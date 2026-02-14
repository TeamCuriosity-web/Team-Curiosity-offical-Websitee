import React from 'react';
import Card from '../ui/Card';
import { Terminal, Shield, Cpu, Code, Globe, Lock } from 'lucide-react';

const Tenet = ({ icon: Icon, title, desc, num }) => (
  <div className="flex gap-4 group">
    <div className="font-mono text-gray-300 text-xl font-bold group-hover:text-black transition-colors">{num}</div>
    <div>
       <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className="text-black" />
            <h3 className="font-bold text-lg text-black uppercase tracking-wider">{title}</h3>
       </div>
       <p className="text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ManifestoPage = () => {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-5xl">
          
          {}
          <div className="mb-16 border-b-2 border-black pb-8">
              <div className="flex items-center gap-2 mb-4 text-red-600 animate-pulse">
                  <Lock size={16} />
                  <span className="font-mono text-xs uppercase font-bold tracking-[0.2em]">Top Secret</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-4 uppercas leading-none">
                The Legendary<br/>Doctrine
              </h1>
              <p className="text-xl text-secondary max-w-2xl border-l-4 border-gray-200 pl-6 py-1">
                  We are not just a team. We are a sovereign state of engineering excellence. These are the laws that govern our code.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {}
              <div className="lg:col-span-4 space-y-8">
                  <Card className="p-6 bg-black text-white rounded-none">
                      <h4 className="font-mono text-xs uppercase text-gray-500 mb-4 border-b border-gray-800 pb-2">Status Report</h4>
                      <div className="space-y-4 font-mono text-sm">
                          <div className="flex justify-between"><span>OPERATIVES</span> <span>004</span></div>
                          <div className="flex justify-between"><span>MISSIONS</span> <span>ACTIVE</span></div>
                          <div className="flex justify-between"><span>MORALE</span> <span>100%</span></div>
                          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500">
                             LAST UPDATE: {new Date().toLocaleDateString()}
                          </div>
                      </div>
                  </Card>
                  
                  <div className="text-xs font-mono text-gray-400">
                      <p className="mb-2">ENCRYPTION: AES-256</p>
                      <p>PROTOCOL: OMEGA</p>
                  </div>
              </div>

              {}
              <div className="lg:col-span-8 space-y-16">
                  
                  {}
                  <section>
                      <h2 className="text-2xl font-bold bg-black text-white inline-block px-2 py-1 mb-8 uppercase">01. Core Philosophy</h2>
                      <div className="space-y-8">
                          <Tenet 
                             num="01"
                             icon={Code}
                             title="Code is Law"
                             desc="We believe in the absolute authority of functional code. Arguments are irrelevant; execution is everything. If it runs, it rules."
                          />
                          <Tenet 
                             num="02"
                             icon={Shield}
                             title="Radical Simplicity"
                             desc="Complexity is the enemy of security. We strip away the non-essential until only the pure, functioning core remains."
                          />
                          <Tenet 
                             num="03"
                             icon={Cpu}
                             title="Human-Machine Symbiosis"
                             desc="We do not fear AI; we fuse with it. We leverage intelligence amplification to achieve 10x output."
                          />
                      </div>
                  </section>

                  {}
                  <section>
                      <h2 className="text-2xl font-bold bg-black text-white inline-block px-2 py-1 mb-8 uppercase">02. Global Ambition</h2>
                      <div className="prose text-secondary mb-8">
                          <p className="mb-4">
                              Our objective is not merely to build apps, but to construct the digital infrastructure of the next century. From decentralized protocol layers to hyper-scale consumer interfaces.
                          </p>
                          <blockquote className="border-l-4 border-black pl-4 italic text-black text-lg font-medium">
                              "We are building the tools that will build the future."
                          </blockquote>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50 border border-gray-200">
                              <Globe size={24} className="mb-2 text-black" />
                              <h4 className="font-bold text-sm">Global Reach</h4>
                          </div>
                          <div className="p-4 bg-gray-50 border border-gray-200">
                              <Terminal size={24} className="mb-2 text-black" />
                              <h4 className="font-bold text-sm">System Control</h4>
                          </div>
                      </div>
                  </section>

              </div>
          </div>

      </div>
    </main>
  );
};

export default ManifestoPage;
