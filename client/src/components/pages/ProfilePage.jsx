import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { User, Shield, Briefcase, Code, LogOut, Clock, CheckCircle, Lock, MessageSquare, Send } from 'lucide-react';
import api from '../../services/api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setSending(true);
        try {
            await api.post('/notifications', { 
                message: message,
                recipient: 'admin' // Explicitly targeting admin channel
            });
            setSentSuccess(true);
            setMessage('');
            setTimeout(() => setSentSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to send message");
            alert("Transmission failed. Secure line broken.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto bg-white text-black">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full border-2 border-black p-1">
                            <img 
                                src={user.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} 
                                alt="Profile" 
                                className="w-full h-full rounded-full bg-gray-50 object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight uppercase">{user.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                                    user.isApproved 
                                        ? 'bg-green-50 text-green-600 border-green-200' 
                                        : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                                }`}>
                                    {user.isApproved ? (
                                        <span className="flex items-center gap-1"><CheckCircle size={12}/> Verified Operative</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Clock size={12}/> Pending Approval</span>
                                    )}
                                </span>
                                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-mono border border-gray-200 uppercase">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleLogout} variant="secondary" className="mt-6 md:mt-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                        <LogOut size={14} className="mr-2"/> Terminate Session
                    </Button>
                </div>

                {!user.isApproved && (
                    <div className="mb-12 bg-yellow-50 border border-yellow-200 p-6 rounded-xl flex items-start gap-4">
                        <Lock className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-bold text-yellow-800 mb-2">Access Restricted</h3>
                            <p className="text-yellow-700 text-sm leading-relaxed">
                                Your account is currently under review by Command. Until approved, access to sensitive sections (Projects, Team, Missions) is locked. 
                                Please wait for an administrator to verify your credentials.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Personal Detail */}
                    <Card className="p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <User size={16} /> Personal Dossier
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Email</label>
                                <div className="font-mono text-sm">{user.email}</div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">College</label>
                                <div className="font-medium">{user.college || 'N/A'}</div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Branch</label>
                                    <div className="font-medium">{user.branch || 'N/A'}</div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Section</label>
                                    <div className="font-medium">{user.section || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Tech & Status */}
                    <Card className="p-8 flex flex-col justify-between">
                        <div>
                             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Code size={16} /> Technical Arsenal
                            </h3>
                            {user.programmingLanguages && user.programmingLanguages.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.programmingLanguages.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono border border-gray-200">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-400 italic text-sm">No technical data recorded.</div>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                <Shield size={16} /> Security Clearance
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                                <div className="text-xs font-bold uppercase text-gray-500">Current Level</div>
                                <div className="text-sm font-bold text-black uppercase">{user.role}</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Comms Channel */}
                <Card className="p-8 border-t-4 border-black">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <MessageSquare size={16} /> Secure Comms Channel
                    </h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="relative">
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Transmit message to Command (Admins)..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 text-sm font-mono focus:border-black focus:ring-1 focus:ring-black outline-none resize-none transition-all placeholder:text-gray-400"
                            ></textarea>
                            <div className="absolute bottom-4 right-4">
                                <button 
                                    type="submit" 
                                    disabled={sending || !message.trim()}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                        sending 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : sentSuccess 
                                                ? 'bg-green-500 text-white'
                                                : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {sending ? 'Transmitting...' : sentSuccess ? 'Sent' : 'Send'} <Send size={12} />
                                </button>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
