import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useNavigation } from './hooks/useNavigation';
import { DirectoryPage } from './components/DirectoryPage';
import { EventsPage } from './components/EventsPage';
import { AddBusinessPage } from './components/AddBusinessPage';
import { SavedBusinessesPage } from './components/SavedBusinessesPage';
import { MorePage } from './components/MorePage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { AdvisoryBoardPage } from './components/AdvisoryBoardPage';
import { Navigation } from './components/Navigation';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const { currentPage, setCurrentPage } = useNavigation();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAdmin(true);
      }
    };
    checkAdminStatus();
  }, []);

  // Handle keyboard shortcut for admin access (Ctrl/Cmd + Shift + A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminLoginOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'directory':
        return <DirectoryPage />;
      case 'events':
        return <EventsPage />;
      case 'add-business':
        return <AddBusinessPage onBack={() => setCurrentPage('directory')} />;
      case 'saved':
        return <SavedBusinessesPage onBack={() => setCurrentPage('directory')} />;
      case 'more':
        return (
          <MorePage onNavigate={(page) => setCurrentPage(page)} />
        );
      case 'about':
        return <AboutUsPage onBack={() => setCurrentPage('more')} />;
      case 'contact':
        return <ContactPage onBack={() => setCurrentPage('more')} />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={() => setCurrentPage('more')} />;
      case 'terms':
        return <TermsOfServicePage onBack={() => setCurrentPage('more')} />;
      case 'advisory':
        return <AdvisoryBoardPage onBack={() => setCurrentPage('more')} />;
      default:
        return <DirectoryPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
        {/* Main Content - Full Screen Scrollable */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </div>
        
        {/* Fixed Bottom Tab Navigation */}
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
        />
        
        {/* Admin Components */}
        {isAdminLoginOpen && (
          <AdminLogin
            onLoginSuccess={() => {
              setIsAdminLoginOpen(false);
              setIsAdmin(true);
              setIsAdminDashboardOpen(true);
            }}
            onClose={() => setIsAdminLoginOpen(false)}
          />
        )}
        
        {isAdminDashboardOpen && isAdmin && (
          <AdminDashboard
            onClose={() => setIsAdminDashboardOpen(false)}
          />
        )}
        
        {/* Admin Access Hint (only in development) */}
        {import.meta.env.DEV && (
          <div className="fixed bottom-4 left-4 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
            Admin: Ctrl/Cmd + Shift + A
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;