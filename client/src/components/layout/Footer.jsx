import React from 'react';
import { Github, Instagram, Shield } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming Link comes from react-router-dom

const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-200 mt-20 relative z-10 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-slate-800">TEAM CURIOSITY</h4>
            <p className="text-xs text-slate-500 mt-2">© 2026 TEAM CURIOSITY. All rights reserved. [System v2.1]</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <a href="https://github.com/TeamCuriosity-web" className="flex items-center gap-2 hover:text-black transition-colors">
                <Github size={18} />
                <span>Github</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-black transition-colors">
                <Instagram size={18} />
                <span>Instagram</span>
            </a>
            <Link to="/admin" className="flex items-center gap-2 hover:text-black transition-colors">
                <Shield size={18} />
                <span>Command Center</span>
            </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
