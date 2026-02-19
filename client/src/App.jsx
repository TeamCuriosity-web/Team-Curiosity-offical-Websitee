import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';


import Hero from './components/sections/Hero';
import Manifesto from './components/sections/Manifesto';
import MissionOverview from './components/sections/MissionOverview';
import ProjectDetails from './components/pages/ProjectDetails';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Hackathons from './components/sections/Hackathons';
import ChatGlimpse from './components/sections/ChatGlimpse';
import Leaderboard from './components/sections/Leaderboard';


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
import StudyStuffPage from './components/pages/StudyStuffPage';
import InvitePage from './components/pages/InvitePage';
import ReflectiveTypePage from './components/pages/ReflectiveTypePage';


import LegendaryLoader from './components/ui/LegendaryLoader';
import SmoothScroll from './components/ui/SmoothScroll';


import LockedView from './components/ui/LockedView';


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
  
  const shouldLoad = location.pathname !== '/invite'; 
  const [loading, setLoading] = useState(shouldLoad); 
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
    }
    
    if (location.pathname !== '/invite') {
        setLoading(true);
    } else {
        setLoading(false);
    }
  }, [location.pathname]);

  
  useEffect(() => {
     const syncUserStatus = async () => {
         const token = localStorage.getItem('token');
         if (token) {
             try {
                 
                 
                 
                 
                 
                 const response = await fetch('https://team-curiosity-offical-websitee.onrender.com/api/auth/me', {
                     headers: {
                         'Authorization': `Bearer ${token}`
                     }
                 });
                 
                 if (response.ok) {
                     const data = await response.json();
                     localStorage.setItem('user', JSON.stringify(data));
                     
                     
                     
                     
                     
                 }
             } catch (err) {
                 console.error("Failed to sync user status", err);
             }
         }
     };
     
     syncUserStatus();
  }, [location.pathname]); 
  
  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LegendaryLoader onComplete={handleLoaderComplete} />}
      
      <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
        <SmoothScroll>
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
              <Route path="/study-stuff" element={<StudyStuffPage />} />
              <Route path="/invite" element={<InvitePage />} />
              <Route path="/reflective" element={<ReflectiveTypePage />} />
            </Routes>
        </SmoothScroll>
      </div>
      </>
  );
};

import UserGuide from './components/ui/UserGuide';

function App() {
  return (
    <Router basename="/Team-Curiosity-offical-Websitee">
      <UserGuide />
      <AppContent />
    </Router>
  );
}

export default App;
