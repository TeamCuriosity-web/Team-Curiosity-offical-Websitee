import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Server, Cpu, Globe, Terminal, Box, Database, Zap, Code } from 'lucide-react';

const StudyStuffPage = () => {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                
                {/* Header */}
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 border-2 border-black px-3 py-1 mb-8 bg-black text-white font-mono text-[10px] uppercase tracking-widest">
                        <Terminal size={14} /> Knowledge Repository v1.0
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.8]">
                        Study<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-gray-400">Stuff.</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl font-mono border-l-4 border-black pl-6">
                        // ACCESSING MISSION CRITICAL DOCUMENTATION. <br/>
                        Deep dives into the tech stacks powering our digital infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* FRONTEND SECTION */}
                    <div className="space-y-12">
                        <div className="border-b-4 border-black pb-4">
                            <h2 className="text-4xl font-black uppercase tracking-tight flex items-center gap-4">
                                <Layout size={32} /> Frontend Architecture
                            </h2>
                        </div>
                        
                        <div className="grid gap-6">
                            {[
                                {
                                    title: "Vite + React",
                                    desc: "The core framework for high-performance reactive interfaces. Utilizing functional components and hooks for state management.",
                                    icon: <Zap size={20} className="text-yellow-500" />
                                },
                                {
                                    title: "GSAP Animations",
                                    desc: "Implementing professional-grade motion design. Scroll-triggered sequences and complex timeline orchestration.",
                                    icon: <Zap size={20} className="text-green-500" />
                                },
                                {
                                    title: "Three.js (3D Engine)",
                                    desc: "Integrating WebGL experiences. Rendering magnetic spheres, particles, and interactive 3D assets.",
                                    icon: <Box size={20} className="text-blue-500" />
                                },
                                {
                                    title: "Tailwind CSS",
                                    desc: "Utility-first CSS framework for rapid UI development and total design control via config tokens.",
                                    icon: <Globe size={20} className="text-cyan-500" />
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-6 bg-gray-50 border-2 border-gray-100 hover:border-black transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        {item.icon}
                                        <h3 className="font-bold uppercase text-lg">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm font-mono leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BACKEND SECTION */}
                    <div className="space-y-12">
                        <div className="border-b-4 border-black pb-4">
                            <h2 className="text-4xl font-black uppercase tracking-tight flex items-center gap-4">
                                <Server size={32} /> Backend Core
                            </h2>
                        </div>

                        <div className="grid gap-6">
                            {[
                                {
                                    title: "Node.js & Express",
                                    desc: "Scalable server-side logic. RESTful API architecture with robust middleware chains for security and validation.",
                                    icon: <Cpu size={20} className="text-green-600" />
                                },
                                {
                                    title: "MongoDB",
                                    desc: "NoSQL database management. Optimized schema design for high-throughput data operations and reliability.",
                                    icon: <Database size={20} className="text-green-500" />
                                },
                                {
                                    title: "Socket.IO",
                                    desc: "Full-duplex real-time communication. Powering our live comms and synchronized system notifications.",
                                    icon: <MessageSquare size={20} className="text-blue-500" />
                                },
                                {
                                    title: "JWT Authentication",
                                    desc: "Stateless security protocol. Managing session persistence and role-based access control across all nodes.",
                                    icon: <Shield size={20} className="text-red-500" />
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-6 bg-gray-50 border-2 border-gray-100 hover:border-black transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        {item.icon}
                                        <h3 className="font-bold uppercase text-lg">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm font-mono leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Additional Intel */}
                <div className="mt-32 p-12 border-4 border-black relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mission: continuous learning</h2>
                            <p className="text-gray-600 font-mono">
                                Our stack is constantly evolving. Operatives are expected to master these protocols and contribute to the internal knowledge base.
                            </p>
                        </div>
                        <Link to="/">
                           <button className="px-10 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-black border-2 border-transparent transition-all">
                                Return to Command
                           </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper for icons used in the map which weren't imported in first line
import { MessageSquare, Shield } from 'lucide-react';

export default StudyStuffPage;
