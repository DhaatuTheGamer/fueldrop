import React from 'react';
import { ArrowLeft, Fuel, Mail, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate('/settings')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">About</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 bg-primary border-2 border-border rounded-sm flex items-center justify-center mb-4 shadow-brutal transition-colors">
            <Fuel size={48} className="text-bg" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-text tracking-tight">FuelDrop</h2>
          <p className="text-muted font-body mt-1 text-center">Version 2.0.0</p>
        </div>

        <div className="card-brutal p-6 space-y-4 transition-colors">
          <h3 className="label-small">Our Mission</h3>
          <p className="text-text font-body leading-relaxed text-sm">
            FuelDrop is on a mission to revolutionize the way people refuel their vehicles. We believe that getting fuel should be as easy as ordering food — convenient, transparent, and delivered right to your doorstep.
          </p>
          <p className="text-text font-body leading-relaxed text-sm">
            Founded in 2025, we're building the future of fuel delivery with a focus on safety, reliability, and an uncompromising user experience.
          </p>
        </div>

        <div className="card-brutal p-6 space-y-4 transition-colors">
          <h3 className="label-small">Contact Us</h3>
          <div className="space-y-3">
            <a href="mailto:support@fueldrop.in" className="flex items-center text-sm text-text hover:text-primary transition-colors font-body">
              <Mail size={18} className="mr-3 text-primary" /> support@fueldrop.in
            </a>
            <a href="https://fueldrop.in" className="flex items-center text-sm text-text hover:text-primary transition-colors font-body">
              <Globe size={18} className="mr-3 text-primary" /> www.fueldrop.in
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-muted font-body uppercase tracking-wider mt-8">
          Made with ❤️ in Bangalore, India
        </p>
      </main>
    </div>
  );
}
