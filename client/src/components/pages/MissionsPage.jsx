import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Target, Shield, Rocket, Globe, Lock, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const MissionsPage = () => {
    const missions = [
        {
            id: "OP-ALPHA",
            title: "Global Dominance",
            description: "Establishing a worldwide network of autonomous nodes to ensure redundancy and high availability across all 7 continents.",
            icon: <Globe size={32} className="text-blue-500" />,
            status: "In Progress",
            progress: 65,
            priority: "High",
            brief: "Execute Phase 3: Expansion into APAC region."
        },
        {
            id: "OP-SHIELD",
            title: "Cyber Defense Grid",
            description: "Impenetrable firewall architecture using quantum-resistant encryption protocols.",
            icon: <Shield size={32} className="text-green-500" />,
            status: "Secure",
            progress: 100,
            priority: "Critical",
            brief: "System operational. Monitoring for zero-day exploits."
        },
        {
            id: "OP-MARS",
            title: "Off-World Colonization",
            description: "Terraforming software simulation and habitat life-support OS development.",
            icon: <Rocket size={32} className="text-red-500" />,
            status: "Planning",
            progress: 15,
            priority: "Extreme",
            brief: "Blueprints initialized. Awaiting hardware specs."
        },
        {
            id: "OP-OMEGA",
            title: "Project OMEGA",
            description: "Classified [REDACTED] Protocol for [REDACTED].",
            icon: <Lock size={32} className="text-gray-400" />,
            status: "Classified",
            progress: 0,
            priority: "Unknown",
            brief: "Access Denied. Clearance Level 5 Required."
        }
    ];

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Secure': return <CheckCircle size={16} className="text-green-600" />;
            case 'In Progress': return <Clock size={16} className="text-blue-600" />;
            case 'Planning': return <Target size={16} className="text-orange-600" />;
            default: return <AlertTriangle size={16} className="text-red-600" />;
        }
    };

    return (
        <>
            <main className="container mx-auto px-6 pt-32 pb-20 animate-fade-in">
                <div className="mb-16 border-b-2 border-black pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Target size={32} className="text-black" />
                        <h1 className="text-4xl font-bold text-black uppercase tracking-tighter">Mission Control</h1>
                    </div>
                    <p className="text-secondary font-mono text-sm max-w-xl">
                        Operational directives and strategic milestones. 
                        WARNING: Some files may be classified.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {missions.map((mission) => (
                        <div key={mission.id} className="bg-white border-2 border-black p-8 relative overflow-hidden group hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                            {/* Watermark ID */}
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <span className="text-9xl font-black font-mono">{mission.id.split('-')[1]}</span>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-gray-50 border-2 border-black flex items-center justify-center rounded-lg">
                                        {mission.icon}
                                    </div>
                                </div>
                                
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div>
                                            <span className="font-mono text-xs font-bold text-secondary bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                                                ID: {mission.id}
                                            </span>
                                            <h2 className="text-2xl font-bold text-black">{mission.title}</h2>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-sm font-bold border-2 border-black px-4 py-2 rounded-full uppercase">
                                            {getStatusIcon(mission.status)}
                                            {mission.status}
                                        </div>
                                    </div>

                                    <p className="text-secondary mb-6 leading-relaxed max-w-3xl">
                                        {mission.description}
                                    </p>

                                    <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-6 font-mono text-xs">
                                        <strong className="text-black block mb-1 uppercase tracking-wider">Mission Brief:</strong>
                                        <span className="text-gray-600"> &gt; {mission.brief}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-black">
                                            <span>Completion</span>
                                            <span>{mission.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-black">
                                            <div 
                                                className={`h-full ${mission.progress === 100 ? 'bg-green-500' : 'bg-black'} transition-all duration-1000 ease-in-out`} 
                                                style={{ width: `${mission.progress}%` }}
                                            >
                                                 {/* Striped pattern overlay */}
                                                <div className="w-full h-full opacity-20 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default MissionsPage;
