import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Fuel, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, addNotification, vehicles, hasCompletedOnboarding } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10 && acceptedTerms) {
      setStep('otp');
      setCountdown(30);
    }
  };

  const handleResendOtp = () => {
    setCountdown(30);
    addNotification('OTP Resent', 'A new OTP has been sent to your mobile number.', 'info');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid OTP');
      }

      const data = await response.json();

      setUser({
        id: data.user?.id || 'user-1',
        phone,
        name: data.user?.name || 'Guest User',
        email: data.user?.email || '',
      });

      // Route new users to onboarding, returning users to home
      if (!hasCompletedOnboarding && vehicles.length === 0) {
        navigate('/onboarding');
      } else {
        navigate('/');
      }
      setTimeout(() => {
        addNotification('Welcome to FuelDrop!', 'Get ₹50 off on your first order with code FIRST50', 'success');
      }, 1000);
    } catch (error) {
      addNotification('Error', error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-text transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-primary rounded-sm flex items-center justify-center mb-4 border-2 border-border shadow-brutal">
          <Fuel size={40} className="text-bg" />
        </div>
        <h1 className="text-4xl font-heading font-bold tracking-tight">FuelDrop</h1>
        <p className="text-muted mt-2 font-body">Fuel delivered to your doorstep</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md card-brutal p-8"
      >
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="label-small">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 border-2 border-r-0 border-border bg-surface text-muted rounded-l-sm font-body">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="input-brutal rounded-l-none"
                  placeholder="Enter 10 digit number"
                  required
                />
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-primary rounded-sm focus:ring-primary border-2 border-border bg-bg"
              />
              <span className="text-sm text-muted leading-tight font-body">
                I agree to the <button type="button" onClick={() => navigate('/terms')} className="text-primary hover:underline font-bold">Terms & Conditions</button> and <button type="button" onClick={() => navigate('/privacy')} className="text-primary hover:underline font-bold">Privacy Policy</button>
              </span>
            </label>

            <button
              type="submit"
              disabled={phone.length < 10 || !acceptedTerms}
              className="btn-primary w-full"
            >
              Get OTP <ArrowRight size={16} className="ml-2" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="label-small">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="input-brutal text-center tracking-widest text-2xl font-heading"
                placeholder="1234"
                required
              />
            </div>
            <button
              type="submit"
              disabled={otp.length < 4 || isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full"
                />
              ) : (
                'Verify & Login'
              )}
            </button>
            <div className="flex flex-col space-y-3 mt-4">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className={`w-full text-sm font-body uppercase tracking-wider font-bold transition-colors ${
                  countdown > 0 ? 'text-muted cursor-not-allowed' : 'text-primary hover:underline'
                }`}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-muted hover:text-text transition-colors font-body uppercase tracking-wider font-bold"
              >
                Change Mobile Number
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
