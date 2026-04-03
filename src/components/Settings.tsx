import React from 'react';
import { ArrowLeft, Moon, Sun, Info, FileText, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { darkMode, setDarkMode } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button aria-label="Go back" onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Settings</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        <div className="card-brutal overflow-hidden transition-colors">
          {/* Dark Mode Toggle */}
          <div className="p-4 flex items-center justify-between border-b-2 border-border transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-text mr-3 transition-colors shadow-brutal-sm">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Dark Mode</span>
                <p className="text-xs text-muted font-body">{darkMode ? 'Lights off' : 'Lights on'}</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={darkMode}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-14 h-8 rounded-sm border-2 border-border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-offset-2 ${darkMode ? 'bg-primary' : 'bg-surface'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-sm bg-bg border-2 border-border transition-all shadow-brutal-sm ${darkMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* About */}
          <button
            onClick={() => navigate('/about')}
            className="w-full p-4 flex items-center justify-between border-b-2 border-border hover:bg-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:-outline-offset-2"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-text mr-3 transition-colors shadow-brutal-sm">
                <Info size={20} />
              </div>
              <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">About FuelDrop</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </button>

          {/* Terms */}
          <button
            onClick={() => navigate('/terms')}
            className="w-full p-4 flex items-center justify-between border-b-2 border-border hover:bg-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:-outline-offset-2"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-text mr-3 transition-colors shadow-brutal-sm">
                <FileText size={20} />
              </div>
              <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Terms & Conditions</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </button>

          {/* Privacy */}
          <button
            onClick={() => navigate('/privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-bg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:-outline-offset-2 rounded-b-sm"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-text mr-3 transition-colors shadow-brutal-sm">
                <Shield size={20} />
              </div>
              <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Privacy Policy</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </button>
        </div>
      </main>
    </div>
  );
}
