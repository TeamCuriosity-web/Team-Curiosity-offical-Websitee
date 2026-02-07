import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Shield, Users, Trash2, Lock, Cpu, Activity, Database, Code, Key, UserPlus, Zap, LayoutGrid, Layers, Globe, GitBranch, Server } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('admins'); // admins, members, projects, hackathons
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

    // --- HANDLERS (Unchanged Logic) ---

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
        if (!window.confirm('WARNING: TERMINATION PROTOCOL INITIATED.\n\nConfirm deletion?')) return;
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
        } catch (err) { alert(`Operation failed: ${err.message}`); }
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
        if (!window.confirm('Confirm deletion?')) return;
        try {
            if (type === 'project') {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } else if (type === 'hackathon') {
                await api.delete(`/hackathons/${id}`);
                setHackathons(hackathons.filter(h => h._id !== id));
            }
        } catch (err) { alert('Deletion failed'); }
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
        setActiveTab('projects'); // Ensure we stay on projects tab
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            setInviteLink(data.inviteLink);
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center font-sans text-xs text-red-500 tracking-[0.3em] font-bold">
            SYSTEM INITIALIZING...
        </div>
    );

    const adminList = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const memberList = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    // --- UI HELPERS ---
    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === id
                    ? 'border-red-500 text-white bg-white/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );

    const GlassCard = ({ children, className = "" }) => (
        <div className={`bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl ${className}`}>
            {children}
        </div>
    );

    const Badge = ({ children, color = "gray" }) => {
        const colors = {
            red: "bg-red-500/10 text-red-500 border-red-500/20",
            green: "bg-green-500/10 text-green-500 border-green-500/20",
            blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.gray}`}>{children}</span>
    };

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-red-900 selection:text-white pt-24 pb-12 px-6">
            
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] opacity-50"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>
                             <span className="text-xs font-bold tracking-[0.3em] text-red-600 uppercase">God Mode Active</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">Super Admin Console</h1>
                    </div>
                    <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }} className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest border border-white/10 hover:border-white/30 px-4 py-2 rounded">
                        Terminate Session
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex mb-8 border-b border-white/10">
                    <TabButton id="admins" label="Admins" icon={Shield} />
                    <TabButton id="members" label="Members" icon={Users} />
                    <TabButton id="projects" label="Projects" icon={Cpu} />
                    <TabButton id="hackathons" label="Hackathons" icon={Zap} />
                </div>

                {/* --- ADMINS TAB --- */}
                {activeTab === 'admins' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <GlassCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Shield size={18} className="text-red-500"/> Admin Roster</h3>
                                    <Badge color="red">{adminList.length} Active</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest">
                                                <th className="py-3">Identity</th>
                                                <th className="py-3">Clearance</th>
                                                <th className="py-3 text-right">Protocol</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {adminList.map(user => (
                                                <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4">
                                                        <div className="font-bold text-white text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        {user.role === 'superadmin' ? <Badge color="red">Omega</Badge> : <Badge color="blue">Alpha</Badge>}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {user.role !== 'superadmin' && (
                                                            <button onClick={() => deleteUser(user._id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </div>
                        <div className="lg:col-span-1">
                            <GlassCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><UserPlus size={18} className="text-emerald-500"/> Provision Admin</h3>
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Operative Name</label>
                                        <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-emerald-500 outline-none mt-1" placeholder="Enter name" value={createAdminForm.name} onChange={e => setCreateAdminForm({...createAdminForm, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Secure Email</label>
                                        <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-emerald-500 outline-none mt-1" placeholder="Enter email" value={createAdminForm.email} onChange={e => setCreateAdminForm({...createAdminForm, email: e.target.value})} />
                                    </div>
                                    <button className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-600/50 hover:border-emerald-600 font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Create Credentials
                                    </button>
                                </form>
                                {newAdminCreds && (
                                    <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded">
                                        <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-widest"><Key size={14}/> Access Granted</div>
                                        <div className="space-y-1 font-mono text-xs">
                                            <div className="flex justify-between"><span className="text-gray-500">ID:</span> <span className="text-gray-300">{newAdminCreds.email}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">KEY:</span> <span className="text-white bg-emerald-500/20 px-1 rounded">{newAdminCreds.password}</span></div>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                )}

                {/* --- MEMBERS TAB --- */}
                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <GlassCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Users size={18} className="text-blue-500"/> Member Directory</h3>
                                    <Badge color="blue">{memberList.length} Users</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-white/5">
                                            {memberList.map(user => (
                                                <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-2">
                                                        <div className="font-bold text-white text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <button onClick={() => deleteUser(user._id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </GlassCard>
                        </div>
                        <div className="lg:col-span-1">
                            <GlassCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Globe size={18} className="text-purple-500"/> Recruit Operative</h3>
                                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                                    Generate a temporary, encrypted access link for new personnel. Link expires in 24 hours.
                                </p>
                                {inviteLink ? (
                                    <div onClick={() => navigator.clipboard.writeText(inviteLink)} className="bg-purple-900/20 border border-purple-500/30 p-4 rounded cursor-pointer hover:bg-purple-900/40 transition-colors group">
                                        <div className="text-purple-300 font-mono text-xs break-all font-bold group-hover:text-white transition-colors">{inviteLink}</div>
                                        <div className="text-[10px] text-center text-purple-500 mt-2 uppercase tracking-widest">Click to Copy</div>
                                    </div>
                                ) : (
                                    <button onClick={generateInvite} className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-500 hover:text-white border border-purple-600/50 hover:border-purple-600 font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Generate Uplink
                                    </button>
                                )}
                            </GlassCard>
                        </div>
                    </div>
                )}

                {/* --- PROJECTS TAB --- */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {projects.map(p => (
                                <GlassCard key={p._id} className="hover:border-white/30 transition-colors group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-white">{p.title}</h4>
                                                <Badge color={p.status === 'ongoing' ? 'yellow' : p.status === 'completed' ? 'green' : 'blue'}>{p.status}</Badge>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.techStack.map(t => <span key={t} className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-1 rounded">{t}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors"><Code size={16}/></button>
                                            <button onClick={() => deleteItem('project', p._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <GlassCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Server size={18} className="text-yellow-500"/> {editingId ? 'Modify Project' : 'Deploy Project'}
                                </h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Brief Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                                    <textarea className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none h-24" placeholder="Detailed Specifications" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="bg-black/50 border border-white/10 p-3 rounded text-sm text-gray-300 outline-none focus:border-yellow-500" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select>
                                        <select className="bg-black/50 border border-white/10 p-3 rounded text-sm text-gray-300 outline-none focus:border-yellow-500" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="legendary">Legendary</option></select>
                                    </div>
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Repository URL" value={projectForm.repoLink} onChange={e => setProjectForm({...projectForm, repoLink: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Live Deployment URL" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                                    
                                    <button className="w-full bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white border border-yellow-600/50 hover:border-yellow-600 font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        {editingId ? 'Commit Update' : 'Initialize Project'}
                                    </button>
                                </form>
                            </GlassCard>
                        </div>
                    </div>
                )}

                {/* --- HACKATHONS TAB --- */}
                {activeTab === 'hackathons' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {hackathons.map(h => (
                                <GlassCard key={h._id} className="relative group hover:border-white/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-white">{h.name}</h4>
                                                <Badge color="yellow">{h.status}</Badge>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-2">{h.description}</p>
                                            <div className="text-xs font-bold text-yellow-500 flex items-center gap-1"><Zap size={12}/> {h.achievement}</div>
                                        </div>
                                        <button onClick={() => deleteItem('hackathon', h._id)} className="p-2 text-gray-600 hover:text-red-500 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <GlassCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-500"/> Log Event
                                </h3>
                                <form onSubmit={handleHackathonSubmit} className="space-y-4">
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Hackathon Name" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Description / Theme" value={hackathonForm.description} onChange={e => setHackathonForm({...hackathonForm, description: e.target.value})} />
                                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-white focus:border-yellow-500 outline-none" placeholder="Achievement (e.g. 1st Place)" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                    <select className="w-full bg-black/50 border border-white/10 p-3 rounded text-sm text-gray-300 outline-none focus:border-yellow-500" value={hackathonForm.status} onChange={e => setHackathonForm({...hackathonForm, status: e.target.value})}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="won">Won</option></select>
                                    
                                    <button className="w-full bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white border border-yellow-600/50 hover:border-yellow-600 font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Record Entry
                                    </button>
                                </form>
                            </GlassCard>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SuperAdminDashboard;
