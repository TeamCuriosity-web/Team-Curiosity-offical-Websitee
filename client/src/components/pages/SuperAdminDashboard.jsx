import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Shield, Users, Trash2, Lock, Cpu, Activity, Terminal, Database, Code, Key, UserPlus, Zap, LayoutGrid, Layers } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, personnel, operations
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    
    // Forms & State
    const [createAdminForm, setCreateAdminForm] = useState({ name: '', email: '' });
    const [newAdminCreds, setNewAdminCreds] = useState(null);
    const [inviteLink, setInviteLink] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [projectForm, setProjectForm] = useState({
        title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate'
    });
    const [hackathonForm, setHackathonForm] = useState({
        name: '', description: '', achievement: '', status: 'upcoming'
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'superadmin') {
            navigate('/admin');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, projectsRes, hackathonsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/projects'),
                api.get('/hackathons')
            ]);
            setUsers(usersRes.data);
            setProjects(projectsRes.data);
            setHackathons(hackathonsRes.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---
    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/admin/create-admin', createAdminForm);
            setUsers([...users, data]);
            setNewAdminCreds({ email: data.email, password: data.generatedPassword });
            setCreateAdminForm({ name: '', email: '' });
        } catch (err) { alert(err.response?.data?.message || 'Failed to create admin'); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert('Deletion failed'); }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...projectForm, techStack: typeof projectForm.techStack === 'string' ? projectForm.techStack.split(',').map(s => s.trim()) : projectForm.techStack };
            if (editingId) {
                const { data } = await api.put(`/projects/${editingId}`, payload);
                setProjects(projects.map(p => p._id === editingId ? data : p));
                setEditingId(null);
            } else {
                const { data } = await api.post('/projects', payload);
                setProjects([...projects, data]);
            }
            setProjectForm({ title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate' });
        } catch (err) { alert('Operation failed'); }
    };

    const handleHackathonSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/hackathons', hackathonForm);
            setHackathons([...hackathons, data]);
            setHackathonForm({ name: '', description: '', achievement: '', status: 'upcoming' });
        } catch (err) { alert('Operation failed'); }
    };

    const deleteItem = async (type, id) => {
        if (!window.confirm('Confirm delete?')) return;
        try {
            if (type === 'project') {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } else if (type === 'hackathon') {
                await api.delete(`/hackathons/${id}`);
                setHackathons(hackathons.filter(h => h._id !== id));
            }
        } catch (err) { alert('Delete failed'); }
    };

    const handleEditClick = (project) => {
        setEditingId(project._id);
        setProjectForm({
            title: project.title,
            description: project.description,
            longDescription: project.longDescription || '',
            techStack: project.techStack.join(', '),
            repoLink: project.repoLink || '',
            liveLink: project.liveLink || '',
            status: project.status || 'ongoing',
            difficulty: project.difficulty || 'intermediate'
        });
        setActiveTab('operations');
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            setInviteLink(data.inviteLink);
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center font-sans text-xs text-white/50 tracking-widest">
            AUTHENTICATING...
        </div>
    );

    const admins = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const members = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    // --- COMPONENTS ---
    const StatCard = ({ label, value, icon: Icon, color = "blue" }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 transition-colors`}>
                    <Icon size={20} />
                </div>
                <div className={`text-${color}-400 bg-${color}-500/10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider`}>
                    Active
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                             <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">Super Admin Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">Command Center</h1>
                        <p className="text-gray-500 max-w-md">Complete oversight of platform operations, personnel, and deployment protocols.</p>
                    </div>
                     <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }} className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 text-xs font-bold tracking-widest transition-all text-gray-300 hover:text-white">
                        DISCONNECT
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-4 mb-8 pb-2 scrollbar-hide">
                    {[
                        { id: 'overview', icon: <Activity size={18}/>, label: 'Overview' },
                        { id: 'personnel', icon: <Users size={18}/>, label: 'Personnel' },
                        { id: 'operations', icon: <Layers size={18}/>, label: 'Operations' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard label="Total Admins" value={admins.length} icon={Shield} color="indigo" />
                            <StatCard label="Field Members" value={members.length} icon={Users} color="purple" />
                            <StatCard label="Active Projects" value={projects.length} icon={Cpu} color="cyan" />
                            <StatCard label="Hackathons" value={hackathons.length} icon={Zap} color="yellow" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Create Admin Panel */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><UserPlus size={20}/></div>
                                    <h3 className="text-xl font-bold text-white">Provision Administrator</h3>
                                </div>
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Full Name</label>
                                        <input value={createAdminForm.name} onChange={e => setCreateAdminForm({...createAdminForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="e.g. Sarah Connor" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                                        <input value={createAdminForm.email} onChange={e => setCreateAdminForm({...createAdminForm, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition-colors" placeholder="sarah@skynet.com" required />
                                    </div>
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                        Create & Generate Credentials
                                    </button>
                                </form>
                                {newAdminCreds && (
                                    <div className="mt-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in">
                                        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold">
                                            <Key size={18} /> Credentials Generated
                                        </div>
                                        <div className="space-y-2 font-mono text-sm">
                                            <div className="flex justify-between border-b border-white/5 pb-2">
                                                <span className="text-gray-400">ID</span>
                                                <span className="text-white">{newAdminCreds.email}</span>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <span className="text-gray-400">KEY</span>
                                                <span className="text-emerald-400 bg-emerald-500/10 px-2 rounded">{newAdminCreds.password}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                             {/* Recruitment Link Panel */}
                             <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Code size={20}/></div>
                                        <h3 className="text-xl font-bold text-white">Generation Protocol</h3>
                                    </div>
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        Generate a cryptographically secure, time-limited invite token for new personnel onboarding. Tokens expire automatically after 24 hours.
                                    </p>
                                </div>
                                
                                <div className="space-y-4">
                                     {inviteLink ? (
                                        <div onClick={() => navigator.clipboard.writeText(inviteLink)} className="bg-black/50 border border-purple-500/50 rounded-xl p-6 cursor-pointer group hover:bg-black/80 transition-all relative overflow-hidden">
                                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="text-center text-purple-400 font-mono text-sm break-all font-bold relative z-10">{inviteLink}</div>
                                            <div className="text-center text-[10px] text-gray-500 uppercase tracking-widest mt-2 group-hover:text-purple-300 transition-colors relative z-10">Click to Copy</div>
                                        </div>
                                    ) : (
                                        <button onClick={generateInvite} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl transition-all">
                                            Generate Single-Use Token
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* --- PERSONNEL TAB --- */}
                {activeTab === 'personnel' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">User Profile</th>
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Role</th>
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400">Clearance</th>
                                        <th className="p-6 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[...admins, ...members].map(user => (
                                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-6">
                                                <div className="font-bold text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    user.role === 'superadmin' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                    user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' :
                                                    'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${user.role === 'superadmin' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                    {user.role === 'superadmin' ? 'OMEGA' : 'STANDARD'}
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                {user.role !== 'superadmin' && (
                                                    <button onClick={() => deleteUser(user._id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- OPERATIONS TAB --- */}
                {activeTab === 'operations' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Editor Panel */}
                        <div className="lg:col-span-1">
                             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-8">
                                <h3 className="text-lg font-bold text-white mb-6">
                                    {editingId ? 'Edit Project' : 'New Project'}
                                </h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none placeholder-gray-600" placeholder="Project Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none placeholder-gray-600" placeholder="Short Desc" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                                    <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none placeholder-gray-600 h-24" placeholder="Full Details" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none placeholder-gray-600" placeholder="Stack (React, Node...)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select>
                                        <select className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-gray-300" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="legendary">Legendary</option></select>
                                    </div>
                                    <div className="pt-2">
                                        <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition-colors">
                                            {editingId ? 'Update System' : 'Deploy Project'}
                                        </button>
                                    </div>
                                </form>
                             </div>
                        </div>

                        {/* Projects List */}
                        <div className="lg:col-span-2 space-y-4">
                            {projects.map(p => (
                                <div key={p._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-white">{p.title}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                                    p.status === 'ongoing' ? 'bg-yellow-500/20 text-yellow-400' : 
                                                    p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>{p.status}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                                            <div className="flex gap-2">
                                                {p.techStack.map(t => (
                                                    <span key={t} className="text-[10px] bg-white/5 border border-white/5 text-gray-400 px-2 py-1 rounded-md">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"><Code size={16}/></button>
                                            <button onClick={() => deleteItem('project', p._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Hackathons Section */}
                            <div className="pt-8 mt-8 border-t border-white/10">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Zap className="text-yellow-400" size={20}/> Hackathons</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hackathons.map(h => (
                                        <div key={h._id} className="bg-gradient-to-br from-yellow-900/10 to-transparent border border-yellow-500/10 rounded-2xl p-6 relative group">
                                            <button onClick={() => deleteItem('hackathon', h._id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 p-1 rounded"><Trash2 size={14}/></button>
                                            <div className="text-yellow-500 font-bold mb-1">{h.name}</div>
                                            <div className="text-sm text-gray-400 mb-2">{h.achievement}</div>
                                            <div className="inline-block px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-bold uppercase">{h.status}</div>
                                        </div>
                                    ))}
                                    {/* Simple Add Hackathon Form Inline */}
                                    <div className="bg-white/5 border border-white/5 border-dashed rounded-2xl p-6 flex flex-col justify-center items-center text-center opacity-50 hover:opacity-100 transition-opacity">
                                        <form onSubmit={handleHackathonSubmit} className="w-full space-y-2">
                                            <input className="w-full bg-transparent border-b border-gray-700 p-1 text-center text-white text-sm focus:border-yellow-500 outline-none" placeholder="New Hackathon Name" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} />
                                            <input className="w-full bg-transparent border-b border-gray-700 p-1 text-center text-gray-400 text-xs focus:border-yellow-500 outline-none" placeholder="Achievement" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                            <button className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mt-2 hover:underline">Add Entry</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
