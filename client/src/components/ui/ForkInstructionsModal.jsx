import React, { useState } from 'react';
import { X, Copy, Check, GitFork, Terminal, Code2, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

const ForkInstructionsModal = ({ isOpen, onClose, repoLink }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    
    const safeRepoLink = repoLink || '';
    const cloneCommand = `git clone ${safeRepoLink}.git`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cloneCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
                {}
                <div className="bg-black text-white p-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                            <Code2 className="text-blue-400" size={18} /> 
                            Initialize Local Environment
                        </h2>
                        <p className="text-gray-400 text-[10px] font-mono mt-0.5">FOLLOW PROTOCOL TO SYNC MISSION DATA</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {}
                <div className="p-6 space-y-6">
                    
                    {}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 text-sm">1</div>
                        <div className="space-y-2 w-full">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <GitFork size={16} /> Fork Repository
                                <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">REQUIRED</span>
                            </h3>
                            <p className="text-xs text-gray-600">Create your own copy of the mission files on GitHub.</p>
                            <a 
                                href={safeRepoLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded transition-colors"
                            >
                                Open GitHub Repo <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>

                    {}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold border border-purple-200 text-sm">2</div>
                        <div className="space-y-2 w-full">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <Terminal size={16} /> Clone to Device
                            </h3>
                            <p className="text-xs text-gray-600">Run this command in your local terminal or VS Code.</p>
                            <div className="bg-gray-900 text-gray-300 p-3 rounded-lg font-mono text-[10px] flex justify-between items-center group">
                                <code className="break-all">{cloneCommand}</code>
                                <button 
                                    onClick={handleCopy}
                                    className="ml-2 p-1.5 hover:bg-gray-700 rounded transition-colors text-white"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold border border-green-200 text-sm">3</div>
                        <div className="space-y-2 w-full">
                            <h3 className="font-bold flex items-center gap-2 text-sm">
                                <Code2 size={16} /> Launch VS Code (Optional)
                            </h3>
                            <p className="text-xs text-gray-600">Try opening VS Code directly (may require permission).</p>
                             <button 
                                onClick={() => {
                                    let url = safeRepoLink;
                                    if (!url.endsWith('.git')) url += '.git';
                                    window.location.href = `vscode:
                                }}
                                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline border border-blue-100 bg-blue-50 px-3 py-1.5 rounded"
                            >
                                Attempt Direct Launch
                            </button>
                        </div>
                    </div>

                </div>

                {}
                <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-4 py-1.5 text-xs">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForkInstructionsModal;
