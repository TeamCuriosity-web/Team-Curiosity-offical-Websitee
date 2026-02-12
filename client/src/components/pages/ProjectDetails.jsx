import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Code2, GitBranch, Globe, Cpu, UserPlus, Lock, Activity } from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';
import ForkInstructionsModal from '../ui/ForkInstructionsModal';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));
    // Safe check if teamMembers exists and is array, and if user is in it
    // Safe check: teamMembers is array of objects (populated) or strings (if not populated)
    const isMember = project?.teamMembers?.some(member => 
        (typeof member === 'string' ? member : member._id) === user?._id
    );

    const [isForkModalOpen, setIsForkModalOpen] = useState(false);
    const [contributors, setContributors] = useState([]);

    const [isForkModalOpen, setIsForkModalOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
             // ... existing code ...
        };
        fetchProject();
    }, [id]);

    const handleJoinProject = async () => {
        // ... existing code ...
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs">DECRYPTING FILE...</div>;
    if (!project) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-red-500">FILE CORRUPTED OR NOT FOUND</div>;

    const getDifficultyColor = (level) => {
         // ... existing code ...
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 container mx-auto animate-fade-in">
            {/* ... existing header and content ... */}
            
            <ForkInstructionsModal 
                isOpen={isForkModalOpen} 
                onClose={() => setIsForkModalOpen(false)} 
                repoLink={project.repoLink} 
            />

            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-black mb-8 transition-colors">
                <ArrowLeft size={16} /> RETURN TO PROJECTS
            </Link>

            {/* ... rest of the component ... */}
            
            {/* Sidebar content where button is located */}
                        {/* Join / Open Project Button */}
                        {user ? (
                            isMember ? (
                                <div className="space-y-3">
                                    <div className="w-full bg-green-50 text-green-700 border border-green-200 p-4 rounded text-center font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                        <Shield size={16} /> Active Operative
                                    </div>
                                    <Button 
                                        onClick={() => setIsForkModalOpen(true)}
                                        variant="outline" 
                                        className="w-full justify-center gap-2 py-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <Code2 size={16} /> FORK TO DEVICE (VS CODE)
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-400 font-mono">Clones repository to your local workspace</p>
                                </div>
                            ) : (
                                <Button onClick={handleJoinProject} variant="outline" className="w-full justify-center gap-2 py-4 border-black hover:bg-black hover:text-white transition-all">
                                    <UserPlus size={16} /> REQUEST ASSIGNMENT (JOIN)
                                </Button>
                            )
                        ) : (
                            <Link to="/login" className="w-full">
                                <Button variant="outline" className="w-full justify-center gap-2 py-4 opacity-50 hover:opacity-100">
                                    <Lock size={16} /> LOGIN TO JOIN OPERATION
                                </Button>
                            </Link>
                        )}

            {/* Header */}
            <header className="mb-12 border-b border-black pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <span className="font-mono text-xs bg-black text-white px-2 py-1 rounded uppercase tracking-widest">
                                {project.status}
                             </span>
                             <span className={`font-mono text-xs border px-2 py-1 rounded uppercase tracking-widest ${getDifficultyColor(project.difficulty)}`}>
                                {project.difficulty || 'Analysis Pending'}
                             </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">{project.title}</h1>
                    </div>
                </div>
                <p className="text-xl md:text-2xl text-secondary max-w-3xl leading-relaxed">
                    {project.description}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <div className="flex justify-between items-end mb-4">
                             <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight">
                                <Activity size={20} /> Mission Progress
                            </h2>
                            <span className="font-mono text-2xl font-bold">{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
                             <div 
                                className="h-full bg-green-500 transition-all duration-1000 ease-out relative overflow-hidden" 
                                style={{ width: `${project.progress || 0}%` }}
                             >
                                 <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                             </div>
                        </div>
                         <p className="text-secondary font-mono text-xs text-right uppercase">
                            {project.progress === 100 ? 'Mission Accomplished' : project.progress > 0 ? 'Operation in Progress' : 'Not Started'}
                        </p>
                    </section>

                     <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight mb-6">
                            <Shield size={20} /> Mission Briefing
                        </h2>
                        <div className="prose prose-lg text-gray-800 leading-relaxed whitespace-pre-line">
                            {project.longDescription || "No detailed briefing available for this operation."}
                        </div>
                     </section>

                     <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight mb-6">
                            <UserPlus size={20} /> Active Operatives
                        </h2>
                        {project.teamMembers && project.teamMembers.length > 0 ? (
                            <div className="flex flex-wrap gap-6">
                                {project.teamMembers.map(member => (
                                    <div key={member._id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg min-w-[200px]">
                                        <img 
                                            src={member.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}`} 
                                            alt={member.name} 
                                            className="w-10 h-10 rounded-full bg-gray-200"
                                        />
                                        <div>
                                            <div className="font-bold text-sm">{member.name}</div>
                                            <div className="text-[10px] text-gray-500 font-mono">OPERATIVE</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="font-mono text-sm text-gray-400">NO AGENTS ASSIGNED.</p>
                        )}
                     </section>

                     <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight mb-6">
                            <GitBranch size={20} /> Code Contributors
                        </h2>
                        {contributors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {contributors.map(contributor => (
                                    <a 
                                        key={contributor.id} 
                                        href={contributor.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-black transition-colors group"
                                    >
                                        <img src={contributor.avatar_url} alt={contributor.login} className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black transition-colors" />
                                        <div>
                                            <div className="font-bold text-lg">{contributor.login}</div>
                                            <div className="font-mono text-xs text-gray-500">{contributor.contributions} COMMITS</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="font-mono text-sm text-gray-400">AWAITING GITHUB DATA SYNC...</p>
                        )}
                     </section>

                     <section>
                        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight mb-6">
                            <Cpu size={20} /> Tech Stack Architecture
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map(tech => (
                                <div key={tech} className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg flex items-center gap-2">
                                    <Code2 size={16} className="text-gray-400" />
                                    <span className="font-mono text-sm font-bold uppercase">{tech}</span>
                                </div>
                            ))}
                        </div>
                     </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-black text-white p-8 rounded-lg">
                        <h3 className="font-bold text-xl mb-6 uppercase tracking-widest text-gray-400">Eligibility Analysis</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-mono mb-2 text-gray-400">
                                    <span>COMPLEXITY</span>
                                    <span>
                                        {project.difficulty === 'beginner' ? '25%' : 
                                         project.difficulty === 'intermediate' ? '50%' : 
                                         project.difficulty === 'advanced' ? '75%' : '99%'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                     <div className={`h-full ${project.difficulty === 'legendary' ? 'bg-purple-500' : 'bg-white'} w-[${
                                         project.difficulty === 'beginner' ? '25%' : 
                                         project.difficulty === 'intermediate' ? '50%' : 
                                         project.difficulty === 'advanced' ? '75%' : '99%'
                                     }]`}></div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-4">
                                This project requires 
                                <span className={`font-bold uppercase ml-1 ${
                                    project.difficulty === 'legendary' ? 'text-purple-400' : 'text-white'
                                }`}>
                                    {project.difficulty}
                                </span> level skills in {project.techStack.slice(0,2).join(' & ')}. Ensure capability before initialization.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {project.repoLink && (
                            <a href={project.repoLink} target="_blank" rel="noreferrer" className="w-full">
                                <Button variant="outline" className="w-full justify-center gap-2 py-4">
                                    <GitBranch size={16} /> ACCESS REPOSITORY
                                </Button>
                            </a>
                        )}
                        {project.liveLink && (
                             <a href={project.liveLink} target="_blank" rel="noreferrer" className="w-full">
                                <Button variant="primary" className="w-full justify-center gap-2 py-4">
                                    <Globe size={16} /> LAUNCH LIVE UPLINK
                                </Button>
                            </a>
                        )}

                        {/* Join / Open Project Button */}
                        {user ? (
                            isMember ? (
                                <div className="space-y-3">
                                    <div className="w-full bg-green-50 text-green-700 border border-green-200 p-4 rounded text-center font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                        <Shield size={16} /> Active Operative
                                    </div>
                                    <Button 
                                        onClick={() => setIsForkModalOpen(true)}
                                        variant="outline" 
                                        className="w-full justify-center gap-2 py-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <Code2 size={16} /> FORK TO DEVICE (VS CODE)
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-400 font-mono">Clones repository to your local workspace</p>
                                </div>
                            ) : (
                                <Button onClick={handleJoinProject} variant="outline" className="w-full justify-center gap-2 py-4 border-black hover:bg-black hover:text-white transition-all">
                                    <UserPlus size={16} /> REQUEST ASSIGNMENT (JOIN)
                                </Button>
                            )
                        ) : (
                            <Link to="/login" className="w-full">
                                <Button variant="outline" className="w-full justify-center gap-2 py-4 opacity-50 hover:opacity-100">
                                    <Lock size={16} /> LOGIN TO JOIN OPERATION
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
};

export default ProjectDetails;
