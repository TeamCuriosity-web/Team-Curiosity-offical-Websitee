import React, { useEffect, useState, useRef } from 'react';
import { Github, Trophy, GitCommit, Activity, Clock, Shield, Zap } from 'lucide-react';
import api from '../../services/api';
// Removing complex GSAP for now to ensure visibility is robust
// import gsap from 'gsap'; 
// import { useGSAP } from '@gsap/react';

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
        <section className="py-24 relative min-h-screen bg-[#050505] text-white overflow-hidden">
             {/* Background Ambience */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-cyan-900/10 rounded-full blur-[100px]"></div>
             </div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-6 uppercase tracking-wider backdrop-blur-md">
                        <Activity size={12} className="animate-pulse" /> Live Intelligence
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Team Leaderboard
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Real-time tracking of engineering contributions. <br className="hidden md:block"/> 
                        Ranked by <span className="text-white font-semibold">GitHub Commits</span> and active status.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Syncing Data...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm max-w-3xl mx-auto">
                        <Shield size={48} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
                        <p className="text-gray-400">Unable to retrieve team metrics at this time.</p>
                    </div>
                ) : (
                    <div className="max-w-5xl mx-auto">
                        {/* Top Protocol - The podium or highlighted top user could go here, 
                            but a clean list is often more "Dashboard" premium. 
                            Let's do a highlighted top 3 list style. */}

                        <div className="grid gap-4">
                            {/* Column Headers */}
                            <div className="grid grid-cols-12 px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <div className="col-span-2 md:col-span-1">Rank</div>
                                <div className="col-span-6 md:col-span-5">Engineer</div>
                                <div className="col-span-4 md:col-span-3 text-right">Commit Power</div>
                                <div className="hidden md:block md:col-span-3 text-right">Last Signal</div>
                            </div>

                            {leaders.map((member, idx) => {
                                const isTop3 = idx < 3;
                                const rankColor = idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-600';
                                const glowClass = idx === 0 ? 'shadow-[0_0_30px_-5px_rgba(250,204,21,0.15)] border-yellow-500/30' : 
                                                  idx === 1 ? 'shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] border-white/20' : 
                                                  idx === 2 ? 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.1)] border-orange-500/30' : 
                                                  'border-white/5 hover:border-white/20 hover:bg-white/5';

                                return (
                                    <div 
                                        key={member._id} 
                                        className={`
                                            relative grid grid-cols-12 items-center px-6 py-5 rounded-2xl border transition-all duration-300 cursor-default
                                            ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}
                                            ${glowClass}
                                            backdrop-blur-sm
                                        `}
                                    >
                                        {/* Rank */}
                                        <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                                            <span className={`text-xl md:text-2xl font-black ${rankColor}`}>
                                                #{idx + 1}
                                            </span>
                                        </div>

                                        {/* User Info */}
                                        <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                                            <div className="relative">
                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full p-[2px] ${isTop3 ? 'bg-gradient-to-br from-white/20 to-transparent' : 'bg-white/10'}`}>
                                                    <img 
                                                        src={member.profileImage || member.avatar || "https://github.com/github.png"} 
                                                        alt={member.name} 
                                                        className="w-full h-full rounded-full object-cover bg-gray-800"
                                                    />
                                                </div>
                                                {member.lastCommit && (
                                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]"></div>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className={`font-bold text-sm md:text-base truncate ${isTop3 ? 'text-white' : 'text-gray-300'}`}>
                                                    {member.name}
                                                    {idx === 0 && <span className="ml-2 inline-block text-[10px] bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/20">MVP</span>}
                                                </h4>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 font-mono mt-0.5">
                                                    {member.githubUsername ? (
                                                        <><Github size={10} /> @{member.githubUsername}</>
                                                    ) : (
                                                        <span className="opacity-50">No GitHub Linked</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Commits */}
                                        <div className="col-span-4 md:col-span-3 text-right flex justify-end items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-bold text-lg md:text-xl ${member.commitCount > 0 ? 'text-white' : 'text-gray-600'}`}>
                                                    {member.commitCount || 0}
                                                </span>
                                                <span className="text-[10px] text-gray-600 uppercase tracking-wider font-mono">Commits</span>
                                            </div>
                                            {member.commitCount > 0 && <Zap size={16} className={`hidden md:block ${idx === 0 ? 'text-yellow-400' : 'text-cyan-500'}`} />}
                                        </div>

                                        {/* Last Active */}
                                        <div className="hidden md:flex col-span-3 text-right justify-end items-center gap-2 text-gray-400">
                                            {member.lastCommit ? (
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                                    <Clock size={12} className="text-cyan-400" />
                                                    <span className="text-xs font-mono text-cyan-100">{formatTimeAgo(member.lastCommit)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-600 font-mono px-2">--</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
