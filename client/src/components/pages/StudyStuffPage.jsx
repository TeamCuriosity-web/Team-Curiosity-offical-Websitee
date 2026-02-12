import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Play, BookOpen, Clock, Star, ArrowRight, FileText, ChevronLeft, PlayCircle, Video, Download, Database } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../../services/api';

const StudyStuffPage = () => {
    const containerRef = useRef(null);
    const [selectedDomain, setSelectedDomain] = useState(null); // 'Frontend' | 'Backend' | null
    const [activeTab, setActiveTab] = useState('Courses'); // 'Courses' | 'Notes'
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedDomain && activeTab === 'Courses') {
            fetchCourses();
        }
    }, [selectedDomain, activeTab]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/courses?domain=${selectedDomain}`);
            setCourses(data);
        } catch (err) {
            console.error("Fetch courses error", err);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!selectedDomain) {
                gsap.from(".domain-card", {
                    y: 50,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out"
                });
            } else {
                gsap.from(".hub-content-item", {
                    y: 20,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power3.out"
                });
            }
        }, containerRef);
        return () => ctx.revert();
    }, [selectedDomain, activeTab]);

    const DomainCard = ({ title, lessons, duration, rating, thumbnailGradient, onClick }) => (
        <div 
            onClick={onClick}
            className="domain-card group bg-white border-4 border-black overflow-hidden hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 flex flex-col h-full cursor-pointer relative"
        >
            <div className={`relative h-64 w-full ${thumbnailGradient} flex items-center justify-center overflow-hidden border-b-4 border-black`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="p-6 bg-black text-white rounded-full transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border-2 border-white">
                    <Play fill="white" size={32} />
                </div>
                <div className="absolute top-4 left-4 bg-black text-white px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20">
                    CORE_PROTOCOL
                </div>
            </div>
            <div className="p-10 flex flex-col flex-grow bg-white group-hover:bg-black transition-colors duration-500">
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-none group-hover:text-white transition-colors italic">
                    {title}
                </h3>
                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-red-500 mt-auto">
                    <span className="flex items-center gap-2">
                        <Database size={12} /> {lessons} ARCHIVES
                    </span>
                    <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        ACCESS_HUB <ArrowRight size={14} />
                    </div>
                </div>
            </div>
            {/* Decorative Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20"></div>
        </div>
    );

    const CourseVideoCard = ({ title, instructor, duration, rating, color, thumbnailUrl, onClick }) => (
        <div onClick={onClick} className="hub-content-item group bg-white border-2 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-500 cursor-pointer relative">
            <div className={`relative h-48 w-full ${color} flex items-center justify-center border-b-2 border-black overflow-hidden`}>
                {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                ) : (
                    <Video size={40} className="text-white opacity-20" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-4 bg-white text-black rounded-full shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] border-2 border-black">
                        <Play fill="black" size={20} />
                    </div>
                </div>
                <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-0.5 text-[8px] font-mono font-black italic tracking-widest uppercase">
                    LIVE_SPEC
                </div>
                <div className="absolute bottom-3 right-3 bg-black text-white px-2 py-1 text-[10px] font-mono font-bold z-10 border border-gray-800">
                    {duration}
                </div>
            </div>
            <div className="p-6 group-hover:bg-gray-50 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3 font-mono">
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-full">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[9px] font-bold">{rating} RANK</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">v01.2</span>
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-6 leading-none line-clamp-2 h-10 group-hover:text-red-600 transition-colors">
                    {title}
                </h4>
                <button className="w-full py-3 bg-black text-white font-bold uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-red-600 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                    Watch_Protocol
                </button>
            </div>
        </div>
    );

    const NoteItem = ({ title, size, type }) => (
        <div className="hub-content-item group flex items-center justify-between p-5 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer">
            <div className="flex items-center gap-6">
                <div className="p-3 bg-gray-100 border border-black text-black group-hover:bg-white transition-colors">
                    <Database size={20} />
                </div>
                <div>
                    <h5 className="font-black uppercase tracking-tight text-sm group-hover:text-red-600 transition-colors inline-block mr-3">
                        {title}
                    </h5>
                    <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest group-hover:text-gray-500">
                        {type} // {size}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-10 h-0.5 bg-black transition-all duration-500 origin-left group-hover:w-20 group-hover:bg-red-600"></div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-white" />
            </div>
        </div>
    );

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
                        <div className="pt-8 min-h-[400px]">
                            {activeTab === 'Courses' ? (
                                loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="font-mono text-[10px] tracking-widest uppercase">Fetching_Repository...</p>
                                    </div>
                                ) : courses.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {courses.map((course, i) => (
                                            <CourseVideoCard 
                                                key={course._id || i} 
                                                title={course.title}
                                                duration={course.duration}
                                                rating={course.rating}
                                                thumbnailUrl={course.thumbnailUrl}
                                                color={selectedDomain === 'Frontend' ? 'bg-cyan-500' : 'bg-red-600'}
                                                onClick={() => window.open(course.youtubeLink, '_blank')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
                                        <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">No Protocol_Files found for this domain</p>
                                    </div>
                                )
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
