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
            className="group relative h-[450px] cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-black/5 bg-white transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.1)]"
        >
            {/* Mesh Gradient Header */}
            <div className={`absolute top-0 inset-x-0 h-2/3 ${thumbnailGradient} opacity-80 transition-opacity duration-700 group-hover:opacity-100 overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
                <div className="absolute top-8 left-8 bg-black text-white px-4 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                    Control_Protocol
                </div>
            </div>

            {/* Content Container */}
            <div className="absolute bottom-0 inset-x-0 bg-white p-10 pt-12 rounded-t-[2.5rem] border-t-2 border-black/5 transition-transform duration-700 group-hover:translate-y-[-10px]">
                <h3 className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter text-gray-900 transition-colors group-hover:text-red-600">
                    {title}
                </h3>
                
                <div className="flex items-center justify-between border-t border-black/5 pt-8">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Database</span>
                            <span className="font-mono text-xs font-bold text-gray-900">{lessons} ARCHIVES</span>
                        </div>
                        <div className="flex flex-col border-l border-black/10 pl-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Security</span>
                            <span className="font-mono text-xs font-bold text-red-600">ENCRYPTED</span>
                        </div>
                    </div>
                    <div className="rounded-full bg-black p-5 text-white transition-all duration-500 group-hover:bg-red-600 group-hover:rotate-12 group-hover:shadow-[0_10px_30px_rgba(220,38,38,0.4)]">
                        <ArrowRight size={24} />
                    </div>
                </div>
            </div>
        </div>
    );

    const CourseVideoCard = ({ title, instructor, duration, rating, thumbnailUrl, onClick }) => (
        <div 
            onClick={onClick} 
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={thumbnailUrl || '/api/placeholder/400/225'} 
                    alt={title} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                />
                
                {/* Information Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-3 left-3 flex gap-2">
                    <div className="rounded-full bg-red-600 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-lg">
                        Premium
                    </div>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
                    <Star size={10} fill="#facc15" className="text-yellow-400" />
                    <span className="text-[10px] font-bold text-white">{rating}</span>
                </div>

                <div className="absolute top-3 right-3 rounded-lg bg-white/20 px-2.5 py-1 font-mono text-[9px] font-bold text-white backdrop-blur-md">
                    {duration}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play fill="black" size={20} className="translate-x-0.5" />
                    </div>
                </div>
            </div>

            <div className="p-7">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-4 w-1 bg-red-600 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Archive_Protocol</span>
                </div>
                
                <h4 className="mb-6 text-xl font-bold tracking-tight text-gray-900 group-hover:text-red-600 transition-colors leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {title}
                </h4>
                
                <div className="flex items-center justify-between border-t border-black/5 pt-5">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-[8px] font-black text-white">TC</div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Lead_Source</span>
                            <span className="text-[11px] font-bold text-gray-700">{instructor || "Team Curiosity"}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                        Review <ArrowRight size={14} />
                    </div>
                </div>
            </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
