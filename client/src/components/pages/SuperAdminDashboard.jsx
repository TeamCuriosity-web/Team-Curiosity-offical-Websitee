import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Shield, Users, Trash2, Lock, Cpu, Activity, Terminal, Database, Code, Key, UserPlus, AlertTriangle, Radio } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('system'); // system, personnel, operations
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [inviteLink, setInviteLink] = useState('');
    
    // Forms & State
    const [createAdminForm, setCreateAdminForm] = useState({ name: '', email: '' });
    const [newAdminCreds, setNewAdminCreds] = useState(null);
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
        if (!window.confirm('⚠️ TERMINATION PROTOCOL ⚠️\n\nConfirm deletion of this operative?')) return;
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
        if (!window.confirm('Confirm Purge?')) return;
        try {
            if (type === 'project') {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } else if (type === 'hackathon') {
                await api.delete(`/hackathons/${id}`);
                setHackathons(hackathons.filter(h => h._id !== id));
            }
        } catch (err) { alert('Purge failed'); }
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
        <div className="min-h-screen bg-black flex items-center justify-center font-mono">
            <div className="text-red-600 animate-pulse flex flex-col items-center gap-4">
                <Shield size={48} />
                <div className="text-xl tracking-[0.2em] font-bold">ESTABLISHING SECURE CONNECTION...</div>
            </div>
        </div>
    );

    const admins = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const members = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    return (
        <div className="min-h-screen bg-black text-red-500 font-mono p-4 md:p-8 pt-24 selection:bg-red-900 selection:text-white">
            <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(255,0,0,0.02),rgba(255,0,0,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20"></div>
            
            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                
                {/* HUD HEADER */}
                <div className="border-b-2 border-red-900/50 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-600 blur opacity-20 animate-pulse"></div>
                            <Shield size={48} className="text-red-600 relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-white mb-1">GOD MODE</h1>
                            <p className="text-xs text-red-600/80 tracking-[0.3em] uppercase">Super Admin Console Scoped Access</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-xs font-bold tracking-widest bg-red-900/10 p-4 rounded border border-red-900/30">
                        <div className="flex items-center gap-2">
                             <Activity size={14} className="animate-pulse" />
                             <span>SYSTEM: ONLINE</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Users size={14} />
                             <span>AGENTS: {admins.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Cpu size={14} />
                             <span>CPU: OPTIMAL</span>
                        </div>
                        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }} className="ml-4 text-red-400 hover:text-white transition-colors underline decoration-red-900">
                            LOGOUT
                        </button>
                    </div>
                </div>

                {/* NAVIGATION */}
                <div className="flex gap-2">
                    {[
                        { id: 'system', icon: <Terminal size={16}/>, label: 'COMMAND' },
                        { id: 'personnel', icon: <Users size={16}/>, label: 'PERSONNEL' },
                        { id: 'operations', icon: <Database size={16}/>, label: 'OPERATIONS' }
                    ].map(nav => (
                        <button 
                            key={nav.id}
                            onClick={() => setActiveTab(nav.id)}
                            className={`flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest border border-b-0 transition-all clip-path-slant ${
                                activeTab === nav.id 
                                ? 'bg-red-600 text-black border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                                : 'bg-black text-red-900 border-red-900/30 hover:text-red-500 hover:border-red-600/50'
                            }`}
                        >
                            {nav.icon}
                            {nav.label}
                        </button>
                    ))}
                    <div className="flex-1 border-b border-red-900/30"></div>
                </div>

                {/* CONTENT AREA */}
                <div className="bg-black border border-red-900/30 p-8 min-h-[600px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600"></div>

                    {/* --- SYSTEM TAB --- */}
                    {activeTab === 'system' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Create Admin Terminal */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3 border-b border-red-900/30 pb-4">
                                    <UserPlus className="text-red-500" />
                                    PROVISION NEW ADMIN
                                </h2>
                                <div className="bg-red-900/5 p-6 border border-red-900/30 space-y-4 font-mono text-sm relative">
                                    <p className="text-xs text-red-700 mb-4 opacity-50">// ENTER OPERATIVE DETAILS</p>
                                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs uppercase tracking-widest text-red-400">Codename</label>
                                            <input value={createAdminForm.name} onChange={e => setCreateAdminForm({...createAdminForm, name: e.target.value})} className="bg-black border border-red-900/50 p-2 text-white focus:outline-none focus:border-red-500 w-full" placeholder="e.g. AGENT SMITH" required />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs uppercase tracking-widest text-red-400">Secure Comm Channel</label>
                                            <input value={createAdminForm.email} onChange={e => setCreateAdminForm({...createAdminForm, email: e.target.value})} className="bg-black border border-red-900/50 p-2 text-white focus:outline-none focus:border-red-500 w-full" placeholder="email@agency.com" required />
                                        </div>
                                        <button className="w-full bg-red-600 hover:bg-red-500 text-black font-bold py-3 mt-4 tracking-widest transition-colors flex items-center justify-center gap-2">
                                            <Key size={16} /> AUTHORIZE CREDENTIALS
                                        </button>
                                    </form>
                                    {newAdminCreds && (
                                        <div className="mt-6 p-4 bg-green-900/10 border border-green-500/30 text-green-500">
                                            <div className="flex items-center gap-2 mb-2 font-bold"><Shield size={16}/> NEW ENTITY CREATED</div>
                                            <div className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                                                <span className="opacity-50">ID:</span> {newAdminCreds.email}
                                                <span className="opacity-50">SECRET:</span> <span className="bg-green-500/20 px-2">{newAdminCreds.password}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                             {/* Recruit Member Terminal */}
                             <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3 border-b border-red-900/30 pb-4">
                                    <Radio className="text-red-500" />
                                    RECRUITMENT BEACON
                                </h2>
                                <div className="bg-red-900/5 p-6 border border-red-900/30 space-y-4 text-sm">
                                    <p className="text-xs text-red-700 mb-4 opacity-50">// GENERATE SINGLE-USE ACCESS KEY</p>
                                    <div className="h-32 flex items-center justify-center border border-red-900/30 bg-black">
                                        {inviteLink ? (
                                            <div onClick={() => navigator.clipboard.writeText(inviteLink)} className="cursor-pointer text-center group">
                                                <div className="text-green-500 text-xs break-all px-4 font-bold">{inviteLink}</div>
                                                <div className="text-[10px] text-green-700 mt-2 uppercase opacity-0 group-hover:opacity-100 transition-opacity">[ CLICK TO COPY TO CLIPBOARD ]</div>
                                            </div>
                                        ) : (
                                            <button onClick={generateInvite} className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-colors text-xs uppercase tracking-widest">
                                                Generate Signal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PERSONNEL TAB --- */}
                    {activeTab === 'personnel' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Admins List */}
                            <div>
                                <h3 className="text-sm font-bold text-white bg-red-900/20 p-2 border-l-4 border-red-600 mb-4 tracking-widest flex justify-between items-center">
                                    <span>COMMAND STAFF</span>
                                    <span className="text-[10px] bg-red-600 text-black px-1 rounded">{admins.length}</span>
                                </h3>
                                <div className="space-y-1">
                                    {admins.map(user => (
                                        <div key={user._id} className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <div>
                                                <div className="text-white font-bold text-xs uppercase flex items-center gap-2">
                                                    {user.name} 
                                                    {user.role === 'superadmin' && <Shield size={10} className="text-yellow-500" />}
                                                </div>
                                                <div className="text-[10px] text-gray-500 opacity-50 font-mono">{user.email}</div>
                                            </div>
                                            {user.role !== 'superadmin' && (
                                                <button onClick={() => deleteUser(user._id)} className="text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Members List */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 bg-gray-900/20 p-2 border-l-4 border-gray-600 mb-4 tracking-widest flex justify-between items-center">
                                    <span>FIELD AGENTS</span>
                                    <span className="text-[10px] bg-gray-600 text-black px-1 rounded">{members.length}</span>
                                </h3>
                                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-black">
                                    {members.map(user => (
                                        <div key={user._id} className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <div>
                                                <div className="text-gray-300 font-bold text-xs uppercase">{user.name}</div>
                                                <div className="text-[10px] text-gray-600 font-mono">{user.email}</div>
                                            </div>
                                            <button onClick={() => deleteUser(user._id)} className="text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- OPERATIONS TAB --- */}
                    {activeTab === 'operations' && (
                        <div className="space-y-12">
                            {/* Project Controls */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <div className="bg-red-900/5 p-4 border border-red-900/30 sticky top-4">
                                        <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                                            <Database size={12} className="text-red-500"/> 
                                            {editingId ? 'UPDATE PROTOCOL' : 'INITIATE PROJECT'}
                                        </h3>
                                        <form onSubmit={handleProjectSubmit} className="space-y-3">
                                            <input className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-red-500 outline-none" placeholder="Operation Name" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                                            <input className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-red-500 outline-none" placeholder="Brief" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                                            <textarea className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-red-500 outline-none h-16" placeholder="Full Directive" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                            <input className="w-full bg-black border border-white/10 p-2 text-xs text-white focus:border-red-500 outline-none" placeholder="Tech Stack (comma sep)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} />
                                            <div className="grid grid-cols-2 gap-2">
                                                <select className="bg-black border border-white/10 text-xs text-gray-400 p-2" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select>
                                                <select className="bg-black border border-white/10 text-xs text-gray-400 p-2" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="legendary">Legendary</option></select>
                                            </div>
                                            <button className="w-full bg-red-600/20 hover:bg-red-600 hover:text-black text-red-500 text-xs font-bold py-2 border border-red-600/50 transition-all">
                                                {editingId ? 'OVERWRITE DATA' : 'DEPLOY'}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-4">
                                     <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">ACTIVE OPERATIONS</h3>
                                     {projects.map(p => (
                                         <div key={p._id} className="border border-white/10 bg-white/5 p-4 flex justify-between items-start hover:border-red-500/50 transition-all group">
                                             <div>
                                                 <div className="flex items-center gap-2 mb-1">
                                                     <div className={`w-2 h-2 rounded-full ${p.status === 'ongoing' ? 'bg-yellow-500 animate-pulse' : p.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                                     <div className="text-white font-bold text-sm tracking-wider">{p.title}</div>
                                                 </div>
                                                 <div className="text-[10px] text-gray-500 font-mono max-w-md">{p.description}</div>
                                             </div>
                                             <div className="flex gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                                 <button onClick={() => handleEditClick(p)} className="text-blue-400 hover:text-white"><Code size={14}/></button>
                                                 <button onClick={() => deleteItem('project', p._id)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                             </div>
                                         </div>
                                     ))}
                                </div>
                            </div>

                            {/* Hackathon Controls */}
                            <div className="border-t border-red-900/30 pt-8">
                                <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle size={12} className="text-yellow-500"/> 
                                    HACKATHON LOGS
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {hackathons.map(h => (
                                            <div key={h._id} className="border border-yellow-900/30 bg-yellow-900/5 p-4 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 cursor-pointer" onClick={() => deleteItem('hackathon', h._id)}><Trash2 size={12} className="text-red-500"/></div>
                                                <div className="text-yellow-500 font-bold text-sm mb-1">{h.name}</div>
                                                <div className="text-[10px] text-yellow-700 font-mono mb-2">{h.achievement}</div>
                                                <div className="inline-block text-[10px] bg-yellow-500/20 text-yellow-200 px-2 py-0.5 rounded">{h.status}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="lg:col-span-1">
                                         <form onSubmit={handleHackathonSubmit} className="space-y-2 border-l border-white/10 pl-4">
                                             <input className="w-full bg-transparent border-b border-white/10 p-2 text-xs text-white focus:border-yellow-500 outline-none" placeholder="Event Name" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} />
                                             <input className="w-full bg-transparent border-b border-white/10 p-2 text-xs text-white focus:border-yellow-500 outline-none" placeholder="Achievement/Rank" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                             <button className="w-full bg-yellow-600/20 hover:bg-yellow-600 hover:text-black text-yellow-500 text-xs font-bold py-2 mt-2 border border-yellow-600/50 transition-all">LOG VICTORY</button>
                                         </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
