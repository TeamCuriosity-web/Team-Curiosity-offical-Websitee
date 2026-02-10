import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Terminal, Users, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { useScrollReveal } from '../../utils/animations';

const ChatGlimpse = () => {
    const [recentMessages, setRecentMessages] = useState([]);
    const [onlineCount, setOnlineCount] = useState(1); // Mock for now
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useScrollReveal(containerRef, { mode: 'up', distance: 20 });
    
    // Scale up the chat window like it's opening
    useScrollReveal(contentRef, { mode: 'scale', duration: 0.8, delay: 0.2 });

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                // Determine API URL based on environment
                const baseUrl = 'https://team-curiosity-offical-websitee.onrender.com/api';
                // Adjust fetch logic if needed, reusing api instance
                const { data } = await api.get('/chat/history?room=general'); 
                setRecentMessages(data.slice(0, 3)); // Show only last 3
            } catch (err) {
                console.error("Failed to fetch chat preview");
            }
        };
        fetchPreview();
    }, []);

    // Remove early return
    // if (recentMessages.length === 0) return null;

    return (
        <section ref={containerRef} className="py-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 flex items-center gap-3">
                        LIVE COMMS <span className="animate-pulse text-green-500 text-6xl">•</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        Real-time intelligence sharing. Join the <span className="font-mono bg-gray-100 px-1 rounded text-black">#general</span> channel to coordinate with the team.
                    </p>
                </div>
                <Link to="/chat">
                    <button className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all">
                        Open Secure Frequency <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </Link>
            </div>

            <div ref={contentRef} className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Terminal size={120} />
                </div>
                
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                     <div className="flex items-center gap-2 font-mono font-bold text-sm uppercase">
                        <Hash size={16} /> general
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-gray-500 uppercase">
                        <Users size={14} /> {onlineCount} Operative(s) Online
                    </div>
                </div>

                <div className="space-y-4">
                    {recentMessages.length > 0 ? (
                        recentMessages.map((msg) => (
                        <div key={msg._id} className="flex gap-3 items-start opacity-70 hover:opacity-100 transition-opacity">
                            <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-[10px] font-bold mt-1">
                                {(msg.sender?.name || 'U').charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold font-mono">{msg.sender?.name || 'Unknown'}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 line-clamp-1">{msg.content}</p>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="text-center py-8 opacity-50 font-mono text-sm">
                            <div className="mb-2">NO ACTIVE TRANSMISSIONS</div>
                            <div className="text-xs">Secure Channel Idle</div>
                        </div>
                    )}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <Link to="/chat" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                        View all transmissions
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ChatGlimpse;
