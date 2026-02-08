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
        const particleCount = 1500; // Denser for text

        class Particle {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = 0;
                this.color = '#000000';
                
                // Target: The Envelope Rectangle (approx 500x300)
                const envelopeWidth = 500;
                const envelopeHeight = 300;
                this.targetX = (canvas.width / 2) + (Math.random() - 0.5) * envelopeWidth;
                this.targetY = (canvas.height / 2) + (Math.random() - 0.5) * envelopeHeight;
                
                this.active = false;
            }

            spawnAtText() {
                // Tighter text volume for "TEAM CURIOSITY"
                const textWidth = Math.min(window.innerWidth * 0.8, 1000);
                const textHeight = window.innerWidth < 768 ? 100 : 250; 
                
                this.x = (canvas.width / 2) + (Math.random() - 0.5) * textWidth;
                this.y = (canvas.height / 2) + (Math.random() - 0.5) * textHeight;
                
                // Low velocity start
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                
                this.size = Math.random() * 2 + 1.5;
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
                    this.x += (this.targetX - this.x) * 0.05; // Slower snap too
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

        // Phase 3: Disintegrate (VERY SLOW)
        tl.to(textGroupRef.current, {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(5px)',
            duration: 4.0, // Extended duration
            ease: 'power1.in',
            onStart: () => setPhase('disintegrate') 
        });

        // Phase 4: Coalesce
        tl.to({}, { duration: 2.0, onStart: () => setPhase('coalesce') }); 

        // Phase 5: Materialize (No Flash, just smooth transformation)
        tl.to(canvasRef.current, { 
            opacity: 0, 
            duration: 0.5, 
            ease: 'power2.in' 
        }, "+=0.1"); // Wait slightly for particles to settle

        tl.fromTo(envelopeGroupRef.current, 
            { scale: 1, opacity: 0 }, 
            { 
                opacity: 1,
                duration: 0.8, 
                ease: 'power2.inOut',
                onStart: () => setPhase('envelope') 
            },
            "-=0.5" // Overlap with particle fade out
        );
        
        // Float
        gsap.to(envelopeGroupRef.current, {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 5.5 // Delay start of float until after sequence
        });

    }, { scope: containerRef });


    const handleOpenEnvelope = (e) => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);
        setPhase('open');

        const tl = gsap.timeline();

        // Reveal Card
        tl.to(envelopeRef.current, { 
            y: 300, 
            opacity: 0, 
            duration: 0.6, 
            ease: 'power2.in' 
        });

        tl.fromTo(cardRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
            "-=0.4"
        );

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
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

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
                <div 
                    ref={envelopeRef}
                    className="absolute w-[350px] md:w-[500px] h-[220px] md:h-[300px] bg-white shadow-2xl rounded-sm cursor-pointer hover:shadow-xl transition-shadow duration-300 z-40 border border-gray-100 flex flex-col items-center justify-center"
                    onClick={handleOpenEnvelope}
                >
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 text-white shadow-lg">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl tracking-[0.3em] font-light text-gray-900 border-b border-gray-200 pb-2 mb-2">INVITATION</h2>
                    <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Tap to Decrypt</p>
                </div>

                {/* Card */}
                <div 
                    ref={cardRef}
                    className="w-[340px] md:w-[500px] bg-white rounded-2xl p-8 md:p-12 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 opacity-0 z-50"
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
