import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Button from './components/ui/Button';

// Sections
import Hero from './components/sections/Hero';
import Manifesto from './components/sections/Manifesto';
import MissionOverview from './components/sections/MissionOverview';
import ProjectDetails from './components/pages/ProjectDetails';
import About from './components/sections/About';
import Team from './components/sections/Team';
import Projects from './components/sections/Projects';
import Hackathons from './components/sections/Hackathons';

// Pages
import TeamPage from './components/pages/TeamPage'; // Assuming this exists or using inline
import MissionsPage from './components/pages/MissionsPage';
import JoinPage from './components/pages/JoinPage'; 
import LoginPage from './components/pages/LoginPage';
import AdminDashboard from './components/pages/AdminDashboard';
import SuperAdminDashboard from './components/pages/SuperAdminDashboard';
import ManifestoPage from './components/pages/ManifestoPage';
import StartBuildingPage from './components/pages/StartBuildingPage';

// UI
import LegendaryLoader from './components/ui/LegendaryLoader';

const Home = () => (
  <>
    <main className="bg-white">
       <Hero />
       
       <div className="container mx-auto px-6 pb-20">
          <Manifesto />
          <MissionOverview />

          <div className="border-t border-border my-20"></div>

          <About />
       </div>
    </main>
    <Footer />
  </>
);

// Inline pages wrapper for cleanliness
// HackathonsPage is still inline for now
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
  const [loading, setLoading] = useState(false); // No loader on initial load
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    // Skip the first execution (on mount)
    if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
    }
    // Trigger loader on subsequent route changes
    setLoading(true);
  }, [location.pathname]);
  
  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LegendaryLoader onComplete={handleLoaderComplete} />}
      
      <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white">
        <Navbar />
// Protected Route Component
const RequireApproval = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // If not logged in, they can view public pages (Team, etc.) normally 
    // OR if we want to force login for these pages, we'd redirect to login.
    // Based on user request: "every section should be locked until admin approves... for new user"
    // implies if they ARE a user (new user), it's locked.
    
    if (user && !user.isApproved) {
        // Redirect to profile if they try to access restricted areas
        // But we need to allow them to see the landing page probably?
        // Actually, user said "every section should be locked".
        return <Navigate to="/profile" replace />;
    }
    return children;
};

import { Navigate } from 'react-router-dom';
import ProfilePage from './components/pages/ProfilePage';

// ... (existing imports)

        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Public access allowed for now, but if logged in & unapproved, we might want to block? 
              User said "locked until admin approves". 
              Let's Wrap the main operational pages. 
          */}
          <Route path="/team" element={<RequireApproval><TeamPage /></RequireApproval>} />
          <Route path="/projects" element={<RequireApproval><Projects /></RequireApproval>} />
          <Route path="/projects/:id" element={<RequireApproval><ProjectDetails /></RequireApproval>} />
          <Route path="/hackathons" element={<RequireApproval><HackathonsPage /></RequireApproval>} />
          <Route path="/missions" element={<RequireApproval><MissionsPage /></RequireApproval>} />
          
          <Route path="/manifesto" element={<ManifestoPage />} />
          <Route path="/start" element={<StartBuildingPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
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
