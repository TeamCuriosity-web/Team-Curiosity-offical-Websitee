import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/adminApi'; // Use Admin Authenticated API
import { Shield, Users, Trash2, Lock, Cpu, Activity, Database, Code, Key, UserPlus, Zap, LayoutGrid, Layers, Globe, GitBranch, Server } from 'lucide-react';

    // --- UI HELPERS ---
    const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === id
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );

    const LightCard = ({ children, className = "" }) => (
        <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm ${className}`}>
            {children}
        </div>
    );

    const Badge = ({ children, color = "gray" }) => {
        const colors = {
            red: "bg-red-50 text-red-600 border-red-100",
            green: "bg-green-50 text-green-600 border-green-100",
            blue: "bg-blue-50 text-blue-600 border-blue-100",
            yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
            gray: "bg-gray-50 text-gray-500 border-gray-100",
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.gray}`}>{children}</span>
    };

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('requests'); // requests, admins, members, projects, hackathons
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
        const user = JSON.parse(localStorage.getItem('adminUser')); // Check Admin User
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
            if (err.response?.status === 401) navigate('/admin/login');
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

    const handleApproveUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/approve`);
            setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
        } catch (err) { alert('Approval failed'); }
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
        setActiveTab('projects');
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            // Construct link on frontend to ensure it matches the current environment (e.g. GitHub Pages)
            // Assuming data.inviteLink contains the full URL or just the token. 
            // We'll extract the token if it's a URL, or use it directly if it's a token.
            // But usually backend returns full link. Let's safeguard.
            
            let token = '';
            if (data.inviteLink.includes('token=')) {
                token = data.inviteLink.split('token=')[1];
            } else {
                // If it's just the token or something else, this might be risky without seeing backend.
                // Let's assume the standard format is base_url/join?token=...
                // If the backend returns a relative path, we might be fine.
                // Safest approach: replace the origin of the returned link with window.location.origin
                try {
                    const url = new URL(data.inviteLink);
                    token = url.searchParams.get('token');
                } catch (e) {
                    console.error("Could not parse invite link URL", e);
                }
            }

            if (token) {
                 const clientUrl = `${window.location.origin}${window.location.pathname.startsWith('/Team-Curiosity-offical-Websitee') ? '/Team-Curiosity-offical-Websitee' : ''}/invite?token=${token}`;
                 setInviteLink(clientUrl);
            } else {
                // Fallback if parsing fails (e.g. if backend just returns the link and our logic fails)
                // We'll just replace 'localhost:5000' or whatever backend host with client host
                // This is a rough patch.
                // FORCE FRONTEND URL (GitHub Pages or Localhost)
            const isLocal = window.location.hostname === 'localhost';
            const basePath = isLocal ? '' : '/Team-Curiosity-offical-Websitee';
            const fullLink = `${window.location.origin}${basePath}/invite?token=${data.token}`;
            
            setInviteLink(fullLink); 
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs text-red-600 tracking-[0.2em] font-bold">
            VERIFYING CREDENTIALS...
        </div>
    );

    const adminList = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const memberList = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-red-100 selection:text-red-900 pt-24 pb-12 px-6">
            
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-1.5 bg-red-600 text-white rounded">
                                 <Shield size={16} />
                             </div>
                             <span className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase">Super Admin Console</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Control</h1>
                        <p className="text-gray-500 font-mono text-xs uppercase mt-2 tracking-widest">
                            Welcome, <span className="text-red-600 font-bold">Naseer Pasha</span>
                        </p>
                    </div>
                    <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin/login'); }} className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-widest border border-gray-200 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded flex items-center gap-2">
                        <Lock size={12}/> Log Out [Terminate Session]
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
                    <TabButton id="requests" label="Requests" icon={Lock} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="admins" label="Admins" icon={Shield} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="members" label="Members" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="projects" label="Projects" icon={Cpu} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="hackathons" label="Hackathons" icon={Zap} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="comms" label="Comms" icon={Activity} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="system" label="System" icon={Database} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* --- REQUESTS TAB --- */}
                {activeTab === 'requests' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                             <LightCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">Pending Access Requests</h3>
                                    <Badge color="yellow">{users.filter(u => !u.isApproved).length} Pending</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-widest">
                                                <th className="py-3 font-semibold">Candidate</th>
                                                <th className="py-3 font-semibold">Details</th>
                                                <th className="py-3 font-semibold text-right">Protocol</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {users.filter(u => !u.isApproved).length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-center text-gray-400 text-xs font-mono">NO PENDING REQUESTS // ALL SYSTEMS SECURE</td>
                                                </tr>
                                            ) : (
                                                users.filter(u => !u.isApproved).map(user => (
                                                    <tr key={user._id} className="group hover:bg-gray-50 transition-colors">
                                                        <td className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <img src={user.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} className="w-8 h-8 rounded-full bg-gray-100" alt="" />
                                                                <div>
                                                                    <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                                                                    <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-xs"><span className="font-bold text-gray-400">INST:</span> {user.college || 'N/A'}</div>
                                                                <div className="text-xs"><span className="font-bold text-gray-400">BR/SEC:</span> {user.branch || '-'}/{user.section || '-'}</div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => handleApproveUser(user._id)} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors border border-green-100">
                                                                    Approve
                                                                </button>
                                                                <button onClick={() => deleteUser(user._id)} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors border border-red-100">
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </LightCard>
                        </div>
                    </div>
                )}
                
                {/* --- ADMINS TAB --- */}
                {activeTab === 'admins' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <LightCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">Admin Roster</h3>
                                    <Badge color="red">{adminList.length} Active</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-widest">
                                                <th className="py-3 font-semibold">Identity</th>
                                                <th className="py-3 font-semibold">Clearance</th>
                                                <th className="py-3 font-semibold text-right">Protocol</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {adminList.map(user => (
                                                <tr key={user._id} className="group hover:bg-gray-50 transition-colors">
                                                    <td className="py-4">
                                                        <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        {user.role === 'superadmin' ? <Badge color="red">Omega</Badge> : <Badge color="blue">Alpha</Badge>}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        {user.role !== 'superadmin' && (
                                                            <button onClick={() => deleteUser(user._id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </LightCard>
                        </div>
                        <div className="lg:col-span-1">
                            <LightCard className="sticky top-6 border-red-100 bg-red-50/10">
                                <h3 className="text-lg font-bold text-red-900 mb-6 flex items-center gap-2"><UserPlus size={18} className="text-red-600"/> Provision Admin</h3>
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Operative Name</label>
                                        <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" placeholder="Enter name" value={createAdminForm.name} onChange={e => setCreateAdminForm({...createAdminForm, name: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Secure Email</label>
                                        <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" placeholder="Enter email" value={createAdminForm.email} onChange={e => setCreateAdminForm({...createAdminForm, email: e.target.value})} />
                                    </div>
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Create Credentials
                                    </button>
                                </form>
                                {newAdminCreds && (
                                    <div className="mt-6 p-4 bg-white border border-green-200 rounded shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-green-600 font-bold text-xs uppercase tracking-widest"><Key size={14}/> Access Granted</div>
                                        <div className="space-y-1 font-mono text-xs">
                                            <div className="flex justify-between"><span className="text-gray-400">ID:</span> <span className="text-gray-800">{newAdminCreds.email}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-400">KEY:</span> <span className="text-green-700 bg-green-50 px-1 rounded font-bold">{newAdminCreds.password}</span></div>
                                        </div>
                                    </div>
                                )}
                            </LightCard>
                        </div>
                    </div>
                )}

                {/* --- MEMBERS TAB --- */}
                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <LightCard>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">Member Directory</h3>
                                    <Badge color="blue">{memberList.length} Users</Badge>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <tbody className="divide-y divide-gray-50">
                                            {memberList.map(user => (
                                                <tr key={user._id} className="group hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-2">
                                                        <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
                                                    </td>
                                                    <td className="py-3 px-2 text-right">
                                                        <button onClick={() => deleteUser(user._id)} className="text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </LightCard>
                        </div>
                        <div className="lg:col-span-1">
                            <LightCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><Globe size={18} className="text-purple-600"/> Recruit Operative</h3>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                    Generate a temporary access link for new personnel. Link expires in 24 hours.
                                </p>
                                {inviteLink ? (
                                    <div onClick={() => navigator.clipboard.writeText(inviteLink)} className="bg-purple-50 border border-purple-100 p-4 rounded cursor-pointer hover:bg-purple-100 transition-colors group">
                                        <div className="text-purple-700 font-mono text-xs break-all font-bold">{inviteLink}</div>
                                        <div className="text-[10px] text-center text-purple-400 mt-2 uppercase tracking-widest group-hover:text-purple-600">Click to Copy</div>
                                    </div>
                                ) : (
                                    <button onClick={generateInvite} className="w-full bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Generate Uplink
                                    </button>
                                )}
                            </LightCard>
                        </div>
                    </div>
                )}

                {/* --- PROJECTS TAB --- */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {projects.map(p => (
                                <LightCard key={p._id} className="hover:border-blue-200 transition-colors group border-l-4 border-l-transparent hover:border-l-blue-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-gray-900">{p.title}</h4>
                                                <Badge color={p.status === 'ongoing' ? 'yellow' : p.status === 'completed' ? 'green' : 'blue'}>{p.status}</Badge>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-4">{p.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.techStack.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded border border-gray-100">{t}</span>)}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditClick(p)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded transition-colors"><Code size={16}/></button>
                                            <button onClick={() => deleteItem('project', p._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                </LightCard>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <LightCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Server size={18} className="text-yellow-600"/> {editingId ? 'Modify Project' : 'Deploy Project'}
                                </h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Brief Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                                    <textarea className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none h-24 shadow-sm" placeholder="Detailed Specifications" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Tech Stack (comma separated)" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="bg-white border border-gray-200 p-3 rounded text-sm text-gray-600 outline-none focus:border-yellow-500 shadow-sm" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select>
                                        <select className="bg-white border border-gray-200 p-3 rounded text-sm text-gray-600 outline-none focus:border-yellow-500 shadow-sm" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="legendary">Legendary</option></select>
                                    </div>
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Repository URL" value={projectForm.repoLink} onChange={e => setProjectForm({...projectForm, repoLink: e.target.value})} />
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Live Deployment URL" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                                    
                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        {editingId ? 'Commit Update' : 'Initialize Project'}
                                    </button>
                                </form>
                            </LightCard>
                        </div>
                    </div>
                )}

                {/* --- HACKATHONS TAB --- */}
                {activeTab === 'hackathons' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {hackathons.map(h => (
                                <LightCard key={h._id} className="relative group hover:border-yellow-300 transition-colors border-l-4 border-l-transparent hover:border-l-yellow-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-gray-900">{h.name}</h4>
                                                <Badge color="yellow">{h.status}</Badge>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-2">{h.description}</p>
                                            <div className="text-xs font-bold text-yellow-600 flex items-center gap-1"><Zap size={12}/> {h.achievement}</div>
                                        </div>
                                        <button onClick={() => deleteItem('hackathon', h._id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </LightCard>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <LightCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Zap size={18} className="text-yellow-600"/> Log Event
                                </h3>
                                <form onSubmit={handleHackathonSubmit} className="space-y-4">
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Hackathon Name" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} required />
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Description / Theme" value={hackathonForm.description} onChange={e => setHackathonForm({...hackathonForm, description: e.target.value})} />
                                    <input className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-yellow-500 outline-none shadow-sm" placeholder="Achievement (e.g. 1st Place)" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                    <select className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-600 outline-none focus:border-yellow-500 shadow-sm" value={hackathonForm.status} onChange={e => setHackathonForm({...hackathonForm, status: e.target.value})}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="won">Mission Accomplished (Won)</option></select>
                                    
                                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                        Record Entry
                                    </button>
                                </form>
                            </LightCard>
                        </div>
                    </div>
                )}

                {/* --- COMMS TAB --- */}
                {activeTab === 'comms' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <LightCard>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600"/> Broadcast Network
                            </h3>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const payload = {
                                    message: formData.get('message'),
                                    type: formData.get('type'),
                                    recipient: formData.get('recipient')
                                };
                                try {
                                    await api.post('/notifications', payload);
                                    alert('Transmission Sent Successfully');
                                    e.target.reset();
                                } catch(err) { alert('Transmission Failed'); }
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Target Audience</label>
                                    <select name="recipient" className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 outline-none mt-1 shadow-sm">
                                        <option value="all">Global Broadcast (All Users)</option>
                                        <option value="admin">Command Channel (Admins Only)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Message Type</label>
                                    <select name="type" className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 outline-none mt-1 shadow-sm">
                                        <option value="alert">Critical Alert</option>
                                        <option value="message">Standard Message</option>
                                        <option value="system">System Notification</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Content</label>
                                    <textarea name="message" required className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 outline-none h-32 mt-1 shadow-sm" placeholder="Enter transmission content..." />
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold py-3 rounded text-xs uppercase tracking-widest transition-all">
                                    Initiate Broadcast
                                </button>
                            </form>
                        </LightCard>
                        
                        <LightCard className="bg-blue-50/50 border-blue-100">
                             <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold uppercase tracking-widest text-xs">
                                 <Activity size={14}/> Network Status
                             </div>
                             <div className="space-y-2 text-sm text-blue-900">
                                 <p>Commencing broadcast sends real-time alerts to all active terminals.</p>
                                 <p>• <strong>Global Broadcast</strong>: Visible to Members, Admins, and Super Admins.</p>
                                 <p>• <strong>Command Channel</strong>: Encrypted channel for Admin personnel only.</p>
                             </div>
                        </LightCard>
                    </div>
                )}

                {/* --- SYSTEM TAB --- */}
                {activeTab === 'system' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <LightCard className="border-red-200">
                            <h3 className="text-lg font-bold text-red-700 mb-6 flex items-center gap-2">
                                <Database size={18}/> Danger Zone
                            </h3>
                            
                            <div className="p-4 bg-red-50 border border-red-100 rounded mb-6">
                                <h4 className="font-bold text-red-800 text-sm mb-2">Purge Chat Logs</h4>
                                <p className="text-xs text-red-600 mb-4">
                                    Permanently delete all message history from the main server. This action cannot be undone.
                                    Target: All Project Channels & General Chat.
                                </p>
                                <button 
                                    onClick={async () => {
                                        if(window.confirm('CRITICAL WARNING: CONFIRM PURGE PROTOCOL? All chat history will be erased.')) {
                                            try {
                                                await api.delete('/chat/clear');
                                                alert('Purge Complete. Systems Normal.');
                                            } catch(err) { alert('Purge Failed: Authorization Denied or Server Error.'); }
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded uppercase tracking-widest shadow-sm flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Execute Purge
                                </button>
                            </div>
                        </LightCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
