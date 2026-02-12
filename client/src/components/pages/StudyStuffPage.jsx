import React, { useLayoutEffect, useRef, useState } from 'react';
import { Play, BookOpen, Clock, Star, ArrowRight, FileText, ChevronLeft, PlayCircle } from 'lucide-react';
import { gsap } from 'gsap';

const StudyStuffPage = () => {
    const containerRef = useRef(null);
    const [selectedDomain, setSelectedDomain] = useState(null); // 'Frontend' | 'Backend' | null

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".course-card", {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [selectedDomain]);

    const SubSectionCard = ({ title, icon: Icon, count, description, color }) => (
        <div className="group bg-white border-2 border-black p-8 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer flex flex-col h-full min-h-[300px]">
            <div className={`w-16 h-16 ${color} text-white flex items-center justify-center mb-6 border-2 border-black group-hover:rotate-6 transition-transform`}>
                <Icon size={32} />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{title}</h3>
            <p className="text-gray-500 font-mono text-sm mb-8 leading-relaxed">
                {description}
            </p>
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">{count} Files Available</span>
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </div>
        </div>
    );

    const CourseCard = ({ title, instructor, duration, lessons, rating, thumbnailGradient, onClick }) => (
        <div 
            onClick={onClick}
            className="course-card group bg-white border-2 border-black overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            {/* Thumbnail / Video Placeholder */}
            <div className={`relative h-56 w-full ${thumbnailGradient} flex items-center justify-center overflow-hidden border-b-2 border-black`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white transform group-hover:scale-110 transition-transform duration-500">
                    <Play fill="white" size={32} />
                </div>
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                    Education_Protocol
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Master_Class</span>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                        <Star size={12} fill="currentColor" /> {rating}
                    </div>
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-tight group-hover:text-red-600 transition-colors">
                    {title}
                </h3>

                <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between font-mono text-xs text-gray-500 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2"><BookOpen size={14}/> Modules:</div>
                        <span className="font-bold text-black">{lessons}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs text-gray-500 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2"><Clock size={14}/> Total Time:</div>
                        <span className="font-bold text-black">{duration}</span>
                    </div>
                </div>

                <button className="mt-auto w-full py-4 bg-black text-white font-bold uppercase text-xs tracking-[0.3em] border-2 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group-hover:gap-4">
                    Enter Domain <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex items-center justify-center p-6 pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="container mx-auto max-w-6xl">
                {!selectedDomain ? (
                    /* Main View: Course Selection */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <CourseCard 
                            title="Frontend Engineering"
                            lessons="24 Modules"
                            duration="18.5 Hours"
                            rating="4.9"
                            thumbnailGradient="bg-gradient-to-br from-cyan-400 to-blue-600"
                            onClick={() => setSelectedDomain('Frontend')}
                        />
                        <CourseCard 
                            title="Backend Systems"
                            lessons="19 Modules"
                            duration="15.2 Hours"
                            rating="4.8"
                            thumbnailGradient="bg-gradient-to-br from-red-400 to-purple-600"
                            onClick={() => setSelectedDomain('Backend')}
                        />
                    </div>
                ) : (
                    /* Detail View: Courses and Notes */
                    <div className="space-y-12 animate-fade-in">
                        {/* Navigation */}
                        <button 
                            onClick={() => setSelectedDomain(null)}
                            className="flex items-center gap-2 font-black uppercase text-xs tracking-[0.2em] hover:text-red-600 transition-colors group"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Domains
                        </button>

                        <div className="border-b-4 border-black pb-6">
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                                {selectedDomain} <span className="text-gray-300">Hub</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <SubSectionCard 
                                title="Courses"
                                icon={PlayCircle}
                                color="bg-black"
                                count="12+"
                                description={`Comprehensive video series on ${selectedDomain} protocols. Step-by-step masterclasses from zero to production deployment.`}
                            />
                            <SubSectionCard 
                                title="Technical Notes"
                                icon={FileText}
                                color="bg-gray-400"
                                count="45+"
                                description={`Deep-dive dossiers and technical documentation for offline study. Architectural diagrams and core logic breakdowns.`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyStuffPage;
