import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Shield, Terminal, Users, Trash2, Lock } from 'lucide-react';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
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
            const { data } = await api.get('/admin/users');
            setUsers(data);
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
        } catch (err) { console.error(err); }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('WARNING: TERMINATION PROTOCOL INITIATED.\n\nThis action is irreversible. Confirm deletion of operative?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert('Deletion failed'); }
    };

    const updateUserRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';
        if (!window.confirm(`Promote/Demote user to ${newRole.toUpperCase()}?`)) return;
        
        try {
            await api.put(`/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-red-600">AUTHENTICATING GOD MODE...</div>;

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
                    <Link to="/admin" className="text-sm border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors">
                        Switch to Standard Command
                    </Link>
                    <Link to="/" className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition-colors">
                        Exit Console
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Users List */}
                <div className="lg:col-span-2">
                    <Card className="p-0 overflow-hidden border-red-100 shadow-xl">
                        <div className="p-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
                            <h3 className="font-bold text-red-800 flex items-center gap-2"><Users size={16}/> Personnel Database</h3>
                            <span className="text-xs font-mono text-red-600">{users.length} Records Found</span>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-100">
                                    <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-400">Operative</th>
                                    <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-400">Clearance</th>
                                    <th className="py-3 px-6 text-[10px] uppercase font-bold text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b border-gray-50 hover:bg-red-50/10 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-sm">{user.name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{user.email}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button 
                                                onClick={() => user.role !== 'superadmin' && updateUserRole(user._id, user.role)}
                                                disabled={user.role === 'superadmin'}
                                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    user.role === 'superadmin' ? 'bg-red-600 text-white cursor-default' :
                                                    user.role === 'admin' ? 'bg-black text-white hover:bg-gray-800' :
                                                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {user.role}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {user.role !== 'superadmin' && (
                                                <button onClick={() => deleteItem(user._id)} className="text-gray-300 hover:text-red-600 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>

                {/* Sidebar / Tools */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 border-red-100 shadow-xl">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-red-800"><Shield size={16}/> Recruit Operative</h3>
                        <p className="text-xs text-gray-500 mb-4">Generate a 24-hour access key for new personnel.</p>
                        
                        {inviteLink ? (
                            <div className="p-4 bg-black text-green-400 rounded text-xs break-all font-mono border border-green-900 cursor-pointer hover:bg-gray-900 transition-colors" onClick={() => navigator.clipboard.writeText(inviteLink)}>
                                {inviteLink}
                                <div className="text-[10px] text-gray-500 mt-2 text-center uppercase">Click to Copy</div>
                            </div>
                        ) : (
                            <Button onClick={generateInvite} className="w-full text-xs bg-red-600 hover:bg-red-700 text-white border-0">Generate Access Key</Button>
                        )}
                    </Card>

                    <div className="p-6 bg-gray-50 rounded border border-gray-100">
                        <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">System Status</h4>
                         <div className="flex justify-between text-xs mb-1">
                            <span>Server Status</span>
                            <span className="text-green-600 font-bold">ONLINE</span>
                        </div>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Database Connection</span>
                            <span className="text-green-600 font-bold">STABLE</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Security Protocols</span>
                            <span className="text-green-600 font-bold">ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
