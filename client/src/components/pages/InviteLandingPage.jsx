import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const InviteLandingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const containerRef = useRef(null);
    const envelopeRef = useRef(null);
    const cardRef = useRef(null);
    const flapRef = useRef(null);
    const particlesRef = useRef(null);
    
    const [envelopeOpen, setEnvelopeOpen] = useState(false);

    // Initial Particle Explosion & Envelope Entrance
    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Particle Boom (Simulated with simple divs for performance)
        // We'll create particles dynamically in the DOM for this effect or just use a staggered scale-in of background elements
        // For "Boom", let's use a flash and expanding circles
        
        tl.set(envelopeRef.current, { scale: 0, autoAlpha: 0 });
        
        // Flash
        tl.to(containerRef.current, { backgroundColor: '#ffffff', duration: 0.1, ease: 'power4.in' })
          .to(containerRef.current, { backgroundColor: '#000000', duration: 0.5 });

        // Particles (Simulated by simple background divs in CSS for now, or we animate them here)
        // Let's keep it simple but punchy: Text "INCOMING TRANSMISSION" glitching in
        
        // 2. Envelope Entrance
        tl.to(envelopeRef.current, { 
            scale: 1, 
            autoAlpha: 1, 
            duration: 1.5, 
            ease: 'elastic.out(1, 0.5)',
            delay: 0.2
        });

    }, { scope: containerRef });

    const handleOpenEnvelope = () => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);

        const tl = gsap.timeline();

        // 1. Open Flap
        tl.to(flapRef.current, { 
            rotateX: 180, 
            duration: 0.6, 
            ease: 'power2.inOut',
            transformOrigin: 'top' 
        });

        // 2. Pull Card Out
        tl.to(cardRef.current, {
            y: -150,
            zIndex: 50,
            duration: 0.8,
            ease: 'power2.out'
        });

        // 3. Card Scale Up & Center
        tl.to(cardRef.current, {
            y: 0,
            scale: 1.5,
            zIndex: 100,
            position: 'fixed',
            top: '50%',
            left: '50%',
            x: '-50%',
            yPercent: -50,
            duration: 1,
            ease: 'back.out(1.2)'
        });
        
        // 4. Fade out envelope
        tl.to(envelopeRef.current, { autoAlpha: 0, duration: 0.5 }, "-=0.8");
    };

    const handleAccept = () => {
        // Explode card and navigate
        gsap.to(cardRef.current, {
            scale: 5,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                 navigate(`/join?token=${token || ''}`);
            }
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center overflow-hidden perspective-1000">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            {/* Envelope Container */}
            <div 
                ref={envelopeRef} 
                className="relative w-80 h-52 bg-gray-900 rounded-b-lg shadow-2xl cursor-pointer group z-10"
                onClick={handleOpenEnvelope}
            >
                {/* Envelope Body */}
                <div className="absolute inset-0 bg-gray-800 rounded-b-lg border-2 border-gray-700 z-20 overflow-hidden flex items-end justify-center pb-4">
                     <span className="text-gray-500 font-mono text-xs tracking-widest group-hover:text-white transition-colors">
                        {envelopeOpen ? "" : "CLICK TO DECRYPT"}
                     </span>
                </div>
                
                {/* Top Flap */}
                <div 
                    ref={flapRef}
                    className="absolute top-0 left-0 w-full h-1/2 bg-gray-700 origin-top z-30 transition-colors border-t-2 border-l-2 border-r-2 border-gray-600"
                    style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
                ></div>

                {/* The Letter/Card */}
                <div 
                    ref={cardRef}
                    className="absolute left-4 right-4 bottom-4 bg-white text-black p-6 rounded shadow-lg transform origin-center flex flex-col items-center text-center will-change-transform"
                    style={{ height: '180px' }} 
                >
                    <div className="mb-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                        <Mail size={20} />
                    </div>
                    <h2 className="text-xl font-black uppercase mb-1">Classified Invite</h2>
                    <p className="text-xs text-gray-500 font-mono mb-4 leading-relaxed">
                        You have been selected to join the Team Curiosity Network. Your skills are required for upcoming operations.
                    </p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAccept(); }}
                        className="mt-auto w-full py-2 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center justify-center gap-2"
                    >
                        Accept Mission <ArrowRight size={12} />
                    </button>
                </div>
            </div>
            
            {/* Introduction Text - Fades out */}
            {!envelopeOpen && (
                 <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                     <p className="text-gray-500 font-mono text-xs animate-pulse">SECURE CONNECTION ESTABLISHED</p>
                 </div>
            )}
        </div>
    );
};

export default InviteLandingPage;
