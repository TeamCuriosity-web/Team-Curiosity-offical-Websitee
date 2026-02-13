import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ReflectiveTypePage = () => {
    const textRef = useRef(null);
    const shineRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            gsap.set(textRef.current, { opacity: 0, scale: 0.96 });
            gsap.set(shineRef.current, { x: '-100%' });

            const tl = gsap.timeline({ delay: 0.3 });

            
            tl.to(textRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out'
            });

            
            tl.to(shineRef.current, {
                x: '100%',
                duration: 2,
                ease: 'power2.inOut'
            }, '+=0.3');

        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center overflow-hidden">
            <div className="relative" style={{ width: '75vw' }}>
                <h1 
                    ref={textRef}
                    className="text-[12vw] font-bold tracking-tight text-center uppercase leading-none relative overflow-hidden"
                    style={{
                        color: '#1a1a1a',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
                    }}
                >
                    Team Curiosity
                    
                    {}
                    <span 
                        ref={shineRef}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                            WebkitMaskClip: 'text',
                            maskImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                            maskClip: 'text'
                        }}
                    />
                </h1>
            </div>
        </div>
    );
};

export default ReflectiveTypePage;
