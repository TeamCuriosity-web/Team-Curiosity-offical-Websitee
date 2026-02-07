import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Logic remains
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/register', {
        ...formData,
        inviteToken: token
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/admin'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20 px-4 bg-white">
      <div className="mb-8 text-center">
         <h1 className="text-2xl font-bold tracking-tight">Execute Sequence</h1>
         <p className="text-secondary text-sm">Authentication Required</p>
      </div>

      <Card className="max-w-md w-full p-8 shadow-lg">
        <p className="text-sm font-mono text-center mb-8 border border-border p-2 rounded bg-gray-50">
          {token ? "TOKEN_VERIFIED: ACCESS_GRANTED" : "ERROR: MISSING_CREDENTIALS"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Codename</label>
            <input
              type="text"
              required
              className="w-full bg-white border border-border rounded-md px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="e.g. Neo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-white border border-border rounded-md px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="neo@matrix.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white border border-border rounded-md px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full h-11">
            {loading ? "PROCESSING..." : "REGISTER"}
          </Button>

          <div className="text-center pt-4">
              <Link to="/" className="text-sm text-secondary hover:text-black hover:underline">Return Home</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JoinPage;
