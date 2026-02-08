import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, CheckCircle, ArrowRight, Shield, Globe, Terminal, Lock } from 'lucide-react';
import Button from '../ui/Button';

const InviteLandingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const envelopeGroupRef = useRef(null);
    const envelopeRef = useRef(null);
    const cardRef = useRef(null);
    const flapRef = useRef(null);
    const contentRef = useRef(null);
    
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [phase, setPhase] = useState('gathering'); // phases: scattering -> gathering -> morphed

    // Particle System (Dark Particles on White)
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = 300; // More particles for density

        class Particle {
            constructor() {
                // Start ANYWHERE on screen
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 1.5 + 0.5;
                this.color = '#111827'; // Dark Gray
                this.targetX = canvas.width / 2;
                this.targetY = canvas.height / 2;
                // SLOW speed
                this.speed = Math.random() * 0.008 + 0.002; 
            }

            update() {
                if (phase === 'gathering') {
                    // Ease towards center very slowly
                    this.x += (this.targetX - this.x) * this.speed;
                    this.y += (this.targetY - this.y) * this.speed;
                } else if (phase === 'morphed') {
                    // Quick fade
                    this.size *= 0.8; 
                }
            }

            draw() {
                if (this.size < 0.1) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Init
        for(let i=0; i<particleCount; i++) particles.push(new Particle());

        // Animation Loop
        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => cancelAnimationFrame(animationId);
    }, [phase]);


    // GSAP Sequence
    useGSAP(() => {
        const tl = gsap.timeline();

         // Phase 1: Gathering Particles
         // Slower duration for the "slowly" effect
        tl.to({}, { duration: 4.0, onComplete: () => setPhase('morphed') });

        // Phase 2: Morph into Envelope
        tl.fromTo(envelopeGroupRef.current, 
            { scale: 0, autoAlpha: 1 }, 
            { 
                scale: 1, 
                duration: 1.2, 
                ease: 'power3.inOut', 
                immediateRender: true
            },
            "-=0.5" 
        );
        
        // Continuous Float effect
        gsap.to(envelopeGroupRef.current, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.0
        });

    }, { scope: containerRef });

    const handleOpenEnvelope = (e) => {
        e.stopPropagation();
        if (envelopeOpen) return;
        setEnvelopeOpen(true);

        const tl = gsap.timeline();

        // 1. Envelope slides down out of view
        tl.to(envelopeRef.current, { 
            y: 300, 
            opacity: 0,
            duration: 0.8, 
            ease: 'power2.in' 
        });

        // 2. Card Emerges (stays in place, envelope falls away)
        tl.fromTo(cardRef.current,
            { y: 0, scale: 0.9, opacity: 0 },
            {
                y: 0,
                scale: 1,
                opacity: 1,
                zIndex: 60,
                duration: 1.0,
                ease: 'back.out(1.2)',
                delay: -0.6
            }
        );
        
        // 3. Reveal Content
        tl.fromTo(contentRef.current, 
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }
        );
    };

    const handleAccept = () => {
        gsap.to(cardRef.current, {
            scale: 1.1,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => navigate(`/join?token=${token || ''}`)
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden perspective-1000 relative font-sans">
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            
            {/* Elegant Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>

            {/* Scale Wrapper for centering */}
            <div ref={envelopeGroupRef} className="relative z-50 opacity-0 will-change-transform pointer-events-auto flex items-center justify-center">
                
                {/* --- The Envelope (Sleeve Style) --- */}
                <div 
                    ref={envelopeRef}
                    className="absolute w-[500px] h-[300px] bg-white shadow-2xl rounded-sm cursor-pointer hover:shadow-xl transition-shadow duration-500 overflow-hidden flex flex-col items-center justify-center z-40 border border-gray-100"
                    onClick={handleOpenEnvelope}
                >
                   {/* Decorative Stripe */}
                   <div className="absolute top-0 left-0 w-2 h-full bg-black"></div>
                   
                   {/* Center Content */}
                   <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                            <Lock size={24} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-light tracking-[0.2em] text-gray-800 uppercase">Invitation</h2>
                        <p className="text-xs text-gray-400 font-mono tracking-widest">PRIVATE & CONFIDENTIAL</p>
                   </div>

                   {/* Bottom Edge */}
                    <div className="absolute bottom-6 text-[10px] text-gray-300 tracking-[0.5em] animate-pulse">
                        CLICK TO ACCESS
                    </div>
                </div>

                {/* --- The Invite Card (Hidden initially behind/inside) --- */}
                <div 
                    ref={cardRef}
                    className="w-[450px] bg-white rounded-lg p-10 flex flex-col items-center justify-center z-20 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 relative"
                >
                    <div ref={contentRef} className="space-y-8 w-full">
                        {/* Header */}
                        <div className="border-b border-gray-100 pb-6 w-full">
                             <div className="flex items-center justify-center gap-2 mb-2">
                                 <Terminal size={14} className="text-black" />
                                 <span className="text-xs font-bold uppercase tracking-widest text-black">System Notification</span>
                             </div>
                             <h1 className="text-5xl font-bold text-black tracking-tighter">
                                HELLO.
                             </h1>
                        </div>

                        {/* Body */}
                        <div className="text-left space-y-4">
                            <p className="text-lg text-gray-600 font-light leading-relaxed">
                                You have been selected. This is not a coincidence.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                <strong>Team Curiosity</strong> is identifying exceptional individuals for an upcoming initiative. Your profile matched our criteria.
                            </p>
                        </div>

                        {/* Footer / Action */}
                        <div className="pt-4">
                            <Button onClick={handleAccept} variant="black" className="w-full py-5 text-sm font-bold tracking-[0.2em] bg-black text-white hover:bg-gray-800 transition-all hover:scale-[1.02]">
                                ACCEPT INVITATION
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default InviteLandingPage;
