import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import PatientAnalysisPage from './pages/PatientAnalysisPage';
import GeneExplorerPage from './pages/GeneExplorerPage';
import { fetchHealth } from './api/apiService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    // Initial health check
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const data = await fetchHealth();
      setSystemStatus(data);
    } catch (err) {
      console.warn('Backend polling error:', err);
    }
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'patients':
        return <PatientAnalysisPage />;
      case 'gene-explorer':
        return <GeneExplorerPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-burgundy-700 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        systemStatus={systemStatus}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          setMobileOpen={setMobileOpen}
          systemStatus={systemStatus}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        <Footer />
      </div>
    </div>
  );
}
