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
    const mainTextRef = useRef(null);
    const subTextRef = useRef(null);
    const envelopeGroupRef = useRef(null);
    const envelopeRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);

    // Phases: 'text-intro' -> 'text-fill' -> 'disintegrate' -> 'coalesce' -> 'envelope' -> 'open'
    const [phase, setPhase] = useState('text-intro'); 
    const [envelopeOpen, setEnvelopeOpen] = useState(false);

    // --- Particle System ---
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        let particles = [];
        const particleCount = 4000; // Ultra Dense for high resolution

        class Particle {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = 0;
                this.color = '#000000';
                
                // Target: The Envelope Rectangle 
                const envelopeWidth = 500;
                const envelopeHeight = 300;
                this.targetX = (canvas.width / 2) + (Math.random() - 0.5) * envelopeWidth;
                this.targetY = (canvas.height / 2) + (Math.random() - 0.5) * envelopeHeight;
                
                this.active = false;
            }

            spawnAtText() {
                // Tighter text volume
                const textWidth = Math.min(window.innerWidth * 0.8, 1000);
                const textHeight = 200; 
                
                this.x = (canvas.width / 2) + (Math.random() - 0.5) * textWidth;
                this.y = (canvas.height / 2) + (Math.random() - 0.5) * textHeight;
                
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                
                // Small, crisp particles (sand/dust)
                this.size = Math.random() * 1.5 + 0.5;
                this.active = true;
            }

            update() {
                if (!this.active) return;

                if (phase === 'disintegrate') {
                    this.x += this.vx;
                    this.y += this.vy;
                    // Slow, drifting disintegration
                    this.vx *= 1.01; 
                    this.vy *= 1.01;
                } else if (phase === 'coalesce') {
                    // Snap to target
                    this.x += (this.targetX - this.x) * 0.05; 
                    this.y += (this.targetY - this.y) * 0.05;
                    
                    this.vx = 0;
                    this.vy = 0;
                }
            }

            draw() {
                if (!this.active || this.size < 0.1) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.size, this.size);
                ctx.fill();
            }
        }

        // Init Pool
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

        if (phase === 'disintegrate') {
            particles.forEach(p => p.spawnAtText());
        }

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [phase]);


    // --- GSAP Choreography ---
    useGSAP(() => {
        const tl = gsap.timeline();

         // Phase 1: Text Intro
        tl.fromTo(mainTextRef.current, 
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' }
        )
        .fromTo(subTextRef.current,
            { opacity: 0, letterSpacing: '0em' },
            { opacity: 1, letterSpacing: '0.5em', duration: 1.5, ease: 'power2.out' },
            "-=1.0"
        );

        // Phase 2: Fill Animation
        tl.to([mainTextRef.current, subTextRef.current], {
            color: '#000000', 
            WebkitTextStrokeColor: '#000000',
            duration: 1.5,
            ease: 'power2.inOut',
            onStart: () => setPhase('text-fill')
        })
        .to({}, { duration: 0.5 });

        // Phase 3: Disintegrate
        // Shake before break
        tl.to(textGroupRef.current, {
            x: "+=5", 
            yoyo: true, 
            repeat: 5, 
            duration: 0.05
        })
        .to(textGroupRef.current, {
            opacity: 0,
            scale: 1.05,
            duration: 0.05, // SNAP
            ease: 'none',
            onStart: () => setPhase('disintegrate') 
        });

        // Phase 4: Coalesce
        tl.to({}, { duration: 1.5, onStart: () => setPhase('coalesce') }); 

        // Phase 5: Materialize
        tl.call(() => {
            if (canvasRef.current) canvasRef.current.style.opacity = 0;
            setPhase('envelope');
        });

        tl.fromTo(envelopeGroupRef.current, 
            { scale: 1, opacity: 0 }, 
            { 
                opacity: 1,
                duration: 0.01,
                immediateRender: false
            }
        );
        
        // Float
        gsap.to(envelopeGroupRef.current, {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 4.0 
        });

    }, { scope: containerRef });


    const handleOpenEnvelope = (e) => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);
        setPhase('open');

        const tl = gsap.timeline();

        // 1. Pull Card OUT (Upwards)
        tl.to(cardRef.current, {
            y: -150, // Accurately slide out of the top
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
        });

        // 2. Drop Envelope Down
        tl.to(envelopeRef.current, { 
            y: 300, 
            opacity: 0, 
            duration: 0.5, 
            ease: 'power2.in' 
        }, "-=0.4");

        // 3. Center and Expand Card
        tl.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)'
        });

        tl.fromTo(contentRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }
        );
    };

    const handleAccept = () => {
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => navigate(`/join?token=${token || ''}`)
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex items-center justify-center overflow-hidden relative font-sans selection:bg-black selection:text-white">
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-75" />

            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* --- INTRO TEXT LAYER --- */}
            <div ref={textGroupRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-4">
                <h1 
                    ref={mainTextRef}
                    className="text-[12vw] md:text-[10rem] font-black tracking-tighter text-transparent mb-4 text-center leading-[0.85] uppercase"
                    style={{ WebkitTextStroke: '2px black' }}
                >
                    TEAM<br />CURIOSITY
                </h1>
                <p 
                    ref={subTextRef}
                    className="text-sm md:text-2xl font-light tracking-[0.2em] text-transparent uppercase"
                    style={{ WebkitTextStroke: '1px black' }}
                >
                    An Exclusive Platform
                </p>
            </div>

            {/* --- ENVELOPE LAYER --- */}
            <div ref={envelopeGroupRef} className="relative z-50 opacity-0 flex items-center justify-center">
                
                {/* BLACK DOSSIER (The "Cover") */}
                <div 
                    ref={envelopeRef}
                    className="absolute w-[360px] md:w-[520px] h-[240px] md:h-[320px] bg-[#0a0a0a] shadow-2xl rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 z-50 flex flex-col items-center justify-center overflow-hidden border-t border-gray-800"
                    onClick={handleOpenEnvelope}
                >
                    {/* Top Flap Indicator */}
                    <div className="absolute top-0 w-full h-2 bg-gray-800"></div>

                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white border border-white/10 backdrop-blur-sm">
                        <Lock size={28} />
                    </div>
                    <h2 className="text-3xl tracking-[0.3em] font-bold text-white mb-2">CONFIDENTIAL</h2>
                    <div className="h-px w-24 bg-gray-700 mb-4"></div>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase animate-pulse">
                        [ TAP TO EXTRACT FILE ]
                    </p>

                    {/* Corner Marks */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-gray-600"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-gray-600"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-gray-600"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-gray-600"></div>
                </div>

                {/* Card (Starts Hidden BEHIND the cover, or physically slightly inside) */}
                <div 
                    ref={cardRef}
                    className="w-[340px] md:w-[480px] bg-white rounded-xl p-8 md:p-12 text-center shadow-2xl border border-gray-100 opacity-0 z-40 transform translate-y-4"
                >
                    <div ref={contentRef}>
                        <div className="mb-8 flex justify-center">
                            <Terminal size={40} className="text-black" />
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">WELCOME.</h1>
                        
                        <div className="space-y-4 text-left max-w-sm mx-auto mb-10">
                            <p className="text-lg text-gray-900 leading-snug font-medium">
                                You have been selected.
                            </p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                This is your private key to Team Curiosity. Access is limited to verified candidates only.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200 flex items-center justify-between text-xs font-mono">
                            <span className="text-gray-500">ID: A-{Math.floor(Math.random()*1000)}</span>
                            <span className="flex items-center gap-2 text-black font-bold">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                ACTIVE
                            </span>
                        </div>

                        <Button onClick={handleAccept} variant="black" className="w-full py-5 text-sm font-bold tracking-[0.2em] bg-black text-white hover:bg-gray-800 transition-all hover:scale-[1.02]">
                            ENTER PLATFORM
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InviteLandingPage;
