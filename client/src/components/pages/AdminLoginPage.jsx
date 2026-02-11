import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { Shield, Lock, Hexagon, ChevronRight, Activity } from 'lucide-react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [focused, setFocused] = useState(null);

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            if (data.role === 'admin' || data.role === 'superadmin') {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data));
                navigate(data.role === 'superadmin' ? '/super-admin' : '/admin');
            } else {
                throw new Error('PERMISSION DENIED: INVALID CLEARANCE DETECTED');
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    const loading = loginMutation.isPending;
    const error = loginMutation.error ? (loginMutation.error.response?.data?.message || loginMutation.error.message || 'AUTHENTICATION PROTOCOL FAILED') : '';

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 font-sans selection:bg-cyan-500/30">
            
            {/* --- Ambient Background Effects --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
            </div>

            {/* --- Main Interface --- */}
            <div className="relative z-10 w-full max-w-[400px] p-1">
                
                {/* Holographic Border Effect - Subtle in light mode */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-2xl opacity-50 blur-sm"></div>
                
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    
                    {/* Header Scanner Animation */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 scanner-line"></div>

                    <div className="p-8 pb-10">
                        {/* Logo / Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <div className="relative w-20 h-20 bg-white border border-cyan-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-cyan-300 transition-colors">
                                    <Hexagon size={40} className="text-cyan-600 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                                    <div className="absolute inset-0 animate-spin-slow opacity-10">
                                        <div className="w-full h-full rounded-full border-t border-cyan-600"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-gray-900 text-xl font-bold tracking-[0.3em] uppercase">Hyperion Gate</h2>
                            < div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-cyan-600/80 font-mono uppercase tracking-widest">
                                <Activity size={10} className="animate-pulse" /> System Secure
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <Shield size={16} className="text-red-600 shrink-0 mt-0.5" />
                                <span className="text-xs text-red-600 font-mono leading-relaxed">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className={`relative group transition-all duration-300 ${focused === 'email' ? 'scale-[1.02]' : ''}`}>
                                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1.5 block pl-1">Operative ID</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3.5 px-4 text-gray-900 text-sm font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                        placeholder="USR-9920-X"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                    <div className={`absolute right-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-lg transition-all duration-300 ${focused === 'email' ? 'opacity-100 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'opacity-0'}`}></div>
                                </div>
                            </div>

                            <div className={`relative group transition-all duration-300 ${focused === 'password' ? 'scale-[1.02]' : ''}`}>
                                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-widest mb-1.5 block pl-1">Security Token</label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        required
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3.5 px-4 text-gray-900 text-sm font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <div className={`absolute right-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-lg transition-all duration-300 ${focused === 'password' ? 'opacity-100 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'opacity-0'}`}></div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full relative group overflow-hidden bg-black hover:bg-gray-900 text-white font-bold py-4 rounded-lg text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span className="relative flex items-center justify-center gap-3">
                                    {loading ? 'AUTHENTICATING...' : (
                                        <>Access Mainframe <ChevronRight size={14} /></>
                                    )}
                                </span>
                            </button>

                        </form>
                    </div>

                    {/* Footer Infos */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-400">
                        <span>V.4.0.21</span>
                        <div className="flex gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-green-600 font-bold">ONLINE</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .scanner-line {
                    animation: scan 3s linear infinite;
                }
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(400px); opacity: 0; }
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AdminLoginPage;
