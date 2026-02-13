import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const GiftPacket = ({ onOpen }) => {
    const packetRef = useRef(null);
    const leftFlapRef = useRef(null);
    const rightFlapRef = useRef(null);
    
    
    const vRibbonRef = useRef(null);
    const hRibbonLeftRef = useRef(null);
    const hRibbonRightRef = useRef(null);
    const bowRef = useRef(null);
    
    
    const onRibbonUntieRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            gsap.set(packetRef.current, { scale: 0, opacity: 0, rotate: -10 });
            gsap.to(packetRef.current, {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.75)"
            });

            
            const untie = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        
                        const flapTl = gsap.timeline({ onComplete: () => { if(onOpen) onOpen(); } });
                        flapTl.to([leftFlapRef.current, rightFlapRef.current], {
                            x: (i) => i === 0 ? -150 : 150, 
                            rotationY: (i) => i === 0 ? -90 : 90,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power2.inOut"
                        })
                        .to(packetRef.current, {
                            scale: 1.2,
                            opacity: 0,
                            duration: 0.5
                        }, "-=0.5");
                    }
                });

                
                
                tl.to(bowRef.current, {
                    rotation: 15,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 5,
                    ease: "sine.inOut"
                })
                .to(bowRef.current, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.in(1.7)"
                })
                
                .to(vRibbonRef.current, {
                    scaleY: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                }, "-=0.3")
                
                .to([hRibbonLeftRef.current, hRibbonRightRef.current], {
                    scaleX: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                }, "<");
            };
            
            onRibbonUntieRef.current = untie;

        }, packetRef);

        return () => ctx.revert();
    }, [onOpen]);

    return (
        <div 
            className="absolute inset-0 flex items-center justify-center z-50 overflow-visible"
            style={{ perspective: '1000px' }}
        >
            <div 
                ref={packetRef}
                className="relative transition-transform"
                style={{ width: '300px', height: '400px' }}
            >
                {}
                <div 
                    ref={leftFlapRef}
                    className="absolute inset-y-0 left-0 w-1/2 rounded-l-lg bg-white shadow-xl overflow-hidden origin-right"
                    style={{ 
                        background: 'linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.05), 10px 0 20px rgba(0,0,0,0.1)',
                        zIndex: 1
                    }}
                >
                     <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                     {}
                     <div ref={hRibbonLeftRef} className="absolute top-1/2 left-0 right-0 h-8 bg-red-600 shadow-sm origin-left" style={{ marginTop: '-16px' }} />
                </div>

                {}
                <div 
                    ref={rightFlapRef}
                    className="absolute inset-y-0 right-0 w-1/2 rounded-r-lg bg-white shadow-xl overflow-hidden origin-left"
                    style={{ 
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.05), -10px 0 20px rgba(0,0,0,0.1)',
                        zIndex: 1
                    }}
                >
                     <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                     {}
                     <div ref={hRibbonRightRef} className="absolute top-1/2 left-0 right-0 h-8 bg-red-600 shadow-sm origin-right" style={{ marginTop: '-16px' }} />
                </div>
                
                {}
                <div 
                    ref={vRibbonRef}
                    className="absolute top-0 bottom-0 left-1/2 w-8 bg-red-600 shadow-lg origin-center z-10" 
                    style={{ marginLeft: '-16px' }}
                />

                {}
                <div 
                    ref={bowRef}
                    onClick={() => onRibbonUntieRef.current && onRibbonUntieRef.current()}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-110 transition-transform"
                >
                    {}
                    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http:
                        <path d="M50 50 C30 20 0 20 0 50 C0 80 30 80 50 50" fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
                        <path d="M50 50 C70 20 100 20 100 50 C100 80 70 80 50 50" fill="#EF4444" stroke="#B91C1C" strokeWidth="2"/>
                        <circle cx="50" cy="50" r="10" fill="#B91C1C" />
                        <path d="M50 60 L30 90 L40 95 L50 60" fill="#EF4444" />
                        <path d="M50 60 L70 90 L60 95 L50 60" fill="#EF4444" />
                    </svg>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                         <span className="text-black text-[10px] tracking-widest font-light bg-white/80 px-2 py-1 rounded shadow-sm border border-black/10">TAP TO UNTIE</span>
                    </div>
                </div>
            </div>
            
            {}
            <div className="absolute bottom-20 text-center animate-pulse opacity-50 pointer-events-none">
                <span className="text-black text-xs tracking-[0.2em] font-light">
                    TAP TO UNTIE RIBBON
                </span>
            </div>
        </div>
    );
};

export default GiftPacket;
