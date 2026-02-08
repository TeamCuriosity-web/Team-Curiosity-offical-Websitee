import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Target, Clock, ArrowUpRight, MapPin, Award } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-black pb-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-black tracking-tighter uppercase">Hackathons</h2>
            <p className="text-secondary font-mono text-sm">Global competitions and conquests.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-red-600">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            LIVE OPERATIONS
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {['Upcoming', 'Past'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredEvents.map((event, idx) => (
            <div 
                key={event._id}
                className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] cursor-default"
            >
                {/* 1. Icon & Title */}
                <div className="flex items-center gap-6 w-full md:w-1/3">
                    <div className="p-3 bg-gray-100 rounded border border-black text-black group-hover:bg-white group-hover:text-black transition-colors min-w-[50px] min-h-[50px] flex items-center justify-center">
                        {event.status === 'won' ? <Trophy size={24} className="text-yellow-600" /> : <Target size={24} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] uppercase text-gray-500 group-hover:text-gray-400 border border-gray-200 px-1 rounded">
                                {event.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">{event.name}</h3>
                        {event.location && (
                            <div className="flex items-center gap-1 text-xs font-mono text-gray-500 group-hover:text-gray-400 mt-1">
                                <MapPin size={10} /> {event.location}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Description & Tech (Middle) */}
                <div className="hidden md:block w-1/3 px-4">
                    <p className="text-sm font-mono text-secondary group-hover:text-gray-300 line-clamp-2">
                        {event.description || "Mission details classified..."}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1 text-gray-500 group-hover:text-gray-400">
                            <Calendar size={12} /> {event.formattedDate}
                        </div>
                    </div>
                </div>

                {/* 3. Status/Achievement & Action (Right) */}
                <div className="flex items-center justify-between w-full md:w-1/3 pl-0 md:pl-10 mt-4 md:mt-0">
                    
                    <div className="text-right flex-1 pr-6">
                        {activeTab === 'Past' ? (
                            <>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-secondary group-hover:text-gray-400">Result</p>
                                <div className="font-mono text-sm uppercase font-bold flex items-center justify-end gap-1">
                                    {event.achievement ? (
                                        <span className="text-yellow-600 group-hover:text-yellow-400 flex items-center gap-1">
                                            <Award size={14} /> {event.achievement}
                                        </span>
                                    ) : (
                                        <span>Participted</span>
                                    )}
                                </div>
                            </>
                        ) : (
                             <>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-secondary group-hover:text-gray-400">Countdown</p>
                                <p className="font-mono text-sm uppercase">T-Minus: Active</p>
                            </>
                        )}
                    </div>

                    <a 
                        href="#" // Hackathons might not have links in the model yet, but if they do: event.link
                        onClick={(e) => e.preventDefault()} // Placeholder action
                        className="p-3 rounded-full transition-all duration-300 z-10 relative bg-black text-white group-hover:bg-white group-hover:text-black border border-transparent group-hover:border-black"
                    >
                         <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
                    </a>
                </div>

            </div>
        ))}

        {filteredEvents.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded font-mono text-sm text-gray-400 uppercase">
                NO {activeTab} HACKATHONS LOGGED.
            </div>
        )}
      </div>
    </section>
  );
};

export default Hackathons;
