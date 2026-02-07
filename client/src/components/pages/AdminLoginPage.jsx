import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Use standard api for initial auth check
import { Shield, AlertTriangle } from 'lucide-react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/auth/login', formData);
            
            if (data.role === 'admin' || data.role === 'superadmin') {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data));
                
                if (data.role === 'superadmin') {
                    navigate('/super-admin');
                } else {
                    navigate('/admin');
                }
            } else {
                setError('ACCESS DENIED: Insufficient Clearance Level. Personnel is not authorized for Command Center access.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'AUTHENTICATION FAILED: Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={120} />
                </div>

                <div className="p-8 relative z-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4 ring-1 ring-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-white text-center">Command Access</h1>
                        <p className="text-zinc-500 text-[10px] font-mono mt-2 tracking-widest uppercase border-b border-zinc-800 pb-1">
                            Restricted Area // Class 5 Personnel Only
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded mb-6 flex items-start gap-3 text-xs font-mono animate-pulse">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Operative ID (Email)</label>
                            <input 
                                type="email" 
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition-all placeholder:text-zinc-700"
                                placeholder="ENTER IDENTIFIER"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Secure Key (Password)</label>
                            <input 
                                type="password" 
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 rounded text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition-all placeholder:text-zinc-700"
                                placeholder="ENTER ACCESS CODE"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-4 rounded text-xs uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'VERIFYING CREDENTIALS...' : 'INITIATE UPLINK'}
                        </button>
                    </form>
                </div>
                
                <div className="bg-zinc-950 p-4 border-t border-zinc-800 text-center">
                    <p className="text-[10px] text-zinc-600 font-mono">
                        UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
