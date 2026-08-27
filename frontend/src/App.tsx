import { useState, useEffect } from 'react';
import type { NavTab, Property } from './types';
import { mockProperties } from './data/mockProperties';
import { LanguageProvider } from './context/LanguageContext';

import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

import { DashboardView } from './components/views/DashboardView';
import { ExplorerView } from './components/views/ExplorerView';
import { PropertyAnalysisView } from './components/views/PropertyAnalysisView';
import { CompareView } from './components/views/CompareView';
import { SimulatorView } from './components/views/SimulatorView';
import { MarketIntelligenceView } from './components/views/MarketIntelligenceView';
import { AIAdvisorView } from './components/views/AIAdvisorView';
import { SettingsView } from './components/views/SettingsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [previousTab, setPreviousTab] = useState<NavTab>('explore');
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('realvest_theme');
    return savedTheme === 'dark';
  });

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onSearchClick={() => handleTabChange('explore')}
        onBack={handleBack}
        showBack={activeTab === 'analysis'}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleTabChange}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorerView
            properties={mockProperties}
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
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleTabChange}
          />
        )}

        {activeTab === 'simulator' && <SimulatorView onBack={handleBack} />}

        {activeTab === 'markets' && <MarketIntelligenceView />}

        {activeTab === 'advisor' && (
          <AIAdvisorView
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleTabChange}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView isDark={isDark} onToggleTheme={handleToggleTheme} />
        )}
      </main>

      {/* Bottom Navigation Dock */}
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
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
