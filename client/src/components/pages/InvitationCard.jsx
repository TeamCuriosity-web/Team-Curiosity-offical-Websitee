import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const MagneticButton = ({ children, onClick }) => {
    const buttonRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;
        const text = textRef.current;
        
        const handleMouseMove = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
            
            
            gsap.to(text, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: "power2.out"
            });
        };

        const handleMouseLeave = () => {
            gsap.to([button, text], {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className="relative px-8 py-3 bg-black rounded-full text-white font-bold shadow-lg overflow-hidden group hover:shadow-cyan-500/50 transition-shadow duration-300"
        >
            <span ref={textRef} className="relative z-10 block tracking-widest text-xs font-mono">
                {children}
            </span>
            {}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
};

const InvitationCard = () => {
    const cardRef = useRef(null);

    useEffect(() => {
        
        gsap.fromTo(cardRef.current, 
            { scale: 0.8, opacity: 0, y: 50 },
            { scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)", delay: 0.2 }
        );
    }, []);

    const handleJoin = () => {
        
        window.location.href = "/Team-Curiosity-offical-Websitee/join"; 
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div 
                ref={cardRef}
                className="relative w-[350px] md:w-[450px] p-8 rounded-2xl bg-white shadow-2xl flex flex-col items-center text-center pointer-events-auto"
                style={{ 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                }}
            >
                {}
                <div className="mb-6 flex flex-col items-center">
                    {}
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http:
                            <defs>
                                <style>
                                    {`
                                        .shard { transform-origin: center; animation: assemble-card 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                                        .shard-1 { animation-delay: 0.5s; transform: translate(-10px, -10px) rotate(-45deg); opacity: 0; }
                                        .shard-2 { animation-delay: 0.6s; transform: translate(10px, -5px) rotate(30deg); opacity: 0; }
                                        .shard-3 { animation-delay: 0.7s; transform: translate(-5px, 15px) rotate(90deg); opacity: 0; }
                                        .core-glow-card { animation: pulse-core 3s infinite ease-in-out; opacity: 0; transform-origin: center; animation-delay: 2s; animation-fill-mode: forwards; }
                                        @keyframes assemble-card { to { transform: translate(0, 0) rotate(0deg); opacity: 1; } }
                                    `}
                                </style>
                            </defs>
                            <path d="M20 5L30 25H10L20 5Z" fill="#000000" stroke="#000000" strokeWidth="1" className="shard shard-1"/>
                            <path d="M10 25L5 35L15 35L10 25Z" fill="#000000" stroke="#000000" strokeWidth="1" className="shard shard-2"/>
                            <path d="M30 25L35 35L25 35L30 25Z" fill="#000000" stroke="#000000" strokeWidth="1" className="shard shard-3"/>
                            <circle cx="20" cy="27" r="2" fill="#000000" className="core-glow-card"/>
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-black tracking-wide font-['Orbitron']">
                        TEAM CURIOSITY
                    </h2>
                </div>

                {}
                <div className="w-full h-[1px] bg-gray-200 mb-6"></div>

                {}
                <div className="mb-8 space-y-2">
                    <h3 className="text-xl text-black font-medium">Welcome</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        You have been invited to join our elite team of innovators. 
                        Your journey begins here.
                    </p>
                </div>

                {}
                <MagneticButton onClick={handleJoin}>
                    JOIN TEAM NOW
                </MagneticButton>
                
                {}
                <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-black/10 rounded-tl-2xl -m-1"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-black/10 rounded-br-2xl -m-1"></div>
            </div>
        </div>
    );
};

export default InvitationCard;
