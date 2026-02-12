import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/adminApi'; // Use Admin Authenticated API
import { Shield, Users, Trash2, Lock, Cpu, Activity, Database, Code, Key, UserPlus, Zap, LayoutGrid, Layers, Globe, GitBranch, Server, Video, ExternalLink, Play } from 'lucide-react';

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
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('requests'); // requests, admins, members, projects, hackathons, comms, system, courses
    
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
    const [courseForm, setCourseForm] = useState({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [noteForm, setNoteForm] = useState({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' });
    const [editingNoteId, setEditingNoteId] = useState(null);

    // --- QUERIES ---
    const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await api.get('/admin/users');
            return data;
        },
        retry: false
    });

    const { data: projects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data } = await api.get('/projects');
            return data;
        }
    });

    const { data: hackathons = [], isLoading: hackathonsLoading } = useQuery({
        queryKey: ['hackathons'],
        queryFn: async () => {
            const { data } = await api.get('/hackathons');
            return data;
        }
    });

    const { data: courses = [], isLoading: coursesLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => api.get('/courses').then(res => res.data)
    });

    const { data: notes = [], isLoading: notesLoading } = useQuery({
        queryKey: ['notes'],
        queryFn: () => api.get('/notes').then(res => res.data)
    });

    const isLoading = usersLoading || projectsLoading || hackathonsLoading || coursesLoading || notesLoading;

    if (usersError?.response?.status === 401) {
        navigate('/admin/login');
    }

    // --- MUTATIONS ---
    const createAdminMutation = useMutation({
        mutationFn: (data) => api.post('/admin/create-admin', data),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['admin-users']);
            setNewAdminCreds({ email: res.data.email, password: res.data.generatedPassword });
            setCreateAdminForm({ name: '', email: '' });
        },
        onError: (err) => alert(err.response?.data?.message || 'Failed to create admin')
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => api.delete(`/admin/users/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['admin-users']),
        onError: () => alert('Deletion failed')
    });

    const projectMutation = useMutation({
        mutationFn: (variables) => {
             if (variables.editingId) {
                 return api.put(`/projects/${variables.editingId}`, variables.payload);
             } else {
                 return api.post('/projects', variables.payload);
             }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
            setProjectForm({ title: '', description: '', longDescription: '', techStack: '', repoLink: '', liveLink: '', status: 'ongoing', difficulty: 'intermediate' });
            setEditingId(null);
        },
        onError: (err) => alert(`Operation failed: ${err.message}`)
    });

    const deleteProjectMutation = useMutation({
        mutationFn: (id) => api.delete(`/projects/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['projects']),
        onError: () => alert('Deletion failed')
    });

    const hackathonMutation = useMutation({
        mutationFn: (data) => api.post('/hackathons', data),
        onSuccess: () => {
             queryClient.invalidateQueries(['hackathons']);
             setHackathonForm({ name: '', description: '', achievement: '', status: 'upcoming' });
        },
        onError: () => alert('Operation failed')
    });

    const { mutate: deleteHackathon } = useMutation({
        mutationFn: (id) => api.delete(`/hackathons/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['hackathons']),
        onError: (err) => {
            console.error("HACKATHON_DELETION_PROTOCOL_FAILURE:", err);
            alert(`Protocol Error: Deletion Failed [${err.response?.status || 'UNKNOWN'}] - ${err.response?.data?.message || err.message}`);
        }
    });

    const courseMutation = useMutation({
        mutationFn: (variables) => {
            if (variables.editingId) {
                return api.put(`/courses/${variables.editingId}`, variables.payload);
            } else {
                return api.post('/courses', variables.payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
            setCourseForm({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
            setEditingCourseId(null);
        },
        onError: (err) => alert(`Operation Failed: ${err.response?.data?.message || err.message}`)
    });

    const createCourse = (data) => courseMutation.mutate({ payload: data });
    const updateCourse = (id, data) => courseMutation.mutate({ editingId: id, payload: data });

    const { mutate: deleteCourse } = useMutation({
        mutationFn: (id) => api.delete(`/courses/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['courses']),
        onError: (err) => {
            console.error("COURSE_DELETION_PROTOCOL_FAILURE:", err);
            alert(`Protocol Error: Deletion Failed [${err.response?.status || 'UNKNOWN'}] - ${err.response?.data?.message || err.message}`);
        }
    });

    const noteMutation = useMutation({
        mutationFn: (variables) => {
            if (variables.editingId) {
                return api.put(`/notes/${variables.editingId}`, variables.payload);
            } else {
                return api.post('/notes', variables.payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            setNoteForm({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' });
            setEditingNoteId(null);
        },
        onError: (err) => alert(`Operation Failed: ${err.response?.data?.message || err.message}`)
    });

    const deleteNote = useMutation({
        mutationFn: (id) => api.delete(`/notes/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['notes']),
        onError: (err) => alert(`Deletion failed: ${err.response?.data?.message || err.message}`)
    });

    const approveUserMutation = useMutation({
        mutationFn: (id) => api.put(`/admin/users/${id}/approve`),
        onSuccess: () => queryClient.invalidateQueries(['admin-users']),
        onError: () => alert('Approval failed')
    });


    // --- HANDLERS ---

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        createAdminMutation.mutate(createAdminForm);
    };

    const deleteUser = async (id) => {
        if (!window.confirm('WARNING: TERMINATION PROTOCOL INITIATED.\n\nConfirm deletion?')) return;
        deleteUserMutation.mutate(id);
    };

    const handleProjectSubmit = (e) => {
        e.preventDefault();
        const payload = { ...projectForm, techStack: typeof projectForm.techStack === 'string' ? projectForm.techStack.split(',').map(s => s.trim()) : projectForm.techStack };
        projectMutation.mutate({ editingId, payload });
    };

    const handleHackathonSubmit = (e) => {
        e.preventDefault();
        hackathonMutation.mutate(hackathonForm);
    };

    const deleteItem = (type, id) => {
        if (!window.confirm(`WARNING: Confirm ${type} deletion protocol?`)) return;
        if (type === 'project') deleteProjectMutation.mutate(id);
        else if (type === 'hackathon') deleteHackathon(id);
        else if (type === 'course') deleteCourse(id);
        else if (type === 'note') deleteNote.mutate(id);
    };

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        noteMutation.mutate({ editingId: editingNoteId, payload: noteForm });
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

    const handleApproveUser = (id) => {
        approveUserMutation.mutate(id);
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

    if (isLoading) return (
        <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs text-red-600 tracking-[0.2em] font-bold">
            VERIFYING CREDENTIALS...
        </div>
    );

    const adminList = users.filter(u => u.role === 'admin' || u.role === 'superadmin');
    const memberList = users.filter(u => u.role !== 'admin' && u.role !== 'superadmin');

    const handleYoutubeLinkChange = async (url) => {
        setCourseForm(prev => ({ ...prev, youtubeLink: url }));
        
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
        }

        if (videoId) {
            const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            setCourseForm(prev => ({ ...prev, youtubeId: videoId, thumbnailUrl: thumbUrl }));
            
            try {
                const response = await fetch(`https://noembed.com/embed?url=${url}`);
                const data = await response.json();
                if (data.title) {
                    setCourseForm(prev => ({ ...prev, title: data.title }));
                }
            } catch (err) {
                console.error("Meta fetch error", err);
            }
        }
    };

    const handleCourseSubmit = (e) => {
        e.preventDefault();
        if (editingCourseId) {
            updateCourse(editingCourseId, courseForm);
        } else {
            createCourse(courseForm);
        }
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
        setActiveTab('courses'); // Ensure we are on the right tab
    };

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
                    <TabButton id="courses" label="Courses" icon={Video} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="notes" label="Notes" icon={Database} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                {/* --- COURSES TAB --- */}
                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.map(course => (
                                    <LightCard key={course._id} className="relative group overflow-hidden border-gray-100">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0 relative">
                                                <img src={course.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Play size={12} fill="white" className="text-white"/>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <Badge color={course.domain === 'Frontend' ? 'blue' : 'red'}>{course.domain}</Badge>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditCourse(course)} className="text-gray-300 hover:text-blue-600 transition-colors">
                                                            <Code size={14}/>
                                                        </button>
                                                        <button onClick={() => deleteItem('course', course._id)} className="text-gray-300 hover:text-red-600 transition-colors">
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-sm mt-1 line-clamp-1">{course.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{course.duration || 'N/A'}</div>
                                                    <a href={course.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-900 transition-colors">
                                                        <ExternalLink size={10}/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </LightCard>
                                ))}
                            </div>
                            {courses.length === 0 && (
                                <div className="p-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="text-gray-300 mb-2 font-mono text-xs uppercase tracking-[0.2em]">No Courses Deployed // Empty Repository</div>
                                    <p className="text-gray-400 text-[10px] uppercase">Add your first YouTube course using the uplink protocol.</p>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                            <LightCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><Video size={18} className="text-red-600"/> Deploy Course</h3>
                                <form onSubmit={handleCourseSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">YouTube Uplink [URL]</label>
                                        <input 
                                            className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" 
                                            placeholder="https://youtube.com/watch?v=..." 
                                            value={courseForm.youtubeLink} 
                                            onChange={e => handleYoutubeLinkChange(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    
                                    {courseForm.thumbnailUrl && (
                                        <div className="relative h-24 w-full bg-black rounded overflow-hidden border-2 border-gray-100 group">
                                            <img src={courseForm.thumbnailUrl} className="w-full h-full object-cover opacity-80" alt="Preview"/>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                                <span className="text-[8px] font-mono text-white/80 line-clamp-1 uppercase tracking-tighter">PREVIEW: {courseForm.title}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mission Title</label>
                                            <input 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm font-bold" 
                                                placeholder="Course Title" 
                                                value={courseForm.title} 
                                                onChange={e => setCourseForm({...courseForm, title: e.target.value})} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Lead Instructor</label>
                                            <input 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" 
                                                placeholder="Author Name" 
                                                value={courseForm.instructor} 
                                                onChange={e => setCourseForm({...courseForm, instructor: e.target.value})} 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Domain</label>
                                            <select 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 outline-none mt-1 bg-white cursor-pointer"
                                                value={courseForm.domain}
                                                onChange={e => setCourseForm({...courseForm, domain: e.target.value})}
                                            >
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Duration</label>
                                            <input 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" 
                                                placeholder="e.g. 4:20:00" 
                                                value={courseForm.duration} 
                                                onChange={e => setCourseForm({...courseForm, duration: e.target.value})} 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {editingCourseId && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setEditingCourseId(null);
                                                    setCourseForm({ title: '', youtubeLink: '', domain: 'Frontend', instructor: 'Team Curiosity', duration: '', youtubeId: '', thumbnailUrl: '' });
                                                }}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded text-xs uppercase tracking-[0.2em] transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button 
                                            type="submit"
                                            disabled={!courseForm.youtubeId}
                                            className="grow-[2] bg-black hover:bg-red-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-red-200"
                                        >
                                            {editingCourseId ? 'Update Course' : 'Deploy to Hub'}
                                        </button>
                                    </div>
                                </form>
                            </LightCard>
                        </div>
                    </div>
                )}

                {/* --- NOTES TAB --- */}
                {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.map(note => (
                                    <LightCard key={note._id} className="relative group overflow-hidden border-gray-100">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded flex items-center justify-center flex-shrink-0">
                                                <Database size={20}/>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <Badge color={note.domain === 'Frontend' ? 'blue' : 'red'}>{note.domain}</Badge>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditNote(note)} className="text-gray-300 hover:text-blue-600 transition-colors">
                                                            <Code size={14}/>
                                                        </button>
                                                        <button onClick={() => deleteItem('note', note._id)} className="text-gray-300 hover:text-red-600 transition-colors">
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-sm mt-1 line-clamp-1">{note.title}</h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{note.description || 'No legacy metadata provided'}</p>
                                                <div className="mt-2 text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
                                                    BY: {note.author}
                                                    <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-red-600 transition-colors">
                                                        <ExternalLink size={10}/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </LightCard>
                                ))}
                            </div>
                            {notes.length === 0 && (
                                <div className="p-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="text-gray-300 mb-2 font-mono text-xs uppercase tracking-[0.2em]">No Academic Archives // Empty Repository</div>
                                    <p className="text-gray-400 text-[10px] uppercase">Upload your first PDF resource to the central archive.</p>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                            <LightCard className="sticky top-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><Database size={18} className="text-red-600"/> Archive Note</h3>
                                <form onSubmit={handleNoteSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">PDF Source Uplink</label>
                                        <input 
                                            className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" 
                                            placeholder="https://..." 
                                            value={noteForm.pdfUrl} 
                                            onChange={e => setNoteForm({...noteForm, pdfUrl: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Title</label>
                                        <input 
                                            className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm font-bold" 
                                            placeholder="E.g. React Patterns" 
                                            value={noteForm.title} 
                                            onChange={e => setNoteForm({...noteForm, title: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Description</label>
                                        <textarea 
                                            className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none h-24 mt-1 shadow-sm" 
                                            placeholder="Archive summary..." 
                                            value={noteForm.description} 
                                            onChange={e => setNoteForm({...noteForm, description: e.target.value})} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Domain</label>
                                            <select 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 outline-none mt-1"
                                                value={noteForm.domain}
                                                onChange={e => setNoteForm({...noteForm, domain: e.target.value})}
                                            >
                                                <option value="Frontend">Frontend</option>
                                                <option value="Backend">Backend</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Author</label>
                                            <input 
                                                className="w-full bg-white border border-gray-200 p-3 rounded text-sm text-gray-900 focus:border-red-500 outline-none mt-1 shadow-sm" 
                                                value={noteForm.author} 
                                                onChange={e => setNoteForm({...noteForm, author: e.target.value})} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {editingNoteId && (
                                            <button 
                                                type="button"
                                                onClick={() => { setEditingNoteId(null); setNoteForm({ title: '', description: '', pdfUrl: '', domain: 'Frontend', author: 'Team Curiosity' }); }}
                                                className="flex-1 bg-gray-100 font-bold py-3 rounded text-xs uppercase tracking-widest"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button type="submit" className="grow-[2] bg-black hover:bg-red-600 text-white font-bold py-3 rounded text-xs uppercase tracking-widest transition-colors">
                                            {editingNoteId ? 'Commit Update' : 'Initialize Archival'}
                                        </button>
                                    </div>
                                </form>
                            </LightCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default SuperAdminDashboard;
