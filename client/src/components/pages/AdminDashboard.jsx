import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Copy, Users, Shield, Terminal, Database, Code, Trash2, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects'); // projects, hackathons, team
    const [loading, setLoading] = useState(true);
    
    // Data State
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    
    // Forms State
    const [projectForm, setProjectForm] = useState({ title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate' });
    const [hackathonForm, setHackathonForm] = useState({ name: '', description: '', achievement: '', status: 'upcoming' });
    const [inviteLink, setInviteLink] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            if (user.role === 'superadmin') {
                navigate('/super-admin');
                return;
            }
            setCurrentUser(user);
        } else {
             // Optional: redirect to login if no user, handled by error catch usually but safe to add
             // navigate('/login'); 
             // Leaving existing logic for now
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, projectsRes, hackathonsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/projects'), // Public read is fine
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

    // --- Actions ---

    const handleLogout = () => {
        if (window.confirm('Terminate session?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            setInviteLink(data.inviteLink);
        } catch (err) { console.error(err); }
    };
    
    // ... deleteItem and other actions ...

    const deleteItem = async (type, id) => {
        if (!window.confirm('Confirm deletion protocol?')) return;
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

    // ... (rest of actions) ...

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
        } catch (err) { 
            console.error(err);
            alert(`Failed to deploy: ${err.response?.data?.message || err.message}`);
        }
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
    };

    const handleHackathonSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/hackathons', hackathonForm);
            setHackathons([...hackathons, data]);
            setHackathonForm({ name: '', description: '', achievement: '', status: 'upcoming' });
        } catch (err) { alert('Failed to log hackathon'); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs">LOADING_MAINFRAME...</div>;

    return (
        <div className="min-h-screen pt-32 px-6 container mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-black text-white rounded">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-black tracking-tight">Command Center</h1>
                        <p className="text-secondary font-mono text-xs uppercase flex items-center gap-2">
                            Welcome, {currentUser?.name}. 
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link to="/" className="text-sm border border-border px-4 py-2 rounded hover:bg-black hover:text-white transition-colors">
                        Exit Console
                    </Link>
                    <button onClick={handleLogout} className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors">
                        Logout
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 mb-8 border-b border-gray-200">
                {['projects', 'hackathons', 'team'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                            activeTab === tab 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                 {/* --- TEAM TAB --- */}
                 {activeTab === 'team' && (
                    <>
                        <div className="lg:col-span-2 space-y-6">
                             <Card className="p-0 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-100 mb-0">
                                    <h3 className="font-bold flex items-center gap-2"><Users size={16}/> Team Directory</h3>
                                </div>
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-border">
                                            <th className="py-3 px-6 text-xs uppercase font-semibold text-secondary">Personnel</th>
                                            <th className="py-3 px-6 text-xs uppercase font-semibold text-secondary">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-6 font-medium text-sm">{user.name} <span className="block text-[10px] text-gray-400">{user.email}</span></td>
                                                <td className="py-3 px-6">
                                                     <span className="px-2 py-1 border text-[10px] uppercase font-bold bg-gray-50 text-gray-400 cursor-not-allowed">{user.role}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Shield size={16}/> Recruit Operative</h3>
                                <p className="text-secondary text-xs mb-4">Generate access key for new members.</p>
                                {inviteLink ? (
                                    <div className="p-3 bg-black text-white rounded text-xs break-all font-mono" onClick={() => navigator.clipboard.writeText(inviteLink)}>
                                        {inviteLink}
                                    </div>
                                ) : (
                                    <Button onClick={generateInvite} variant="primary" className="w-full text-xs">Generate Access Key</Button>
                                )}
                            </Card>
                        </div>
                    </>
                )}
                


                {/* --- PROJECTS TAB --- */}
                {activeTab === 'projects' && (
                    <>
                        <div className="lg:col-span-2 space-y-6">
                            {projects.map(project => (
                                <Card key={project._id} className="p-6 flex justify-between items-start group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg">{project.title}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                project.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>{project.status}</span>
                                        </div>
                                        <p className="text-secondary text-sm mb-2">{project.description}</p>
                                        <div className="flex gap-2">
                                            {project.techStack.map(t => <span key={t} className="text-[10px] bg-gray-100 px-2 py-1 rounded">{t}</span>)}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditClick(project)} className="text-gray-300 hover:text-blue-500 transition-colors"><Code size={18} /></button>
                                        <button onClick={() => deleteItem('project', project._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Database size={16}/> {editingId ? 'Update Protocol' : 'Deploy New Project'}</h3>
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <input placeholder="Project Codename" className="w-full border p-2 text-sm" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
                                    <textarea placeholder="Briefing (Short)" className="w-full border p-2 text-sm h-20" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
                                    <textarea placeholder="Mission Detail (Long Description)" className="w-full border p-2 text-sm h-32" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})} />
                                    <input placeholder="Tech Stack (React, Node...)" className="w-full border p-2 text-sm" value={projectForm.techStack} onChange={e => setProjectForm({...projectForm, techStack: e.target.value})} required />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="w-full border p-2 text-sm bg-white" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})}>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <select className="w-full border p-2 text-sm bg-white" value={projectForm.difficulty} onChange={e => setProjectForm({...projectForm, difficulty: e.target.value})}>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="legendary">Legendary</option>
                                        </select>
                                    </div>

                                    <input placeholder="Repository URL" className="w-full border p-2 text-sm" value={projectForm.repoLink} onChange={e => setProjectForm({...projectForm, repoLink: e.target.value})} />
                                    <input placeholder="Live Uplink URL" className="w-full border p-2 text-sm" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                                    <div className="flex gap-2">
                                        {editingId && <Button type="button" onClick={() => { setEditingId(null); setProjectForm({ title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate' }); }} variant="secondary" className="flex-1 text-xs">Cancel</Button>}
                                        <Button type="submit" variant="primary" className="flex-1 text-xs">{editingId ? 'Update System' : 'Initialize Deployment'}</Button>
                                    </div>
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
                                <Card key={hack._id} className="p-6 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                             <h3 className="font-bold text-lg">{hack.name}</h3>
                                             {hack.achievement && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{hack.achievement}</span>}
                                        </div>
                                        <p className="text-secondary text-sm">{hack.description}</p>
                                        <p className="text-xs text-black font-mono mt-2 uppercase">{hack.status}</p>
                                    </div>
                                    <button onClick={() => deleteItem('hackathon', hack._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </Card>
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Code size={16}/> Log Hackathon</h3>
                                <form onSubmit={handleHackathonSubmit} className="space-y-4">
                                    <input placeholder="Event Name" className="w-full border p-2 text-sm" value={hackathonForm.name} onChange={e => setHackathonForm({...hackathonForm, name: e.target.value})} required />
                                    <input placeholder="Project/Outcome Description" className="w-full border p-2 text-sm" value={hackathonForm.description} onChange={e => setHackathonForm({...hackathonForm, description: e.target.value})} />
                                    <input placeholder="Achievement (e.g. 1st Place)" className="w-full border p-2 text-sm" value={hackathonForm.achievement} onChange={e => setHackathonForm({...hackathonForm, achievement: e.target.value})} />
                                    <select className="w-full border p-2 text-sm bg-white" value={hackathonForm.status} onChange={e => setHackathonForm({...hackathonForm, status: e.target.value})}>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="won">Mission Accomplished (Won)</option>
                                    </select>
                                    <Button type="submit" variant="primary" className="w-full text-xs">Record Event</Button>
                                </form>
                            </Card>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
