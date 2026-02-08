import React, { useRef } from 'react';
import { Code2, Database, LayoutTemplate } from 'lucide-react';
import { useScrollReveal } from '../../utils/animations';

const About = () => {
  const containerRef = useRef(null);

  useScrollReveal(containerRef, { selector: '.capability-card', mode: 'up', distance: 60, duration: 0.8, stagger: 0.2 });
  useScrollReveal(containerRef, { selector: '.about-header', mode: 'left', distance: 30 });

  const capabilities = [
    {
      icon: <LayoutTemplate size={32} />,
      title: "Frontend Engineering",
      description: "Pixel-perfect implementation of complex UIs.",
      stack: ["React", "Tailwind", "GSAP", "Three.js"]
    },
    {
      icon: <Database size={32} />,
      title: "Backend Systems",
      description: "Robust APIs and scalable data architecture.",
      stack: ["Node.js", "PostgreSQL", "Go", "Docker"]
    },
    {
      icon: <Code2 size={32} />,
      title: "Creative Development",
      description: "Interactive experiences and WebGL shaders.",
      stack: ["WebGL", "GLSL", "Canvas", "Blender"]
    }
  ];

  return (
    <section ref={containerRef} className="py-24">
      <div className="about-header flex flex-col md:flex-row justify-between items-end mb-12 px-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-black tracking-tight">Technical Arsenal</h2>
            <p className="text-secondary max-w-md">The tools we use to ship products.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {capabilities.map((cap, idx) => (
            <div key={idx} className="capability-card group bg-white rounded-lg p-6 flex flex-col items-start h-full border border-border hover:border-black hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="mb-6 p-3 bg-gray-50 rounded-lg text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    {cap.icon}
                </div>
                
                <h3 className="text-xl font-bold text-black mb-2">{cap.title}</h3>
                <p className="text-secondary text-sm mb-6 leading-relaxed flex-grow">
                    {cap.description}
                </p>

                <div className="w-full pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                        {cap.stack.map(tech => (
                            <span key={tech} className="text-xs font-mono bg-gray-100 text-secondary px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default About;
