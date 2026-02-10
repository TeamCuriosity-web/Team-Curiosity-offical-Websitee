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
    { name: 'Manual', path: '/guide' },
  ];

  if (location.pathname === '/invite') return null;

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-transparent ${scrolled ? 'border-border' : ''}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo - The Ultimate Animated "Badge" */}
            <Link to="/" className="flex items-center gap-2 z-50 relative hover:scale-[1.02] transition-transform duration-500 group">
                <svg width="240" height="48" viewBox="0 0 240 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto drop-shadow-2xl">
                    <defs>
                        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00F3FF"/>
                            <stop offset="100%" stopColor="#BD00FF"/>
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <style>
                            {`
                                .logo-path {
                                    stroke-dasharray: 100;
                                    stroke-dashoffset: 100;
                                    animation: draw 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                                }
                                .logo-fade {
                                    opacity: 0;
                                    animation: fade 1s ease-out 1s forwards;
                                }
                                .logo-pulse {
                                    animation: pulse 3s infinite ease-in-out;
                                }
                                .circuit-line {
                                    stroke-dasharray: 50;
                                    stroke-dashoffset: 50;
                                    animation: draw 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
                                }
                                .text-reveal {
                                    opacity: 0;
                                    transform: translateY(5px);
                                    animation: slideUp 0.8s ease-out 1.2s forwards;
                                }
                                @keyframes draw {
                                    to { stroke-dashoffset: 0; }
                                }
                                @keyframes fade {
                                    to { opacity: 1; }
                                }
                                @keyframes slideUp {
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                @keyframes pulse {
                                    0%, 100% { fill-opacity: 0.6; r: 3; }
                                    50% { fill-opacity: 1; r: 4; filter: url(#glow); }
                                }
                            `}
                        </style>
                    </defs>

                    {/* Dark Matter Badge Container */}
                    <rect x="2" y="4" width="236" height="40" rx="20" fill="#050505" stroke="url(#neonGradient)" strokeWidth="1" className="logo-path"/>
                    
                    {/* Neural Core / Eye Symbol */}
                    <g transform="translate(24, 24)">
                        {/* Outer Eye Arcs */}
                        <path d="M-12 0C-12 0 -6 -8 0 -8C6 -8 12 0 12 0" stroke="#00F3FF" strokeWidth="1.5" fill="none" className="logo-path" style={{animationDelay: '0.2s'}}/>
                        <path d="M-12 0C-12 0 -6 8 0 8C6 8 12 0 12 0" stroke="#00F3FF" strokeWidth="1.5" fill="none" className="logo-path" style={{animationDelay: '0.4s'}}/>
                        
                        {/* The Pupil (Pulse) */}
                        <circle cx="0" cy="0" r="3" fill="#00F3FF" className="logo-pulse logo-fade"/>
                        
                        {/* Negative Space Question Mark (Subtle) */}
                        <path d="M0 -3C1.5 -3 2.5 -2 2.5 -1C2.5 0.5 0 0.5 0 2" stroke="#050505" strokeWidth="1.2" strokeLinecap="round" className="logo-fade"/>
                    </g>

                    {/* Neural Circuits extending right */}
                    <path d="M40 24H50L55 20H65" stroke="#00F3FF" strokeWidth="1" fill="none" className="circuit-line"/>
                    <circle cx="65" cy="20" r="1.5" fill="#BD00FF" className="logo-fade" style={{animationDelay: '1.2s'}}/>

                    {/* Typography - The Reveal */}
                    <text x="75" y="29" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="16" fill="white" letterSpacing="0.1em" className="text-reveal">
                        TEAM CURIOSITY
                    </text>
                </svg>
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
