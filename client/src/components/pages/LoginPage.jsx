import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { Terminal, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
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
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirect based on role
      if (data.role === 'admin' || data.role === 'superadmin') {
          navigate('/admin');
      } else {
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20 px-4 bg-white">
      <div className="mb-8 text-center">
         <div className="inline-block p-3 bg-black text-white rounded-full mb-4">
            <Lock size={24} />
         </div>
         <h1 className="text-2xl font-bold tracking-tight text-black">Restricted Access</h1>
         <p className="text-secondary text-sm font-mono">Identify yourself, Operative.</p>
      </div>

      <Card className="max-w-md w-full p-8 shadow-2xl border-2 border-black">
        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded mb-6 border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} />
            {error.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Email Identity</label>
            <input
              type="email"
              required
              className="w-full bg-white border-2 border-gray-200 rounded-none px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="operative@legendary.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Access Key (Password)</label>
            <input
              type="password"
              required
              className="w-full bg-white border-2 border-gray-200 rounded-none px-4 py-3 text-black font-mono text-sm focus:outline-none focus:border-black transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full h-12 text-sm">
            {loading ? <span className="animate-pulse">AUTHENTICATING...</span> : "ESTABLISH UPLINK"}
          </Button>

          <div className="text-center pt-4 border-t border-gray-100 mt-6 pointer-events-none opacity-50">
             <span className="text-[10px] uppercase text-gray-400">Secure Connection // SSL Encrypted</span>
          </div>
        </form>
      </Card>
      
       <div className="mt-8 opacity-50 hover:opacity-100 transition-opacity">
            <Link to="/" className="text-xs font-mono text-gray-400 hover:text-black flex items-center gap-2">
                <Terminal size={12} /> ABORT SEQUENCE
            </Link>
       </div>
    </div>
  );
};

export default LoginPage;
