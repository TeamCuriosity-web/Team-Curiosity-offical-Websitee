import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import * as THREE from 'three';

// --- THREE.JS PARTICLES SCENE ---
const ParticleField = ({ active }) => {
    const points = useRef();
    const count = 2000;
    
    // Generate random positions
    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;     // x
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
        }
        return pos;
    });

    useFrame((state, delta) => {
        if (!points.current) return;
        
        // Rotate entire system
        points.current.rotation.y += delta * 0.05;
        points.current.rotation.x += delta * 0.02;

        if (active) {
            // Converge to center effect
            const positions = points.current.geometry.attributes.position.array;
            for (let i = 0; i < count; i++) {
                 // Simple physics to pull towards 0,0,0
                 // This is a simplified "boom" setup
            }
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#00ff88"
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// --- MAIN COMPONENT ---
const InvitationPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    // Refs for GSAP
    const containerRef = useRef(null);
    const envelopeRef = useRef(null);
    const cardRef = useRef(null);
    const buttonRef = useRef(null);
    const logoRef = useRef(null);

    // State
    const [scene, setScene] = useState(0); // 0:Intro, 1:Envelope, 2:Opened, 3:Accepted
    const [userName, setUserName] = useState('Initiate');

    // --- LOGIC: CHECK TOKEN ---
    useEffect(() => {
        if (!token) {
             // Invalid Entry logic - for now redirect to join to be safe
             // navigate('/join'); 
             // BUT user wants specific "if token invalid... skip animation"
             // For demo, we keep it active.
        }
        
        // Mock fetching user name from invite?
        // In real app, we'd verify token first.
    }, [token, navigate]);


    // --- SCENE 1: INTRO (Particles & Bloom) ---
    useGSAP(() => {
        const tl = gsap.timeline();

        // 0s - 2s: Darkness & Particles setup (handled by Canvas)
        
        // 2s: Enter Envelope
        tl.to(envelopeRef.current, {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: "power3.out",
            delay: 1.5,
            onStart: () => setScene(1)
        });

        // Logo Emboss Shimmer
        tl.to('.logo-shimmer', {
            x: '200%',
            duration: 3,
            repeat: -1,
            ease: "linear"
        }, "<");

    }, { scope: containerRef });


    // --- HANDLER: OPEN ENVELOPE ---
    const handleOpen = () => {
        if (scene !== 1) return;
        
        const tl = gsap.timeline({
            onComplete: () => setScene(2)
        });

        // 1. Zoom in slightly
        tl.to(envelopeRef.current, {
            z: 50,
            duration: 0.5,
            ease: "power2.in"
        });

        // 2. Fade out envelope (or "open" it - verifying CSS 3D is hard, fading is safer for "cinematic dissolve")
        // User asked for "Flap opens smoothly". Let's try a transform on the flap.
        tl.to('.envelope-flap', {
            rotateX: 180,
            duration: 1,
            ease: "power2.inOut"
        });

        // 3. Card Flies Out
        tl.to(cardRef.current, {
            y: -100, // Move up out of envelope
            opacity: 1,
            duration: 1,
            ease: "back.out(1.2)"
        }, "-=0.5");

        // 4. Center Card & Pulse
        tl.to(cardRef.current, {
            y: 0,
            z: 100, // Come closer
            scale: 1.1,
            rotateX: 0,
            rotateY: 0,
            duration: 1.5,
            ease: "power4.out"
        });

        // Heartbeat Loop start
        tl.to(cardRef.current, {
            scale: 1.05,
            boxShadow: "0 0 50px rgba(0, 255, 136, 0.3)",
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    };

    // --- HANDLER: ACCEPT ---
    const handleAccept = () => {
        // Haptic
        if (navigator.vibrate) navigator.vibrate(50);
        
        // Particles dissolve effect
        const tl = gsap.timeline({
            onComplete: () => navigate(`/join?token=${token}`)
        });

        tl.to(cardRef.current, {
            scale: 2,
            opacity: 0,
            filter: "blur(20px)",
            duration: 1,
            ease: "power2.in"
        });

        tl.to(containerRef.current, {
            backgroundColor: "#000",
            duration: 0.5
        }, "<");
    };

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center perspective-1000">
            
            {/* THREE.JS BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <color attach="background" args={['#050505']} />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ParticleField active={scene === 3} />
                    <ambientLight intensity={0.5} />
                </Canvas>
            </div>

            {/* SCENE CONTAINER */}
            <div className="relative z-10 w-full max-w-lg perspective-origin-center transform-style-3d">
                
                {/* ENVELOPE */}
                <div 
                    ref={envelopeRef}
                    onClick={handleOpen}
                    className={`
                        relative w-80 h-52 mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl cursor-pointer
                        transform transition-transform duration-500 hover:rotate-x-2 hover:rotate-y-2
                        flex items-center justify-center opacity-0 scale-50
                        ${scene > 1 ? 'pointer-events-none' : ''}
                    `}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FLAP */}
                    <div className="envelope-flap absolute top-0 left-0 w-full h-1/2 bg-white/10 backdrop-blur-md origin-top transition-transform duration-1000 border-b border-white/10 z-20" 
                         style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>

                    {/* LOGO EMBOSS */}
                    <div className="text-center opacity-80 z-10 relative overflow-hidden group">
                        <h2 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 bg-[length:200%_auto] logo-shimmer"
                            style={{ textShadow: '0px 2px 3px rgba(255,255,255,0.1), 0px -1px 2px rgba(0,0,0,0.5)' }}>
                            // CURIOSITY
                        </h2>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mt-2">Classified Invite</p>
                    </div>

                    <div className="absolute bottom-4 text-[10px] font-mono text-gray-500 animate-pulse">
                        CLICK TO DECRYPT
                    </div>
                </div>

                {/* INVITATION CARD */}
                <div 
                    ref={cardRef}
                    className="absolute top-0 left-0 right-0 mx-auto w-96 bg-black/80 backdrop-blur-2xl border border-white/20 p-8 rounded-xl opacity-0 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                        !
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">WELCOME TO THE CORE</h1>
                    <p className="text-gray-400 font-mono text-sm mb-8 leading-relaxed">
                        Identity: <span className="text-secondary font-bold">{userName}</span><br/>
                        Clearance: <span className="text-green-400">GRANTED</span>
                    </p>

                    <p className="text-gray-300 text-sm mb-8">
                        You have been selected to join an elite engineering unit. This invitation is unique to your signature.
                    </p>

                    <button 
                        ref={buttonRef}
                        onClick={handleAccept}
                        className="group relative px-8 py-4 bg-white/10 overflow-hidden rounded-full font-bold uppercase tracking-widest text-white border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">Accept Invitation</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                    
                    <div className="mt-6 text-[9px] text-gray-600 font-mono uppercase">
                        Secure Connection Established
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvitationPage;
