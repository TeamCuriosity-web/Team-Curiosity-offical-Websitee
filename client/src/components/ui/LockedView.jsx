import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const LockedView = ({ title = "Restricted Area" }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 flex items-center justify-center">
      {}
      <div className="absolute inset-0 filter blur-xl opacity-30 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern transform scale-110"></div>
          {}
          <div className="container mx-auto px-6 py-20 space-y-12">
               <div className="h-20 bg-gray-300 w-1/3 rounded"></div>
               <div className="grid grid-cols-3 gap-8">
                   <div className="h-64 bg-gray-200 rounded"></div>
                   <div className="h-64 bg-gray-200 rounded"></div>
                   <div className="h-64 bg-gray-200 rounded"></div>
               </div>
               <div className="h-40 bg-gray-200 w-full rounded"></div>
          </div>
      </div>

      {}
      <div className="relative z-10 max-w-lg w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-2xl">
                  <Lock size={32} />
              </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
              {title}
          </h1>
          <p className="text-gray-500 font-mono text-sm mb-8 uppercase tracking-widest">
              Clearance Level: Operative
          </p>

          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200">
              <p className="text-gray-600 mb-8 font-medium">
                  This section requires active operative credentials. Access is restricted to team members only.
              </p>
              
              <Link to="/join">
                  <button className="w-full py-4 bg-black text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg">
                      Join The Team
                  </button>
              </Link>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase">
                      Already have clearance? <Link to="/login" className="text-black font-bold hover:underline">Login Access</Link>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LockedView;
