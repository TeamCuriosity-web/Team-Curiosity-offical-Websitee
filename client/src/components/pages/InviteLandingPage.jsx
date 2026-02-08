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
    // Refs for character animations
    const charRefs = useRef([]); 

    const [phase, setPhase] = useState('0-init'); 
    const [envelopeOpen, setEnvelopeOpen] = useState(false);

    // Helper to push chars to refs
    const addToRefs = (el) => {
        if (el && !charRefs.current.includes(el)) {
            charRefs.current.push(el);
        }
    };

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
        const particleCount = 3000; // Good density for outline

        const envelopeWidth = 520;
        const envelopeHeight = 320;

        class Particle {
            constructor(i) {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 1.5 + 0.5;
                this.color = '#000000';
                
                // Calculate Outline Target
                // Distribute particles along the perimeter of the rect
                // Perimeter = 2(w+h)
                const perimeter = 2 * (envelopeWidth + envelopeHeight);
                const positionOnPerimeter = Math.random() * perimeter;

                if (positionOnPerimeter < envelopeWidth) {
                    // Top Edge
                    this.targetX = (canvas.width / 2) - (envelopeWidth/2) + positionOnPerimeter;
                    this.targetY = (canvas.height / 2) - (envelopeHeight/2);
                } else if (positionOnPerimeter < envelopeWidth + envelopeHeight) {
                    // Right Edge
                    this.targetX = (canvas.width / 2) + (envelopeWidth/2);
                    this.targetY = (canvas.height / 2) - (envelopeHeight/2) + (positionOnPerimeter - envelopeWidth);
                } else if (positionOnPerimeter < (envelopeWidth * 2) + envelopeHeight) {
                    // Bottom Edge
                    this.targetX = (canvas.width / 2) + (envelopeWidth/2) - (positionOnPerimeter - (envelopeWidth + envelopeHeight));
                    this.targetY = (canvas.height / 2) + (envelopeHeight/2);
                } else {
                    // Left Edge
                    this.targetX = (canvas.width / 2) - (envelopeWidth/2);
                    this.targetY = (canvas.height / 2) + (envelopeHeight/2) - (positionOnPerimeter - (envelopeWidth*2 + envelopeHeight));
                }
                
                this.baseX = this.targetX;
                this.baseY = this.targetY;
                this.active = false;
            }

            spawnAtText() {
                const textWidth = Math.min(window.innerWidth * 0.8, 1000);
                const textHeight = 200; 
                this.x = (canvas.width / 2) + (Math.random() - 0.5) * textWidth;
                this.y = (canvas.height / 2) + (Math.random() - 0.5) * textHeight;
                
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.active = true;
            }

            update() {
                if (!this.active) return;

                if (phase === '3-disintegrate') {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.98; // Friction for "floating" feel
                    this.vy *= 0.98;
                } 
                else if (phase === '4-vibrate') {
                    // Jitter in place
                    this.x += (Math.random() - 0.5) * 2;
                    this.y += (Math.random() - 0.5) * 2;
                }
                else if (phase === '5-outline') {
                    // Move to Outline Target
                    this.x += (this.targetX - this.x) * 0.08;
                    this.y += (this.targetY - this.y) * 0.08;
                }
                else if (phase === '6-envelope-active') {
                     // Keep them on the border perfectly
                     this.x = this.targetX;
                     this.y = this.targetY;
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
        for(let i=0; i<particleCount; i++) particles.push(new Particle(i));

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

        if (phase === '3-disintegrate') {
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
        
        // Ensure chars are visible first
        gsap.set(charRefs.current, { autoAlpha: 1 });

        // Phase 1: Fly In (One by One)
        // Come from "away" (z-axis or y/x axis with blur)
        tl.from(charRefs.current, {
            y: 100,
            x: () => (Math.random() - 0.5) * 200, // Random scatter
            rotation: () => (Math.random() - 0.5) * 90,
            opacity: 0,
            scale: 2,
            filter: 'blur(10px)',
            duration: 1.2,
            stagger: 0.05, // "One by one"
            ease: 'back.out(1.7)',
            onStart: () => setPhase('1-fly-in')
        });

        // Phase 2: Fill Effect (Stroke -> Solid)
        tl.to(charRefs.current, {
            color: '#000000',
            WebkitTextStrokeColor: '#000000',
            duration: 1.0,
            ease: 'power2.inOut',
            stagger: 0.02, // Fill wave
            onStart: () => setPhase('2-fill')
        });

        // Pause to read
        tl.to({}, { duration: 0.5 });

        // Phase 3: Disintegrate
        tl.to(textGroupRef.current, {
            opacity: 0,
            duration: 0.05, // Instant swap
            onStart: () => setPhase('3-disintegrate')
        });

        // Wait for particles to float a bit
        tl.to({}, { duration: 1.5 });

        // Phase 4: Vibrate
        tl.call(() => setPhase('4-vibrate'));
        tl.to({}, { duration: 1.0 }); // Vibrate for 1s

        // Phase 5: Form Outline
        tl.call(() => setPhase('5-outline'));
        tl.to({}, { duration: 2.0 }); // Time to travel to border

        // Phase 6: Fill Envelope Content
        tl.call(() => setPhase('6-envelope-active'));
        
        // Fade in the REAL envelope div (which has white bg, masking the particles behind or blending)
        // User said "Outline ... will fill with text etc"
        tl.fromTo(envelopeGroupRef.current,
            { opacity: 0, scale: 1 },
            { opacity: 1, duration: 1.0, ease: 'power2.inOut' }
        );

        // Float Animation
        gsap.to(envelopeGroupRef.current, {
            y: -10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 10 // Start floating later
        });

    }, { scope: containerRef });


    const handleOpenEnvelope = (e) => {
        if (envelopeOpen) return;
        setEnvelopeOpen(true);

        const tl = gsap.timeline();

         // 1. Pull Card OUT (Upwards)
         tl.to(cardRef.current, {
            y: -180, 
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out'
        });

        // 2. Drop Envelope
        tl.to(envelopeRef.current, { 
            y: 400, 
            opacity: 0, 
            duration: 0.5, 
            ease: 'power2.in' 
        }, "-=0.5");

        // 3. Center Card
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

    // Text splitting logic
    const renderText = (text, className) => (
        <span className={className}>
            {text.split('').map((char, i) => (
                <span 
                    key={i} 
                    ref={addToRefs} 
                    className="inline-block opacity-0 text-transparent relative" 
                    style={{ WebkitTextStroke: 'inherit' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex items-center justify-center overflow-hidden relative font-sans selection:bg-black selection:text-white">
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

            {/* --- INTRO TEXT LAYER --- */}
            <div ref={textGroupRef} className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-4">
                <div 
                    className="text-[10vw] md:text-[8rem] font-black tracking-tighter mb-4 text-center leading-[0.85] uppercase"
                    style={{ WebkitTextStroke: '2px black' }}
                >
                    {renderText("TEAM", "block")}
                    {renderText("CURIOSITY", "block")}
                </div>
                <div 
                    className="text-sm md:text-2xl font-light tracking-[0.2em] uppercase"
                    style={{ WebkitTextStroke: '1px black' }}
                >
                    {renderText("An Exclusive Platform", "block")}
                </div>
            </div>

            {/* --- ENVELOPE LAYER --- */}
            <div ref={envelopeGroupRef} className="relative z-50 opacity-0 flex items-center justify-center">
                
                {/* WHITE DOSSIER (The "Cover") */}
                <div 
                    ref={envelopeRef}
                    className="absolute w-[360px] md:w-[520px] h-[240px] md:h-[320px] bg-white shadow-2xl rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 z-50 flex flex-col items-center justify-center overflow-hidden border-2 border-black"
                    onClick={handleOpenEnvelope}
                >
                    {/* Top Flap Indicator */}
                    <div className="absolute top-0 w-full h-8 bg-gray-50 border-b-2 border-black flex items-center justify-center">
                         <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
                    </div>

                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 text-white shadow-lg mt-8">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-3xl tracking-[0.3em] font-black text-black mb-2">CONFIDENTIAL</h2>
                    <div className="h-px w-24 bg-black mb-4"></div>
                    <p className="text-[10px] text-gray-900 font-mono tracking-widest uppercase animate-pulse">
                        [ TAP TO EXTRACT INVITATION ]
                    </p>

                    {/* Corner Marks (The "Outline" anchor points visually) */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-black"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-black"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-black"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-black"></div>
                </div>

                {/* Card */}
                <div 
                    ref={cardRef}
                    className="w-[340px] md:w-[480px] bg-white rounded-xl p-8 md:p-12 text-center shadow-2xl border-2 border-gray-100 opacity-0 z-40 transform translate-y-4"
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
