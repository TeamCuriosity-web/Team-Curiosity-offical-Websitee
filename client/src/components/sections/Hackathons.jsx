import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Target, Clock, ArrowUpRight, MapPin, Award, Code, Users } from 'lucide-react';
import api from '../../services/api';

const Hackathons = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Upcoming');

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const { data } = await api.get('/hackathons');

                // Sort by date usually, but here we just process
                const enhancedData = data.map(hack => ({
                    ...hack,
                    formattedDate: new Date(hack.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }));
                setEvents(enhancedData);
            } catch (err) {
                console.error("Failed to load hackathons");
            } finally {
                setLoading(false);
            }
        };
        fetchHackathons();
    }, []);

    const filteredEvents = events.filter(e => {
        if (activeTab === 'Upcoming') return e.status === 'upcoming' || e.status === 'ongoing';
        if (activeTab === 'Past') return e.status === 'completed' || e.status === 'won';
        return true;
    });

  if (loading) return <div className="py-24 text-center font-mono text-xs">RETRIEVING BATTLE LOGS...</div>;

  return (
    <section className="py-12 animate-fade-in container mx-auto px-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-black pb-6">
          <div className="space-y-3">
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase relative inline-block">
                Hackathons
                <span className="absolute -top-2 -right-4 text-xs font-mono bg-black text-white px-1 transform rotate-12">v.2.0</span>
            </h2>
            <p className="text-gray-600 font-mono text-sm md:text-base max-w-lg border-l-2 border-red-500 pl-4">
                Deploying code in high-stakes environments. Global competitive operations and conquests.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 mt-6 md:mt-0">
               <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    System Status: Active
               </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-10">
        {['Upcoming', 'Past'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    activeTab === tab 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8">
        {filteredEvents.map((event, idx) => (
            <div 
                key={event._id}
                className={`group relative overflow-hidden bg-white border-2 border-black transition-all duration-300 hover:-translate-y-1 ${event.status === 'won' ? 'shadow-[12px_12px_0px_0px_#fbbf24]' : 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'}`}
            >
                {/* Winner Banner */}
                {event.status === 'won' && (
                    <div className="absolute top-6 -right-8 w-32 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-widest text-center transform rotate-45 border-y-2 border-black z-10 py-1 shadow-sm">
                        Winner
                    </div>
                )}

                <div className="flex flex-col md:flex-row">
                    
                    {/* Left: Visual & Status */}
                    <div className="w-full md:w-1/4 p-8 bg-gray-50 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col items-center justify-center text-center group-hover:bg-yellow-50 transition-colors">
                        <div className={`w-20 h-20 mb-4 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${event.status === 'won' ? 'text-yellow-500' : 'text-gray-800'}`}>
                            {event.status === 'won' ? <Trophy size={32} /> : (event.status === 'upcoming' ? <Clock size={32} /> : <Target size={32} />)}
                        </div>
                        <div className="font-mono text-xs font-bold uppercase tracking-widest bg-black text-white px-2 py-1 mb-2">
                            {event.status}
                        </div>
                        <div className="font-mono text-[10px] text-gray-500 flex items-center gap-1">
                            <Calendar size={10} /> {event.formattedDate}
                        </div>
                    </div>

                    {/* Middle: Content */}
                    <div className="w-full md:w-2/4 p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 group-hover:text-red-600 transition-colors">
                            {event.name}
                        </h3>
                        
                        {event.location && (
                             <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
                                <MapPin size={12} className="text-red-500" /> 
                                {event.location}
                            </div>
                        )}

                        <p className="text-gray-600 font-mono text-sm leading-relaxed mb-6 border-l-2 border-gray-200 pl-4 py-1">
                            {event.description || "Mission objective details are currently classified. Awaiting further intelligence briefings."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                             {/* Mock Tags if none exist yet */}
                             {['React', 'Node.js', 'AI'].map(tag => (
                                 <span key={tag} className="flex items-center gap-1 text-[10px] font-bold uppercase border border-black px-2 py-1 bg-white hover:bg-black hover:text-white transition-colors">
                                     <Code size={10} /> {tag}
                                 </span>
                             ))}
                        </div>
                    </div>

                    {/* Right: Action & Results */}
                    <div className="w-full md:w-1/4 p-8 flex flex-col justify-between items-end border-t-2 md:border-t-0 md:border-l-2 border-black bg-gray-50/50">
                        <div className="text-right">
                             <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Squad Size</p>
                             <div className="flex items-center justify-end gap-1 font-mono font-bold text-sm">
                                <Users size={14} /> 4 Operatives
                             </div>
                        </div>

                        <div className="w-full mt-8 md:mt-0">
                            {activeTab === 'Past' && event.achievement ? (
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Result</p>
                                    <div className="inline-block bg-yellow-400 border-2 border-black px-3 py-2 font-black uppercase text-sm transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Award size={16} className="inline-block mr-1 -mt-1" />
                                        {event.achievement}
                                    </div>
                                </div>
                            ) : (
                                <button className="w-full group/btn relative flex items-center justify-center gap-2 bg-black text-white font-bold uppercase text-xs py-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all">
                                    <span>View Intel</span>
                                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        ))}

        {filteredEvents.length === 0 && (
             <div className="text-center py-20 border-4 border-dashed border-gray-200 rounded-lg">
                <p className="font-mono text-gray-400 uppercase tracking-widest mb-2">Signal Lost</p>
                <h3 className="text-xl font-bold text-gray-300">No {activeTab} Operations Found</h3>
            </div>
        )}
      </div>
    </section>
  );
};

export default Hackathons;
