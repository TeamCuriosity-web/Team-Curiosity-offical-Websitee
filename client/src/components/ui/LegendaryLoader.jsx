import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LegendaryLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [scrambleText, setScrambleText] = useState("INITIALIZING");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*";
  
  useEffect(() => {
    let interval;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
             // Animate out - Split curtain or slide up fast
             gsap.to(containerRef.current, {
                 height: 0,
                 duration: 0.5,
                 ease: "power4.inOut",
                 onComplete: onComplete
             });
        }
      });

      // Randomized Text Scramble Effect
      let iter = 0;
      interval = setInterval(() => {
          setScrambleText(prev => 
              prev.split("").map((letter, index) => {
                  if(index < iter) return "CONNECTING"[index];
                  return chars[Math.floor(Math.random() * chars.length)];
              }).join("")
          );
          if(iter >= "CONNECTING".length) clearInterval(interval);
          iter += 1/2; 
      }, 50);

      // Animation Sequence
      tl.to(".loader-line", {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.inOut",
          stagger: 0.1
      })
      .to(".loader-content", {
          opacity: 0,
          duration: 0.2
      }, "-=0.2");

    }, containerRef);

    return () => {
        ctx.revert();
        clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white overflow-hidden origin-top"
    >
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 background-size-[100%_2px,3px_100%]"></div>

        <div className="loader-content flex flex-col items-center relative z-20">
            <div className="font-mono text-4xl md:text-6xl font-black tracking-tighter mb-4 glitch-text">
                {scrambleText}
            </div>

            <div className="flex items-center gap-1 w-64 h-1">
                <div className="loader-line h-full bg-white w-1/4 scale-x-0 origin-left"></div>
                <div className="loader-line h-full bg-white w-2/4 scale-x-0 origin-left"></div>
                <div className="loader-line h-full bg-white w-1/4 scale-x-0 origin-left"></div>
            </div>
            
            <div className="mt-4 flex justify-between w-64 font-mono text-[10px] text-gray-500 uppercase">
                <span>Sys.Root</span>
                <span>Port: 3000</span>
                <span>V.2.0.4</span>
            </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white opacity-50"></div>
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white opacity-50"></div>
        
        {/* Running Codes */}
        <div className="absolute bottom-8 left-8 font-mono text-[10px] text-gray-600 hidden md:block">
             {`> 0x${Math.floor(Math.random()*16777215).toString(16)}`}
        </div>
    </div>
  );
};

export default LegendaryLoader;
