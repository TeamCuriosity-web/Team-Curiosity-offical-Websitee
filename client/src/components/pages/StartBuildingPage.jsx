import React, { useLayoutEffect, useRef } from 'react';
import { Terminal, Box, Database, Cpu, ArrowRight, Copy, Check } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { gsap } from 'gsap';

const StartBuildingPage = () => {
  const containerRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
       gsap.from(".fade-item", {
           y: 30,
           opacity: 0,
           duration: 0.8,
           stagger: 0.2,
           ease: "power2.out"
       });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const copyCommand = () => {
      navigator.clipboard.writeText('npx create-legendary-app@latest');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main ref={containerRef} className="container mx-auto px-6 pt-32 pb-20">
      
      {/* Header */}
      <div className="mb-12 border-b-2 border-black pb-4 fade-item">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-2 uppercase">
            Initialize <span className="text-gray-400">Environment</span>
          </h1>
          <p className="text-secondary font-mono text-sm uppercase">Protocol: GENESIS // Phase 1</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Quick Start Terminal */}
          <div className="space-y-8 fade-item">
              <div className="prose">
                  <p className="text-lg text-black font-medium leading-relaxed">
                      You are about to instantiate a new node in the network. 
                      Follow the protocol below to spin up your development environment.
                  </p>
              </div>

              <div className="bg-black text-gray-300 p-6 rounded-lg font-mono text-sm shadow-2xl relative group">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-2 text-xs text-gray-500">bash</span>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <span className="text-green-500">$</span> <span className="opacity-50"># Install the CLI tool</span>
                          <div className="flex items-center justify-between bg-gray-900 p-3 rounded mt-2 border border-gray-800">
                              <code className="text-white">npx create-legendary-app@latest</code>
                              <button onClick={copyCommand} className="hover:text-white transition-colors">
                                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                              </button>
                          </div>
                      </div>
                      
                      <div>
                          <span className="text-green-500">$</span> <span className="opacity-50"># Navigate to directory</span>
                          <div className="mt-1 pl-4">cd my-legendary-project</div>
                      </div>

                      <div>
                          <span className="text-green-500">$</span> <span className="opacity-50"># Jack into the mainframe</span>
                          <div className="mt-1 pl-4">npm run dev</div>
                      </div>
                  </div>
              </div>

              <div className="flex gap-4">
                   <Button variant="primary" className="h-12 px-6">
                        View Documentation
                   </Button>
                   <Button variant="secondary" className="h-12 px-6">
                        Github Repository
                   </Button>
              </div>
          </div>

          {/* Right: Architecture Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-item">
               <Card className="p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group cursor-pointer">
                    <Box size={32} className="mb-4 text-black group-hover:text-white" />
                    <h3 className="font-bold text-xl mb-2">Frontend Core</h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 font-mono">React / Vite / Tailwind / GSAP</p>
               </Card>

               <Card className="p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group cursor-pointer">
                    <Database size={32} className="mb-4 text-black group-hover:text-white" />
                    <h3 className="font-bold text-xl mb-2">Backend Node</h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 font-mono">Node.js / Express / MongoDB</p>
               </Card>

               <Card className="p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group cursor-pointer">
                    <Cpu size={32} className="mb-4 text-black group-hover:text-white" />
                    <h3 className="font-bold text-xl mb-2">AI Agents</h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 font-mono">OpenAI / LangChain / Vector DB</p>
               </Card>

               <Card className="p-6 border-2 border-black hover:bg-black hover:text-white transition-colors group cursor-pointer flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center mb-2">
                        <ArrowRight size={24} />
                    </div>
                    <span className="font-bold text-sm">Explore All Modules</span>
               </Card>
          </div>

      </div>
    </main>
  );
};

export default StartBuildingPage;
