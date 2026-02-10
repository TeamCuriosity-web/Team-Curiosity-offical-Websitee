import React, { useEffect, useState, useRef } from 'react';
import { Github, Trophy, GitCommit } from 'lucide-react';
import api from '../../services/api';
import { useScrollReveal } from '../../utils/animations';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useScrollReveal(containerRef, { mode: 'up', distance: 40, stagger: 0.1 });

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                // 1. Fetch Team Data (now includes commitCount from backend)
                const { data: teamMembers } = await api.get('/team');
                
                // 2. Filter for those with GitHub handles and valid commit counts
                // Ensure proper property access depending on what backend returns
                const eligibleMembers = teamMembers.filter(m => m.github && m.github.length > 0);

                // 3. Sort by Commits
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

    if (loading) return null;

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden">
             {/* Background Elements */}
             <div className="absolute top-0 left-0 w-full h-full -z-10 bg-white">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             </div>

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" size={40} /> Team Leaderboard
                    </h2>
                    <p className="text-secondary font-mono text-sm max-w-2xl mx-auto">
                        Real-time contribution tracking. Rank determined by total GitHub commits.
                    </p>
                </div>

                {leaders.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <Github size={48} className="mx-auto mb-4" />
                        <h3 className="text-2xl font-bold uppercase">No Intelligence Data</h3>
                        <p className="font-mono text-sm max-w-md mx-auto mt-2">
                            No team members with GitHub activity found.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
                            {/* 2nd Place */}
                            {leaders[1] && <LeaderCard member={leaders[1]} rank={2} />}
                            
                            {/* 1st Place */}
                            {leaders[0] && <LeaderCard member={leaders[0]} rank={1} />}
                            
                            {/* 3rd Place */}
                            {leaders[2] && <LeaderCard member={leaders[2]} rank={3} />}
                        </div>

                        {/* Rest of the list */}
                        {leaders.length > 3 && (
                            <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                                {leaders.slice(3).map((member, idx) => (
                                    <div key={member._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                             <span className="font-mono text-lg font-bold text-gray-400 w-8">#{idx + 4}</span>
                                             <img src={member.profileImage || member.avatar || "https://github.com/github.png"} alt={member.name} className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                                             <div>
                                                 <h4 className="font-bold text-sm uppercase">{member.name}</h4>
                                                 <p className="text-[10px] font-mono text-gray-500">{member.githubUsername}</p>
                                             </div>
                                        </div>
                                        <div className="font-mono font-bold text-purple-600 flex items-center gap-2">
                                            <GitCommit size={14} /> {member.commitCount || 0}
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

const LeaderCard = ({ member, rank }) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    return (
        <div className={`relative group ${isFirst ? 'order-first lg:order-2 lg:-mt-12 z-10' : 'order-last lg:order-1'}`}>
            <div className={`
                relative bg-white/80 backdrop-blur-md border-2 p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-500 hover:transform hover:-translate-y-2
                ${isFirst ? 'border-yellow-400 shadow-[0_20px_50px_rgba(250,204,21,0.2)] h-[350px] justify-center' : ''}
                ${isSecond ? 'border-gray-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] h-[300px] justify-center' : ''}
                ${isThird ? 'border-orange-300 shadow-[0_10px_30px_rgba(249,115,22,0.1)] h-[280px] justify-center' : ''}
            `}>
                
                {/* Crown/Rank Badge */}
                <div className={`
                    absolute -top-6 w-12 h-12 flex items-center justify-center rounded-full font-black text-white text-xl shadow-lg
                    ${isFirst ? 'bg-yellow-400 scale-125' : ''}
                    ${isSecond ? 'bg-gray-400' : ''}
                    ${isThird ? 'bg-orange-400' : ''}
                `}>
                    #{rank}
                </div>

                <div className={`
                    mb-6 rounded-full p-1 border-2 border-dashed
                    ${isFirst ? 'w-32 h-32 border-yellow-400' : 'w-24 h-24 border-gray-200'}
                `}>
                    <img 
                        src={member.profileImage || member.avatar || "https://github.com/github.png"} 
                        alt={member.name} 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>

                <h3 className={`font-black uppercase tracking-tight mb-1 ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                    {member.name}
                </h3>
                <div className="flex items-center gap-2 text-secondary text-xs font-mono mb-6">
                    <Github size={12} /> {member.githubUsername}
                </div>

                <div className={`
                    px-6 py-3 rounded-full font-mono font-bold text-lg flex items-center gap-2
                    ${isFirst ? 'bg-yellow-50 text-yellow-700' : ''}
                    ${isSecond ? 'bg-gray-50 text-gray-700' : ''}
                    ${isThird ? 'bg-orange-50 text-orange-700' : ''}
                `}>
                    <GitCommit size={20} /> {member.commitCount || 0} EST. COMMITS
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
