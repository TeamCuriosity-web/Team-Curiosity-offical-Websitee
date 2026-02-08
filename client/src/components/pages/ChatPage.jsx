import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../../services/api';
import { Send, Hash, Users, Terminal as TerminalIcon } from 'lucide-react';
import Card from '../ui/Card';

// Connect to socket backend
const SOCKET_URL = 'https://team-curiosity-offical-websitee.onrender.com';
const socket = io(SOCKET_URL);

const ChatPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState('general');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);

        // Fetch history
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/chat/history?room=${room}`);
                setMessageList(data);
                scrollToBottom();
            } catch (err) {
                console.error("Failed to fetch chat history");
            }
        };
        fetchHistory();

        // Join Room
        socket.emit('join_room', room);

        // Listen for messages
        const handleReceiveMessage = (data) => {
             setMessageList((list) => [...list, data]);
             scrollToBottom();
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [room, navigate]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const messageData = {
            room: room,
            senderId: user.id || user._id, // Ensure ID is present
            sender: user, // For immediate UI update (optimistic or self)
            content: message,
            timestamp: new Date().toISOString(),
        };

        await socket.emit('send_message', messageData);
        setMessageList((list) => [...list, messageData]);
        setMessage('');
        scrollToBottom();
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-20 pb-10 bg-gray-50 flex flex-col">
            <div className="flex-1 container mx-auto px-4 max-w-6xl flex gap-4 h-[calc(100vh-140px)]">
                {/* Sidebar */}
                <div className="hidden md:flex w-64 flex-col gap-4">
                    <Card className="p-4 flex-1 flex flex-col bg-white border-black/10 shadow-lg">
                        <div className="flex items-center gap-2 mb-6 text-black font-bold uppercase tracking-widest border-b pb-2">
                            <TerminalIcon size={16} /> Secure Comms
                        </div>

                        <div className="space-y-1">
                            <div className="px-3 py-2 bg-black text-white rounded font-mono text-sm flex items-center gap-2 cursor-pointer">
                                <Hash size={14} /> general
                            </div>
                             {/* Future channels can go here */}
                             <div className="px-3 py-2 text-gray-400 hover:bg-gray-100 rounded font-mono text-sm flex items-center gap-2 cursor-pointer transition-colors">
                                <Hash size={14} /> missions (LOCKED)
                            </div>
                        </div>

                        <div className="mt-auto border-t pt-4">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase">
                                <Users size={12} /> Team Online: 1
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col bg-white border-black/10 shadow-lg relative overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-2">
                            <Hash size={20} className="text-gray-400" />
                            <h2 className="font-bold text-lg">general</h2>
                        </div>
                         <div className="text-xs font-mono text-gray-400 uppercase">
                             Encrypted • Live
                         </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dots-pattern">
                        {messageList.map((msg, index) => {
                            // Robust ID comparison
                            const currentUserId = user.id || user._id;
                            const msgSenderId = msg.sender?._id || msg.sender?.id || msg.sender;
                            
                            // Check if the message sender matches current user
                            // specific check for optimistic updates where sender might be the user object
                            const isMe = 
                                (typeof msgSenderId === 'string' && msgSenderId === currentUserId) ||
                                (msgSenderId?.toString() === currentUserId?.toString());

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
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white">
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
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
