import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Shield, Users, Trash2, Lock, Cpu, ToggleLeft, ToggleRight, FileText } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // users, system
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [featureFlags, setFeatureFlags] = useState([]);
    const [inviteLink, setInviteLink] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'superadmin') {
            navigate('/admin'); // Fallback for non-superadmins
            return;
        }
        setCurrentUser(user);
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

    // --- ACTIONS: ADMIN MANAGEMENT ---

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/admin/create-admin', createAdminForm);
            setUsers([...users, data]); // Add new admin to list
            setNewAdminCreds({ email: data.email, password: data.generatedPassword });
            setCreateAdminForm({ name: '', email: '' });
            alert(`Admin Created! Password: ${data.generatedPassword}`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create admin');
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('WARNING: TERMINATION PROTOCOL INITIATED.\n\nThis action is irreversible. Confirm deletion?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert('Deletion failed'); }
    };

    // --- ACTIONS: CONTENT MANAGEMENT (Merged from AdminDashboard) ---

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
        } catch (err) { alert(`Failed to deploy: ${err.response?.data?.message || err.message}`); }
    };

    const handleHackathonSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/hackathons', hackathonForm);
            setHackathons([...hackathons, data]);
            setHackathonForm({ name: '', description: '', achievement: '', status: 'upcoming' });
        } catch (err) { alert('Failed to log hackathon'); }
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
        setActiveTab('projects'); // Switch tab if needed
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            setInviteLink(data.inviteLink);
        } catch (err) { console.error(err); }
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-red-600">AUTHENTICATING GOD MODE...</div>;

    // Filter users for display
    const adminList = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const memberList = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    return (
        <div className="min-h-screen pt-32 px-6 container mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b-2 border-red-600 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600 text-white rounded">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-red-600 tracking-tight">SUPER ADMIN CONSOLE</h1>
                        <p className="text-secondary font-mono text-xs uppercase flex items-center gap-2">
                             Full System Control // Clearance Level: OMEGA
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); }} className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 mb-8 border-b border-gray-200">
                {['admins', 'members', 'projects', 'hackathons'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                            activeTab === tab 
                                ? 'border-red-600 text-red-600' 
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- ADMINS TAB --- */}
                {activeTab === 'admins' && (
                    <>
                        <div className="lg:col-span-2">
                            <Card className="p-0 overflow-hidden border-red-100 shadow-xl">
                                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                                    <h3 className="font-bold text-red-800 flex items-center gap-2"><Shield size={16}/> Admin Command</h3>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="bg-white border-b border-gray-100"><th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-400">Admin</th><th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-400 text-right">Action</th></tr></thead>
                                    <tbody>
                                        {adminList.map(user => (
                                            <tr key={user._id} className="border-b border-gray-50 hover:bg-red-50/10">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-sm">{user.name} {user.role === 'superadmin' && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 rounded">SUPER</span>}</div>
                                                    <div className="text-xs text-gray-400 font-mono">{user.email}</div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {user.role !== 'superadmin' && <button onClick={() => deleteUser(user._id)} className="text-gray-300 hover:text-red-600"><Trash2 size={16} /></button>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="p-6 border-red-100 shadow-xl">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-red-800"><UserPlus size={16}/> Create New Admin</h3>
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <input placeholder="Admin Name" className="w-full border p-2 text-sm" value={createAdminForm.name} onChange={e => setCreateAdminForm({...createAdminForm, name: e.target.value})} required />
                                    <input placeholder="Admin Email" className="w-full border p-2 text-sm" value={createAdminForm.email} onChange={e => setCreateAdminForm({...createAdminForm, email: e.target.value})} required />
                                    <Button type="submit" className="w-full text-xs bg-red-600 hover:bg-red-700 text-white border-0">Provision Admin</Button>
                                </form>
                                {newAdminCreds && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                                        <p className="text-xs font-bold text-green-800 mb-2 flex items-center gap-2"><Key size={14}/> Credentials Generated</p>
                                        <div className="text-xs font-mono">
                                            <p>Email: {newAdminCreds.email}</p>
                                            <p>Pass:  <span className="font-bold bg-green-200 px-1">{newAdminCreds.password}</span></p>
                                        </div>
                                        <p className="text-[10px] text-green-600 mt-2">Copy immediately. Passwords are hashed and cannot be retrieved later.</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </>
                )}

                {/* --- MEMBERS TAB --- */}
                {activeTab === 'members' && (
                    <>
                        <div className="lg:col-span-2">
                             <Card className="p-0 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-100"><h3 className="font-bold flex items-center gap-2"><Users size={16}/> Member Roster</h3></div>
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        {memberList.map(user => (
                                            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-6 font-medium text-sm">{user.name} <span className="block text-[10px] text-gray-400">{user.email}</span></td>
                                                <td className="py-3 px-6 text-right"><button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={16}/> Recruit Member</h3>
                                {inviteLink ? (
                                    <div className="p-3 bg-black text-white rounded text-xs break-all font-mono" onClick={() => navigator.clipboard.writeText(inviteLink)}>{inviteLink}</div>
                                ) : (
                                    <Button onClick={generateInvite} variant="primary" className="w-full text-xs">Generate Access Key</Button>
                                )}
                            </Card>
                        </div>
                    </>
                )}

                {/* --- PROJECTS TAB (Merged) --- */}
                {activeTab === 'projects' && (
                    <>
                        <div className="lg:col-span-2 space-y-6">
                             {/* Hackathons Section (if intended to be here, otherwise move to its own tab, but user wanted unified) */}
                             {/* Actually, let's keep Projects tab for PROJECTS only for clarity, but if we want unified, we should use separate sections. 
                                 Wait, the user wanted "Unified Control". I'll put Projects in Projects tab. 
                                 The previous code had `hackathons.map` inside `activeTab === 'projects'`. 
                                 I will remove hackathons from here and ensure they are in their own tab or properly separated.
                                 
                                 Actually, I see I have a 'hackathons' tab. I should probably just fix the `projects` tab to only show projects.
                                 And ensure the `hackathons` tab shows hackathons.
                             */}
                             
                            {projects.map(project => (
                                <Card key={project._id} className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                                     <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : project.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{project.status}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">{project.techStack.map(t => <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">{t}</span>)}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(project)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Code size={18} /></button>
                                        <button onClick={() => deleteItem('project', project._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Database size={16}/> {editingId ? 'Update Protocol' : 'Deploy new Project'}</h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input placeholder="Codename" className="w-full border p-2 text-sm" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
                                    <input placeholder="Short Brief" className="w-full border p-2 text-sm" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
                                    <textarea placeholder="Long Details" className="w-full border p-2 text-sm h-20" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                    <input placeholder="Tech Stack" className="w-full border p-2 text-sm" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="border p-2 text-sm" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select>
                                        <select className="border p-2 text-sm" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="legendary">Legendary</option></select>
                                    </div>
                                    <input placeholder="Repo URL" className="w-full border p-2 text-sm" value={projectForm.repoLink} onChange={e => setProjectForm({...projectForm, repoLink: e.target.value})} />
                                    <input placeholder="Live URL" className="w-full border p-2 text-sm" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                                    <Button type="submit" variant="primary" className="w-full text-xs">{editingId ? 'Update' : 'Deploy'}</Button>
                                </form>
                            </Card>
                        </div>
                    </>
                )}

                {/* --- HACKATHONS TAB --- */}
                {activeTab === 'hackathons' && (
                    <>
                        <div className="lg:col-span-2 space-y-6">
                            {hackathons.map(hack => (
                                <Card key={hack._id} className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-lg text-gray-800">{hack.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${hack.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : hack.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{hack.status}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">{hack.description}</p>
                                        <p className="text-xs font-bold text-yellow-600 flex items-center gap-1">🏆 {hack.achievement}</p>
                                    </div>
                                    <button onClick={() => deleteItem('hackathon', hack._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={18} /></button>
                                </Card>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Code size={16}/> Log Hackathon</h3>
                                <form onSubmit={handleHackathonSubmit} className="space-y-4">
                                    <input placeholder="Name" className="w-full border p-2 text-sm" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} required />
                                    <input placeholder="Description" className="w-full border p-2 text-sm" value={hackathonForm.description} onChange={e => setHackathonForm({...hackathonForm, description: e.target.value})} />
                                    <input placeholder="Achievement" className="w-full border p-2 text-sm" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                    <select className="w-full border p-2 text-sm" value={hackathonForm.status} onChange={e => setHackathonForm({...hackathonForm, status: e.target.value})}><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="won">Won</option></select>
                                    <Button type="submit" variant="primary" className="w-full text-xs">Record</Button>
                                </form>
                            </Card>
                        </div>
                    </>
                )}

                {/* Sidebar / Tools */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-red-500/20 bg-gradient-to-b from-red-950/20 to-black shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={100} />
                        </div>
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500 tracking-widest text-sm uppercase"><Shield size={16}/> Recruit Operative</h3>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">Generate a 24-hour encrypted access token for new personnel. Use with caution.</p>
                        
                        {inviteLink ? (
                            <div className="p-4 bg-black/80 text-green-400 rounded-lg text-xs break-all font-mono border border-green-500/30 cursor-pointer hover:bg-black transition-colors" onClick={() => navigator.clipboard.writeText(inviteLink)}>
                                {inviteLink}
                                <div className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest">Click to Copy Encrypted Key</div>
                            </div>
                        ) : (
                            <Button onClick={generateInvite} className="w-full text-xs font-bold uppercase tracking-widest bg-red-600 hover:bg-red-500 text-white border-0 py-4 shadow-lg shadow-red-900/20">Generate Access Key</Button>
                        )}
                    </Card>

                    <div className="p-6 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h4 className="font-bold text-[10px] uppercase text-gray-500 mb-4 tracking-widest border-b border-white/5 pb-2">System Telemetry</h4>
                         <div className="flex justify-between text-xs mb-3 items-center">
                            <span className="text-gray-400">Server Status</span>
                            <span className="text-green-500 font-bold text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ONLINE</span>
                        </div>
                        <div className="flex justify-between text-xs mb-3 items-center">
                            <span className="text-gray-400">Database</span>
                            <span className="text-green-500 font-bold text-[10px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">CONNECTED</span>
                        </div>
                        <div className="flex justify-between text-xs items-center">
                            <span className="text-gray-400">Global Security</span>
                            <span className="text-red-500 font-bold text-[10px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">STRICT</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
