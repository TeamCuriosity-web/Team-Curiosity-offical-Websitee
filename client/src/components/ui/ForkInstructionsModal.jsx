import React, { useState } from 'react';
import { X, Copy, Check, GitFork, Terminal, Code2, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

const ForkInstructionsModal = ({ isOpen, onClose, repoLink }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // Ensure repoLink is valid
    const safeRepoLink = repoLink || '';
    const cloneCommand = `git clone ${safeRepoLink}.git`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cloneCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-black text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
                            <Code2 className="text-blue-400" size={24} /> 
                            Initialize Local Environment
                        </h2>
                        <p className="text-gray-400 text-xs font-mono mt-1">FOLLOW PROTOCOL TO SYNC MISSION DATA</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                    
                    {/* Step 1: Fork */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200">1</div>
                        <div className="space-y-3 w-full">
                            <h3 className="font-bold flex items-center gap-2">
                                <GitFork size={18} /> Fork Repository
                                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">REQUIRED</span>
                            </h3>
                            <p className="text-sm text-gray-600">Create your own copy of the mission files on GitHub.</p>
                            <a 
                                href={safeRepoLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-gray-900 hover:bg-black px-4 py-2 rounded transition-colors"
                            >
                                Open GitHub Repo <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>

                    {/* Step 2: Clone */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold border border-purple-200">2</div>
                        <div className="space-y-3 w-full">
                            <h3 className="font-bold flex items-center gap-2">
                                <Terminal size={18} /> Clone to Device
                            </h3>
                            <p className="text-sm text-gray-600">Run this command in your local terminal or VS Code.</p>
                            <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-xs flex justify-between items-center group">
                                <code className="break-all">{cloneCommand}</code>
                                <button 
                                    onClick={handleCopy}
                                    className="ml-4 p-2 hover:bg-gray-700 rounded transition-colors text-white"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Open (Optional Helper) */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold border border-green-200">3</div>
                        <div className="space-y-3 w-full">
                            <h3 className="font-bold flex items-center gap-2">
                                <Code2 size={18} /> Launch VS Code (Optional)
                            </h3>
                            <p className="text-sm text-gray-600">Try opening VS Code directly (may require permission).</p>
                             <button 
                                onClick={() => {
                                    let url = safeRepoLink;
                                    if (!url.endsWith('.git')) url += '.git';
                                    window.location.href = `vscode://vscode.git/clone?url=${encodeURIComponent(url)}`;
                                }}
                                className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:underline border border-blue-100 bg-blue-50 px-3 py-2 rounded"
                            >
                                Attempt Direct Launch
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <Button variant="outline" onClick={onClose} className="px-6">
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ForkInstructionsModal;
