import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from "gsap/draggable";
import { useSearchParams } from 'react-router-dom';

gsap.registerPlugin(Draggable);

const InvitePage = () => {
    const containerRef = useRef(null);
    const topTriangleRef = useRef(null);
    const bottomLeftRef = useRef(null);
    const bottomRightRef = useRef(null);
    const coreRef = useRef(null);
    const textRef = useRef(null);
    const charsRef = useRef([]);
    const shineGradientRef = useRef(null);
    const envelopeRef = useRef(null);
    
    const [searchParams] = useSearchParams();
    const invitedName = searchParams.get('name') || 'Guest';
    
    const [envelopeRotation, setEnvelopeRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [envelopeVisible, setEnvelopeVisible] = useState(false);
    const [backLogoAnimated, setBackLogoAnimated] = useState(false);
    
    // SEAL TEAR STATE
    const [isSealBroken, setIsSealBroken] = useState(false);
    const [isFlapOpen, setIsFlapOpen] = useState(false);
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    
    // REFS
    const dragStartX = useRef(0);
    const sealRef = useRef(null); // Reference for Draggable
    const flapRef = useRef(null); // Reference for Flap Draggable
    const cardRef = useRef(null); // Reference for Card Draggable
    const isSealDraggingRef = useRef(false); // Ref for coordination with envelope rotation
    const sealDragDistanceRef = useRef(0); // Synchronous drag tracker for threshold logic
    
    const backTopTriangleRef = useRef(null);
    const backBottomTriangleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial positions - parts off-screen
            gsap.set(topTriangleRef.current, { x: '-200%', opacity: 1 });
            gsap.set(bottomLeftRef.current, { x: '200%', opacity: 1 });
            gsap.set(bottomRightRef.current, { y: '200%', opacity: 1 });
            gsap.set(coreRef.current, { opacity: 0, scale: 0 });
            gsap.set(textRef.current, { opacity: 0, y: 40, scale: 0.7 });
            gsap.set(envelopeRef.current, { opacity: 0, y: 60, scale: 0.96 });
            
            // Set each character to start from far (small and invisible)
            gsap.set(charsRef.current, { scale: 0.3, opacity: 0, fillOpacity: 0 });

            const tl = gsap.timeline({ delay: 0.3 });

            // PHASE 1: Smooth movement to center (ASSEMBLY)
            const allParts = [topTriangleRef.current, bottomLeftRef.current, bottomRightRef.current];
            
            tl.to(allParts, {
                x: 0,
                y: 0,
                duration: 1.1,
                ease: 'power2.out'
            });

            // Final snap into position
            tl.to(allParts, {
                x: 0,
                y: 0,
                duration: 0.25,
                ease: 'power3.out'
            }, '-=0.1');

            // Show core glow after assembly
            tl.to(coreRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power3.out'
            }, '-=0.1');

            // Hold assembled state briefly
            tl.to({}, { duration: 0.5 });

            // PHASE 2: DISASSEMBLY - Logo breaks apart and exits
            // Core fades first
            tl.to(coreRef.current, {
                opacity: 0,
                scale: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            // Parts exit in different directions - COMPLETELY GONE
            tl.to(topTriangleRef.current, {
                x: '-200%',
                y: '-50%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.2');

            tl.to(bottomLeftRef.current, {
                x: '200%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');

            tl.to(bottomRightRef.current, {
                y: '-200%',
                opacity: 0,
                scale: 0.95,
                duration: 0.9,
                ease: 'power2.in'
            }, '-=0.9');

            // PHASE 3: TEXT ENTRY - Hero moment with depth
            tl.to(textRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out'
            }, '+=0.3');

            // Step 1: Each character zooms in from far (LEFT to RIGHT: T, E, A, M...)
            tl.to(charsRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                stagger: 0.08  // Each character enters sequentially
            }, '-=0.3');

            // Step 2: Fill each character (stroke to fill effect)
            tl.to(charsRef.current, {
                fillOpacity: 1,
                duration: 1.5,
                ease: 'power2.inOut',
                stagger: 0.1  // Fill spreads across characters
            }, '-=0.5');

            // Shine effect - 2 times FAST (right to left)
            tl.to(shineGradientRef.current, {
                attr: { x1: '-100%', x2: '0%' },
                duration: 0.6,  // Faster
                ease: 'power2.inOut',
                repeat: 1,  // Repeat once = 2 times total
                yoyo: false,  // Don't reverse, reset and repeat
                onRepeat: () => {
                    // Reset to start position for second shine
                    gsap.set(shineGradientRef.current, { attr: { x1: '100%', x2: '200%' } });
                }
            }, '+=0.2');

            // Hold text briefly
            tl.to({}, { duration: 0.3 });

            // PHASE 4: TEXT EXIT
            // Step 1: Unfill each character (LEFT to RIGHT: T, E, A, M...)
            tl.to(charsRef.current, {
                fillOpacity: 0,
                duration: 1.2,
                ease: 'power2.inOut',
                stagger: 0.1  // Positive = left to right (T exits first)
            });

            // Step 2: Each character zooms TOWARD viewer (opposite of entry)
            tl.to(charsRef.current, {
                scale: 1.3,  // Scale UP (toward viewer) instead of down
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                stagger: 0.08  // Left to right (T exits first)
            }, '-=0.5');

            // Then: Container exits
            tl.to(textRef.current, {
                opacity: 0,
                duration: 0.3
            }, '-=0.3');

            // PHASE 5: ENVELOPE ENTRY
            tl.to(envelopeRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                onComplete: () => {
                    setEnvelopeVisible(true);
                }
            }, '+=0.3');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Smooth envelope flip with GSAP quickTo (locomotive-smooth)
    const rotationQuickTo = useRef(null);
    
    useEffect(() => {
        if (!envelopeRef.current) return;
        
        const flipper = envelopeRef.current.querySelector('.envelope-flipper');
        if (!flipper) return;
        
        // Initialize GSAP on the flipper
        gsap.set(flipper, { rotationY: 0 });
    }, []);

    // Animate logo on envelope back when flipped
    useEffect(() => {
        if (envelopeRotation > 90 && !backLogoAnimated) {
            setBackLogoAnimated(true);
            
            const tl = gsap.timeline();
            
            // Start with triangles separated
            gsap.set(".back-logo-top", { x: -30, opacity: 0 });
            gsap.set(".back-logo-bottom", { x: 30, opacity: 0 });
            
            // Animate triangles coming together
            tl.to([".back-logo-top", ".back-logo-bottom"], {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            })
            .to(".back-logo-top", {
                x: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.2')
            .to(".back-logo-bottom", {
                x: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.6');
        }
    }, [envelopeRotation, backLogoAnimated]);

    // --- GSAP DRAGGABLE SETUP (SEAL) ---
    useEffect(() => {
        if (isSealBroken || !sealRef.current) return;

        const draggable = Draggable.create(sealRef.current, {
            type: "y",
            bounds: { minY: 0, maxY: 120 }, // Constrain vertical movement
            inertia: true,
            edgeResistance: 0.5,
            onPress: (e) => {
                e.stopPropagation(); // Stop propagation to envelope
                isSealDraggingRef.current = true;
                sealDragDistanceRef.current = 0; // Reset tracking ref
                
                // Add scale down effect immediately
                gsap.to(sealRef.current, { scale: 0.95, duration: 0.1 });
            },
            onDrag: function() {
                // Update ref with CURRENT drag position
                sealDragDistanceRef.current = this.y;
                
                // Determine drag progress for visual feedback
                const progress = Math.max(0, this.y / 100);
                // Subtle scale effect
                gsap.set(this.target, { scale: 0.95 - progress * 0.05 });
            },
            onDragEnd: function() {
                isSealDraggingRef.current = false;
                
                // STRICT THRESHOLD CHECK using REF (Downward > 70px)
                const finalDistance = sealDragDistanceRef.current;
                console.log("Seal Drag End - Final Distance (Ref):", finalDistance);
                
                if (finalDistance >= 70) {
                    console.log("Threshold Met! Breaking Seal...");
                    this.disable(); // Stop Draggable interaction
                    
                    // Break Animation
                    gsap.to(this.target, {
                        scale: 1.2,
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => {
                            console.log("Seal Break Animation Complete - Setting State");
                            setIsSealBroken(true);
                        }
                    });
                } else {
                    console.log("Threshold NOT Met. Snapping back.");
                    // Snap Back
                    gsap.to(this.target, {
                        y: 0,
                        scale: 1, 
                        duration: 0.5,
                        ease: "elastic.out(1, 0.4)",
                        onComplete: () => {
                            sealDragDistanceRef.current = 0; // Reset ref
                        }
                    });
                }
            }
        })[0];

        return () => {
            if (draggable) draggable.kill();
        };
    }, [isSealBroken]);

    // --- GSAP DRAGGABLE SETUP (FLAP) ---
    useEffect(() => {
        // Only enable flap drag if seal is broken and flap is NOT yet open
        if (!isSealBroken || isFlapOpen || !flapRef.current) return;

        // Use a virtual proxy to handle the drag values without moving the flap element itself
        const proxy = document.createElement("div");

        const draggable = Draggable.create(proxy, {
            trigger: flapRef.current, // The user interacts with the flap
            type: "y",
            bounds: { minY: -200, maxY: 0 }, 
            inertia: true,
            edgeResistance: 0.5,
            onPress: (e) => {
                e.stopPropagation(); // Stop propagation
            },
            onDrag: function() {
                // Logic: 120px drag = 120deg rotation
                const progress = Math.min(Math.abs(this.y) / 120, 1);
                const rotation = -progress * 120; // negative = backward open
                
                gsap.set(flapRef.current, { 
                    rotationX: rotation,
                    transformOrigin: "top center"
                });

                // Dynamic shadow intensity
                const shadowOpacity = 0.2 + (progress * 0.3); 
                gsap.set(flapRef.current, { 
                    boxShadow: `0 -5px 15px rgba(0,0,0,${shadowOpacity})` 
                });
            },
            onDragEnd: function() {
                const dragAmount = Math.abs(this.y);
                console.log("Flap Drag End Y:", dragAmount);
                
                // Threshold: > 60px upward drag to open
                if (dragAmount > 60) {
                    this.disable();
                    
                    // Snap fully open
                    gsap.to(flapRef.current, {
                        rotationX: -120, // Fully open (backward)
                        duration: 0.6,
                        ease: "back.out(1.4)",
                        onComplete: () => {
                            setIsFlapOpen(true);
                        }
                    });
                } else {
                    // Snap back closed
                    gsap.to(flapRef.current, {
                        rotationX: 0,
                        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", // Default shadow
                        duration: 0.5,
                        ease: "power3.out"
                    });
                }
            }
        })[0];

        return () => {
            if (draggable) draggable.kill();
        };
    }, [isSealBroken, isFlapOpen]);



    // --- AUTO CARD REVEAL (PEEK) ---
    useEffect(() => {
        if (isFlapOpen && !isCardRevealed && cardRef.current) {
            // Animate card peeking out slightly (60-80px)
            gsap.to(cardRef.current, {
                y: -80,
                duration: 0.8,
                ease: "power3.out",
                delay: 0.2 // Wait for flap to clear
            });
        }
    }, [isFlapOpen, isCardRevealed]);

    useEffect(() => {
        if (!isFlapOpen || isCardRevealed || !cardRef.current) return;

        // Note: We need to sync the draggable with the new Y position from the peek animation
        // GSAP Draggable usually handles this, but we should ensure bounds are correct.
        
        const draggable = Draggable.create(cardRef.current, {
            type: "y",
            bounds: { minY: -450, maxY: -80 }, // Allow drag from peek (-80) upwards
            inertia: true,
            edgeResistance: 0.5,
            onPress: (e) => {
                e.stopPropagation(); 
            },
            onDrag: function() {
                // Limit downward drag to the peek position
                if (this.y > -80) this.y = -80;
            },
            onDragEnd: function() {
                const currentY = this.y;
                console.log("Card Drag End Y:", currentY);
                
                // Threshold: Pull further up (e.g. past -200) to fully remove
                if (currentY < -200) { 
                    this.disable();
                    
                    // Reveal Animation
                    const tl = gsap.timeline({
                        onComplete: () => {
                            setIsCardRevealed(true);
                        }
                    });
                    
                    // 1. Envelope Fades
                    tl.to(".envelope-part", {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power2.in"
                    });
                    
                    // 2. Card Scales Up & Centers
                    tl.to(cardRef.current, {
                        y: -window.innerHeight * 0.1, // Center visually
                        x: 0,
                        scale: 1.2,
                        duration: 0.8,
                        ease: "back.out(1.2)"
                    }, "<"); 

                } else {
                    // Snap back to peek position (-80)
                    gsap.to(this.target, {
                        y: -80,
                        duration: 0.5,
                        ease: "power3.out"
                    });
                }
            }
        })[0];

        return () => {
            if (draggable) draggable.kill();
        };
    }, [isFlapOpen, isCardRevealed]);

    // --- ENVELOPE ROTATION HANDLER ---

    // ENVELOPE ROTATION LOGIC
    const handleDragStart = (e) => {
        // Prevent rotation if we are dragging the seal or if card is revealed
        if (isSealDraggingRef.current || isCardRevealed) return;
        
        setIsDragging(true);
        const touch = e.touches ? e.touches[0] : e;
        dragStartX.current = touch.clientX;
    };

    const handleDragMove = (e) => {
        if (isSealDraggingRef.current) return;
        if (!isDragging) return;
        
        const touch = e.touches ? e.touches[0] : e;
        const deltaX = touch.clientX - dragStartX.current;
        
        // Sensitivity: 0.3 rotation per pixel
        let newRotation = envelopeRotation + deltaX * 0.3;
        newRotation = Math.max(0, Math.min(180, newRotation));
        
        // Direct update for performance
        const flipper = envelopeRef.current?.querySelector('.envelope-flipper');
        if (flipper) {
            gsap.set(flipper, { rotationY: newRotation });
        }
        setEnvelopeRotation(newRotation);
        
        dragStartX.current = touch.clientX;
    };

    const handleDragEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            const targetRotation = envelopeRotation > 90 ? 180 : 0;
            
            const flipper = envelopeRef.current?.querySelector('.envelope-flipper');
            if (flipper) {
                gsap.to(flipper, {
                    rotationY: targetRotation,
                    duration: 0.6,
                    ease: 'power3.out',
                    onUpdate: function() {
                        const currentRot = gsap.getProperty(flipper, "rotationY");
                        setEnvelopeRotation(currentRot);
                    }
                });
            }
        }
    };

    const text = "TEAM CURIOSITY";
    const chars = text.split('');

    return (
        <div 
            className="min-h-screen bg-[#f7f7f7] flex items-center justify-center" 
            style={{ 
                overflow: 'visible',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none'
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
        >
            <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center" style={{ overflow: 'visible' }}>
                {/* PHASE 1: Logo */}
                <svg 
                    width="400" 
                    height="400" 
                    viewBox="0 0 40 40" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                    {/* Top Triangle Fragment - from LEFT */}
                    <g ref={topTriangleRef}>
                        <path 
                            d="M20 5L30 25H10L20 5Z" 
                            fill="#171717" 
                            stroke="#00F3FF" 
                            strokeWidth="1"
                        />
                    </g>

                    {/* Bottom Left Fragment - from RIGHT */}
                    <g ref={bottomLeftRef}>
                        <path 
                            d="M10 25L5 35L15 35L10 25Z" 
                            fill="#171717" 
                            stroke="#00F3FF" 
                            strokeWidth="1"
                        />
                    </g>

                    {/* Bottom Right Fragment - from BOTTOM */}
                    <g ref={bottomRightRef}>
                        <path 
                            d="M30 25L35 35L25 35L30 25Z" 
                            fill="#171717" 
                            stroke="#00F3FF" 
                            strokeWidth="1"
                        />
                    </g>

                    {/* Central Core Glow */}
                    <circle 
                        ref={coreRef}
                        cx="20" 
                        cy="27" 
                        r="2.5" 
                        fill="#00F3FF"
                    />
                </svg>

                {/* PHASE 3: Text Entry - Character-by-Character Fill */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: 'visible' }}>
                    <svg 
                        ref={textRef}
                        viewBox="0 0 1000 200" 
                        className="w-[80vw]"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            {/* Pure black gradient */}
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#000000" />
                                <stop offset="50%" stopColor="#000000" />
                                <stop offset="100%" stopColor="#000000" />
                            </linearGradient>
                            
                            {/* Shine gradient overlay */}
                            <linearGradient 
                                id="shineGradient" 
                                ref={shineGradientRef}
                                x1="100%" 
                                y1="0%" 
                                x2="200%" 
                                y2="0%"
                            >
                                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="20%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
                                <stop offset="80%" stopColor="rgba(255,255,255,0)" />
                                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </linearGradient>
                            
                            {/* More visible shadow */}
                            <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                                {/* Main shadow */}
                                <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur1"/>
                                <feOffset in="blur1" dx="0" dy="6" result="offsetBlur1"/>
                                <feFlood floodColor="#000000" floodOpacity="0.25"/>
                                <feComposite in2="offsetBlur1" operator="in" result="shadow1"/>
                                
                                {/* Soft ambient shadow */}
                                <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur2"/>
                                <feFlood floodColor="#000000" floodOpacity="0.15"/>
                                <feComposite in2="blur2" operator="in" result="shadow2"/>
                                
                                <feMerge>
                                    <feMergeNode in="shadow2"/>
                                    <feMergeNode in="shadow1"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            
                            {/* Cyan Glow for borders */}

                            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                            
                            {/* Seal Gradient - Metallic Cyan */}
                            <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00F3FF"/>
                                <stop offset="50%" stopColor="#00a8cc"/>
                                <stop offset="100%" stopColor="#004e66"/>
                            </linearGradient>
                        </defs>
                        
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="font-black uppercase"
                            filter="url(#textShadow)"
                            style={{
                                fontSize: '130px',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {chars.map((char, i) => (
                                <tspan
                                    key={i}
                                    ref={el => charsRef.current[i] = el}
                                    style={{
                                        stroke: '#0a0a0a',
                                        strokeWidth: '4',
                                        fill: 'url(#textGradient)',
                                        fillOpacity: 0,
                                        paintOrder: 'stroke fill'
                                    }}
                                >
                                    {char}
                                </tspan>
                            ))}
                        </text>
                        
                        {/* Shine overlay */}
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            className="font-black uppercase"
                            style={{
                                fontSize: '130px',
                                letterSpacing: '0.02em',
                                fill: 'url(#shineGradient)',
                                opacity: 1,
                                mixBlendMode: 'screen'
                            }}
                        >
                            {text}
                        </text>
                    </svg>
                </div>

                {/* PHASE 5 & 6: Envelope with flip interaction */}
                <div 
                    ref={envelopeRef}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ perspective: '1200px' }}
                >
                    <div 
                        className="envelope-flipper relative"
                        style={{
                            width: '450px',
                            height: '280px',
                            transformStyle: 'preserve-3d',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none'
                        }}
                    >
                        {/* Front Side */}
                        <div 
                            className="absolute inset-0 rounded-xl flex items-center justify-center"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                background: 'linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%)'
                            }}
                        >
                            {/* Inner border for depth */}
                            <div 
                                className="absolute inset-0 rounded-xl pointer-events-none"
                                style={{
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    margin: '8px'
                                }}
                            />
                            
                            {/* Left Grip Marks */}
                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div 
                                        key={`left-${i}`}
                                        className="w-8 h-1 rounded-full bg-gray-400"
                                        style={{ 
                                            opacity: 0.4,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Right Grip Marks */}
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div 
                                        key={`right-${i}`}
                                        className="w-8 h-1 rounded-full bg-gray-400"
                                        style={{ 
                                            opacity: 0.4,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                ))}
                            </div>
                            
                            {/* Content */}
                            <div className="text-center relative z-10">
                                <p className="text-3xl font-semibold text-gray-700" style={{ letterSpacing: '0.02em' }}>
                                    To, <span className="font-bold text-gray-900">{invitedName}</span>
                                </p>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div 
                            className="absolute inset-0 rounded-xl flex items-center justify-center"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                // Background moved to child "Back Skin" to allow fading separately from Card
                            }}
                        >
                            {/* Back Skin (Visual Body) */}
                            <div 
                                className="envelope-part absolute inset-0 bg-[#e8e8e8] rounded-xl"
                                style={{
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 20px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                    background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 100%)'
                                }}
                            >
                                {/* Envelope Back Body - Base Layer */}
                                <div className="absolute inset-0 bg-[#e0e0e0]" />
                            </div>

                            {/* Hinge/Crease Shadow at the top */}
                            <div 
                                className="envelope-part absolute top-0 left-0 right-0 h-4 z-0"
                                style={{
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
                                    opacity: isSealBroken ? 0.6 : 0,
                                    transition: 'opacity 0.5s'
                                }}
                            />

                            {/* Flap - 3D Container */}
                            <div 
                                ref={flapRef}
                                className="envelope-part absolute top-0 left-0 right-0 h-[160px] z-10 origin-top"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    touchAction: 'none',
                                    cursor: (isSealBroken && !isFlapOpen) ? 'grab' : 'default',
                                    // Initial transform handled by GSAP/Default state
                                }}
                            >
                                {/* Front Face (Matches envelope) */}
                                <div 
                                    className="absolute inset-0"
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                                >
                                    <svg width="100%" height="100%" viewBox="0 0 450 160" preserveAspectRatio="none">
                                        <path 
                                            d="M0 0 L225 150 L450 0 Z" 
                                            fill="#d4d4d4" 
                                            stroke="rgba(0,0,0,0.05)"
                                            strokeWidth="1"
                                        />
                                    </svg>
                                </div>

                                {/* Back Face (Inner side - Darker) */}
                                <div 
                                    className="absolute inset-0"
                                    style={{ 
                                        backfaceVisibility: 'hidden', 
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateX(180deg)',
                                    }}
                                >
                                    <svg width="100%" height="100%" viewBox="0 0 450 160" preserveAspectRatio="none">
                                        <path 
                                            d="M0 0 L225 150 L450 0 Z" 
                                            fill="#c0c0c0" 
                                        />
                                        {/* Inner Shadow / Depth gradient */}
                                        <path 
                                            d="M0 0 L225 150 L450 0 Z" 
                                            fill="url(#innerFlapGradient)"
                                            fillOpacity="0.3"
                                        />
                                        <defs>
                                            <linearGradient id="innerFlapGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="black" stopOpacity="0.2"/>
                                                <stop offset="100%" stopColor="transparent"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            
                            {/* Bottom Fold */}
                            <div className="envelope-part absolute bottom-0 left-0 right-0 h-[140px] z-[6] pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 450 140" preserveAspectRatio="none">
                                    <path 
                                        d="M0 140 L225 0 L450 140 Z" 
                                        fill="#dadada" 
                                        fillOpacity="0.5"
                                    />
                                </svg>
                            </div>

                            {/* DIGITAL SLATE CARD (Phase 11 - Team Curiosity Style) */}
                            <div 
                                ref={cardRef}
                                className="absolute left-[15px] right-[15px] h-[340px] bg-[#0a0a0a]/95 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[5]"
                                style={{
                                    bottom: '10px',
                                    transform: 'translateY(0)',
                                    cursor: isFlapOpen && !isCardRevealed ? 'grab' : 'default',
                                    touchAction: 'none',
                                    border: '1px solid rgba(0, 243, 255, 0.3)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Digital Grid Background Pattern */}
                                <div 
                                    className="absolute inset-0 opacity-[0.05] pointer-events-none"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle, #00f3ff 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />

                                {/* Moving Scan Line Effect */}
                                <div 
                                    className="absolute inset-x-0 h-[2px] bg-cyan-500/20 shadow-[0_0_10px_rgba(0,243,255,0.5)] z-0"
                                    style={{
                                        top: '-10%',
                                        animation: 'scanline 4s linear infinite'
                                    }}
                                />

                                {/* Glowing Cyan Corners */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500 drop-shadow-[0_0_5px_rgba(0,243,255,1)]" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500 drop-shadow-[0_0_5px_rgba(0,243,255,1)]" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500 drop-shadow-[0_0_5px_rgba(0,243,255,1)]" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500 drop-shadow-[0_0_5px_rgba(0,243,255,1)]" />
                                
                                {/* Card Content Container */}
                                <div className="p-8 flex flex-col items-center justify-between h-full relative z-10 font-sans">
                                    
                                    {/* Tech Metrics (Top Corners) */}
                                    <div className="absolute top-3 left-6 flex flex-col items-start opacity-40 text-[8px] font-mono text-cyan-500">
                                        <span>COORD: 34.0522°N 118.2437°W</span>
                                        <span>LATENCY: 12ms</span>
                                    </div>
                                    <div className="absolute top-3 right-6 flex flex-col items-end opacity-40 text-[8px] font-mono text-cyan-500 text-right">
                                        <span>ACCESS: PRIORITY_A</span>
                                        <span>REV: 11.0.42</span>
                                    </div>

                                    {/* System Status Line */}
                                    <div className="mt-2 text-[9px] font-mono text-cyan-400/80 tracking-[0.3em] uppercase animate-pulse">
                                        [ System Status: Identity Verified ]
                                    </div>

                                    {/* Main Holographic Icon */}
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                                        <svg width="60" height="60" viewBox="0 0 40 40" className="relative drop-shadow-[0_0_10px_rgba(0,243,255,0.6)]">
                                            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(0, 243, 255, 0.4)" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                                            <path d="M20 8L32 30H8L20 8Z" fill="url(#slateLogoGradient)" />
                                            <path d="M20 32L8 10H32L20 32Z" fill="rgba(0, 243, 255, 0.2)" />
                                        </svg>
                                        <defs>
                                            <linearGradient id="slateLogoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#00f3ff" />
                                                <stop offset="100%" stopColor="#007ea7" />
                                            </linearGradient>
                                        </defs>
                                    </div>

                                    {/* Center Title Group */}
                                    <div className="flex-1 flex flex-col items-center justify-center py-2 space-y-1">
                                        <h2 className="text-3xl font-black text-white tracking-widest uppercase">
                                            Team Curiosity
                                        </h2>
                                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />
                                        <p className="text-[10px] text-cyan-300/60 font-medium tracking-[0.5em] mt-2 italic">
                                            THE EVOLUTION BEGINS
                                        </p>
                                    </div>

                                    {/* Interaction Call-to-action */}
                                    <div className="pt-2 flex flex-col items-center">
                                        <div className="text-[9px] font-mono tracking-[0.2em] text-cyan-400">
                                            {isCardRevealed ? "NETWORK CONNECTED" : "INITIATING UPLOAD..."}
                                        </div>
                                        <div className="mt-2 flex gap-1">
                                            {[1, 2, 3].map((i) => (
                                                <div 
                                                    key={`bit-${i}`}
                                                    className="w-1.5 h-1.5 bg-cyan-500/40 rounded-sm animate-pulse"
                                                    style={{ animationDelay: `${i * 0.2}s` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Side Folds - Left and Right */}
                            <div className="envelope-part absolute inset-0 z-[6] pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 450 280" preserveAspectRatio="none">
                                    {/* Left Fold */}
                                    <path d="M0 0 L225 140 L0 280 Z" fill="#e5e5e5" />
                                    {/* Right Fold */}
                                    <path d="M450 0 L225 140 L450 280 Z" fill="#e5e5e5" />
                                </svg>
                            </div>
                            
                            {/* Inner border */}
                            <div 
                                className="absolute inset-0 rounded-xl pointer-events-none z-20"
                                style={{
                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                    margin: '4px'
                                }}
                            />

                            {/* Seal - Circular Matte with Engraved Logo */}
                            {/* Hide when broken */}
                            {!isSealBroken && (
                                <div 
                                    ref={sealRef}
                                    className="seal-element absolute top-[90px] left-1/2 transform -translate-x-1/2 z-30 cursor-grab active:cursor-grabbing"
                                    style={{
                                        touchAction: 'none'
                                    }}
                                >
                                    {/* Wax Seal Graphic - Classic Red Style */}
                                    <svg width="68" height="68" viewBox="0 0 64 64" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                                        <defs>
                                            <radialGradient id="classicSeal" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                                                <stop offset="0%" stopColor="#d93025"/>
                                                <stop offset="70%" stopColor="#9e1c1c"/>
                                                <stop offset="100%" stopColor="#660000"/>
                                            </radialGradient>
                                            <linearGradient id="sealGoldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#b8860b" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Irregular Shape for real wax look */}
                                        <path 
                                            d="M32 4 C40 4 48 8 54 14 C60 20 62 28 60 36 C58 44 54 52 46 58 C38 64 26 64 18 58 C10 52 4 40 4 32 C4 24 10 10 32 4 Z" 
                                            fill="url(#classicSeal)" 
                                        />
                                        
                                        {/* Embossed Ring */}
                                        <circle cx="32" cy="32" r="22" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
                                        <circle cx="32" cy="32" r="22" fill="url(#sealGoldHighlight)" fillOpacity="0.2" />
                                        
                                        {/* Embossed Text */}
                                        <text 
                                            x="32" 
                                            y="40" 
                                            textAnchor="middle" 
                                            fill="#4a0000" 
                                            style={{ fontSize: '22px', fontFamily: 'serif', fontWeight: 'bold', filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.1))' }}
                                        >
                                            TC
                                        </text>
                                        
                                        {/* Glossy Overlay */}
                                        <circle cx="20" cy="20" r="10" fill="white" fillOpacity="0.08" filter="blur(3px)" />
                                    </svg>
                                    
                                    {/* Visual Hint - Pull Down - Fades out on drag */}
                                    <div 
                                        className="visual-hint absolute top-18 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gray-400 tracking-[0.2em] whitespace-nowrap opacity-100 transition-opacity duration-300 pointer-events-none"
                                    >
                                        PULL TO BREAK
                                    </div>
                                </div>
                            )} 

                        </div>
                    </div>
                </div>

                {/* Swipe Indicator - Shows only when envelope is visible */}
                <div 
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center gap-3 transition-opacity duration-500 z-50"
                    style={{ 
                        opacity: envelopeVisible && envelopeRotation < 5 ? 1 : 0,
                        pointerEvents: 'none'
                    }}
                >
                    {/* Left arrow */}
                    <svg 
                        className="w-10 h-10 text-gray-700"
                        style={{ 
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>

                    {/* Text hint */}
                    <p 
                        className="text-gray-800 font-bold text-xl px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm"
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                    >
                        Swipe to flip
                    </p>

                    {/* Right arrow */}
                    <svg 
                        className="w-10 h-10 text-gray-700"
                        style={{ 
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default InvitePage;
