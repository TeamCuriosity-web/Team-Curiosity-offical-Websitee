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
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50 relative hover:opacity-80 transition-opacity group">
                <svg width="220" height="40" viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
                    {/* Dark Tech Hexagon Base */}
                    <path d="M25 5L36.547 11.6667V25L25 31.6667L13.453 25V11.6667L25 5Z" fill="#0B0F1A" stroke="#00F3FF" strokeWidth="1.5"/>
                    
                    {/* Neural Circuits */}
                    <path d="M37 18H42M8 18H13" stroke="#00F3FF" strokeWidth="1" strokeLinecap="round" className="opacity-60"/>
                    <circle cx="44" cy="18" r="1.5" fill="#00F3FF" className="animate-pulse"/>
                    <circle cx="6" cy="18" r="1.5" fill="#00F3FF" className="animate-pulse"/>

                    {/* The Eye of Constant Vigilance */}
                    <path d="M18 18.5C18 18.5 21.5 13.5 25 13.5C28.5 13.5 32 18.5 32 18.5C32 18.5 28.5 23.5 25 23.5C21.5 23.5 18 18.5 18 18.5Z" stroke="#00F3FF" strokeWidth="1.5" fill="none"/>
                    
                    {/* The Pupil & Hidden Question */}
                    <circle cx="25" cy="18.5" r="3.5" fill="#00F3FF"/>
                    {/* Negative space Question Mark */}
                    <path d="M25 16.5C25.8 16.5 26.2 16.9 26.2 17.5C26.2 18.2 25 18.4 25 19.2" stroke="#0B0F1A" strokeWidth="1.2" strokeLinecap="round"/>
                    <circle cx="25" cy="20.5" r="0.7" fill="#0B0F1A"/>

                    {/* Typography - Adjusted for Light Navbar Visibility */}
                    <text x="52" y="24" fontFamily="monospace" fontWeight="bold" fontSize="20" fill="#000000" letterSpacing="0.05em">TEAM CURIOSITY</text>
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
