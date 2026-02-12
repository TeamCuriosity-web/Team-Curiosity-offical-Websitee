import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/adminApi'; // Use Admin Authenticated API
import { Copy, Users, Shield, Terminal, Database, Code, Trash2, Plus, Video, ExternalLink, Play } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects'); // projects, hackathons, team
    const [loading, setLoading] = useState(true);
    
    // Data State
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [hackathons, setHackathons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [notes, setNotes] = useState([]);
    
    // Forms State
    const [projectForm, setProjectForm] = useState({ title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate' });
    const [hackathonForm, setHackathonForm] = useState({ name: '', description: '', achievement: '', status: 'upcoming' });
    const [courseForm, setCourseForm] = useState({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
    const [noteForm, setNoteForm] = useState({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' });
    const [inviteLink, setInviteLink] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [systemStatus, setSystemStatus] = useState({ githubConnected: false, status: 'CHECKING...' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('adminUser')); // Check Admin User
        if (user) {
            if (user.role === 'superadmin') {
                navigate('/super-admin');
                return;
            }
            setCurrentUser(user);
        } else {
             navigate('/admin/login'); 
             return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, projectsRes, hackathonsRes, coursesRes, notesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/projects'), // Public read is fine
                api.get('/hackathons'),
                api.get('/courses'),
                api.get('/notes'),
                api.get('/admin/system-status')
            ]);
            setUsers(usersRes.data);
            setProjects(projectsRes.data);
            setHackathons(hackathonsRes.data);
            setCourses(coursesRes.data);
            setNotes(notesRes.data);
            setSystemStatus(statusRes.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---

    const handleLogout = () => {
        if (window.confirm('Terminate session?')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            navigate('/admin/login');
        }
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            // FORCE FRONTEND URL (GitHub Pages or Localhost)
            // Backend returns its own host, which is wrong for separated deployment.
            // We use the token to build the correct link here.
            // Check if we are on localhost or production to decide on base path if needed.
            // But usually window.location.href handles origin.
            
            // If on localhost, origin is http://localhost:5173
            // If on GH Pages, origin is https://teamcuriosity-web.github.io
            // We need to append the repo path if on GH Pages.
            
            const isLocal = window.location.hostname === 'localhost';
            const basePath = isLocal ? '' : '/Team-Curiosity-offical-Websitee';
            
            const fullLink = `${window.location.origin}${basePath}/invite?token=${data.token}`;
            setInviteLink(fullLink);
        } catch (err) { console.error(err); }
    };
    
    // ... deleteItem and other actions ...

    const deleteItem = async (type, id) => {
        if (!window.confirm(`WARNING: Confirm ${type} deletion protocol?`)) return;
        try {
            if (type === 'project') {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } else if (type === 'hackathon') {
                await api.delete(`/hackathons/${id}`);
                setHackathons(hackathons.filter(h => h._id !== id));
            } else if (type === 'course') {
                await api.delete(`/courses/${id}`);
                setCourses(courses.filter(c => c._id !== id));
            } else if (type === 'note') {
                await api.delete(`/notes/${id}`);
                setNotes(notes.filter(n => n._id !== id));
            } else if (type === 'user') {
                // For requests tab
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (err) { 
            console.error(`${type.toUpperCase()}_DELETION_FAILURE:`, err);
            alert(`Protocol Error: Deletion Failed [${err.response?.status || 'UNKNOWN'}] - ${err.response?.data?.message || err.message}`);
        }
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
            console.error("PROJECT_SUBMIT_ERROR:", err);
            const errMsg = err.response?.data?.message || err.message;
            if (errMsg.includes('GITHUB_DEPLOYMENT_FAILURE')) {
                alert(`GitHub Deployment Blocked:\n\n${errMsg}\n\nPlease check your system configuration or GITHUB_TOKEN.`);
            } else if (errMsg.includes('GITHUB_PROVISION_FAILURE')) {
                alert(`Security Protocol Error:\n\n${errMsg}`);
            } else {
                alert(`Failed to deploy: ${errMsg}`);
            }
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


    const handleApproveUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/approve`);
            setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
        } catch (err) { alert('Approval failed'); }
    };

    // ... (existing functions)

    const handleYoutubeLinkChange = async (url) => {
        setCourseForm(prev => ({ ...prev, youtubeLink: url }));
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : '';

        if (videoId) {
            const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            setCourseForm(prev => ({ ...prev, youtubeId: videoId, thumbnailUrl: thumbUrl }));
            try {
                const { data } = await api.get(`/courses/yt-metadata/${videoId}`);
                setCourseForm(prev => ({ 
                    ...prev, 
                    title: data.title || prev.title, 
                    duration: data.duration || prev.duration 
                }));
            } catch (err) { 
                console.error("METADATA_FETCH_PROTOCOL_ERROR:", err);
                // Fallback to noembed for title only if legacy proxy fails
                try {
                    const resp = await fetch(`https://noembed.com/embed?url=${url}`);
                    const data = await resp.json();
                    if (data.title) setCourseForm(prev => ({ ...prev, title: data.title }));
                } catch (e) { console.error(e); }
            }
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourseId) {
                const { data } = await api.put(`/courses/${editingCourseId}`, courseForm);
                setCourses(courses.map(c => c._id === editingCourseId ? data : c));
                setEditingCourseId(null);
            } else {
                const { data } = await api.post('/courses', courseForm);
                setCourses([data, ...courses]);
            }
            setCourseForm({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
        } catch (err) { alert('Deployment failed'); }
    };

    const handleEditCourse = (course) => {
        setEditingCourseId(course._id);
        setCourseForm({
            title: course.title,
            youtubeLink: course.youtubeLink,
            domain: course.domain,
            instructor: course.instructor || 'Team Curiosity',
            duration: course.duration || '',
            youtubeId: course.youtubeId,
            thumbnailUrl: course.thumbnailUrl
        });
    };

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNoteId) {
                const { data } = await api.put(`/notes/${editingNoteId}`, noteForm);
                setNotes(notes.map(n => n._id === editingNoteId ? data : n));
                setEditingNoteId(null);
            } else {
                const { data } = await api.post('/notes', noteForm);
                setNotes([data, ...notes]);
            }
            setNoteForm({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' });
        } catch (err) { alert('Operation failed'); }
    };

    const handleEditNote = (note) => {
        setEditingNoteId(note._id);
        setNoteForm({
            title: note.title,
            description: note.description || '',
            pdfUrl: note.pdfUrl,
            domain: note.domain || 'Frontend',
            author: note.author || 'Team Curiosity'
        });
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
                            <span className="mx-2 opacity-20">|</span>
                            <span className={`inline-flex items-center gap-1.5 ${systemStatus.githubConnected ? 'text-green-600' : 'text-red-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${systemStatus.githubConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                Deployment Node: {systemStatus.status} {systemStatus.maskedToken && `(${systemStatus.maskedToken})`}
                            </span>
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
            <div className="flex gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
                {['requests', 'projects', 'hackathons', 'courses', 'notes', 'team', 'comms'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                            activeTab === tab 
                                ? 'border-black text-black' 
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab}
                        {tab === 'requests' && users.filter(u => !u.isApproved).length > 0 && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        )}
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
                                        {project.repoLink && (
                                            <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="p-1 px-2 text-gray-300 hover:text-black hover:bg-gray-100 rounded transition-colors flex items-center gap-1 border border-transparent hover:border-gray-200">
                                                 <Code size={14} /> <span className="text-[10px] uppercase font-bold">Repo</span>
                                            </a>
                                        )}
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

                                    {editingId ? (
                                        <input placeholder="Repository URL" className="w-full border p-2 text-sm" value={projectForm.repoLink} onChange={e => setProjectForm({...projectForm, repoLink: e.target.value})} />
                                    ) : (
                                        <div className="w-full border p-2 text-sm bg-gray-50 text-gray-500 flex items-center gap-2 cursor-not-allowed">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="font-mono text-xs uppercase">Auto-Provisioning GitHub Repo [TeamCuriosity-web]</span>
                                        </div>
                                    )}
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

                {/* --- REQUESTS TAB --- */}
                {activeTab === 'requests' && (
                    <div className="lg:col-span-3 space-y-6">
                         <Card className="p-0 overflow-hidden">
                            <div className="p-4 bg-yellow-50 border-b border-yellow-100 mb-0 flex justify-between items-center">
                                <h3 className="font-bold flex items-center gap-2 text-yellow-800"><Shield size={16}/> Pending Access Requests</h3>
                                <span className="text-xs font-bold px-2 py-1 bg-white rounded border border-yellow-200 text-yellow-800">
                                    {users.filter(u => !u.isApproved).length} Pending
                                </span>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-border">
                                        <th className="py-3 px-6 text-xs uppercase font-semibold text-secondary">Candidate</th>
                                        <th className="py-3 px-6 text-xs uppercase font-semibold text-secondary">Details</th>
                                        <th className="py-3 px-6 text-xs uppercase font-semibold text-secondary text-right">Protocol</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => !u.isApproved).length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-400 text-xs font-mono">NO PENDING REQUESTS // ALL SYSTEMS SECURE</td>
                                        </tr>
                                    ) : (
                                        users.filter(u => !u.isApproved).map(user => (
                                            <tr key={user._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <img src={user.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} className="w-8 h-8 rounded-full bg-gray-100" alt="" />
                                                        <div>
                                                            <div className="font-bold text-sm">{user.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-xs"><span className="font-bold text-gray-400">INST:</span> {user.college || 'N/A'}</div>
                                                        <div className="text-xs"><span className="font-bold text-gray-400">BR/SEC:</span> {user.branch || '-'}/{user.section || '-'}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button onClick={() => handleApproveUser(user._id)} variant="primary" className="h-8 text-[10px] px-3 bg-green-600 hover:bg-green-700 border-green-700">
                                                            APPROVE
                                                        </Button>
                                                        <Button onClick={() => deleteItem('user', user._id)} variant="outline" className="h-8 text-[10px] px-3 border-red-200 text-red-600 hover:bg-red-50">
                                                            REJECT
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    </div>
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

                {/* --- COMMS TAB --- */}
                {activeTab === 'comms' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Terminal size={18}/> Broadcast Center
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
                                    alert('Message Dispatched'); // "Transmission Sent" equivalent
                                    e.target.reset();
                                } catch(err) { alert('Dispatch Failed'); }
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Recipients</label>
                                    <select name="recipient" className="w-full border border-gray-200 p-2 rounded text-sm text-gray-900 outline-none mt-1 bg-white">
                                        <option value="all">All Personnel</option>
                                        <option value="admin">Admin Channel Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Priority</label>
                                    <select name="type" className="w-full border border-gray-200 p-2 rounded text-sm text-gray-900 outline-none mt-1 bg-white">
                                        <option value="message">Standard</option>
                                        <option value="alert">High Alert</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Briefing</label>
                                    <textarea name="message" required className="w-full border border-gray-200 p-2 rounded text-sm text-gray-900 outline-none h-32 mt-1" placeholder="Type notification..." />
                                </div>
                                <Button type="submit" variant="primary" className="w-full text-xs">
                                    Send Broadcast
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}
                {/* --- COURSES TAB --- */}
                {activeTab === 'courses' && (
                    <>
                         <div className="lg:col-span-2 space-y-4">
                            {courses.map(course => (
                                <Card key={course._id} className="p-4 flex gap-4 items-center group">
                                    <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                        <img src={course.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={10} fill="white" className="text-white"/>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm truncate max-w-[200px]">{course.title}</h3>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${course.domain === 'Frontend' ? 'bg-cyan-100 text-cyan-800' : 'bg-red-100 text-red-800'}`}>{course.domain}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-gray-400 font-mono">{course.duration || 'N/A'}</span>
                                            <a href={course.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-black"><ExternalLink size={10}/></a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditCourse(course)} className="text-gray-300 hover:text-blue-500 transition-colors"><Code size={16} /></button>
                                        <button onClick={() => deleteItem('course', course._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </Card>
                            ))}
                            {courses.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 border border-dashed rounded text-gray-400 text-[10px] uppercase tracking-widest">
                                    No Courses Found // All Systems Clear
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Video size={16}/> Deploy Course</h3>
                                <form onSubmit={handleCourseSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">YouTube Link</label>
                                        <input className="w-full border p-2 text-sm mt-1" placeholder="https://youtube.com/..." value={courseForm.youtubeLink} onChange={e => handleYoutubeLinkChange(e.target.value)} required />
                                    </div>
                                    {courseForm.thumbnailUrl && (
                                        <div className="h-20 w-full rounded overflow-hidden border border-gray-100 mb-2">
                                            <img src={courseForm.thumbnailUrl} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Title</label>
                                            <input className="w-full border p-2 text-sm mt-1 font-bold" placeholder="Enter title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Instructor / Author</label>
                                            <input className="w-full border p-2 text-sm mt-1" placeholder="Lead Instructor" value={courseForm.instructor} onChange={e => setCourseForm({...courseForm, instructor: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                             <label className="text-[10px] uppercase font-bold text-gray-400">Domain</label>
                                             <select className="w-full border p-2 text-sm bg-white mt-1" value={courseForm.domain} onChange={e => setCourseForm({...courseForm, domain: e.target.value})}>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                            </select>
                                        </div>
                                        <div>
                                             <label className="text-[10px] uppercase font-bold text-gray-400">Duration</label>
                                             <input className="w-full border p-2 text-sm mt-1" placeholder="0:00:00" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {editingCourseId && (
                                            <Button 
                                                type="button" 
                                                onClick={() => {
                                                    setEditingCourseId(null);
                                                    setCourseForm({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
                                                }} 
                                                variant="secondary" 
                                                className="flex-1 text-xs"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" variant="primary" className="flex-1 text-xs" disabled={!courseForm.youtubeId}>
                                            {editingCourseId ? 'Update Protocol' : 'Deploy Protocol'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </>
                )}

                {/* --- NOTES TAB --- */}
                {activeTab === 'notes' && (
                    <>
                         <div className="lg:col-span-2 space-y-4">
                            {notes.map(note => (
                                <Card key={note._id} className="p-4 flex gap-4 items-center group">
                                    <div className="w-20 h-12 bg-red-50 text-red-600 rounded overflow-hidden flex-shrink-0 flex items-center justify-center relative transition-all group-hover:bg-red-100">
                                        <Database size={20}/>
                                        <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FileText size={10} className="text-red-600"/>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm truncate max-w-[200px]">{note.title}</h3>
                                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${note.domain === 'Frontend' ? 'bg-cyan-100 text-cyan-800' : 'bg-red-100 text-red-800'}`}>{note.domain}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] text-gray-400 truncate max-w-[250px]">{note.description || 'No description provided'}</p>
                                            <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-600 transition-colors">
                                                <ExternalLink size={10}/>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditNote(note)} className="text-gray-300 hover:text-blue-500 transition-colors"><Code size={16} /></button>
                                        <button onClick={() => deleteItem('note', note._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </Card>
                            ))}
                            {notes.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 border border-dashed rounded text-gray-400 text-[10px] uppercase tracking-widest">
                                    No Academic Notes // Repository Empty
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                             <Card className="p-6 sticky top-8">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={16}/> {editingNoteId ? 'Update Note' : 'Archive Note'}</h3>
                                <form onSubmit={handleNoteSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">PDF Uplink [Link]</label>
                                        <input className="w-full border p-2 text-sm mt-1" placeholder="https://..." value={noteForm.pdfUrl} onChange={e => setNoteForm({...noteForm, pdfUrl: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Title</label>
                                        <input className="w-full border p-2 text-sm mt-1 font-bold" placeholder="E.g. JavaScript Advanced" value={noteForm.title} onChange={e => setNoteForm({...noteForm, title: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                                        <textarea className="w-full border p-2 text-sm mt-1 h-20" placeholder="Brief summary..." value={noteForm.description} onChange={e => setNoteForm({...noteForm, description: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                             <label className="text-[10px] uppercase font-bold text-gray-400">Domain</label>
                                             <select className="w-full border p-2 text-sm bg-white mt-1" value={noteForm.domain} onChange={e => setNoteForm({...noteForm, domain: e.target.value})}>
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                             <label className="text-[10px] uppercase font-bold text-gray-400">Author</label>
                                             <input className="w-full border p-2 text-sm mt-1" value={noteForm.author} onChange={e => setNoteForm({...noteForm, author: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {editingNoteId && (
                                            <Button type="button" onClick={() => { setEditingNoteId(null); setNoteForm({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' }); }} variant="secondary" className="flex-1 text-xs">Cancel</Button>
                                        )}
                                        <Button type="submit" variant="primary" className="flex-1 text-xs">
                                            {editingNoteId ? 'Commit Update' : 'Initialize Archival'}
                                        </Button>
                                    </div>
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
