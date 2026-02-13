import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Shield, Lock, AlertCircle, Terminal } from 'lucide-react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            return await api.post('/auth/login', credentials).then(res => res.data);
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
        <div className="min-h-screen flex flex-col items-center justify-center -mt-20 px-4 bg-white">
          <div className="mb-8 text-center">
             <div className="inline-block p-3 bg-black text-white rounded-full mb-4">
                <Shield size={24} />
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-black">Command Access</h1>
             <p className="text-secondary text-sm font-mono">Restricted Area. Authorized Personnel Only.</p>
          </div>
    
          <Card className="max-w-md w-full p-8 shadow-2xl border-2 border-black">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded mb-6 border border-red-100 flex items-center gap-2">
                <AlertCircle size={14} />
                {String(error).toUpperCase()}
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Admin Identity</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white border-2 border-gray-200 rounded-none px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Naseer@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
    
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Security Token</label>
                <input
                  type="password"
                  required
                  className="w-full bg-white border-2 border-gray-200 rounded-none px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-black transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
    
              <Button type="submit" variant="primary" className="w-full h-12 text-sm">
                {loading ? <span className="animate-pulse">VERIFYING...</span> : "ACCESS MAINFRAME"}
              </Button>
    
              <div className="text-center pt-4 border-t border-gray-100 mt-6 pointer-events-none opacity-50">
                 <span className="text-[10px] uppercase text-gray-400">System Secure 
              </div>
            </form>
          </Card>
          
           <div className="mt-8 opacity-50 hover:opacity-100 transition-opacity">
                <Link to="/" className="text-xs font-mono text-gray-400 hover:text-black flex items-center gap-2">
                    <Terminal size={12} /> RETURN TO SURFACE
                </Link>
           </div>
        </div>
      );
};

export default AdminLoginPage;
