import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';

const InvitePage = () => {
    const containerRef = useRef(null);
    const logoPartARef = useRef(null);
    const logoPartBRef = useRef(null);
    const logoPartCRef = useRef(null);
    const logoPartDRef = useRef(null);
    const logoCoreRef = useRef(null);
    const textRef = useRef(null);
    const charsRef = useRef([]);
    const shineGradientRef = useRef(null);
    
    const [searchParams] = useSearchParams();
    const invitedName = searchParams.get('name') || 'Guest';

    useEffect(() => {
        const ctx = gsap.context(() => {
            const logoParts = [logoPartARef.current, logoPartBRef.current, logoPartCRef.current, logoPartDRef.current];

            // INITIAL SETUP
            gsap.set(logoParts, { opacity: 1 });
            gsap.set(logoPartARef.current, { x: '-140%', y: '-30%', rotation: -6 });
            gsap.set(logoPartBRef.current, { x: '120%', y: '-40%', rotation: 8 });
            gsap.set(logoPartCRef.current, { x: '-120%', y: '130%', rotation: 5 });
            gsap.set(logoPartDRef.current, { x: '140%', y: '110%', rotation: -7 });
            gsap.set(logoCoreRef.current, { opacity: 0, scale: 0.4 });
            gsap.set(textRef.current, { opacity: 0 });
            gsap.set(charsRef.current, { opacity: 0, scale: 0.88, fillOpacity: 0 });
            gsap.set(shineGradientRef.current, { attr: { x1: '120%', x2: '200%' } });

            const tl = gsap.timeline({ delay: 0.3 });

            // PHASE 1: LOGO ASSEMBLY
            tl.to(logoParts, {
                x: 0,
                y: 0,
                rotation: 0,
                duration: 1.15,
                ease: 'power3.out',
                stagger: 0.06
            });
            tl.to(logoParts, {
                x: 0,
                y: 0,
                duration: 0.25,
                ease: 'power3.out'
            }, '-=0.25');
            tl.to(logoCoreRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power3.out'
            }, '-=0.2');
            tl.to(logoCoreRef.current, {
                boxShadow: '0 0 18px rgba(201, 188, 140, 0.45)',
                duration: 0.4,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });
            tl.to({}, { duration: 0.5 });

            // PHASE 2: LOGO DISASSEMBLY
            tl.to(logoCoreRef.current, {
                opacity: 0,
                scale: 0.6,
                duration: 0.3,
                ease: 'power2.in'
            });
            tl.to(logoPartARef.current, {
                x: '-160%',
                y: '-50%',
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.1');
            tl.to(logoPartBRef.current, {
                x: '150%',
                y: '-80%',
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');
            tl.to(logoPartCRef.current, {
                x: '-150%',
                y: '160%',
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');
            tl.to(logoPartDRef.current, {
                x: '160%',
                y: '140%',
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');

            // PHASE 3: TEXT ANIMATION
            tl.to(textRef.current, {
                opacity: 1,
                duration: 0.2
            }, '+=0.1');
            tl.to(charsRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: 'power3.out',
                stagger: 0.05
            });
            tl.to(charsRef.current, {
                fillOpacity: 1,
                duration: 0.85,
                ease: 'power2.inOut',
                stagger: 0.06
            }, '-=0.2');
            tl.to(shineGradientRef.current, {
                attr: { x1: '-20%', x2: '60%' },
                duration: 0.7,
                ease: 'power2.inOut',
                repeat: 1,
                onRepeat: () => {
                    gsap.set(shineGradientRef.current, { attr: { x1: '120%', x2: '200%' } });
                }
            }, '+=0.2');

            // Hold text briefly - Animation ends here
            tl.to({}, { duration: 0.3 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const text = "TEAM CURIOSITY";
    const chars = text.split('');

    return (
        <div 
            className="min-h-screen bg-[#f7f7f7] flex items-center justify-center" 
            style={{ 
                overflow: 'visible',
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
        >
            <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>
                {/* PHASE 1: Logo */}
                <svg 
                    width="400" 
                    height="400" 
                    viewBox="0 0 120 120" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_12px_30px_rgba(18,18,18,0.12)]"
                >
                    <g ref={logoPartARef}>
                        <path 
                            d="M60 12L92 58H28L60 12Z" 
                            fill="#161616" 
                            stroke="#C9BC8C" 
                            strokeWidth="1.2"
                        />
                    </g>
                    <g ref={logoPartBRef}>
                        <path 
                            d="M28 58L12 88H44L28 58Z" 
                            fill="#161616" 
                            stroke="#C9BC8C" 
                            strokeWidth="1.2"
                        />
                    </g>
                    <g ref={logoPartCRef}>
                        <path 
                            d="M92 58L108 88H76L92 58Z" 
                            fill="#161616" 
                            stroke="#C9BC8C" 
                            strokeWidth="1.2"
                        />
                    </g>
                    <g ref={logoPartDRef}>
                        <path 
                            d="M60 46L76 82H44L60 46Z" 
                            fill="#1F1F1F" 
                            stroke="#B6AA7E" 
                            strokeWidth="1"
                        />
                    </g>
                    <circle ref={logoCoreRef} cx="60" cy="62" r="4" fill="#C9BC8C" />
                </svg>

                {/* PHASE 3: Text */}
                <div 
                    ref={textRef}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg 
                        viewBox="0 0 1200 240" 
                        className="w-[88vw] max-w-[1200px]"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <linearGradient id="textFill" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#111111" />
                                <stop offset="100%" stopColor="#111111" />
                            </linearGradient>
                            <linearGradient 
                                id="shine" 
                                ref={shineGradientRef}
                                x1="120%" 
                                y1="0%" 
                                x2="200%" 
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="45%" stopColor="rgba(255,255,255,0.85)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </linearGradient>
                        </defs>
                        <text 
                            x="50%" 
                            y="55%" 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            fontSize="160" 
                            letterSpacing="14" 
                            fontWeight="600" 
                            fill="url(#textFill)" 
                            stroke="#2A2A2A" 
                            strokeWidth="2"
                        >
                            {chars.map((char, index) => (
                                <tspan 
                                    key={`${char}-${index}`}
                                    ref={(el) => { charsRef.current[index] = el; }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </tspan>
                            ))}
                        </text>
                        <rect 
                            x="0" 
                            y="0" 
                            width="1200" 
                            height="240" 
                            fill="url(#shine)" 
                            style={{ 
                                mixBlendMode: 'screen'
                            }}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default InvitePage;
