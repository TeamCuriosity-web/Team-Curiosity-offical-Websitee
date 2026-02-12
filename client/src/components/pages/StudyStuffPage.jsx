import React, { useLayoutEffect, useRef, useState } from 'react';
import { Play, BookOpen, Clock, Star, ArrowRight, FileText, ChevronLeft, PlayCircle, Video, Download } from 'lucide-react';
import { gsap } from 'gsap';

const StudyStuffPage = () => {
    const containerRef = useRef(null);
    const [selectedDomain, setSelectedDomain] = useState(null); // 'Frontend' | 'Backend' | null
    const [activeTab, setActiveTab] = useState('Courses'); // 'Courses' | 'Notes'

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!selectedDomain) {
                gsap.from(".domain-card", {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            } else {
                gsap.from(".hub-content-item", {
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out"
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, [selectedDomain, activeTab]);

    const DomainCard = ({ title, lessons, duration, rating, thumbnailGradient, onClick }) => (
        <div 
            onClick={onClick}
            className="domain-card group bg-white border-2 border-black overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            <div className={`relative h-56 w-full ${thumbnailGradient} flex items-center justify-center overflow-hidden border-b-2 border-black`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white transform group-hover:scale-110 transition-transform duration-500">
                    <Play fill="white" size={32} />
                </div>
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                    Study_Domain
                </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-red-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center justify-between font-mono text-xs text-gray-500 mt-auto">
                    <span>{lessons} Lessons</span>
                    <ArrowRight size={18} />
                </div>
            </div>
        </div>
    );

    const CourseVideoCard = ({ title, instructor, duration, rating, color }) => (
        <div className="hub-content-item group bg-white border-2 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <div className={`relative h-44 w-full ${color} flex items-center justify-center border-b-2 border-black`}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                <Video size={40} className="text-white group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-3 right-3 bg-black text-white px-2 py-1 text-[10px] font-mono font-bold">
                    {duration}
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <Star size={12} fill="currentColor" className="text-yellow-500" />
                    <span className="text-[10px] font-bold text-gray-400">{rating} Rating</span>
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-4 leading-tight group-hover:text-red-600 transition-colors">
                    {title}
                </h4>
                <button className="w-full py-2.5 bg-black text-white font-bold uppercase text-[10px] tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all">
                    Watch Course
                </button>
            </div>
        </div>
    );

    const NoteItem = ({ title, size, type }) => (
        <div className="hub-content-item flex items-center justify-between p-4 bg-gray-50 border-2 border-transparent hover:border-black transition-all group">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-black text-white">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-bold uppercase text-sm group-hover:text-red-600 transition-colors">{title}</h4>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{type} • {size}</span>
                </div>
            </div>
            <button className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black">
                <Download size={18} />
            </button>
        </div>
    );

    const frontendCourses = [
        { title: "React 19 Deep Dive", duration: "4:25:00", rating: "4.9", color: "bg-cyan-500" },
        { title: "GSAP Motion Secrets", duration: "2:15:00", rating: "4.8", color: "bg-green-500" },
        { title: "Three.js Masterclass", duration: "5:40:00", rating: "5.0", color: "bg-blue-600" },
        { title: "Tailwind UI Systems", duration: "1:50:00", rating: "4.7", color: "bg-indigo-500" }
    ];

    const backendCourses = [
        { title: "Node.js Core Architecture", duration: "6:10:00", rating: "4.9", color: "bg-red-600" },
        { title: "MongoDB Mastery", duration: "3:45:00", rating: "4.8", color: "bg-emerald-600" },
        { title: "Socket.IO Real-time Sync", duration: "2:30:00", rating: "4.7", color: "bg-orange-500" },
        { title: "JWT & Security Protocols", duration: "2:05:00", rating: "4.9", color: "bg-purple-600" }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white p-6 pt-32 pb-20 overflow-hidden relative">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="container mx-auto max-w-6xl">
                {!selectedDomain ? (
                    /* Step 1: Selection */
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Study Vault</h2>
                            <p className="font-mono text-gray-500">// SELECT YOUR SPECIALIZATION</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <DomainCard 
                                title="Frontend Development"
                                lessons="48+"
                                thumbnailGradient="bg-gradient-to-br from-cyan-400 to-blue-600"
                                onClick={() => setSelectedDomain('Frontend')}
                            />
                            <DomainCard 
                                title="Backend Development"
                                lessons="36+"
                                thumbnailGradient="bg-gradient-to-br from-red-500 to-purple-700"
                                onClick={() => setSelectedDomain('Backend')}
                            />
                        </div>
                    </div>
                ) : (
                    /* Step 2: Hub with Sub-Nav */
                    <div className="space-y-8 animate-fade-in">
                        {/* Header & Back */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <button 
                                    onClick={() => setSelectedDomain(null)}
                                    className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] mb-4 hover:text-red-600 transition-colors group"
                                >
                                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
                                </button>
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    {selectedDomain} <span className="stroke-text opacity-20">HUB</span>
                                </h2>
                            </div>
                        </div>

                        {/* Sub-Nav Bar (The core request) */}
                        <div className="flex border-b-4 border-black overflow-x-auto">
                            {['Courses', 'Notes'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-12 py-5 font-black uppercase text-xs tracking-[0.4em] transition-all relative ${
                                        activeTab === tab 
                                        ? 'bg-black text-white' 
                                        : 'text-gray-400 hover:text-black bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="pt-8">
                            {activeTab === 'Courses' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {(selectedDomain === 'Frontend' ? frontendCourses : backendCourses).map((course, i) => (
                                        <CourseVideoCard key={i} {...course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <NoteItem 
                                            key={i} 
                                            title={`Archived Protocol_0${i} - ${selectedDomain}`} 
                                            size={`${(Math.random() * 10).toFixed(1)} MB`} 
                                            type="PDF_SPEC" 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .stroke-text {
                    -webkit-text-stroke: 2px black;
                    color: transparent;
                }
            `}} />
        </div>
    );
};

export default StudyStuffPage;
