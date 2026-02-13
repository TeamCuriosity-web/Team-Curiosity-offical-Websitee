import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../../services/api';
import { Send, Hash, Users, Terminal as TerminalIcon } from 'lucide-react';
import Card from '../ui/Card';


const SOCKET_URL = 'https:
const socket = io(SOCKET_URL);

const ChatPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState('general');
    const [message, setMessage] = useState('');
    const [projects, setProjects] = useState([]);
    const [messageList, setMessageList] = useState([]);
    const bottomRef = useRef(null);

    const [typingUsers, setTypingUsers] = useState(new Set());
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);

        
        const fetchData = async () => {
            try {
                
                const historyRes = await api.get(`/chat/history?room=${room}`);
                setMessageList(historyRes.data);
                scrollToBottom();

                
                const projectsRes = await api.get('/projects');
                setProjects(projectsRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };
        fetchData();

        
        socket.emit('join_room', room);

        
        const handleReceiveMessage = (data) => {
             
             if(data.room === room) {
                setMessageList((list) => [...list, data]);
                scrollToBottom();
             }
        };

        
        const handleDisplayTyping = (data) => {
            if (data.room === room && data.senderId !== (storedUser.id || storedUser._id)) {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(data.senderName);
                    return newSet;
                });
                scrollToBottom();
            }
        };

        const handleHideTyping = (data) => {
            if (data.room === room) {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(data.senderName);
                    return newSet;
                });
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('display_typing', handleDisplayTyping);
        socket.on('hide_typing', handleHideTyping);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('display_typing', handleDisplayTyping);
            socket.off('hide_typing', handleHideTyping);
        };
    }, [room, navigate]);

    const handleInput = (e) => {
        setMessage(e.target.value);

        if (!user) return;

        
        socket.emit('typing', { 
            room, 
            senderName: user.name, 
            senderId: user.id || user._id 
        });

        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop_typing', { 
                room, 
                senderName: user.name, 
                senderId: user.id || user._id 
            });
        }, 2000);
    };

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const messageData = {
            room: room,
            senderId: user.id || user._id, 
            sender: user, 
            content: message,
            timestamp: new Date().toISOString(),
        };

        await socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setMessage('');
        scrollToBottom();
    };

    
    const switchRoom = (newRoom) => {
        setRoom(newRoom);
        setMessageList([]); 
    };

    if (!user) return null;

    return (
        <div className="h-screen overflow-hidden pt-20 pb-4 bg-gray-50 flex flex-col">
            <div className="flex-1 container mx-auto px-4 max-w-6xl flex gap-4 h-full min-h-0">
                {}
                <div className="hidden md:flex w-64 flex-col gap-4 h-full">
                    <Card className="flex-1 flex flex-col bg-white border-black/10 shadow-lg relative overflow-hidden !p-0">
                        {}
                        <div className="p-4 flex-none border-b flex items-center gap-2 text-black font-bold uppercase tracking-widest bg-white z-10">
                            <TerminalIcon size={16} /> Project Channels
                        </div>

                        {}
                        <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-1 custom-scrollbar">
                            <div 
                                onClick={() => switchRoom('general')}
                                className={`px-3 py-2 rounded font-mono text-sm flex items-center gap-2 cursor-pointer transition-colors ${room === 'general' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Hash size={14} /> general
                            </div>
                            
                            {projects.map((proj) => (
                                <div 
                                    key={proj._id}
                                    onClick={() => switchRoom(proj.title)}
                                    className={`px-3 py-2 rounded font-mono text-sm flex items-center gap-2 cursor-pointer transition-colors ${room === proj.title ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <Hash size={14} /> {proj.title.toLowerCase().replace(/\s+/g, '-')}
                                </div>
                            ))}
                        </div>

                        {}
                        <div className="p-4 flex-none border-t bg-white z-10">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase">
                                <Users size={12} /> Team Online: 1
                            </div>
                        </div>
                    </Card>
                </div>

                {}
                <Card className="flex-1 flex flex-col bg-white border-black/10 shadow-lg relative overflow-hidden !p-0 h-full">
                    {}
                    <div className="p-4 flex-none border-b flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-2">
                            <Hash size={20} className="text-gray-400" />
                            <h2 className="font-bold text-lg">general</h2>
                        </div>
                         <div className="text-xs font-mono text-gray-400 uppercase">
                             Encrypted • Live
                         </div>
                    </div>

                    {}
                    <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-dots-pattern custom-scrollbar">
                        {messageList.map((msg, index) => {
                            
                            const currentUserId = user.id || user._id;
                            const msgSenderId = msg.sender?._id || msg.sender?.id || msg.sender;
                            
                            
                            

                            
                            const isMe = 
                                (currentUserId && msgSenderId) && (
                                    (typeof msgSenderId === 'string' && msgSenderId === currentUserId) ||
                                    (msgSenderId?.toString() === currentUserId?.toString())
                                );

                            const senderName = msg.sender?.name || 'Unknown Agent';
                            const senderRole = msg.sender?.role || 'operative';
                            
                            return (
                                <div key={index} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-black/10 flex-shrink-0 ${isMe ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
                                        {senderName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold font-mono">{senderName}</span>
                                            <span className="text-[10px] text-gray-400 uppercase border px-1 rounded">{senderRole}</span>
                                            <span className="text-[10px] text-gray-300">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg text-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-black rounded-tl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {typingUsers.size > 0 && (
                            <div className="flex items-center gap-2 pl-4 pb-2 text-xs font-mono text-gray-500 animate-pulse">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                                {Array.from(typingUsers).join(', ')} is typing...
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {}
                    <div className="p-4 border-t bg-white flex-none z-10">
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={handleInput}
                                placeholder="Transmit message to channel..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                            <button 
                                type="submit" 
                                className="bg-black text-white px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center transform active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ChatPage;
