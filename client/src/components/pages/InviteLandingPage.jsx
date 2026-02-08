import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, CheckCircle, ArrowRight, Shield, Globe } from 'lucide-react';
import Button from '../ui/Button';
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
    const [phase, setPhase] = useState('gathering'); // gathering, boom, envelope, open

    // Particle System
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = 150;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Start from edges
                if (Math.random() > 0.5) {
                    this.x = Math.random() > 0.5 ? 0 : canvas.width;
                } else {
                    this.y = Math.random() > 0.5 ? 0 : canvas.height;
                }
                
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 2;
                this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe'; // Neon Cyan / Neon Purple
            }

            update(targetX, targetY, speed) {
                // Move towards center (target)
                const dx = targetX - this.x;
                const dy = targetY - this.y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;

                // Add some jitter
                this.x += (Math.random() - 0.5) * 2;
                this.y += (Math.random() - 0.5) * 2;
            }

            draw() {
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
            ctx.fillStyle = 'rgba(0,0,0,0.1)'; // Trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                if (phase === 'gathering') {
                    p.update(canvas.width/2, canvas.height/2, 15); // Fast implosion
                } else if (phase === 'boom') {
                    // Explosion handled by GSAP flash, particles scatter
                    p.x += (Math.random()-0.5) * 50;
                    p.y += (Math.random()-0.5) * 50;
                } else {
                    // Floating
                    p.x += (Math.random()-0.5) * 0.5;
                    p.y += (Math.random()-0.5) * 0.5;
                }
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

        // Phase 1: Gathering (Handled by Canvas state)
        // Wait for particles to reach center
        tl.to({}, { duration: 2.0, onComplete: () => setPhase('boom') });

        // Phase 2: BOOM
        tl.to(containerRef.current, { 
            backgroundColor: '#ffffff', 
            duration: 0.1, 
            ease: 'power4.in',
            onComplete: () => setPhase('envelope')
        })
        .to(containerRef.current, { 
            backgroundColor: '#000000', 
            duration: 0.8,
            ease: 'power2.out'
        });

        // Phase 3: Envelope Materialization
        tl.fromTo(envelopeGroupRef.current, 
            { scale: 0, rotateY: 720, autoAlpha: 0 },
            { scale: 1, rotateY: 0, autoAlpha: 1, duration: 1.5, ease: 'back.out(1.2)' },
            "-=0.5"
        );
        
        // Float effect
        gsap.to(envelopeGroupRef.current, {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

    }, { scope: containerRef });

    const handleOpenEnvelope = () => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);
        setPhase('open');

        const tl = gsap.timeline();

        // 1. Zoom in
        tl.to(envelopeGroupRef.current, { scale: 1.2, duration: 0.5, ease: 'power2.in' });

        // 2. Open Flap (3D)
        tl.to(flapRef.current, { 
            rotateX: 180, 
            duration: 0.6, 
            ease: 'power2.inOut',
            transformOrigin: 'top' 
        });

        // 3. Card Flies Out
        tl.to(cardRef.current, {
            y: -250,
            zIndex: 50,
            duration: 0.6,
            ease: 'power2.out'
        });

        // 4. Card Focus (Full Screen Overlay effect)
        tl.to(cardRef.current, {
            y: 0,
            x: 0,
            scale: 1,
            rotateY: 360,
            position: 'fixed',
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            width: '90%',
            maxWidth: '500px',
            height: 'auto',
            duration: 1.2,
            ease: 'back.out(0.8)',
            boxShadow: '0 0 50px rgba(0, 243, 255, 0.5)'
        });

        // 5. Hide Envelope
        tl.to(envelopeRef.current, { autoAlpha: 0, duration: 0.3 }, "-=1.0");
        
        // 6. Reveal Content
        tl.fromTo(contentRef.current, 
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }
        );
    };

    const handleAccept = () => {
        // Warp Drive Effect
        gsap.to(cardRef.current, {
            scale: 10,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.in',
            onComplete: () => navigate(`/join?token=${token || ''}`)
        });
        
        // Flash screen white 
        gsap.to(containerRef.current, {
            backgroundColor: '#fff',
            duration: 0.5,
            delay: 0.4
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black flex items-center justify-center overflow-hidden perspective-1000 relative">
            {/* Fallback Background (if canvas fails or before load) */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0"></div>
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none mix-blend-screen" />
            
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            {/* Envelope Group */}
            <div ref={envelopeGroupRef} className="relative z-10 opacity-0">
                <div 
                    ref={envelopeRef}
                    className="relative w-80 h-52 bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(0,243,255,0.2)] cursor-pointer hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-shadow group"
                    onClick={handleOpenEnvelope}
                >
                    {/* Flap */}
                    <div 
                        ref={flapRef}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gray-800 origin-top z-30 border-b border-cyan-500/20"
                        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)', backfaceVisibility: 'hidden' }}
                    ></div>

                    {/* Seal */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-40 w-12 h-12 bg-black rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_cyan]">
                        <Shield size={20} className="text-cyan-400 animate-pulse" />
                    </div>
                
                    <div className="absolute inset-0 flex items-center justify-center pt-10">
                        <p className="font-mono text-[10px] text-cyan-500/50 tracking-[0.3em]">TOP SECRET</p>
                    </div>
                </div>

                {/* The Card */}
                <div 
                    ref={cardRef}
                    className="absolute top-0 left-0 w-full h-full bg-black/90 backdrop-blur-xl border border-cyan-500/50 rounded-lg p-8 flex flex-col items-center justify-center z-20 text-center shadow-2xl opacity-0"
                >
                    <div ref={contentRef} className="space-y-6">
                        <div className="flex justify-center">
                           <div className="w-16 h-16 rounded-full bg-cyan-900/20 flex items-center justify-center border border-cyan-500 box-[0_0_20px_cyan]">
                                <Globe className="text-cyan-400 animate-spin-slow" size={32} />
                           </div>
                        </div>
                        
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                Welcome Agent
                            </h1>
                            <p className="text-cyan-400 font-mono text-sm tracking-widest">CLEARANCE LEVEL: 5</p>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto font-mono">
                            The Council has been watching. Your skills have triggered our detection algorithms. 
                            We invite you to join <span className="text-white font-bold">Team Curiosity</span>.
                        </p>

                        <Button onClick={handleAccept} variant="primary" className="w-full py-4 text-sm font-bold tracking-[0.2em] border-cyan-500 hover:bg-cyan-900/20 shadow-[0_0_20px_cyan]">
                            ACCEPT MISSION
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* HUD Elements */}
            {!envelopeOpen && (
                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <p className="text-cyan-500/50 font-mono text-xs animate-pulse tracking-widest">
                        // SECURE UPLINK ESTABLISHED
                    </p>
                </div>
            )}
        </div>
    );
};

export default InviteLandingPage;
