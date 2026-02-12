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

    const DomainCard = ({ title, lessons, thumbnailGradient, onClick }) => (
        <div 
            onClick={onClick}
            className="group relative h-[450px] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_45px_100px_rgba(0,0,0,0.5)]"
        >
            {/* Animated Mesh Gradient Background */}
            <div className={`absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60 ${thumbnailGradient}`}>
                <div className="absolute inset-0 bg-[#000]/20 mix-blend-overlay"></div>
                <div className="absolute -inset-[100%] animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-30"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex h-full flex-col justify-end p-10 pb-12">
                <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 py-1.5 px-4 backdrop-blur-md">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500"></div>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                        System_Protocol
                    </span>
                </div>
                
                <h3 className="mb-4 text-5xl font-black italic uppercase leading-[0.9] tracking-tighter text-white transition-transform duration-500 group-hover:scale-105">
                    {title}
                </h3>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</span>
                            <span className="font-mono text-xs text-red-500">DECRYPTED</span>
                        </div>
                        <div className="flex flex-col border-l border-white/10 pl-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Archives</span>
                            <span className="font-mono text-xs text-white">{lessons} UNITS</span>
                        </div>
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/10 p-4 text-white transition-all duration-500 group-hover:bg-red-600 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>

            {/* Glass Overlays */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none group-hover:border-red-500/50 transition-colors duration-500"></div>
        </div>
    );

    const CourseVideoCard = ({ title, instructor, duration, rating, thumbnailUrl, onClick }) => (
        <div 
            onClick={onClick} 
            className="group relative flex flex-col md:flex-row items-center gap-8 cursor-pointer p-4 md:p-6 rounded-[2rem] md:rounded-[100px] border border-white/10 bg-black/40 backdrop-blur-3xl transition-all duration-700 hover:bg-black/60 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-2 overflow-hidden mx-auto w-full"
        >
            {/* Fluid Background Animation */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_50%,#ff4d4d,transparent_70%)]"></div>

            {/* Circular Thumbnail Container */}
            <div className="relative flex-shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                <img 
                    src={thumbnailUrl || '/api/placeholder/400/400'} 
                    alt={title} 
                    className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                
                {/* Play Icon Reveal */}
                <div className="absolute inset-0 flex items-center justify-center bg-red-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Play fill="white" size={24} className="text-white translate-x-0.5" />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 border border-red-500/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500">Active_Res</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                        <Clock size={12} /> {duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-500/80 font-mono text-[10px] uppercase tracking-widest bg-yellow-500/5 px-2 py-0.5 rounded-lg border border-yellow-500/10">
                        <Star size={10} fill="currentColor" /> {rating}
                    </div>
                </div>

                <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none tracking-tighter text-white mb-4 group-hover:text-red-500 transition-colors">
                    {title}
                </h4>

                <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full border border-white/20 bg-black flex items-center justify-center text-[7px] font-black text-white">TC</div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Source: <span className="text-white/60">{instructor || "Team Curiosity"}</span>
                    </span>
                </div>
            </div>

            {/* Final Action Button (Pill Styled) */}
            <div className="hidden lg:flex flex-shrink-0 mr-4">
                <div className="h-14 w-40 flex items-center justify-center rounded-full border-2 border-white/5 bg-white/5 text-white font-black uppercase text-[10px] tracking-[0.3em] overflow-hidden relative group/btn transition-all duration-500 hover:border-red-600 hover:bg-red-600 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <span className="relative z-10">Access_Hub</span>
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-gradient-to-r from-red-600 to-red-400 transition-transform duration-500"></div>
                </div>
            </div>

            {/* Sweep Light Effect */}
            <div className="absolute inset-x-[-100%] top-0 h-full w-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-1000 group-hover:translate-x-[50%] pointer-events-none"></div>
        </div>
    );

    const NoteItem = ({ title, size, type }) => (
        <div className="group relative flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white p-6 transition-all duration-300 hover:bg-black hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-black shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Database size={20} />
                </div>
                <div>
                    <h5 className="mb-1 text-sm font-bold uppercase tracking-tight group-hover:text-white transition-colors">
                        {title}
                    </h5>
                    <div className="flex items-center gap-3">
                        <div className="flex h-4 items-center gap-1.5 rounded-full bg-red-600/10 px-2 text-[9px] font-black uppercase text-red-600 group-hover:bg-white/10 group-hover:text-red-500">
                            <span className="h-1 w-1 rounded-full bg-current"></span>
                            {type}
                        </div>
                        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest group-hover:text-gray-500">
                            SPEC_ID: {size}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-gray-50 text-gray-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-white group-hover:bg-red-600 translate-x-4">
                <Download size={18} />
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
                                    <div className="grid grid-cols-1 gap-10">
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
