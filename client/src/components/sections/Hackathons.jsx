import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, Target, Award, Clock } from 'lucide-react';
import api from '../../services/api';

const Hackathons = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const { data } = await api.get('/hackathons');

                const enhancedData = data.map(hack => ({
                    ...hack,
                    date: new Date(hack.date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    icon: (hack.status === 'upcoming' || hack.status === 'ongoing') ? <Target size={24} className="text-red-500" /> : <Trophy size={24} className="text-yellow-400" />
                }));

                setUpcomingEvents(enhancedData.filter(e => e.status === 'upcoming' || e.status === 'ongoing'));
                setPastEvents(enhancedData.filter(e => e.status === 'completed' || e.status === 'won'));

            } catch (err) {
                console.error("Failed to load hackathons");
            } finally {
                setLoading(false);
            }
        };
        fetchHackathons();
    }, []);

  if (loading) return <div className="py-24 text-center font-mono text-xs">RETRIEVING BATTLE LOGS...</div>;

  return (
    <section className="py-12 animate-fade-in">
      
      {/* --- UPCOMING OPERATIONS --- */}
      {upcomingEvents.length > 0 && (
          <div className="mb-20">
              <div className="mb-8 border-b-2 border-red-600 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-bold mb-2 text-red-600 uppercase tracking-tighter flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                        Active Operations
                    </h2>
                    <p className="text-black font-mono text-sm">Target acquisition in progress.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                    <div key={event._id} className="relative bg-black text-white p-8 overflow-hidden border-2 border-red-600 hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={100} /></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4 text-red-500 font-mono text-xs uppercase tracking-widest border border-red-900 bg-red-900/20 px-2 py-1 w-fit">
                                <Clock size={12} /> T-Minus: Loading...
                            </div>
                            <h3 className="text-2xl font-bold uppercase mb-2">{event.name}</h3>
                            <p className="text-gray-400 text-sm mb-6">{event.description || "Classified Mission Briefing"}</p>
                            
                            <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Deploy Date</p>
                                    <p className="font-mono">{event.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase">Join Squad</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
              </div>
          </div>
      )}

      {/* --- CONQUESTS --- */}
      <div className="mb-12 border-b-2 border-black pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-4xl font-bold mb-2 text-black uppercase tracking-tighter">Conquests</h2>
            <p className="text-secondary font-mono text-sm">Past victories and achievements.</p>
        </div>
        <div className="text-2xl font-bold font-mono text-black">
            <span className="text-xs font-normal text-secondary block text-right tracking-widest uppercase">Status</span>
            VICTORIOUS
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pastEvents.map((event, idx) => (
            <div key={event._id} className="group relative bg-white border-2 border-black p-6 hover:translate-x-2 transition-transform duration-300 flex flex-col sm:flex-row items-center justify-between">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-black text-white flex items-center justify-center font-bold font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx + 1}
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-50 border-2 border-black rounded-none group-hover:bg-black group-hover:border-black transition-colors">
                        <div className="group-hover:scale-110 transition-transform duration-300">
                             {event.icon}
                        </div>
                    </div>
                    <div>
                         <h3 className="text-xl font-bold text-black uppercase mb-1">{event.name}</h3>
                         <div className="flex items-center gap-2 text-xs font-mono text-secondary">
                            <Calendar size={12} />
                            {event.date}
                         </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-12 mt-4 sm:mt-0">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-1">Achievement</p>
                         <span className="font-bold text-black bg-yellow-100 px-2 py-1 border border-yellow-200 text-xs rounded-sm">
                            {event.achievement || 'Participation'}
                        </span>
                    </div>
                    <div className="text-right min-w-[80px]">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-1">Status</p>
                        <span className="text-lg font-mono font-bold text-black flex items-center justify-end gap-1 uppercase text-sm">
                            {event.status}
                        </span>
                    </div>
                </div>
            </div>
        ))}
         {pastEvents.length === 0 && upcomingEvents.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded font-mono text-sm text-gray-400">
                NO BATTLE RECORDS FOUND.
            </div>
        )}
      </div>
    </section>
  );
};

export default Hackathons;
