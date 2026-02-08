import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, CheckCircle, ArrowRight, Shield, Globe, Terminal } from 'lucide-react';
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
        const particleCount = 200;

        class Particle {
            constructor() {
                // Start scattered
                this.x = (Math.random() - 0.5) * canvas.width * 3 + canvas.width/2;
                this.y = (Math.random() - 0.5) * canvas.height * 3 + canvas.height/2;
                
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 2 + 1;
                this.color = '#111827'; // Dark Gray/Black
                this.targetX = canvas.width / 2;
                this.targetY = canvas.height / 2;
                this.speed = Math.random() * 0.05 + 0.02; // Easing factor
            }

            update() {
                if (phase === 'gathering') {
                    // Ease towards center
                    this.x += (this.targetX - this.x) * this.speed;
                    this.y += (this.targetY - this.y) * this.speed;
                } else if (phase === 'morphed') {
                    // Disappear/Fade out rapidly
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
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean clear for white theme
            
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
        tl.to({}, { duration: 2.5, onComplete: () => setPhase('morphed') });

        // Phase 2: Morph into Envelope
        // Force opacity 1 and scale up
        tl.fromTo(envelopeGroupRef.current, 
            { scale: 0, autoAlpha: 1 }, 
            { 
                scale: 1, 
                duration: 0.8, 
                ease: 'back.out(1.7)', 
                immediateRender: true
            },
            "-=0.1" 
        );
        
        // Continuous Float effect
        gsap.to(envelopeGroupRef.current, {
            y: -15,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.8
        });

    }, { scope: containerRef });

    const handleOpenEnvelope = (e) => {
        e.stopPropagation(); // Stop bubbling
        if (envelopeOpen) return;
        setEnvelopeOpen(true);

        const tl = gsap.timeline();

        // 1. Zoom in slightly
        tl.to(envelopeGroupRef.current, { scale: 1.1, duration: 0.4, ease: 'power2.in' });

        // 2. Open Flap
        tl.to(flapRef.current, { 
            rotateX: 180, 
            duration: 0.5, 
            ease: 'power2.inOut',
            transformOrigin: 'top' 
        });

        // 3. Card Slides Out
        tl.to(cardRef.current, {
            y: -220,
            zIndex: 60, // Ensure card is way on top
            duration: 0.5,
            ease: 'power2.out'
        });

        // 4. Card Focus
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
            maxWidth: '550px',
            height: 'auto',
            duration: 1.0,
            ease: 'expo.out',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
        });

        // 5. Hide Envelope
        tl.to(envelopeRef.current, { autoAlpha: 0, duration: 0.3 }, "-=0.8");
        
        // 6. Reveal Content
        tl.fromTo(contentRef.current, 
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }
        );
    };

    const handleAccept = () => {
        // Implode into Button
        gsap.to(cardRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 100,
            duration: 0.4,
            ease: 'back.in(1.7)',
            onComplete: () => navigate(`/join?token=${token || ''}`)
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-white flex items-center justify-center overflow-hidden perspective-1000 relative">
            
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
            
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            {/* Envelope Group */}
            {/* Added z-50 and pointer-events-auto to ensure it catches clicks */}
            <div ref={envelopeGroupRef} className="relative z-50 opacity-0 will-change-transform pointer-events-auto">
                <div 
                    ref={envelopeRef}
                    className="relative w-80 h-52 bg-white border border-gray-200 rounded-md shadow-2xl cursor-pointer hover:scale-105 transition-transform group"
                    onClick={handleOpenEnvelope}
                >
                    {/* Flap */}
                    <div 
                        ref={flapRef}
                        className="absolute top-0 left-0 w-full h-1/2 bg-gray-50 origin-top z-30 border-b border-gray-200 shadow-sm pointer-events-none"
                        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)', backfaceVisibility: 'hidden' }}
                    ></div>

                    {/* Seal */}
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-40 w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg ring-4 ring-white pointer-events-none">
                        <Terminal size={18} className="text-white" />
                    </div>
                
                    {/* Texture/Writing on Envelope */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 opacity-80 pointer-events-none">
                         <div className="border-2 border-dashed border-gray-300 p-2 rounded transform -rotate-2">
                             <p className="font-mono text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                                Classified Document
                             </p>
                         </div>
                         <p className="mt-2 text-xs font-serif italic text-gray-400">To: Agent Candidate</p>
                    </div>

                    {/* Click Guide */}
                    <div className="absolute -bottom-8 left-0 w-full text-center animate-bounce">
                        <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                            [ CLICK TO OPEN ]
                        </p>
                    </div>
                </div>

                {/* The Card */}
                <div 
                    ref={cardRef}
                    className="absolute top-0 left-0 w-full h-full bg-white rounded-xl p-8 flex flex-col items-center justify-center z-20 text-center shadow-2xl opacity-0 border border-gray-100 pointer-events-auto"
                >
                    <div ref={contentRef} className="space-y-6 w-full">
                        <div className="flex justify-center">
                           <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-md">
                                <Globe size={32} />
                           </div>
                        </div>
                        
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Subject: Recruitment</h3>
                            <h1 className="text-4xl font-black text-black tracking-tight uppercase mb-1">
                                TEAM CURIOSITY
                            </h1>
                        </div>

                        <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-100 text-left">
                             <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                                <Shield size={14} className="text-black" />
                                <span className="text-xs font-bold uppercase">Background Check</span>
                             </div>
                             <p className="text-sm text-gray-600 font-mono leading-relaxed">
                                 Code Signature: <strong className="text-green-600">VERIFIED</strong><br/>
                                 Clearance: <strong className="text-black">LEVEL 5</strong><br/>
                                 Directive: <strong className="text-black">IMMEDIATE JOINDER</strong>
                             </p>
                        </div>

                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                            The simulation requires your input.
                        </p>

                        <Button onClick={handleAccept} variant="black" className="w-full py-4 text-sm font-bold tracking-widest bg-black text-white hover:bg-gray-800 shadow-lg transition-transform hover:-translate-y-1">
                            INITIATE PROTOCOL
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* HUD Elements */}
            {!envelopeOpen && (
                <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                    <p className="text-gray-400 font-mono text-xs animate-pulse tracking-widest uppercase">
                        Establishing Secure Link...
                    </p>
                </div>
            )}
        </div>
    );
};

export default InviteLandingPage;
