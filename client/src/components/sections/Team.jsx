import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Code } from 'lucide-react';
import api from '../../services/api';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
        try {
            const { data } = await api.get('/team');
            const femaleSeeds = ['Abby', 'Sasha', 'Cleo'];
            const maleSeeds = ['Aiden', 'Owen', 'Caleb'];
            
            const enhancedData = data
                .filter(user => user.role !== 'superadmin')
                .map((user, idx) => {
                const isFemale = idx % 2 === 1; // Simple alternation for variety
                const defaultSeed = isFemale ? femaleSeeds[Math.floor(idx/2) % 3] : maleSeeds[Math.floor(idx/2) % 3];
                
                return {
                    ...user,
                    codename: `OPERATIVE_0${idx + 1}`,
                    status: "Active",
                    image: user.profileImage || user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name || defaultSeed}`,
                };
            });
            // no need to sort if superadmin is gone, but keeping sort for stability
            const sortedMembers = enhancedData.sort((a, b) => a.name.localeCompare(b.name));
            setMembers(sortedMembers);
        } catch (err) {
            console.error('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };
    fetchTeam();
  }, []);

  if (loading) return <div className="py-24 text-center font-mono text-xs">INITIALIZING ROSTER...</div>;

  return (
    <section className="py-24 animate-fade-in">
      <div className="mb-16 flex flex-col md:flex-row justify-between items-end border-b-2 border-black pb-6 gap-4">
        <div>
            <h2 className="text-4xl font-bold text-black tracking-tighter uppercase mb-2">Core Operatives</h2>
            <p className="text-secondary font-mono text-sm max-w-md">Authorized Personnel Only. Class 5 Restricted.</p>
        </div>
        <div className="font-mono text-xs text-black border-2 border-black px-3 py-1 rounded-full bg-white">
            STATUS: ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((member, idx) => (
            <div key={member._id} className="group relative bg-white border-2 border-black p-0 overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                {/* ID Tag */}
                <div className="bg-black text-white p-2 flex justify-between items-center font-mono text-[10px] uppercase border-b-2 border-black">
                    <span>{member.codename}</span>
                </div>
                
                <div className="p-6 flex flex-col items-center">
                    <div className="w-24 h-24 mb-6 rounded-full border-2 border-dashed border-black p-1">
                        <img src={member.image} alt={member.name} className="w-full h-full rounded-full bg-gray-50 object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-black uppercase tracking-tight">{member.name}</h3>
                    <p className="text-xs font-mono text-secondary mb-6">{member.role}</p>
                    
                    <div className="w-full border-t-2 border-dashed border-gray-200 py-4 flex justify-between items-center text-xs font-mono">
                        <span className="text-secondary font-bold">Current Status:</span>
                        <span className="flex items-center gap-2 text-black font-bold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse border border-green-700"></span>
                            {member.status}
                        </span>
                    </div>

                    <div className="flex gap-4 w-full justify-center pt-2">
                        {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                                <Github size={18} className="text-gray-400 hover:text-black transition-colors cursor-pointer" />
                            </a>
                        )}
                        {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin size={18} className="text-gray-400 hover:text-black transition-colors cursor-pointer" />
                            </a>
                        )}
                        {member.portfolio && (
                            <a href={member.portfolio} target="_blank" rel="noopener noreferrer">
                                <Code size={18} className="text-gray-400 hover:text-black transition-colors cursor-pointer" />
                            </a>
                        )}
                    </div>
                </div>
                
                {}
                <div className="h-4 w-full bg-gray-50 border-t-2 border-black flex gap-0.5 opacity-50">
                     {}
                     {Array(20).fill(0).map((_, i) => (
                        <div key={i} className="h-full bg-black" style={{ width: Math.random() > 0.5 ? '4px' : '1px', marginLeft: Math.random() * 4 }}></div>
                    ))}
                </div>
            </div>
        ))}
        {members.length === 0 && (
            <div className="col-span-3 text-center py-12 border-2 border-dashed border-gray-300 rounded font-mono text-sm text-gray-400">
                NO OPERATIVES FOUND.
            </div>
        )}
      </div>
    </section>
  );
};

export default Team;
