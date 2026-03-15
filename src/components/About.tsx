import React from 'react';
import { ArrowLeft, Info, Mail, Phone, MapPin, Globe, Fuel } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function About() {
  const { setCurrentView } = useAppContext();

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => setCurrentView('settings')} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">About FuelDrop</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        <div className="flex flex-col items-center mt-4 mb-8">
          <div className="w-24 h-24 bg-primary border-2 border-border rounded-sm flex items-center justify-center text-bg mb-4 shadow-brutal transition-colors">
            <Fuel size={48} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-text tracking-tight">FuelDrop</h2>
          <p className="text-muted font-body mt-1 text-center">Version 2.0.0</p>
        </div>

        <div className="card-brutal p-6 space-y-4 transition-colors">
          <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider flex items-center">
            <Info size={20} className="mr-2 text-primary" /> Our Mission
          </h3>
          <p className="text-text font-body leading-relaxed">
            FuelDrop is dedicated to revolutionizing the way you refuel. We bring high-quality fuel directly to your doorstep, saving you time and hassle. Our mission is to provide a seamless, safe, and reliable fuel delivery service for everyone.
          </p>
        </div>

        <div className="card-brutal p-6 space-y-6 transition-colors">
          <h3 className="font-heading font-bold text-lg text-text uppercase tracking-wider">Contact Us</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Email</p>
                <p className="text-muted font-body">support@fueldrop.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Phone size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Phone</p>
                <p className="text-muted font-body">+91 1800-123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Address</p>
                <p className="text-muted font-body">123 Innovation Drive,<br/>Tech Park, Bangalore 560001</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Globe size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-heading font-bold text-text text-sm uppercase tracking-wider">Website</p>
                <p className="text-muted font-body">www.fueldrop.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
