import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Server, Activity, Lock, Database } from 'lucide-react';
import api from '../../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Ongoing');



    const filteredProjects = projects.filter(p => (p.status || 'ongoing').toLowerCase() === activeTab.toLowerCase());

    useEffect(() => {
        const fetchProjects = async () => {
             try {
                 const { data } = await api.get('/projects');
                 setProjects(data);
             } catch (err) {
                 console.error('Failed to load projects');
             } finally {
                 setLoading(false);
             }
        };
        fetchProjects();
    }, []);

  if (loading) return <div className="py-24 text-center font-mono text-xs">SCANNING NETWORK...</div>;

  return (
    <main className="container mx-auto px-6 pt-32 pb-20 animate-fade-in">
    <section className="py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-black pb-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black tracking-tighter uppercase">Active Projects</h2>
            <p className="text-secondary font-mono text-sm">System infrastructure and live services.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-green-600">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            ALL SYSTEMS GREEN
          </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {['Upcoming', 'Ongoing', 'Completed'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project, idx) => (
            <div 
                key={project._id} 
                onClick={() => window.location.href = `/projects/${project._id}`}
                className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] cursor-pointer"
            >
                
                <div className="flex items-center gap-6 w-full md:w-1/3">
                    <div className="p-3 bg-gray-100 rounded border border-black text-black group-hover:bg-white group-hover:text-black transition-colors">
                        <Server size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-gray-500 group-hover:text-gray-400">DEP-00{idx + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">{project.title}</h3>
                    </div>
                </div>

                <div className="hidden md:block w-1/3">
                    <p className="text-sm font-mono text-secondary group-hover:text-gray-300">{project.description}</p>
                    <div className="flex gap-2 mt-2">
                         {project.techStack?.map(tech => (
                             <span key={tech} className="text-[10px] border border-gray-300 px-1 rounded group-hover:border-gray-600 group-hover:text-gray-400">{tech}</span>
                         ))}
                    </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-1/3 pl-0 md:pl-10 mt-4 md:mt-0">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-secondary group-hover:text-gray-400">Status</p>
                        <p className="font-mono text-sm">{project.status}</p>
                    </div>
                    <div className="text-right mx-6">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-secondary group-hover:text-gray-400">Difficulty</p>
                        <p className="font-mono text-sm uppercase">{project.difficulty || 'N/A'}</p>
                    </div>
                    <a 
                        href={project.repoLink && project.repoLink.length > 4 ? project.repoLink : '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        onClick={(e) => { e.stopPropagation(); if(!project.repoLink || project.repoLink.length <= 4) e.preventDefault(); }}
                        className="p-2 rounded-full transition-all duration-300 z-10 relative text-secondary hover:bg-gray-100 group-hover:bg-white group-hover:text-black"
                    >
                         <ArrowUpRight className="transition-transform duration-300 group-hover:rotate-45" />
                    </a>
                </div>

            </div>
        ))}
        {filteredProjects.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded font-mono text-sm text-gray-400 uppercase">
                NO {activeTab} PROJECTS FOUND.
            </div>
        )}
      </div>
    </section>
    </main>
  );
};

export default Projects;
