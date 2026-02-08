import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Sections
import Hero from './components/sections/Hero';
import Manifesto from './components/sections/Manifesto';
import MissionOverview from './components/sections/MissionOverview';
import ProjectDetails from './components/pages/ProjectDetails';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Hackathons from './components/sections/Hackathons';
import ChatGlimpse from './components/sections/ChatGlimpse';
import Leaderboard from './components/sections/Leaderboard';

// Pages
import TeamPage from './components/pages/TeamPage'; 
import MissionsPage from './components/pages/MissionsPage';
import JoinPage from './components/pages/JoinPage'; 
import LoginPage from './components/pages/LoginPage';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminLoginPage from './components/pages/AdminLoginPage';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import ManifestoPage from './components/pages/ManifestoPage';
import StartBuildingPage from './components/pages/StartBuildingPage';
import ProfilePage from './components/pages/ProfilePage';
import ChatPage from './components/pages/ChatPage';
import GuidePage from './components/pages/GuidePage';
import InvitationPage from './components/pages/InvitationPage';

// UI
import LegendaryLoader from './components/ui/LegendaryLoader';

// Protected Route Component
import LockedView from './components/ui/LockedView';

// Protected Route Component
const RequireApproval = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        return <LockedView title="Classified Section" />;
    }

    if (!user.isApproved) {
        return <Navigate to="/profile" replace />;
    }
    return children;
};

const Home = () => (
  <>
    <main className="bg-white">
       <Hero />
       
       <div className="container mx-auto px-6 pb-20">
          <Manifesto />
          <MissionOverview />

          <div className="border-t border-border my-20"></div>
          
          <ChatGlimpse />

          <Leaderboard />

          <About />
       </div>
    </main>
    <Footer />
  </>
);

const HackathonsPage = () => (
    <>
        <main className="container mx-auto px-6 pt-32 pb-20">
            <Hackathons />
        </main>
        <Footer />
    </>
);

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false); 
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
    }
    setLoading(true);
  }, [location.pathname]);

  // Sync User Status Logic
  useEffect(() => {
     const syncUserStatus = async () => {
         const token = localStorage.getItem('token');
         if (token) {
             try {
                 // We need to use fetch directly or axios instance if available
                 // Assuming api instance is attached or we use raw fetch for simplicity here
                 // But wait, we have 'api' imported in other files, let's Import it here too? 
                 // Actually, to avoid import errors if api.js isn't in scope, I'll use fetch.
                 // Better: Let's assume standard fetch for reliability in App root
                 const response = await fetch('https://team-curiosity-offical-websitee.onrender.com/api/auth/me', {
                     headers: {
                         'Authorization': `Bearer ${token}`
                     }
                 });
                 
                 if (response.ok) {
                     const data = await response.json();
                     localStorage.setItem('user', JSON.stringify(data));
                     // We might need to trigger a re-render or state update if RequireApproval doesn't pick it up
                     // Since RequireApproval reads from localStorage on render, a forceUpdate or state change would be good.
                     // But simpler: The user refreshing the page will now definitely work. 
                     // To make it reactive without refresh, we'd need a Context. 
                     // For now, updating localStorage ensures the NEXT check passes.
                 }
             } catch (err) {
                 console.error("Failed to sync user status", err);
             }
         }
     };
     
     syncUserStatus();
  }, [location.pathname]); // Sync on every page change to catch approval "live"
  
  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LegendaryLoader onComplete={handleLoaderComplete} />}
      
      <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/team" element={<RequireApproval><TeamPage /></RequireApproval>} />
          <Route path="/projects" element={<RequireApproval><Projects /></RequireApproval>} />
          <Route path="/projects/:id" element={<RequireApproval><ProjectDetails /></RequireApproval>} />
          <Route path="/hackathons" element={<RequireApproval><HackathonsPage /></RequireApproval>} />
          <Route path="/missions" element={<RequireApproval><MissionsPage /></RequireApproval>} />
          <Route path="/chat" element={<RequireApproval><ChatPage /></RequireApproval>} />
          
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/start" element={<StartBuildingPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/invite" element={<InvitationPage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router basename="/Team-Curiosity-offical-Websitee">
      <AppContent />
    </Router>
  );
}

export default App;
