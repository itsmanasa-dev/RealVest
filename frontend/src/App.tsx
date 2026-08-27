import { useState, useEffect } from 'react';
import type { NavTab, Property } from './types';
import { mockProperties } from './data/mockProperties';
import { LanguageProvider } from './context/LanguageContext';
import { propertyApi } from './services/api/propertyApi';

import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

import { DashboardView } from './components/views/DashboardView';
import { ExplorerView } from './components/views/ExplorerView';
import { PropertyAnalysisView } from './components/views/PropertyAnalysisView';
import { CompareView } from './components/views/CompareView';
import { SavedComparisonsView } from './components/views/SavedComparisonsView';
import { SimulatorView } from './components/views/SimulatorView';
import { MarketIntelligenceView } from './components/views/MarketIntelligenceView';
import { AIAdvisorView } from './components/views/AIAdvisorView';
import { SettingsView } from './components/views/SettingsView';

import { Sidebar } from './components/layout/Sidebar';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [previousTab, setPreviousTab] = useState<NavTab>('explore');
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('realvest_theme');
    return savedTheme === 'dark';
  });

  // Fetch live properties from FastAPI / MySQL backend
  useEffect(() => {
    async function fetchLiveProperties() {
      try {
        const liveData = await propertyApi.getProperties();
        if (liveData && liveData.length > 0) {
          setProperties(liveData);
          setSelectedProperty(liveData[0]);
        }
      } catch (err) {
        console.warn('Backend connection fallback: Using real dataset cached properties.');
      }
    }
    fetchLiveProperties();
  }, []);

  // Sync dark/light class to root HTML element and localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('realvest_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('realvest_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleSelectProperty = (property: Property) => {
    setPreviousTab(activeTab);
    setSelectedProperty(property);
    setActiveTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveTab(previousTab || 'explore');
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab !== activeTab) {
      setPreviousTab(activeTab);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] flex font-sans transition-colors duration-200">
      {/* Desktop Sidebar (Persistent on lg screens) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onSearchClick={() => handleTabChange('explore')}
          onBack={handleBack}
          showBack={activeTab === 'analysis'}
        />

        {/* Unified Main Content Container */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'explore' && (
            <ExplorerView
              properties={properties}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {activeTab === 'analysis' && (
            <PropertyAnalysisView
              property={selectedProperty}
              onBack={handleBack}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'compare' && (
            <CompareView
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'saved-comparisons' && (
            <SavedComparisonsView
              onNavigate={handleTabChange}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {activeTab === 'simulator' && <SimulatorView onBack={handleBack} />}

          {activeTab === 'markets' && (
            <MarketIntelligenceView
              properties={properties}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {activeTab === 'advisor' && (
            <AIAdvisorView
              properties={properties}
              onSelectProperty={handleSelectProperty}
              onNavigate={handleTabChange}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView isDark={isDark} onToggleTheme={handleToggleTheme} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Dock (Visible on < lg screens) */}
      <div className="lg:hidden">
        <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
