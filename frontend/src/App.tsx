import { useState, useEffect } from 'react';
import type { NavTab, Property } from './types';
import { mockProperties } from './data/mockProperties';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

import { DashboardView } from './components/views/DashboardView';
import { ExplorerView } from './components/views/ExplorerView';
import { PropertyAnalysisView } from './components/views/PropertyAnalysisView';
import { SimulatorView } from './components/views/SimulatorView';
import { MarketIntelligenceView } from './components/views/MarketIntelligenceView';
import { AIAdvisorView } from './components/views/AIAdvisorView';
import { SettingsView } from './components/views/SettingsView';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperties[0]);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync dark class to root document element
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
    setSelectedProperty(property);
    setActiveTab('analysis');
  };

  const categoryLabels: Record<NavTab, string> = {
    dashboard: 'PORTFOLIO OVERVIEW',
    explore: 'PROPERTY EXPLORER',
    analysis: 'PROPERTY ANALYSIS & AI DEEP DIVE',
    simulator: 'DECISION SIMULATOR',
    markets: 'MARKET INTELLIGENCE',
    advisor: 'AI DECISION ADVISOR',
    settings: 'PLATFORM SETTINGS',
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--bg-text)] flex">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          categoryLabel={categoryLabels[activeTab]}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onSearchClick={() => setActiveTab('explore')}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
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
              onBack={() => setActiveTab('explore')}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'simulator' && <SimulatorView />}

          {activeTab === 'markets' && <MarketIntelligenceView />}

          {activeTab === 'advisor' && (
            <AIAdvisorView
              properties={mockProperties}
              onSelectProperty={handleSelectProperty}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView isDark={isDark} onToggleTheme={handleToggleTheme} />
          )}
        </main>
      </div>

      {/* Mobile Floating Bottom Dock */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
