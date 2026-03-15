import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User as UserIcon, Mail, Phone, LogOut, Edit2, Check, Heart, ChevronRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const { user, setUser, addNotification, logout } = useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name, email });
      setIsEditing(false);
      addNotification('Profile Updated', 'Your profile information has been saved.', 'success');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="mr-4 text-text hover:text-primary transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">Profile</h1>
        </div>
        {isEditing ? (
          <button onClick={handleSave} className="text-primary font-heading font-bold flex items-center uppercase tracking-wider text-sm">
            <Check size={18} className="mr-1" /> Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-primary font-heading font-bold flex items-center uppercase tracking-wider text-sm">
            <Edit2 size={16} className="mr-1" /> Edit
          </button>
        )}
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        <div className="flex flex-col items-center mt-4 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-primary border-2 border-border rounded-sm flex items-center justify-center text-bg font-heading font-bold text-4xl mb-4 shadow-brutal transition-colors">
              {user?.name.charAt(0) || 'U'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface border-2 border-border rounded-sm flex items-center justify-center text-primary shadow-brutal-sm hover:bg-bg transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-heading font-bold text-text">{user?.name}</h2>
          <p className="text-muted font-body">+91 {user?.phone}</p>
        </div>

        <div className="card-brutal p-6 space-y-6 transition-colors">
          <div>
            <label className="label-small">Full Name</label>
            <div className="flex items-center bg-bg rounded-sm p-3 border-2 border-border transition-colors">
              <UserIcon size={20} className="text-muted mr-3" />
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-text font-body"
                  placeholder="Enter your name"
                />
              ) : (
                <span className="text-text font-body">{user?.name || 'Not set'}</span>
              )}
            </div>
          </div>

          <div>
            <label className="label-small">Email Address</label>
            <div className="flex items-center bg-bg rounded-sm p-3 border-2 border-border transition-colors">
              <Mail size={20} className="text-muted mr-3" />
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-text font-body"
                  placeholder="Enter your email"
                />
              ) : (
                <span className="text-text font-body">{user?.email || 'Not set'}</span>
              )}
            </div>
          </div>

          <div>
            <label className="label-small">Mobile Number</label>
            <div className="flex items-center bg-bg rounded-sm p-3 border-2 border-border transition-colors">
              <Phone size={20} className="text-muted mr-3" />
              <span className="text-muted font-body">+91 {user?.phone}</span>
              <span className="ml-auto text-[10px] bg-primary text-bg px-2 py-1 rounded-sm font-heading font-bold uppercase tracking-widest border-2 border-border">Verified</span>
            </div>
          </div>
        </div>

        <div className="card-brutal overflow-hidden transition-colors">
          <button 
            onClick={() => navigate('/favorites')}
            className="w-full p-4 flex items-center justify-between hover:bg-bg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center text-primary mr-3 transition-colors shadow-brutal-sm">
                <Heart size={20} className="fill-current" />
              </div>
              <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">Favorite Orders</span>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 bg-surface text-text rounded-sm font-heading font-bold text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center justify-center border-2 border-border"
        >
          <LogOut size={18} className="mr-2" /> Log Out
        </button>
      </main>
    </div>
  );
}
