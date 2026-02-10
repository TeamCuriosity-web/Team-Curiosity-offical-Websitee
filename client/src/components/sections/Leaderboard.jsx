import React, { useEffect, useState, useRef } from 'react';
import { Github, Trophy, GitCommit, Activity, Clock, Shield, Zap, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const { data: teamMembers } = await api.get('/team');
                
                // Show ALL members.
                // Sort: Commits (desc), then hasGitHub (yes first), then Name (asc)
                const sorted = teamMembers.sort((a, b) => {
                    const commitDiff = (b.commitCount || 0) - (a.commitCount || 0);
                    if (commitDiff !== 0) return commitDiff;
                    
                    const aHasGit = a.github && a.github.length > 0 ? 1 : 0;
                    const bHasGit = b.github && b.github.length > 0 ? 1 : 0;
                    if (bHasGit !== aHasGit) return bHasGit - aHasGit;

                    return a.name.localeCompare(b.name);
                });

                setLeaders(sorted);
            } catch (err) {
                console.error("Leaderboard init failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboardData();
    }, []);

    // Format relative time helper
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Offline';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Unknown';
        
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <section className="py-24 relative min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
             {/* Background Pattern */}
             <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-slate-600 mb-6 uppercase tracking-wider">
                        <TrendingUp size={12} className="text-green-500" /> Live Metrics
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-slate-900">
                        Team Leaderboard
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                        Real-time tracking of engineering velocity. <br className="hidden md:block"/> 
                        Ranked by <span className="text-slate-900 font-bold underline decoration-slate-300 decoration-2 underline-offset-2">GitHub Contributions</span>.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Database...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
                        <Shield size={48} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Data Available</h3>
                        <p className="text-slate-500">Unable to retrieve team metrics at this time.</p>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            
                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <div className="col-span-2 md:col-span-1 pl-2">Rank</div>
                                <div className="col-span-6 md:col-span-5">Engineer</div>
                                <div className="col-span-4 md:col-span-3 text-right">Commit Power</div>
                                <div className="hidden md:block md:col-span-3 text-right pr-2">Last Signal</div>
                            </div>

                            {/* List */}
                            <div className="divide-y divide-gray-100">
                                {leaders.map((member, idx) => {
                                    const isTop3 = idx < 3;
                                    const rankColor = idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-500' : 'text-slate-400 font-medium';
                                    const bgClass = idx === 0 ? 'bg-yellow-50/30' : 
                                                    idx === 1 ? 'bg-slate-50/30' : 
                                                    idx === 2 ? 'bg-orange-50/30' : 
                                                    'bg-white hover:bg-gray-50';

                                    return (
                                        <div 
                                            key={member._id} 
                                            className={`grid grid-cols-12 items-center px-6 py-5 transition-colors duration-200 ${bgClass}`}
                                        >
                                            {/* Rank */}
                                            <div className="col-span-2 md:col-span-1 flex items-center gap-3 pl-2">
                                                <span className={`text-lg md:text-xl font-black ${rankColor}`}>
                                                    #{idx + 1}
                                                </span>
                                            </div>

                                            {/* User Info */}
                                            <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                                                <div className="relative">
                                                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full p-[2px] bg-white border ${isTop3 ? 'border-transparent shadow-md' : 'border-gray-100'}`}>
                                                        <img 
                                                            src={member.profileImage || member.avatar || "https://github.com/github.png"} 
                                                            alt={member.name} 
                                                            className="w-full h-full rounded-full object-cover bg-gray-100"
                                                        />
                                                    </div>
                                                    {member.lastCommit && (
                                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-sm md:text-base text-slate-900 truncate flex items-center gap-2">
                                                        {member.name}
                                                        {idx === 0 && <span className="hidden md:inline-flex text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">MVP</span>}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                                                        {member.githubUsername ? (
                                                            <><Github size={10} /> @{member.githubUsername}</>
                                                        ) : (
                                                            <span className="opacity-50 text-[10px] italic">No GitHub</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Commits */}
                                            <div className="col-span-4 md:col-span-3 text-right flex justify-end items-center gap-3">
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-black text-lg md:text-xl ${member.commitCount > 0 ? 'text-slate-900' : 'text-slate-300'}`}>
                                                        {member.commitCount || 0}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Commits</span>
                                                </div>
                                                {member.commitCount > 0 && <div className={`w-1 h-8 rounded-full ${idx === 0 ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>}
                                            </div>

                                            {/* Last Active */}
                                            <div className="hidden md:flex col-span-3 text-right justify-end items-center gap-2 pr-2">
                                                {member.lastCommit ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                                                        <Clock size={10} className="text-slate-500" />
                                                        <span className="text-xs font-bold text-slate-600">{formatTimeAgo(member.lastCommit)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-300 font-medium px-2">--</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Footer Note */}
                        <div className="mt-6 text-center text-xs text-slate-400 font-medium">
                            Auto-syncing with GitHub API • Updates hourly
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
