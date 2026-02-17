import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import api from '../../services/api';
import { User, Mail, Lock, BookOpen, Layers, Code, CheckCircle, AlertCircle, School } from 'lucide-react';

const AVATAR_SEEDS = [
    { id: 'male1', seed: 'Aiden', gender: 'male' },
    { id: 'male2', seed: 'Owen', gender: 'male' },
    { id: 'male3', seed: 'Caleb', gender: 'male' },
    { id: 'female1', seed: 'Abby', gender: 'female' },
    { id: 'female2', seed: 'Sasha', gender: 'female' },
    { id: 'female3', seed: 'Cleo', gender: 'female' },
];

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    section: '',
    programmingLanguages: '', 
    avatar: '',
    github: '',
    linkedin: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  
  const validateEmail = (email) => {
    
    
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const blockedDomains = ['xyz', 'test', 'temp', 'example'];
    
    if (!regex.test(email)) return "Invalid email format";
    
    const domain = email.split('@')[1];
    if (domain) {
        const domainExtension = domain.split('.').pop();
        if (blockedDomains.includes(domainExtension)) return "Please use a valid institutional or personal email domain";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    
    const emailError = validateEmail(formData.email);
    if (emailError) {
        setValidationErrors(prev => ({ ...prev, email: emailError }));
        setLoading(false);
        return;
    }

    if (!selectedAvatar) {
        setError("Identity Incomplete: Please select a visual avatar.");
        setLoading(false);
        return;
    }

    try {
      const payload = {
        ...formData,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${selectedAvatar}`,
        programmingLanguages: formData.programmingLanguages.split(',').map(s => s.trim()).filter(s => s),
        inviteToken: token
      };

      const { data } = await api.post('/auth/register', payload);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.isApproved) {
          navigate('/profile'); 
      } else {
          
          navigate('/profile');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (seed) => {
      setSelectedAvatar(seed);
      setFormData(prev => ({ ...prev, avatar: seed }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-white">
      <div className="mb-8 text-center">
         <h1 className="text-3xl font-bold tracking-tight text-black mb-2">Initiate Protocol</h1>
         <p className="text-black/60 font-mono text-xs uppercase tracking-widest">
            {token ? "SECURE UPLINK ESTABLISHED" : "PUBLIC ACCESS DETECTED - APPROVAL REQUIRED"}
         </p>
      </div>

      <Card className="max-w-2xl w-full p-8 shadow-2xl border-2 border-black">
        {token && (
             <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-xs font-bold font-mono mb-6 text-center">
                INVITE VERIFIED: AUTOMATIC APPROVAL ENABLED
             </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-bold p-4 rounded mb-8 border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} />
            {error.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {}
          <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 text-center mb-4">Select Digital Avatar</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-center">
                  {AVATAR_SEEDS.map((av) => (
                      <div 
                        key={av.id}
                        onClick={() => handleAvatarSelect(av.seed)}
                        className={`cursor-pointer rounded-full border-2 p-1 transition-all ${selectedAvatar === av.seed ? 'border-black scale-110 shadow-lg' : 'border-transparent hover:border-gray-200 grayscale hover:grayscale-0'}`}
                      >
                          <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${av.seed}`}
                            alt={av.id} 
                            className="w-full h-full rounded-full bg-white p-1"
                          />
                      </div>
                  ))}
              </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {}
              <div className="space-y-4">
                  <h3 className="text-xs font-bold text-black uppercase border-b border-black pb-2 mb-4 flex items-center gap-2"><User size={14}/> Identity</h3>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
                    <input
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all font-bold text-black"
                      placeholder="ENTER NAME"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email (Official)</label>
                    <div className="relative">
                        <input
                        type="email"
                        required
                        className={`w-full bg-gray-50 border ${validationErrors.email ? 'border-red-500' : 'border-gray-200'} rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all font-mono`}
                        placeholder="Naseer@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Mail size={14} className="absolute right-3 top-3.5 text-gray-300"/>
                    </div>
                    {validationErrors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{validationErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Access Key (Password)</label>
                    <div className="relative">
                        <input
                        type="password"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all font-mono"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <Lock size={14} className="absolute right-3 top-3.5 text-gray-300"/>
                    </div>
                  </div>
              </div>

              {}
              <div className="space-y-4">
                  <h3 className="text-xs font-bold text-black uppercase border-b border-black pb-2 mb-4 flex items-center gap-2"><School size={14}/> Academic Data</h3>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">College / Institution</label>
                    <input
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all"
                      placeholder="e.g. MIT"
                      value={formData.college}
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Branch</label>
                        <input
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all"
                          placeholder="CSE / ECE"
                          value={formData.branch}
                          onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Section</label>
                        <input
                          required
                          className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all"
                          placeholder="A / B"
                          value={formData.section}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                        />
                      </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Tech Stack (Arsenal)</label>
                    <input
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all"
                      placeholder="React, Node, Python..."
                      value={formData.programmingLanguages}
                      onChange={(e) => setFormData({...formData, programmingLanguages: e.target.value})}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Comma separated values</p>
                  </div>
              </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {}
          <div className="space-y-4">
               <h3 className="text-xs font-bold text-black uppercase border-b border-black pb-2 mb-4 flex items-center gap-2">Social Intelligence</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">GitHub Profile</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all font-mono"
                            placeholder="https://github.com/username"
                            value={formData.github}
                            onChange={(e) => setFormData({...formData, github: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">LinkedIn Profile</label>
                        <input
                            className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm focus:border-black focus:ring-0 outline-none transition-all font-mono"
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        />
                    </div>
               </div>
          </div>

          <Button type="submit" variant="primary" className="w-full h-14 text-sm tracking-widest font-bold">
            {loading ? "PROCESSING REQUEST..." : "SUBMIT APPLICATION"}
          </Button>

          <div className="text-center pt-2">
              <Link to="/" className="text-[10px] font-bold uppercase text-gray-400 hover:text-black hover:underline">Abort Sequence</Link>
          </div>

          <div className="text-center mt-4">
              <p className="text-gray-500 text-xs">
                  Already have an operative account?{' '}
                  <Link to={`/login${token ? `?token=${token}` : ''}`} className="text-black font-bold hover:underline">
                      Login Access
                  </Link>
              </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JoinPage;
