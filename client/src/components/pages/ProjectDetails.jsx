import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Code2, GitBranch, Globe, Cpu, UserPlus, Lock } from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    
    const user = JSON.parse(localStorage.getItem('user'));
    // Safe check if teamMembers exists and is array, and if user is in it
    const isMember = project?.teamMembers?.includes(user?._id);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data);
            } catch (err) {
                console.error("Failed to load project details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleJoinProject = async () => {
        if (!user) return;
        setJoining(true);
        try {
            const { data } = await api.post(`/projects/${id}/join`);
            setProject(data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to join project');
        } finally {
            setJoining(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-xs">DECRYPTING FILE...</div>;
    if (!project) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-red-500">FILE CORRUPTED OR NOT FOUND</div>;

    const getDifficultyColor = (level) => {
        switch(level) {
            case 'beginner': return 'text-green-500 border-green-500';
            case 'intermediate': return 'text-yellow-500 border-yellow-500';
            case 'advanced': return 'text-orange-500 border-orange-500';
            case 'legendary': return 'text-purple-500 border-purple-500';
            default: return 'text-gray-500 border-gray-500';
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 container mx-auto animate-fade-in">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-black mb-8 transition-colors">
                <ArrowLeft size={16} /> RETURN TO PROJECTS
            </Link>

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
                        <h2 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight mb-6">
                            <Shield size={20} /> Mission Briefing
                        </h2>
                        <div className="prose prose-lg text-gray-800 leading-relaxed whitespace-pre-line">
                            {project.longDescription || "No detailed briefing available for this operation."}
                        </div>
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

                        {/* Join Project Button */}
                        {user ? (
                            isMember ? (
                                <div className="w-full bg-green-50 text-green-700 border border-green-200 p-4 rounded text-center font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <Shield size={16} /> Active Operative
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
