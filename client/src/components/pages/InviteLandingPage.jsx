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

    // --- AUDIO SYNTHESIS ENGINE (No Assets Needed) ---
    const playSound = (type) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (type === 'break') {
            // High pitch snap
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }
        else if (type === 'slide') {
            // White Noise for paper slide
            const bufferSize = ctx.sampleRate * 0.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        }
    };
    
    // Helper to push chars to refs
    const addToRefs = (el) => {
        if (el && !charRefs.current.includes(el)) {
            charRefs.current.push(el);
        }
    };

    // Refs for state persistence to avoid re-running effects
    const particlesRef = useRef([]);
    const phaseRef = useRef('0-init');
    
    // Sync ref with state
    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

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

        // Initialize particles ONCE
        const particleCount = 5000; 
        const envelopeWidth = 520;
        const envelopeHeight = 320;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        class Particle {
            constructor(i) {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 1.5 + 0.5;
                this.color = '#000000';
                
                // --- TARGETING LOGIC: FILL & CONTENT (Borderless) ---
                const shapeType = Math.random();

                if (shapeType < 0.6) {
                    // 60% - FILL THE RECTANGLE (Mass, not Border)
                    // Particles scattered inside the envelope area
                    this.targetX = centerX + (Math.random() - 0.5) * envelopeWidth;
                    this.targetY = centerY + (Math.random() - 0.5) * envelopeHeight;
                } 
                else if (shapeType < 0.75) {
                    // 15% - Lock Circle (Center)
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 35 * Math.sqrt(Math.random()); // Solid circle fill
                    this.targetX = centerX + Math.cos(angle) * (35 * Math.random()); // Filled circle
                    this.targetY = centerY - 40 + Math.sin(angle) * (35 * Math.random());
                }
                else if (shapeType < 0.9) {
                    // 15% - Text Blocks
                    const lineIndex = Math.floor(Math.random() * 3);
                    const lineWidth = 200;
                    this.targetX = centerX + (Math.random() - 0.5) * lineWidth;
                    this.targetY = centerY + 20 + (lineIndex * 15); 
                }
                else {
                    // 10% - Flap Crease (Shadow line)
                    this.targetX = centerX + (Math.random() - 0.5) * envelopeWidth;
                    this.targetY = centerY - (envelopeHeight/2) + 40;
                }
                
                this.baseX = this.targetX;
                this.baseY = this.targetY;
                this.active = false;
            }

            spawnAtText() {
                const textWidth = Math.min(window.innerWidth * 0.8, 1000);
                const textHeight = 200; 
                this.x = centerX + (Math.random() - 0.5) * textWidth;
                this.y = centerY + (Math.random() - 0.5) * textHeight;
                
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.active = true;
            }

            update() {
                if (!this.active) return;
                
                const currentPhase = phaseRef.current;

                if (currentPhase === '3-disintegrate') {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vx *= 0.98;
                    this.vy *= 0.98;
                } 
                else if (currentPhase === '4-vibrate') {
                    this.x += (Math.random() - 0.5) * 2;
                    this.y += (Math.random() - 0.5) * 2;
                }
                else if (currentPhase === '5-outline') {
                    this.x += (this.targetX - this.x) * 0.08;
                    this.y += (this.targetY - this.y) * 0.08;
                }
                else if (currentPhase === '6-envelope-active') {
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

        // Only init if empty
        if (particlesRef.current.length === 0) {
            for(let i=0; i<particleCount; i++) particlesRef.current.push(new Particle(i));
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesRef.current.forEach(p => {
                // Check if we need to spawn (only once per particle conceptually, but simplified here)
                if (phaseRef.current === '3-disintegrate' && !p.active) {
                     p.spawnAtText();
                }
                
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, []); // Empty dependency array = PERMANENT LOOP


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
        // Shake before break
        tl.to(textGroupRef.current, {
            x: "+=5", 
            yoyo: true, 
            repeat: 5, 
            duration: 0.05
        })
        .to(textGroupRef.current, {
            opacity: 0,
            scale: 1.1, // Slight expansion
            filter: 'blur(4px)', // Smooth dissolve
            duration: 0.4, // SMOOTHER (was 0.05)
            ease: 'power2.in',
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

        // Phase 6: Fill Envelope Content / Materialize
        tl.call(() => setPhase('6-envelope-active'));
        
        // Fade in the REAL envelope div
        tl.fromTo(envelopeGroupRef.current,
            { opacity: 0, scale: 1 },
            { opacity: 1, duration: 1.0, ease: 'power2.inOut' }
        );

        // SMOOTH TRANSITION: Fade out particles AS envelope appears
        // This removes the "particle border" seamlessly
        tl.to(canvasRef.current, {
            opacity: 0,
            duration: 1.0,
            ease: 'power2.inOut'
        }, "<"); // "<" syncs start time with previous tween

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

    const flapRef = useRef(null);

    // Interaction States
    const [interactionPhase, setInteractionPhase] = useState('locked'); // locked -> unsealed -> reading
    const dragStartY = useRef(0);
    const dragCardY = useRef(0);
    const isDragging = useRef(false);

    // UNSEAL: First Interaction (Click Thread)
    const handleUnseal = () => {
        if (interactionPhase !== 'locked') return;
        setInteractionPhase('unsealed'); // Enable Dragging
        
        const tl = gsap.timeline();

        // 1. Unwind & Drop String (Physics-like)
        tl.to(".string-closure", { 
            rotation: 720, // Spin fast (unwind)
            y: 300, // Drop down
            x: 50, // Drift right
            opacity: 0, 
            scale: 0.5, 
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(".string-closure", { display: "none" });
            }
        });

        // 2. Open Flap (Delayed slightly so thread clears)
        tl.to(flapRef.current, {
            rotationX: 180,
            transformOrigin: "top center",
            duration: 0.6,
            ease: "power2.inOut"
        }, "-=0.4");

        // 3. Peek Card (Hint to Pull)
        tl.to(cardRef.current, {
            y: -60, // Peek out slightly
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        }, "-=0.3");
    };

    // DRAG: Second Interaction (Pull Card)
    const handleDragStart = (e) => {
        if (interactionPhase !== 'unsealed') return;
        isDragging.current = true;
        dragStartY.current = e.clientY || e.touches?.[0].clientY;
        
        // Add listeners for move/up
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchmove', handleDragMove);
        window.addEventListener('touchend', handleDragEnd);
    };

    const handleDragMove = (e) => {
        if (!isDragging.current) return;
        const clientY = e.clientY || e.touches?.[0].clientY;
        const deltaY = clientY - dragStartY.current;
        
        // Only allow pulling UP (negative delta)
        // Clamp to prevent pulling down
        const newY = Math.min(0, -60 + deltaY); // Start from -60 (peek position)
        dragCardY.current = newY;

        // Direct update for performance
        gsap.set(cardRef.current, { y: newY });
    };

    const handleDragEnd = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);

        // Threshold check (Did they pull enough?)
        if (dragCardY.current < -150) {
            // SUCCESS: Extract fully
            handleExtractCard();
        } else {
            // FAIL: Snap back to peek
            gsap.to(cardRef.current, { y: -60, duration: 0.3, ease: "power2.out" });
        }
    };

    const handleExtractCard = () => {
        setInteractionPhase('reading');

        const tl = gsap.timeline();

        // 1. Drop Envelope
        tl.to(envelopeRef.current, { 
            y: 400, 
            opacity: 0, 
            duration: 0.5, 
            ease: 'power2.in' 
        });

        // 2. Center Card
        tl.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)'
        }, "-=0.2");

        // 3. Reveal Content
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
                
                {/* WHITE DOSSIER (Borderless Design) */}
                <div 
                    ref={envelopeRef}
                    className="absolute w-[360px] md:w-[520px] h-[240px] md:h-[320px] bg-gray-50 shadow-2xl rounded-lg z-50 flex flex-col items-center justify-center overflow-visible"
                >
                    {/* Top Flap Indicator - Animated */}
                    <div 
                        ref={flapRef}
                        className="absolute top-0 w-full h-16 bg-gray-100 flex items-end justify-center z-20 origin-top shadow-sm border-b border-gray-200"
                        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                    >
                         {/* Flap Circle button */}
                         <div className="w-4 h-4 rounded-full bg-red-800 border-2 border-red-950 opacity-80 mb-2"></div>
                    </div>

                    {/* INTERACTIVE THREAD CLOSURE */}
                    {/* Kept in DOM for animation, hidden via GSAP later */}
                    <div 
                        className="absolute z-50 cursor-pointer string-closure hover:scale-110 transition-transform"
                        onClick={handleUnseal}
                        style={{ top: '60px' }} 
                    >
                         {/* The Thread Visual */}
                         <div className="relative w-16 h-16 flex items-center justify-center">
                            {/* Bottom Button */}
                            <div className="absolute w-6 h-6 rounded-full bg-gray-300 border border-gray-400 shadow-inner z-10"></div>
                            {/* String Winding (SVG) */}
                            <svg width="60" height="100" viewBox="0 0 60 100" className="absolute top-[-20px] drop-shadow-md pointer-events-none">
                                <path 
                                    d="M30 20 C 10 30, 10 50, 30 50 C 50 50, 50 20, 30 20" 
                                    fill="none" 
                                    stroke="#B91C1C" 
                                    strokeWidth="2"
                                />
                                <path 
                                    d="M30 50 L 30 80" 
                                    fill="none" 
                                    stroke="#B91C1C" 
                                    strokeWidth="2"
                                />
                            </svg>
                         </div>
                    </div>

                    <div className="mt-16 text-center pointer-events-none">
                        <h2 className="text-3xl tracking-[0.3em] font-black text-black mb-2 opacity-80">CONFIDENTIAL</h2>
                        <div className="h-px w-24 bg-gray-300 mb-4 mx-auto"></div>
                        <p className="text-[10px] text-red-700 font-mono tracking-widest uppercase animate-pulse font-bold">
                            {interactionPhase === 'locked' ? '[ BREAK SEAL TO OPEN ]' : '[ PULL DOCUMENT UP ]'}
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div 
                    ref={cardRef}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    className={`w-[340px] md:w-[480px] bg-white rounded-xl p-8 md:p-12 text-center shadow-2xl border-2 border-gray-100 opacity-0 z-40 transform translate-y-4 ${interactionPhase === 'unsealed' ? 'cursor-grab active:cursor-grabbing' : ''}`}
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
