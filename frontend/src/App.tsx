import { useState, useEffect } from 'react';
import type { NavTab, Property } from './types';
import { mockProperties } from './data/mockProperties';

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

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [previousTab, setPreviousTab] = useState<NavTab>('explore');
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [isDark, setIsDark] = useState<boolean>(false); // Start with clean light mode by default as per screenshots, easily toggleable

  // Sync dark/light class to root HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleSelectProperty = (property: Property) => {
    setPreviousTab(activeTab);
    setSelectedProperty(property);
    setActiveTab('analysis');
  };

  const handleBack = () => {
    setActiveTab(previousTab || 'explore');
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#031427] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onSearchClick={() => setActiveTab('explore')}
        onBack={handleBack}
        showBack={activeTab === 'analysis'}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={setActiveTab}
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
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'simulator' && <SimulatorView onBack={handleBack} />}

        {activeTab === 'markets' && <MarketIntelligenceView />}

        {activeTab === 'advisor' && (
          <AIAdvisorView
            properties={mockProperties}
            onSelectProperty={handleSelectProperty}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView isDark={isDark} onToggleTheme={handleToggleTheme} />
        )}
      </main>

      {/* Bottom Navigation Dock matching screenshots */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
