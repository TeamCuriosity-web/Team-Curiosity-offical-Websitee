import React, { useState, useEffect } from 'react';
import { X, BookOpen, Target, Users, Code2, Globe, Library, Trophy } from 'lucide-react';
import Button from './Button';

const UserGuide = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        
        const hasSeenGuide = localStorage.getItem('hasSeenGuide_v1');
        if (!hasSeenGuide) {
            
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenGuide_v1', 'true');
    };

    const nextStep = () => setPage(p => p + 1);
    const prevStep = () => setPage(p => p - 1);

    if (!isOpen) return null;

    const sections = [
        {
            title: "Start Kaise Karein? (Guide)",
            icon: <BookOpen size={24} className="text-black" />,
            content: (
                <div className="space-y-4 text-justify font-serif leading-relaxed">
                    <p>
                        <strong>Welcome Bhai/Behen!</strong>
                    </p>
                    <p>
                        Team Curiosity ke main base pe tumhara swagat hai. Ye bas ek website nahi hai, ye humara <strong>Headquarters</strong> hai jaha hum sab milke projects banate hain.
                    </p>
                    <p>
                        Is guide ko dhyan se padho taaki samajh sako ki yaha kaam kaise hota hai aur features kaise use karne hain.
                    </p>
                    <div className="bg-gray-100 p-3 italic text-sm text-gray-600 border-l-2 border-black">
                        "Curiosity ka matlab hai nayi cheezein seekhne ki chahat."
                    </div>
                </div>
            )
        },
        {
            title: "Missions & Projects",
            icon: <Target size={24} className="text-red-600" />,
            content: (
                <div className="space-y-4 text-justify font-serif leading-relaxed">
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 uppercase text-xs tracking-widest text-red-600">Kaam Ki Baat</h3>
                    <p>
                        <strong>PROJECTS</strong> section mein jao aur dekho abhi kya ban raha hai.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>
                            <strong>Request Assignment:</strong> Agar koi project pasand aaye aur usme help karni ho, toh 'Request Assignment' pe click karo.
                        </li>
                        <li>
                            <strong>Fork to Device:</strong> Ye developers ke liye hai. Agar code apne laptop pe chahiye, toh <code className="bg-gray-200 px-1 rounded font-mono text-xs">Fork to Device</code> dabao. Code seedha VS Code mein khul jayega.
                        </li>
                        <li>
                            <strong>Live Deployment:</strong> Jo projects ban chuke hain, unhe live chala ke dekh sakte ho.
                        </li>
                    </ul>
                </div>
            )
        },
        {
            title: "Leaderboard (Ranking)",
            icon: <Trophy size={24} className="text-yellow-600" />,
            content: (
                <div className="space-y-4 text-justify font-serif leading-relaxed">
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 uppercase text-xs tracking-widest text-yellow-600">Kaun Jeet Raha Hai?</h3>
                    <p>
                        Yaha hum dikhate hain ki kaun sabse zyada mehnat kar raha hai. <strong>Leaderboard</strong> pe ranking hoti hai kaam ke hisaab se.
                    </p>
                    <div className="space-y-2 text-sm bg-yellow-50 p-3 rounded">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Commit Strength:</span> Jitna zyada aur accha code likhoge, utna upar aaoge.
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Consistency:</span> Roz thoda-thoda kaam karne se rank badhti hai.
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        *Note: Admins (Seniors) is ranking mein nahi hain, taaki tum sab ka fair competition ho.
                    </p>
                </div>
            )
        },
        {
            title: "Padhai Ka Maal (Study Stuff)",
            icon: <Library size={24} className="text-blue-600" />,
            content: (
                <div className="space-y-4 text-justify font-serif leading-relaxed">
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 uppercase text-xs tracking-widest text-blue-600">Knowledge Base</h3>
                    <p>
                        <strong>Study Stuff</strong> mein jao agar kuch naya seekhna hai.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>
                            <strong>Courses:</strong> Best video playlists jo humne dhund ke nikale hain.
                        </li>
                        <li>
                            <strong>Notes:</strong> Seniors ke haath se likhe huye notes aur diagrams. Exam aur interview mein bahut kaam aayenge.
                        </li>
                    </ul>
                    <p>
                        In resources ko use karo aur apni skills ko next level pe le jao.
                    </p>
                </div>
            )
        }
    ];

    const currentSection = sections[page];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
            <div className="bg-[#fcfbf7] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden relative border-4 border-double border-gray-300" style={{ boxShadow: "10px 10px 30px rgba(0,0,0,0.5)" }}>
                
                {}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https:

                {}
                <div className="bg-[#1a1a1a] text-[#fcfbf7] p-6 flex justify-between items-center relative z-10 border-b-2 border-[#b8b8b8]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fcfbf7] text-black p-2 rounded-sm">
                            {currentSection.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-wider font-mono uppercase">{currentSection.title}</h2>
                            <p className="text-[10px] opacity-70 font-mono tracking-widest">PAGE {page + 1} OF {sections.length}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {}
                <div className="p-8 md:p-10 min-h-[300px] relative z-10">
                    <div className="prose prose-lg text-gray-800">
                        {currentSection.content}
                    </div>
                </div>

                {}
                <div className="bg-[#f0ece2] p-6 border-t border-[#dcdcdc] flex justify-between items-center relative z-10">
                    <div className="flex gap-2">
                        {sections.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`w-2 h-2 rounded-full transition-all ${idx === page ? 'bg-black w-4' : 'bg-gray-400'}`}
                            />
                        ))}
                    </div>
                    
                    <div className="flex gap-4">
                        {page > 0 ? (
                            <button 
                                onClick={prevStep}
                                className="px-6 py-2 border-b-2 border-transparent hover:border-black font-bold uppercase text-xs tracking-widest transition-all"
                            >
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {page < sections.length - 1 ? (
                            <Button onClick={nextStep} variant="primary" className="border-black shadow-none rounded-none px-6">
                                Next Page
                            </Button>
                        ) : (
                            <Button onClick={handleClose} variant="primary" className="border-black shadow-none rounded-none bg-black text-white hover:bg-gray-800 px-6">
                                Acknowledge & Enter
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
