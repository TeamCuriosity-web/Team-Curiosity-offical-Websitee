import GiftPacket from './GiftPacket';
import InvitationCard from './InvitationCard';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSearchParams } from 'react-router-dom';

const InvitePage = () => {
    const containerRef = useRef(null);
    const topTriangleRef = useRef(null);
    const bottomLeftRef = useRef(null);
    const bottomRightRef = useRef(null);
    const coreRef = useRef(null);
    const textRef = useRef(null);
    const charsRef = useRef([]);
    const subCharsRef = useRef([]);
    const shineGradientRef = useRef(null);
    
    const [searchParams] = useSearchParams();

    const [showPacket, setShowPacket] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            gsap.set(topTriangleRef.current, { x: '-200%', opacity: 1 });
            gsap.set(bottomLeftRef.current, { x: '200%', opacity: 1 });
            gsap.set(bottomRightRef.current, { y: '200%', opacity: 1 });
            gsap.set(coreRef.current, { opacity: 0, scale: 0 });
            gsap.set(textRef.current, { opacity: 0, y: 40, scale: 0.7 });
            
            
            gsap.set(charsRef.current, { scale: 0.3, opacity: 0, fillOpacity: 0 });
            gsap.set(subCharsRef.current, { scale: 0.3, opacity: 0, fillOpacity: 0 });

            const tl = gsap.timeline({ delay: 0.3 });

            
            const allParts = [topTriangleRef.current, bottomLeftRef.current, bottomRightRef.current];
            
            tl.to(allParts, {
                x: 0,
                y: 0,
                duration: 1.1,
                ease: 'power2.out'
            });

            
            tl.to(allParts, {
                x: 0,
                y: 0,
                duration: 0.25,
                ease: 'power3.out'
            }, '-=0.1');

            
            tl.to(coreRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power3.out'
            }, '-=0.1');

            
            tl.to({}, { duration: 0.5 });

            
            
            tl.to(coreRef.current, {
                opacity: 0,
                scale: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            
            tl.to(topTriangleRef.current, {
                x: '-200%',
                y: '-50%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.2');

            tl.to(bottomLeftRef.current, {
                x: '200%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');

            tl.to(bottomRightRef.current, {
                y: '-200%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');

            
            tl.to(textRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out'
            }, '+=0.3');

            
            tl.to(charsRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                stagger: 0.08  
            }, '-=0.3');

            
            tl.to(subCharsRef.current, {
                scale: 1,
                opacity: 0.6, 
                duration: 0.3,
                ease: 'power2.out',
                stagger: 0.04
            }, '-=0.2');

            
            tl.to([charsRef.current, subCharsRef.current], {
                fillOpacity: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'power2.inOut',
                stagger: {
                    amount: 0.8,
                    from: "start"
                }
            }, '-=0.5');

            
            const shineTween = tl.to(shineGradientRef.current, {
                attr: { x1: '-100%', x2: '0%' },
                duration: 2.0,
                ease: 'power1.inOut',
                repeat: 0, 
                onComplete: () => {
                     
                    gsap.set(shineGradientRef.current, { attr: { x1: '100%', x2: '200%' } });
                }
            }, '+=0.2');

            
            tl.to({}, { duration: 0.5 }); 

            
            
            tl.to([...charsRef.current, ...subCharsRef.current], {
                fillOpacity: 0,
                x: () => (Math.random() - 0.5) * 500,
                y: () => (Math.random() - 0.5) * 500,
                rotation: () => (Math.random() - 0.5) * 360,
                duration: 0.8,
                ease: 'power2.out',
                stagger: {
                    amount: 0.5,
                    from: "random"
                }
            });

            
            tl.to([...charsRef.current, ...subCharsRef.current], {
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.inOut',
                stagger: {
                    amount: 0.3,
                    from: "edges"
                },
                onComplete: () => {
                    
                    setShowPacket(true);
                }
            }, "-=0.2");

            
            tl.to(textRef.current, {
                opacity: 0,
                duration: 0.1
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    
    const [showCard, setShowCard] = useState(false);

    const handlePacketOpen = () => {
        
        setShowCard(true);
    };

    const text = "TEAM CURIOSITY";
    const subText = "BEYOND THE LIMITS";
    const chars = text.split('');
    const subChars = subText.split('');

    return (
        <div 
            className="min-h-screen bg-[#f7f7f7] flex items-center justify-center" 
            style={{ 
                overflow: 'hidden',
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
        >
            {}
            {showCard && <InvitationCard />}

            {}
            {showPacket && !showCard && <GiftPacket onOpen={handlePacketOpen} />}
            
            {}

            <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>

                {}
                <svg 
                    width="400" 
                    height="400" 
                    viewBox="0 0 40 40" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                    {}
                    <g ref={topTriangleRef}>
                        <path 
                            d="M20 5L30 25H10L20 5Z" 
                            fill="#000000" 
                            stroke="#000000" 
                            strokeWidth="1"
                        />
                    </g>
                    {}
                    <g ref={bottomLeftRef}>
                        <path 
                            d="M10 25L5 35L15 35L10 25Z" 
                            fill="#000000" 
                            stroke="#000000" 
                            strokeWidth="1"
                        />
                    </g>
                    {}
                    <g ref={bottomRightRef}>
                        <path 
                            d="M30 25L35 35L25 35L30 25Z" 
                            fill="#000000" 
                            stroke="#000000" 
                            strokeWidth="1"
                        />
                    </g>
                    {}
                    <circle 
                        ref={coreRef}
                        cx="20" 
                        cy="27" 
                        r="2.5" 
                        fill="#000000"
                    />
                </svg>

                {}
                <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: 'visible' }}>
                    <svg 
                        ref={textRef}
                        viewBox="0 0 1000 400" 
                        className="w-[85vw]"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#000000" />
                                <stop offset="50%" stopColor="#000000" />
                                <stop offset="100%" stopColor="#000000" />
                            </linearGradient>
                            <linearGradient 
                                id="shineGradient" 
                                ref={shineGradientRef}
                                x1="100%" 
                                y1="0%" 
                                x2="200%" 
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="20%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
                                <stop offset="80%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </linearGradient>
                            <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur1"/>
                                <feOffset in="blur1" dx="0" dy="6" result="offsetBlur1"/>
                                <feFlood floodColor="#000000" floodOpacity="0.25"/>
                                <feComposite in2="offsetBlur1" operator="in" result="shadow1"/>
                                <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur2"/>
                                <feFlood floodColor="#000000" floodOpacity="0.15"/>
                                <feComposite in2="blur2" operator="in" result="shadow2"/>
                                <feMerge>
                                    <feMergeNode in="shadow2"/>
                                    <feMergeNode in="shadow1"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        {}
                        <text
                            x="50%"
                            y="40%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="font-black uppercase"
                            filter="url(#textShadow)"
                            style={{
                                fontSize: '130px',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {chars.map((char, i) => (
                                <tspan
                                    key={i}
                                    ref={el => charsRef.current[i] = el}
                                    style={{
                                        stroke: '#0a0a0a',
                                        strokeWidth: '4',
                                        fill: 'url(#textGradient)',
                                        fillOpacity: 0,
                                        paintOrder: 'stroke fill'
                                    }}
                                >
                                    {char}
                                </tspan>
                            ))}
                        </text>
                        <text
                            x="50%"
                            y="40%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="font-black uppercase"
                            style={{
                                fontSize: '130px',
                                letterSpacing: '0.02em',
                                fill: 'url(#shineGradient)',
                                opacity: 1,
                                mixBlendMode: 'screen'
                            }}
                        >
                            {text}
                        </text>

                        {}
                        <text
                            x="50%"
                            y="70%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="font-bold uppercase"
                            style={{
                                fontSize: '42px',
                                letterSpacing: '0.8em',
                                fontWeight: 300
                            }}
                        >
                            {subChars.map((char, i) => (
                                <tspan
                                    key={i}
                                    ref={el => subCharsRef.current[i] = el}
                                    style={{
                                        stroke: '#000000',
                                        strokeWidth: '1',
                                        fill: '#000000',
                                        fillOpacity: 0,
                                        paintOrder: 'stroke fill'
                                    }}
                                >
                                    {char}
                                </tspan>
                            ))}
                        </text>
                    </svg>
                </div>

                {}
            </div>
        </div>
    );
};

export default InvitePage;
