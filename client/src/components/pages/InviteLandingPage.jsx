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
    const textGroupRef = useRef(null);
    const envelopeGroupRef = useRef(null);
    const envelopeRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    // Phases: 'text' -> 'disintegrate' -> 'coalesce' -> 'envelope' -> 'open'
    const [phase, setPhase] = useState('text'); 
    const [envelopeOpen, setEnvelopeOpen] = useState(false);

    // --- Particle System ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = 800; // Dense for text simulation

        class Particle {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = 0;
                this.color = '#111827';
                this.targetX = canvas.width / 2;
                this.targetY = canvas.height / 2;
                this.active = false;
            }

            spawnAtText() {
                // Approximate text area (Center screen rectangle)
                // Width ~600px, Height ~200px
                this.x = (canvas.width / 2) + (Math.random() - 0.5) * 600;
                this.y = (canvas.height / 2) + (Math.random() - 0.5) * 150;
                
                // Random velocity for breakdown
                this.vx = (Math.random() - 0.5) * 4;
                this.vy = (Math.random() - 0.5) * 4;
                
                this.size = Math.random() * 2;
                this.active = true;
            }

            update() {
                if (!this.active) return;

                if (phase === 'disintegrate') {
                    // Explode outward slightly
                    this.x += this.vx;
                    this.y += this.vy;
                    // Friction
                    this.vx *= 0.95;
                    this.vy *= 0.95;
                } else if (phase === 'coalesce') {
                    // Move to center (Envelope position)
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    this.x += dx * 0.08;
                    this.y += dy * 0.08;
                    
                    // Shrink on arrival
                    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
                        this.size *= 0.8;
                    }
                }
            }

            draw() {
                if (!this.active || this.size < 0.1) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Init Pool
        for(let i=0; i<particleCount; i++) particles.push(new Particle());

        // Animation Loop
        let animationId;
        const animate = () => {
             // Trail effect for motion blur feel? No, keep clean.
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        // Trigger Spawning logic based on Phase
        if (phase === 'disintegrate') {
            particles.forEach(p => p.spawnAtText());
        }

        return () => cancelAnimationFrame(animationId);
    }, [phase]);


    // --- GSAP Choreography ---
    useGSAP(() => {
        const tl = gsap.timeline();

         // Phase 1: Text Intro
        tl.fromTo(textGroupRef.current, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
        )
        .to(textGroupRef.current, { 
            duration: 1.5, // Hold time
            onComplete: () => setPhase('disintegrate') 
        })
        
        // Phase 2: Text Disintegrate (Visual)
        .to(textGroupRef.current, {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)',
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => setPhase('coalesce')
        });

        // Phase 3: Coalesce (Wait for Canvas particles to converge)
        tl.to({}, { duration: 1.2 }); // Wait for particles to fly to center

        // Phase 4: Envelope Form
        tl.fromTo(envelopeGroupRef.current, 
            { scale: 0, autoAlpha: 1 }, 
            { 
                scale: 1, 
                duration: 0.6, 
                ease: 'back.out(1.5)', 
                onStart: () => setPhase('envelope') // Stop particles
            }
        );
        
        // Float
        gsap.to(envelopeGroupRef.current, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 4.5 
        });

    }, { scope: containerRef });


    const handleOpenEnvelope = (e) => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);
        setPhase('open');

        const tl = gsap.timeline();

        // Sleeve slides down
        tl.to(envelopeRef.current, { 
            y: 200, 
            opacity: 0, 
            duration: 0.6, 
            ease: 'power2.in' 
        });

        // Card Scales Up
        tl.fromTo(cardRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
            "-=0.4"
        );

        // Content Staggers
        tl.fromTo(contentRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }
        );
    };

    const handleAccept = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => navigate(`/join?token=${token || ''}`)
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden relative font-sans selection:bg-black selection:text-white">
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

            {/* Grid Pattern */}
             <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* --- INTRO TEXT LAYER --- */}
            <div ref={textGroupRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-4 text-center leading-none">
                    TEAM<br />CURIOSITY
                </h1>
                <p className="text-sm md:text-xl font-light tracking-[0.5em] text-gray-500 uppercase">
                    An Exclusive Platform
                </p>
            </div>

            {/* --- ENVELOPE LAYER --- */}
            <div ref={envelopeGroupRef} className="relative z-50 opacity-0 flex items-center justify-center">
                {/* Sleeve */}
                <div 
                    ref={envelopeRef}
                    className="absolute w-[350px] md:w-[500px] h-[220px] md:h-[300px] bg-white shadow-2xl rounded-sm cursor-pointer hover:shadow-xl transition-shadow duration-300 z-40 border border-gray-100 flex flex-col items-center justify-center"
                    onClick={handleOpenEnvelope}
                >
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-xl tracking-[0.2em] font-medium text-gray-800">INVITATION</h2>
                    
                    <div className="absolute bottom-4 text-[10px] text-gray-400 tracking-[0.3em] animate-pulse">
                        TAP TO DECRYPT
                    </div>
                </div>

                {/* Card */}
                <div 
                    ref={cardRef}
                    className="w-[320px] md:w-[450px] bg-white rounded-xl p-8 md:p-12 text-center shadow-2xl border border-gray-100 opacity-0 z-50"
                >
                    <div ref={contentRef}>
                        <div className="mb-6 flex justify-center">
                            <Terminal size={32} className="text-black" />
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">WELCOME AGENT</h1>
                        <div className="h-1 w-12 bg-black mx-auto mb-6"></div>

                        <p className="text-gray-600 mb-8 leading-relaxed font-light">
                            Your digital footprint has been analyzed. You have been selected to join the initiative.
                        </p>

                        <div className="bg-gray-50 p-4 rounded mb-8 border border-gray-100 text-left text-xs font-mono text-gray-500">
                            <p>> User: CANDIDATE_#{Math.floor(Math.random() * 9999)}</p>
                            <p>> Status: <span className="text-green-600">APPROVED</span></p>
                            <p>> Access: GRANTED</p>
                        </div>

                        <Button onClick={handleAccept} variant="black" className="w-full py-4 text-sm font-bold tracking-[0.2em] bg-black text-white hover:scale-[1.02] transition-transform">
                            ENTER PLATFORM
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InviteLandingPage;
