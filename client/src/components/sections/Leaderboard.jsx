import React, { useEffect, useState, useRef } from 'react';
import { Github, Trophy, GitCommit, Crown, Medal } from 'lucide-react';
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
                const eligibleMembers = teamMembers.filter(m => m.github && m.github.length > 0);
                const sorted = eligibleMembers.sort((a, b) => (b.commitCount || 0) - (a.commitCount || 0));
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
            
            // Header animation
            tl.from('.leaderboard-header', {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Podium animation (staggered)
            tl.from('.podium-card', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=0.5');

            // List items animation
            tl.from('.leader-list-item', {
                x: -50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }, { scope: containerRef, dependencies: [loading, leaders] });

    if (loading) return null; // Or a subtle loader

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden min-h-screen flex flex-col justify-center">
             {/* Dynamic Background */}
             <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#0a0a0a]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
             </div>

            <div className="container mx-auto px-6 z-10">
                <div className="text-center mb-20 leaderboard-header">
                     <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] mb-6 uppercase">
                        Team Leaderboard
                    </h2>
                    <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto border border-white/10 bg-white/5 backdrop-blur-sm py-2 px-6 rounded-full inline-block">
                        <span className="text-purple-400">●</span> LIVE INTELLIGENCE TRACKING
                    </p>
                </div>

                {leaders.length === 0 ? (
                    <div className="text-center py-20 opacity-50 leaderboard-header">
                        <Github size={64} className="mx-auto mb-6 text-gray-600" />
                        <h3 className="text-3xl font-bold uppercase text-gray-300">No Data Available</h3>
                        <p className="font-mono text-sm max-w-md mx-auto mt-2 text-gray-500">
                            Connect GitHub accounts to populate the grid.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* PODIUM SECTION */}
                        <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-10 mb-20 min-h-[450px]">
                            {/* 2nd Place */}
                            {leaders[1] && <PodiumCard member={leaders[1]} rank={2} />}
                            
                            {/* 1st Place */}
                            {leaders[0] && <PodiumCard member={leaders[0]} rank={1} />}
                            
                            {/* 3rd Place */}
                            {leaders[2] && <PodiumCard member={leaders[2]} rank={3} />}
                        </div>

                        {/* LIST SECTION */}
                        {leaders.length > 3 && (
                            <div className="max-w-5xl mx-auto space-y-3">
                                {leaders.slice(3).map((member, idx) => (
                                    <div key={member._id} className="leader-list-item group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                                        <div className="flex items-center gap-6">
                                             <span className="font-mono text-xl font-bold text-gray-600 w-12 text-center group-hover:text-white transition-colors">#{idx + 4}</span>
                                             
                                             <div className="relative">
                                                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-gray-700 to-gray-900 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-500">
                                                    <img src={member.profileImage || member.avatar || "https://github.com/github.png"} alt={member.name} className="w-full h-full rounded-full object-cover bg-black" />
                                                </div>
                                             </div>
                                             
                                             <div>
                                                 <h4 className="font-bold text-white text-lg tracking-wide uppercase group-hover:text-purple-300 transition-colors">{member.name}</h4>
                                                 <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                                    <Github size={12} /> {member.githubUsername}
                                                 </div>
                                             </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 px-4 py-2 bg-black/20 rounded-lg border border-white/5 group-hover:border-purple-500/30 transition-colors">
                                            <GitCommit size={16} className="text-purple-400" />
                                            <span className="font-mono font-bold text-white text-lg">{member.commitCount || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

const PodiumCard = ({ member, rank }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    // Rank Styles
    const rankColors = {
        1: { border: 'border-yellow-500', shadow: 'shadow-yellow-500/20', text: 'text-yellow-400', bg: 'bg-yellow-500', crown: 'text-yellow-400' },
        2: { border: 'border-gray-300', shadow: 'shadow-gray-400/20', text: 'text-gray-300', bg: 'bg-gray-400', crown: 'text-gray-300' },
        3: { border: 'border-orange-500', shadow: 'shadow-orange-500/20', text: 'text-orange-400', bg: 'bg-orange-500', crown: 'text-orange-400' }
    };

    const style = rankColors[rank];

    return (
        <div className={`podium-card relative group w-full max-w-[320px] ${isFirst ? 'order-first md:order-2 -mt-12 z-20' : rank === 2 ? 'order-last md:order-1' : 'order-last md:order-3'}`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-b ${isFirst ? 'from-yellow-500/20' : isSecond ? 'from-gray-500/20' : 'from-orange-500/20'} to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700`}></div>

            <div className={`
                relative bg-[#1a1a1a]/80 backdrop-blur-xl border ${style.border} p-8 rounded-3xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                ${isFirst ? 'h-[420px] border-2 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'h-[360px] border opacity-90 hover:opacity-100'}
            `}>
                
                {/* Crown/Rank Badge */}
                <div className={`
                    absolute -top-6 w-14 h-14 flex items-center justify-center rounded-full font-black text-black text-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-10
                    ${style.bg} ${isFirst ? 'scale-125 shadow-[0_0_25px_rgba(234,179,8,0.6)]' : ''}
                `}>
                    {isFirst ? <Crown size={24} fill="currentColor" /> : <span className="text-xl">#{rank}</span>}
                </div>

                {/* Avatar */}
                <div className={`
                    mb-6 rounded-full p-1 bg-gradient-to-br ${isFirst ? 'from-yellow-300 to-yellow-600' : isSecond ? 'from-gray-200 to-gray-500' : 'from-orange-300 to-orange-600'}
                    ${isFirst ? 'w-36 h-36' : 'w-24 h-24'} shadow-2xl relative
                `}>
                    <img 
                        src={member.profileImage || member.avatar || "https://github.com/github.png"} 
                        alt={member.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1a]"
                    />
                     {/* Floating Badge */}
                     <div className="absolute -bottom-2 -right-2 bg-[#1a1a1a] p-2 rounded-full border border-white/10">
                        <Github size={isFirst ? 24 : 18} className="text-white" />
                     </div>
                </div>

                {/* Name */}
                <h3 className={`font-black uppercase tracking-tight mb-2 text-white ${isFirst ? 'text-3xl' : 'text-xl'}`}>
                    {member.name}
                </h3>
                <p className={`font-mono text-xs mb-8 ${style.text} tracking-wider opacity-80`}>
                    @{member.githubUsername}
                </p>

                {/* Stats */}
                <div className={`
                    mt-auto w-full py-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center gap-3 group-hover:bg-white/10 transition-colors
                `}>
                    <GitCommit size={isFirst ? 24 : 20} className={style.text} /> 
                    <span className="font-mono font-bold text-2xl text-white tracking-widest">{member.commitCount || 0}</span>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
