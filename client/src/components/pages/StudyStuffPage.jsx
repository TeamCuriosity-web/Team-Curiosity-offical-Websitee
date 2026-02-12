import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Server, Cpu, Globe, Terminal, Box, Database, Zap, Code, MessageSquare, Shield, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const StudyStuffPage = () => {
    const containerRef = useRef(null);
    const box1Ref = useRef(null);
    const box2Ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".study-header-item", {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.2
            })
            .from([box1Ref.current, box2Ref.current], {
                opacity: 0,
                scale: 0.95,
                y: 40,
                duration: 1,
                stagger: 0.3
            }, "-=0.5");

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const ResourceBox = ({ title, icon: Icon, description, items, color, refProp }) => (
        <div 
            ref={refProp}
            className="group relative overflow-hidden bg-white border-4 border-black p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full min-h-[500px]"
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 group-hover:opacity-20 transition-opacity blur-3xl rounded-full -mr-16 -mt-16`} />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-black text-white rounded-xl group-hover:rotate-12 transition-transform duration-500">
                        <Icon size={32} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">{title}</h2>
                </div>

                <p className="text-xl text-gray-600 font-mono mb-10 leading-relaxed border-l-4 border-black pl-6 py-2">
                    {description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1 p-4 bg-gray-50 border-2 border-transparent group-hover:border-black transition-colors duration-300">
                           <span className="font-black uppercase text-xs tracking-widest text-black">{item.name}</span>
                           <span className="text-[10px] text-gray-400 font-mono uppercase">{item.role}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex items-center justify-between pt-6 border-t border-black/10">
                    <span className="text-xs font-bold font-mono text-gray-400 tracking-widest">ACCESS_LEVEL: OMEGA</span>
                    <div className="flex items-center gap-2 group/btn cursor-pointer">
                        <span className="text-xs font-black uppercase tracking-widest text-black group-hover/btn:mr-2 transition-all">Explore Docs</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
            
            {/* Decorative Glitch Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_6rem]"></div>

            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Header */}
                <div className="mb-24 flex flex-col items-center text-center">
                    <div className="study-header-item inline-flex items-center gap-2 border-2 border-black px-4 py-1.5 mb-8 bg-black text-white font-mono text-xs uppercase tracking-[0.3em] font-bold">
                        <Terminal size={14} /> Repository_v2.0
                    </div>
                    <h1 className="study-header-item text-7xl md:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.8] text-black">
                        STUDY STUFF.
                    </h1>
                    <p className="study-header-item text-xl text-gray-500 max-w-2xl font-mono">
                        // SELECT DOMAIN FOR TACTICAL DEPLOYMENT INTEL. <br/>
                        Master the protocols that power the Curiosity Network.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                    {/* Center Connector Text */}
                    <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                        <div className="bg-black text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-[0.5em] rotate-90 whitespace-nowrap">
                            SYSTEM_CORE
                        </div>
                    </div>

                    <ResourceBox 
                        refProp={box1Ref}
                        title="Frontend"
                        icon={Layout}
                        color="bg-cyan-500"
                        description="Crafting high-fidelity, interactive experiences that bridge the gap between human and machine."
                        items={[
                            { name: "React 19", role: "UI Skeleton" },
                            { name: "GSAP 3", role: "Physics & Motion" },
                            { name: "Three.js", role: "3D Rendering" },
                            { name: "Tailwind", role: "System Styling" }
                        ]}
                    />

                    <ResourceBox 
                        refProp={box2Ref}
                        title="Backend"
                        icon={Server}
                        color="bg-red-500"
                        description="Architecting resilient, scalable infrastructure for seamless data flow and global synchronization."
                        items={[
                            { name: "Node.js", role: "Engine Core" },
                            { name: "MongoDB", role: "Data Vault" },
                            { name: "Express", role: "API Bridge" },
                            { name: "Socket.IO", role: "Real-time Sync" }
                        ]}
                    />
                </div>

                {/* Footer Uplink */}
                <div className="study-header-item mt-32 flex flex-col items-center">
                    <div className="w-1 h-20 bg-black mb-8" />
                    <Link to="/">
                        <button className="group relative px-12 py-5 bg-black text-white font-bold uppercase tracking-[0.3em] text-sm overflow-hidden border-2 border-black hover:bg-white hover:text-black transition-colors duration-500">
                            <span className="relative z-10 flex items-center gap-4">
                                Return to Command <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default StudyStuffPage;
