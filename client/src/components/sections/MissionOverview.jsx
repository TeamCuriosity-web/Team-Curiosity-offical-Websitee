import React, { useRef } from 'react';
import { Target, ArrowRight, Shield, Rocket, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../utils/animations';

const MissionOverview = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    useScrollReveal(headerRef, { mode: 'up', distance: 30 });
    useScrollReveal(sectionRef, { selector: '.mission-card', mode: 'up', distance: 60, stagger: 0.2 });

    const missions = [
        {
            id: "OP-ALPHA",
            title: "Global Dominance",
            icon: <Globe size={24} className="text-blue-500" />,
            status: "In Progress",
            progress: 65
        },
        {
            id: "OP-SHIELD",
            title: "Cyber Defense Grid",
            icon: <Shield size={24} className="text-green-500" />,
            status: "Secure",
            progress: 100
        },
        {
            id: "OP-MARS",
            title: "Off-World Colonization",
            icon: <Rocket size={24} className="text-red-500" />,
            status: "Planning",
            progress: 15
        }
    ];

  return (
    <section ref={sectionRef} className="py-24 border-t border-border overflow-hidden">
      <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
            <h2 className="text-3xl font-bold text-black tracking-tight mb-2">Active Missions</h2>
            <p className="text-secondary max-w-md">Current strategic objectives and operational directives.</p>
        </div>
        <Link to="/missions" className="group flex items-center gap-2 text-sm font-bold text-black uppercase tracking-widest hover:text-gray-600 transition-colors">
            Full Operations Log
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missions.map((mission) => (
            <div key={mission.id} className="mission-card relative group bg-white border-2 border-transparent hover:border-black p-6 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-300">
                        {mission.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-gray-400">{mission.id}</span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-2">{mission.title}</h3>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">
                    <div 
                        className="h-full bg-black transition-all duration-1000 ease-out" 
                        style={{ width: `${mission.progress}%` }}
                    ></div>
                </div>
                
                <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-secondary">Status:</span>
                    <span className="font-bold text-black uppercase">{mission.status}</span>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default MissionOverview;
