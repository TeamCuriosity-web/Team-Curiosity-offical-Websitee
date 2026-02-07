import React, { useLayoutEffect, useRef } from 'react';
import { Target, Zap, Terminal } from 'lucide-react';
import Card from '../ui/Card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Manifesto = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.mission-item', 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-white text-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
               {/* Left: The Manifesto Title */}
               <div className="lg:w-5/12 mission-item">
                    <div className="inline-flex items-center gap-2 border border-black/10 rounded-full px-3 py-1 mb-8 bg-black/5 backdrop-blur-sm">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                         <span className="font-mono text-[10px] uppercase tracking-widest text-black/70">System Message</span>
                    </div>
                    
                    <h2 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
                        CODE IS<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-400">OUR WEAPON.</span>
                    </h2>
                    
                    <p className="text-gray-600 text-lg leading-relaxed mb-10 border-l-2 border-black/10 pl-6">
                        We don't just write software. <strong className="text-black">We architect dominance.</strong><br/>
                        In a world of templates, we build the engines that power the future.
                    </p>

                    <div className="flex items-center gap-4 font-mono text-xs text-gray-400">
                        <Terminal size={14} />
                        <span>v2.0.4 initialized</span>
                        <span className="w-px h-3 bg-black/10" />
                        <span>Secure Connection</span>
                    </div>
               </div>

               {/* Right: The Tenets */}
               <div className="lg:w-7/12 grid gap-6">
                    {[
                        {
                            icon: <Zap size={24} />,
                            title: "Speed is a Feature",
                            desc: "Latency is failure. We optimize for the millisecond, ensuring instant execution across all nodes."
                        },
                        {
                            icon: <Target size={24} />,
                            title: "Precision First",
                            desc: "Clean code. Modular architecture. Zero technical debt. We build systems that last."
                        },
                        {
                            icon: <span className="font-mono text-xl font-bold">01</span>,
                            title: "Binary Thinking",
                            desc: "It works or it doesn't. There is no 'try'. We deliver functioning, bug-free core infrastructure."
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="mission-item group relative p-8 bg-gray-50 border border-black/5 hover:bg-white hover:border-black/20 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-0 bg-black group-hover:h-full transition-all duration-500 ease-in-out" />
                            
                            <div className="flex items-start gap-6">
                                <div className="text-black/50 group-hover:text-black transition-colors duration-300 mt-1">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">{item.title}</h3>
                                    <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
               </div>
          </div>
      </div>
    </section>
  );
};

export default Manifesto;
