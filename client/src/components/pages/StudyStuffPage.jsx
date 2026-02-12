import React, { useLayoutEffect, useRef } from 'react';
import { Play, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const StudyStuffPage = () => {
    const containerRef = useRef(null);

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
    }, []);

    const CourseCard = ({ title, instructor, duration, lessons, students, rating, thumbnailGradient }) => (
        <div className="course-card group bg-white border-2 border-black overflow-hidden hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col h-full">
            {/* Thumbnail / Video Placeholder */}
            <div className={`relative h-48 w-full ${thumbnailGradient} flex items-center justify-center overflow-hidden border-b-2 border-black`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white transform group-hover:scale-110 transition-transform duration-500">
                    <Play fill="white" size={32} />
                </div>
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                    Course_Available
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Education_Protocol</span>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                        <Star size={12} fill="currentColor" /> {rating}
                    </div>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-red-600 transition-colors">
                    {title}
                </h3>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between font-mono text-xs text-gray-500 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2"><BookOpen size={14}/> Lessons:</div>
                        <span className="font-bold text-black">{lessons}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs text-gray-500 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2"><Clock size={14}/> Duration:</div>
                        <span className="font-bold text-black">{duration}</span>
                    </div>
                </div>

                <button className="mt-auto w-full py-3 bg-black text-white font-bold uppercase text-xs tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                    Start Learning <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex items-center justify-center p-6 pt-24 pb-12">
            {/* Minimalist Grid Background */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    <CourseCard 
                        title="Advanced Frontend Engineering"
                        instructor="Naseer Pasha"
                        lessons="18 Chapters"
                        duration="12.5 Hours"
                        rating="4.9"
                        thumbnailGradient="bg-gradient-to-br from-cyan-400 to-blue-600"
                    />

                    <CourseCard 
                        title="Backend Architecture & Scalability"
                        instructor="Naseer Pasha"
                        lessons="14 Chapters"
                        duration="10.8 Hours"
                        rating="4.8"
                        thumbnailGradient="bg-gradient-to-br from-red-400 to-purple-600"
                    />

                </div>
            </div>
        </div>
    );
};

export default StudyStuffPage;
