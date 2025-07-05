'use client';

// import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import NetworkView from './network/page';
import { StackView } from './stack/page';
import { useAppStore } from './store';

function NoteNetworkPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const view = useAppStore((state) => state.view);
  const setView = useAppStore((state) => state.setView);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between px-4 sm:px-8 py-3 border-b border-border bg-background/80 backdrop-blur z-20">
        <h1
          className="text-xl font-bold tracking-tight select-none"
          aria-label="NoteNetwork"
        >
          NoteNetwork
        </h1>
        <Switch
          aria-label="Toggle dark mode"
          checked={theme === 'dark'}
          onCheckedChange={(checked) => {
            setTheme(checked ? 'dark' : 'light');
            toggleDarkMode();
          }}
        />
      </header>

      {/* Floating View Toggle Button */}
      <div className="fixed top-16 right-4 z-30">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => {
            if (val === 'network' || val === 'stack') setView(val);
          }}
          className="bg-background p-1 rounded-2xl shadow-lg border border-border"
        >
          <ToggleGroupItem
            value="network"
            aria-label="Network View"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            🌐 Network
          </ToggleGroupItem>
          <ToggleGroupItem
            value="stack"
            aria-label="Stack View"
            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            📄 Stack
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col">
        {view === 'network' && <NetworkView />}
        {view === 'stack' && <StackView />}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-background/90 border-t border-border px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 z-20 text-sm">
        <div className="flex items-center gap-2" aria-label="Note Metadata">
          <span className="font-medium">Note Title</span>
        </div>
        <div className="flex items-center gap-2" aria-label="Connected Nodes">
          <span className="text-muted-foreground">Connected Nodes</span>
        </div>
      </footer>
    </div>
  );
}

export default NoteNetworkPage;
