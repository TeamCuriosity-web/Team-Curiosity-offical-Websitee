import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Terminal } from 'lucide-react';
import Button from '../ui/Button';
import CharacterTween from '../ui/CharacterTween';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    { name: 'Projects', path: '/projects' },
    { name: 'Hackathons', path: '/hackathons' },
    { name: 'Comms', path: '/chat' },
    { name: 'Study Stuff', path: '/study-stuff' },
  ];

  if (location.pathname === '/invite') return null;

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-transparent ${scrolled ? 'border-border' : ''}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo - Abstract Kinetic Emblem */}
            <Link to="/" className="flex items-center gap-4 z-50 relative hover:opacity-80 transition-opacity group">
                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
                    <defs>
                        <style>
                            {`
                                .shard {
                                    transform-origin: center;
                                    animation: assemble 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                                }
                                .shard-1 { animation-delay: 0.1s; transform: translate(-10px, -10px) rotate(-45deg); opacity: 0; }
                                .shard-2 { animation-delay: 0.2s; transform: translate(10px, -5px) rotate(30deg); opacity: 0; }
                                .shard-3 { animation-delay: 0.3s; transform: translate(-5px, 15px) rotate(90deg); opacity: 0; }
                                .core-glow {
                                    animation: pulse-core 3s infinite ease-in-out;
                                    opacity: 0;
                                    animation-delay: 1.5s; /* Wait for assembly */
                                    animation-fill-mode: forwards; 
                                }
                                
                                @keyframes assemble {
                                    to { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                                }
                                @keyframes pulse-core {
                                    0%, 100% { opacity: 0.3; transform: scale(0.95); }
                                    50% { opacity: 0.8; transform: scale(1.05); }
                                }
                            `}
                        </style>
                    </defs>
                    
                    {/* The Impossible Triangle Fragments */}
                    <path d="M20 5L30 25H10L20 5Z" fill="#171717" stroke="#00F3FF" strokeWidth="1" className="shard shard-1"/>
                    <path d="M10 25L5 35L15 35L10 25Z" fill="#171717" stroke="#00F3FF" strokeWidth="1" className="shard shard-2"/>
                    <path d="M30 25L35 35L25 35L30 25Z" fill="#171717" stroke="#00F3FF" strokeWidth="1" className="shard shard-3"/>
                    
                    {/* Central Bind Point (Invisible until lock) */}
                    <circle cx="20" cy="27" r="2" fill="#00F3FF" className="core-glow"/>
                </svg>
                
                <div className="flex flex-col justify-center animate-[fadeIn_1s_ease-out_1.5s_forwards] opacity-0">
                    <span className="text-sm font-bold tracking-[0.2em] text-black leading-none">TEAM</span>
                    <span className="text-sm font-bold tracking-[0.2em] text-black leading-none">CURIOSITY</span>
                </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-black ${location.pathname === link.path ? 'text-black' : 'text-secondary'} relative`}
                >
                    <CharacterTween text={link.name} />
                    {link.name === 'Comms' && (
                        <span className="absolute -top-1 -right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                </Link>
            ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
                {localStorage.getItem('user') ? (
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        
                        {(() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            return (
                                <Link to="/profile" className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-gray-200 hover:border-black transition-all bg-white hover:bg-gray-50 group">
                                    <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden relative">
                                        <img 
                                            src={user?.profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}`} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-black">
                                        {user?.name?.split(' ')[0]} 
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${user?.isApproved ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
                                </Link>
                            );
                        })()}
                    </div>
                ) : (
                    <Link to="/join">
                        <Button variant="primary" className="h-9 px-4 text-xs font-mono tracking-wide flex items-center gap-2">
                            Join Project <ChevronRight size={12} />
                        </Button>
                    </Link>
                )}
            </div>

            {/* Mobile Hamburger */}
            <button 
                className="md:hidden z-50 relative text-black p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black rounded-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
        </nav>

        {/* Backdrop */}
        {mobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}

        {/* Mobile Sidebar (Drawer) */}
        <div 
            className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out transform border-l-4 border-black ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}
        >
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-12 pt-4 flex items-center gap-2 text-black font-mono text-xs opacity-50 border-b border-gray-200 pb-4">
                    <Terminal size={12} />
                    <span>SYSTEM_NAV_V2.0</span>
                </div>

                <div className="flex flex-col space-y-2">
                     {navLinks.map((link, idx) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`group flex items-center justify-between p-4 border border-black hover:bg-black hover:text-white transition-all duration-200 ${location.pathname === link.path ? 'bg-black text-white' : 'text-black'}`}
                        >
                            <span className="font-mono text-lg uppercase tracking-wider">
                                <span className="text-xs mr-4 opacity-50 group-hover:text-white">0{idx + 1} //</span>
                                {link.name}
                            </span>
                            <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200`} />
                        </Link>
                    ))}
                </div>
                
                <div className="mt-auto pt-8 pb-4">
                     {localStorage.getItem('user') ? (
                         <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full bg-white text-black font-mono text-sm py-4 border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> User Profile
                            </button>
                         </Link>
                     ) : (
                         <Link to="/join" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full bg-black text-white font-mono text-sm py-4 border border-black hover:bg-gray-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                                Join Project <ChevronRight size={14} />
                            </button>
                         </Link>
                     )}
                </div>
            </div>
            
            {/* Decorative Footer */}
            <div className="h-2 w-full bg-stripes-black opacity-10"></div>
        </div>
    </>
  );
};

export default Navbar;
