import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Terminal, ArrowRight, CornerDownRight } from 'lucide-react';
import { gsap } from 'gsap';
import { SplitText } from '../../utils/animations';

const Typewriter = ({ text, delay = 0, speed = 30 }) => {
  const [displayText, setDisplayText] = React.useState('');
  
  React.useEffect(() => {
    let timeout;
    let currentIndex = 0;
    
    // Initial delay before starting to type
    const startTimeout = setTimeout(() => {
        const typeChar = () => {
            if (currentIndex < text.length) {
                setDisplayText(text.substring(0, currentIndex + 1));
                currentIndex++;
                // Randomize speed slightly for realism
                const randomSpeed = speed + (Math.random() * 20 - 10); 
                timeout = setTimeout(typeChar, randomSpeed);
            }
        };
        typeChar();
    }, delay);

    return () => {
        clearTimeout(startTimeout);
        clearTimeout(timeout);
    };
  }, [text, delay, speed]);

  return <span>{displayText}</span>;
}

const Hero = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
       const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

       // Boot text & Subtitle immediate entry
       tl.from(".hero-boot-item", {
           opacity: 0,
           x: -20,
           duration: 0.5,
           stagger: 0.2
       })
       .from(".hero-desc", {
           opacity: 0,
           y: 20,
           duration: 1
       }, "+=0.5")
       .from(".hero-btn", {
           opacity: 0,
           scale: 0.9,
           stagger: 0.1,
           duration: 0.8,
           ease: "back.out(1.7)"
       }, "-=0.5");

       // Right side visual (staggered list)
       gsap.from(".data-row", {
           x: 50,
           opacity: 0,
           duration: 0.8,
           stagger: 0.1,
           delay: 1
       });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden border-b-2 border-black">
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                
                {/* Boot Sequence Header */}
                <div className="flex flex-col gap-1 font-mono text-xs text-secondary mb-4 min-h-[60px]">
                    <div className="flex items-center gap-2 hero-boot-item">
                        <Terminal size={12} /> 
                        <span className="font-bold text-black">
                            <Typewriter text="SYSTEM_READY" delay={0} />
                        </span>
                    </div>
                    <div className="text-black font-bold hero-boot-item">
                        <Typewriter text=">> INITIALIZING PROTOCOLS... OK" delay={600} />
                    </div>
                    <div className="hero-boot-item">
                        <Typewriter text=">> CONNECTED TO [SECURE_NET]" delay={1800} />
                    </div>
                </div>

                {/* Massive Typography with SplitText */}
                <div className="perspective-text">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-black leading-[0.85] uppercase">
                        <div className="block overflow-hidden">
                             <SplitText className="text-black" stagger={0.03} delay={0.5}>We Build</SplitText>
                        </div>
                        <div className="block overflow-hidden">
                             <SplitText className="text-transparent bg-clip-text bg-gradient-to-r from-black via-black to-gray-500" stagger={0.03} delay={0.8}>The Future</SplitText>
                        </div>
                    </h1>
                </div>

                <div className="flex flex-col gap-8 max-w-2xl">
                    <p className="hero-desc text-xl md:text-2xl text-black font-medium leading-relaxed border-l-4 border-black pl-6 py-2">
                        A collective of elite engineers architecting the digital infrastructure of tomorrow. 
                        <span className="block text-secondary mt-2 font-normal text-lg">Zero bloat. Pure execution. Code acts as law.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/start" className="hero-btn">
                            <Button variant="primary" className="h-14 px-8 text-lg group w-full sm:w-auto">
                                Start Building <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/manifesto" className="hero-btn">
                            <Button variant="secondary" className="h-14 px-8 text-lg flex items-center gap-2 w-full sm:w-auto">
                                <CornerDownRight size={18} /> Read Manifesto
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Visual Column (Abstract Data) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col justify-end h-full min-h-[500px] border-l-2 border-black pl-8">
                 <div className="mt-auto space-y-4 font-mono text-xs">
                    <div className="border-b border-black pb-2 mb-4 data-row">
                        <strong className="block text-lg">LATEST_DEPLOY</strong>
                        <span className="text-secondary">Project AETHER v3.2</span>
                    </div>
                    <div className="flex justify-between items-center data-row">
                         <span>SERVER_STATUS</span>
                         <span className="flex items-center gap-2 text-green-600 font-bold"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div> ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center data-row">
                         <span>NODES_ACTIVE</span>
                         <span>8,402</span>
                    </div>
                    <div className="flex justify-between items-center data-row">
                         <span>TOTAL_UPTIME</span>
                         <span>99.999%</span>
                    </div>
                    
                    <div className="pt-8 opacity-50 space-y-1">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="truncate text-[10px] text-gray-400 data-row">
                                0x{Math.random().toString(16).substr(2, 24)}...
                            </div>
                        ))}
                    </div>
                 </div>
            </div>

        </div>
    </section>
  );
};

export default Hero;
