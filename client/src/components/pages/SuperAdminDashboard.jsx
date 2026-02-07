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
            const [usersRes, logsRes, featuresRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/audit-logs'),
                api.get('/admin/features')
            ]);
            setUsers(usersRes.data);
            setAuditLogs(logsRes.data);
            setFeatureFlags(featuresRes.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const generateInvite = async () => {
        try {
            const { data } = await api.post('/admin/invite', { expiresInHours: 24 });
            setInviteLink(data.inviteLink);
            // Refresh logs
            const logsRes = await api.get('/admin/audit-logs');
            setAuditLogs(logsRes.data);
        } catch (err) { console.error(err); }
    };

    const toggleFeature = async (id, currentStatus) => {
         try {
            const { data } = await api.put(`/admin/features/${id}`, { isEnabled: !currentStatus });
            setFeatureFlags(featureFlags.map(f => f._id === id ? data : f));
            // Refresh logs
            const logsRes = await api.get('/admin/audit-logs');
            setAuditLogs(logsRes.data);
         } catch (err) { console.error(err); }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('WARNING: TERMINATION PROTOCOL INITIATED.\n\nThis action is irreversible. Confirm deletion of operative?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            // Refresh logs
            const logsRes = await api.get('/admin/audit-logs');
            setAuditLogs(logsRes.data);
        } catch (err) { alert('Deletion failed'); }
    };

    const updateUserRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';
        if (!window.confirm(`Promote/Demote user to ${newRole.toUpperCase()}?`)) return;
        
        try {
            await api.put(`/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
            // Refresh logs
            const logsRes = await api.get('/admin/audit-logs');
            setAuditLogs(logsRes.data);
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-red-600 tracking-widest animate-pulse">AUTHENTICATING GOD MODE...</div>;

    return (
        <div className="min-h-screen pt-32 px-6 container mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-white/10 pb-8">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-red-600 to-black text-white rounded-xl shadow-2xl shadow-red-900/20 border border-red-500/30">
                        <Lock size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                            SUPER ADMIN <span className="text-red-600">CONSOLE</span>
                        </h1>
                        <p className="text-gray-400 font-mono text-xs uppercase flex items-center gap-2 tracking-widest mt-1">
                             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                             System Intelligence // Clearance: OMEGA
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin" className="text-xs font-bold uppercase tracking-wider border border-white/10 px-6 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all">
                        Command Center
                    </Link>
                    <Link to="/" className="text-xs font-bold uppercase tracking-wider bg-red-600/10 border border-red-500/30 text-red-500 px-6 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                        Exit
                    </Link>
                </div>
            </div>

            {/* Tabs */}
             <div className="flex gap-1 mb-8">
                {['users', 'system'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                            activeTab === tab 
                                ? 'border-red-600 text-white bg-white/5' 
                                : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {activeTab === 'users' && (
                        <Card className="p-0 overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl">
                            <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                <h3 className="font-bold text-gray-200 flex items-center gap-2"><Users size={16}/> Personnel Database</h3>
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">{users.length} RECORDS</span>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-white/5">
                                        <th className="py-4 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Operative</th>
                                        <th className="py-4 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Clearance</th>
                                        <th className="py-4 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors">{user.name}</div>
                                                <div className="text-[11px] text-gray-600 font-mono group-hover:text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button 
                                                    onClick={() => user.role !== 'superadmin' && updateUserRole(user._id, user.role)}
                                                    disabled={user.role === 'superadmin'}
                                                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                        user.role === 'superadmin' ? 'bg-red-500/20 border-red-500/50 text-red-400 cursor-default' :
                                                        user.role === 'admin' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30' :
                                                        'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                                    } transition-all`}
                                                >
                                                    {user.role}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {user.role !== 'superadmin' && (
                                                    <button onClick={() => deleteItem(user._id)} className="p-2 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-8">
                             {/* Feature Flags */}
                             <Card className="p-0 overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl">
                                <div className="p-5 bg-white/5 border-b border-white/10 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-200 flex items-center gap-2"><Cpu size={16}/> System Features</h3>
                                    <div className="flex gap-2">
                                         {featureFlags.map(flag => (
                                             <div key={flag._id} className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg cursor-pointer hover:border-white/30 transition-all" onClick={() => toggleFeature(flag._id, flag.isEnabled)}>
                                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{flag.name}</span>
                                                 {flag.isEnabled ? <ToggleRight size={18} className="text-green-500"/> : <ToggleLeft size={18} className="text-gray-600"/>}
                                             </div>
                                         ))}
                                         {featureFlags.length === 0 && <span className="text-xs text-gray-600 italic">No flags configured</span>}
                                    </div>
                                </div>
                            </Card>

                            {/* Audit Logs */}
                            <Card className="p-0 overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl">
                                <div className="p-5 bg-white/5 border-b border-white/10">
                                    <h3 className="font-bold text-gray-200 flex items-center gap-2"><FileText size={16}/> Audit Logs</h3>
                                </div>
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="sticky top-0 bg-black/90 z-10">
                                            <tr className="border-b border-white/5">
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Timestamp</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Action</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Actor</th>
                                                <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-500 tracking-wider">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {auditLogs.map(log => (
                                                <tr key={log._id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 px-6 text-xs text-gray-500 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                                                    <td className="py-3 px-6"><span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded">{log.action}</span></td>
                                                    <td className="py-3 px-6 text-xs text-gray-400">{log.actorName}</td>
                                                    <td className="py-3 px-6 text-xs text-gray-500 truncate max-w-[200px] font-mono">{JSON.stringify(log.details)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}

                </div>

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
