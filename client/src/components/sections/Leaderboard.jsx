import React, { useEffect, useState, useRef } from 'react';
import { Github, Terminal, GitCommit, Activity, Clock, ShieldAlert, UserX } from 'lucide-react';
import api from '../../services/api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const { data: teamMembers } = await api.get('/team');
                
                // Show ALL members, even without GitHub
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

    useGSAP(() => {
        if (!loading && leaders.length > 0) {
            const tl = gsap.timeline();
            
            // Terminal boot sequence
            tl.from('.terminal-line', {
                opacity: 0,
                x: -20,
                duration: 0.1,
                stagger: 0.05,
                ease: 'none'
            });

            // Cards entry
            tl.from('.operative-card', {
                y: 50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, '+=0.2');
        }
    }, { scope: containerRef, dependencies: [loading, leaders] });

    // Format relative time
    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'OFFLINE';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'UNKNOWN'; // Handle invalid dates
        
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " YRS AGO";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " MONTHS AGO";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " DAYS AGO";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " HRS AGO";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " MINS AGO";
        return "JUST NOW";
    };

    return (
        <section ref={containerRef} className="py-24 relative min-h-screen bg-white text-black font-mono border-t-2 border-black">
             {/* Background Grid */}
             <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50"></div>

            <div className="container mx-auto px-6 z-10">
                
                {/* Header Terminal Block */}
                <div className="mb-16 border-l-4 border-black pl-6 py-2 max-w-4xl">
                    <div className="flex flex-col gap-1 text-sm uppercase tracking-wider">
                        <div className="terminal-line flex items-center gap-2 text-gray-500">
                            <Terminal size={14} /> SYSTEM_ROOT: ACCESSING DATABASE...
                        </div>
                        <div className="terminal-line text-black font-bold">
                            >> INITIATING PROTOCOL: LEADERBOARD_V2
                        </div>
                        <div className="terminal-line text-green-600 font-bold">
                            >> CONNECTION ESTABLISHED. RENDERING DATA...
                        </div>
                    </div>
                    <h2 className="mt-6 text-5xl md:text-7xl font-black tracking-tighter uppercase terminal-line">
                        Team Leaderboard
                    </h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-black border-dashed bg-gray-50">
                        <Activity size={48} className="text-black animate-pulse mb-4" />
                        <p className="text-black font-bold animate-pulse tracking-widest">>> ESTABLISHING SECURE CONNECTION...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="text-center py-20 border-2 border-black bg-gray-50">
                        <ShieldAlert size={64} className="mx-auto mb-6 text-black" />
                        <h3 className="text-3xl font-black uppercase">NO SIGNAL DETECTED</h3>
                        <p className="max-w-md mx-auto mt-2 text-gray-500">
                            :: ERROR: No operative data found in database.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* Headers */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-black">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Operative</div>
                            <div className="col-span-3 text-right">Commit Strength</div>
                            <div className="col-span-3 text-right">Last Signal</div>
                        </div>

                        {leaders.map((member, idx) => (
                            <div key={member._id} className="operative-card group relative bg-white border border-black hover:bg-black hover:text-white transition-all duration-200 p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                
                                {/* Rank */}
                                <div className="col-span-1 flex items-center gap-2">
                                    <span className="font-black text-2xl md:text-xl text-gray-300 group-hover:text-gray-600">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    {idx === 0 && member.commitCount > 0 && <span className="bg-yellow-400 text-black text-[10px] px-1 font-bold border border-black">TOP</span>}
                                </div>

                                {/* Operative Info */}
                                <div className="col-span-5 flex items-center gap-4">
                                    <div className="w-12 h-12 border-2 border-black p-0.5 shrink-0 bg-white">
                                        <img 
                                            src={member.profileImage || member.avatar || "https://github.com/github.png"} 
                                            alt={member.name} 
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-black text-lg uppercase truncate">{member.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 group-hover:text-gray-400 font-bold">
                                            {member.githubUsername ? (
                                                <><Github size={12} /> @{member.githubUsername}</>
                                            ) : (
                                                <><UserX size={12} /> NO GITHUB LINKED</>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Commits */}
                                <div className="col-span-3 flex md:justify-end items-center gap-2">
                                    <div className="md:hidden text-xs text-gray-500 group-hover:text-gray-400 uppercase">Commits:</div>
                                    <span className={`font-black text-2xl flex items-center gap-2 ${member.commitCount > 0 ? 'group-hover:text-green-400' : 'text-gray-300'}`}>
                                        <GitCommit size={18} /> {member.commitCount || 0}
                                    </span>
                                </div>

                                {/* Last Active */}
                                <div className="col-span-3 flex md:justify-end items-center gap-2">
                                    <div className="md:hidden text-xs text-gray-500 group-hover:text-gray-400 uppercase">Last Signal:</div>
                                    <div className={`text-xs font-bold px-2 py-1 border ${member.lastCommit ? 'border-green-600 text-green-700 bg-green-50 group-hover:bg-green-900 group-hover:text-green-300 group-hover:border-green-400' : 'border-gray-200 text-gray-400 bg-gray-100'}`}>
                                        <span className="flex items-center gap-2">
                                           <Clock size={12} /> {formatTimeAgo(member.lastCommit)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
