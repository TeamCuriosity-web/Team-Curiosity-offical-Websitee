import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, MessageSquare, ChevronRight, Terminal } from 'lucide-react';
import Card from '../ui/Card';

// Images (using the generated filenames)
import guideJoin from '../../../assets/images/guide_join_process_1770538053859.png'; // Will move these
import guideProjects from '../../../assets/images/guide_project_hub_1770538071126.png';
import guideComms from '../../../assets/images/guide_comms_network_1770538086227.png'; // Placeholder path, I need to check where to put them or if I can reference artifacts. 
// Actually, since I cannot move files easily with existing tools, I'll assume they are in artifacts and I should probably ask user to move them or use a placeholder URL if I can't access them directly.
// BUT, the system prompt says "If you are embedding a file in an artifact... copy the file". 
// I will use a relative path assuming I might be able to reference them if I move them? 
// No, I'll use the absolute path for now or better, I will assume I need to handle these images.
// Wait, I can't natively "move" the generated images into the src/assets folder with the tools provided (unless run_command 'mv' works, but windows 'move').
// I will try to use the absolute paths for now for local dev, or just standard placeholders if I can't.
// Actually, the user can see artifacts. I will use the ARTIFACT PATHS ? No, browser can't see that.
// I will use a placeholder for now and tell the user to check the artifacts.
// RE-READ: "The resulting image will be saved as an artifact".
// I will use a clever trick: I will just use the filenames and instruct the user that "Images are generated, please move them to client/src/assets/images".
// OR I can use `run_command` to move them! 
// "Operating System: windows. Shell: powershell."
// I can do: `move "C:\Users\...\Start.png" "d:\My team\client\src\assets\images\..."`
// I will do that in the next step. for now, import from assets.

const GuidePage = () => {
    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        OPERATIVE <span className="text-secondary">MANUAL</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-mono">
                        // PROTOCOL V2.0: Guide to navigating the Team Curiosity Network.
                    </p>
                </div>

                {/* Step 1: Registration */}
                <section className="mb-32 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-black group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="/src/assets/images/guide_join.png" alt="Registration Interface" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                            {/* NOTE: I will rename the files when moving them */}
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <Shield className="text-black" /> Identity Verification
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Access to the network is restricted. Initiates must complete the <strong>Registration Protocol</strong>. 
                            If you possess a valid <strong>Invite Token</strong>, your clearance will be granted immediately. 
                            Without a token, you must wait for manual approval from the <span className="font-mono bg-gray-100 px-1 rounded">High Command</span> (Admins).
                        </p>
                        <div className="pt-4">
                            <Link to="/join">
                                <button className="px-6 py-3 border-2 border-black text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-sm">
                                    Initiate Sequence
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Step 2: Projects */}
                <section className="mb-32 flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="w-full md:w-1/2">
                         <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-black group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="/src/assets/images/guide_projects.png" alt="Project Hub" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <Target className="text-black" /> Mission Command
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            The <strong>Projects Hub</strong> is your central workspace. View active missions, track progress, 
                            and join development squads. Use the dashboard to filter by status (Ongoing, Completed) and 
                            access detailed mission dossiers. Only approved operatives can view sensitive project data.
                        </p>
                        <ul className="space-y-2 font-mono text-sm text-gray-500">
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Access Real-time Updates</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> View Tech Stacks</li>
                            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div> Check Github Repos</li>
                        </ul>
                    </div>
                </section>

                {/* Step 3: Comms */}
                <section className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                         <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-black group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="/src/assets/images/guide_comms.png" alt="Secure Comms" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                        <h2 className="text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
                            <MessageSquare className="text-black" /> Secure Comms
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Establish encrypted communication lines with the team via the <strong>Live Comms</strong> channel. 
                            This secure frequency allows for real-time tactical discussions. The system features:
                        </p>
                         <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="p-4 bg-gray-50 border border-gray-100 rounded">
                                 <Terminal size={20} className="mb-2 text-black"/>
                                 <h4 className="font-bold text-xs uppercase">Live Typing</h4>
                                 <p className="text-xs text-gray-500 mt-1">Real-time status indicators</p>
                             </div>
                             <div className="p-4 bg-gray-50 border border-gray-100 rounded">
                                 <Shield size={20} className="mb-2 text-black"/>
                                 <h4 className="font-bold text-xs uppercase">Role Badges</h4>
                                 <p className="text-xs text-gray-500 mt-1">Identify Admin/Members</p>
                             </div>
                         </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="mt-32 p-12 bg-black text-white rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-6 uppercase tracking-tight">Ready to Deploy?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            The network is waiting. Verify your clearace and begin your first mission.
                        </p>
                        <Link to="/">
                            <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded">
                                Return to Base
                            </button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GuidePage;
