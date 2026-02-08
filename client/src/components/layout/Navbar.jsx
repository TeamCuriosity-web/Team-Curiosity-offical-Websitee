import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Terminal } from 'lucide-react';
import Button from '../ui/Button';
import CharacterTween from '../ui/CharacterTween';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  // ... (rest of state)

  // ... (useEffects)

  return (
    <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-transparent ${scrolled ? 'border-border' : ''}`}>
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
            {/* ... Logo ... */}
            <Link to="/" className="text-xl font-bold tracking-tight text-black flex items-center gap-1 font-mono z-50 relative hover:opacity-80 transition-opacity">
                <span className="text-secondary">//</span>
                <span>CURIOSITY</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-black ${location.pathname === link.path ? 'text-black' : 'text-secondary'}`}
                >
                <CharacterTween text={link.name} />
                </Link>
            ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
                {localStorage.getItem('user') ? (
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Link to="/profile">
                            <Button variant="outline" className="h-9 px-4 text-xs font-mono tracking-wide flex items-center gap-2 border-black hover:bg-black hover:text-white transition-colors">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Profile
                            </Button>
                        </Link>
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
