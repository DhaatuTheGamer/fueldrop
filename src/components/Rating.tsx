import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, Leaf, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Rating() {
  const navigate = useNavigate();
  const { orders } = useAppContext();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const tips = [10, 20, 50];

  // Feature 9: Calculate savings
  const totalOrders = orders.filter(o => o.status === 'Delivered').length + 1; // +1 for current
  const timeSavedMinutes = totalOrders * 25; // ~25 min avg trip to petrol station
  const co2Avoided = totalOrders * 0.8; // ~0.8 kg CO₂ per avoided round-trip

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/'), 4000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 transition-colors">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface p-8 rounded-sm shadow-brutal text-center max-w-sm w-full border-2 border-border transition-colors"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-sm flex items-center justify-center mx-auto mb-6 text-primary border-2 border-border transition-colors">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-text mb-2 uppercase tracking-wider">Thank You!</h2>
          <p className="text-muted font-body mb-6">Your feedback helps us improve our service.</p>

          {/* Feature 9: Savings Gamification */}
          <div className="bg-bg border-2 border-border rounded-sm p-4 space-y-3 mb-4">
            <p className="font-heading font-bold text-text text-xs uppercase tracking-wider mb-3">Your Impact with FuelDrop</p>
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-sm flex items-center justify-center mx-auto mb-1 border border-accent/30">
                  <Clock size={18} className="text-accent" />
                </div>
                <p className="font-heading font-bold text-accent text-lg">{timeSavedMinutes}</p>
                <p className="text-[9px] text-muted font-body uppercase">min saved</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-sm flex items-center justify-center mx-auto mb-1 border border-accent/30">
                  <Leaf size={18} className="text-accent" />
                </div>
                <p className="font-heading font-bold text-accent text-lg">{co2Avoided.toFixed(1)}</p>
                <p className="text-[9px] text-muted font-body uppercase">kg CO₂</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-sm flex items-center justify-center mx-auto mb-1 border border-primary/30">
                  <Zap size={18} className="text-primary" />
                </div>
                <p className="font-heading font-bold text-primary text-lg">{totalOrders}</p>
                <p className="text-[9px] text-muted font-body uppercase">deliveries</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <main className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center">
        <div className="card-brutal p-8 text-center transition-colors">
          <div className="w-24 h-24 bg-surface rounded-sm flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-border shadow-brutal-sm transition-colors">
            <img src="https://i.pravatar.cc/150?img=11" alt="Captain" className="w-full h-full object-cover grayscale" />
          </div>
          
          <h2 className="text-2xl font-heading font-bold text-text mb-1 uppercase tracking-wider">Rate Rahul Kumar</h2>
          <p className="text-muted font-body mb-8">How was your fuel delivery experience?</p>

          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={40}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-primary text-primary'
                      : 'text-border'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="mb-8">
            <p className="label-small mb-4">Say Thanks with a Tip</p>
            <div className="flex justify-center space-x-3">
              {tips.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTip(amount === tip ? 0 : amount)}
                  className={`w-16 py-2 rounded-sm font-heading font-bold border-2 transition-all ${
                    tip === amount
                      ? 'bg-primary border-border text-bg shadow-brutal-sm'
                      : 'bg-surface border-border text-text hover:bg-bg'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 text-left">
            <p className="label-small mb-2">Additional Feedback (Optional)</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or what could be better..."
              className="input-brutal w-full h-24 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="btn-primary w-full py-4 text-lg mb-4"
          >
            Submit Feedback
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 text-muted font-heading font-bold uppercase tracking-wider hover:text-text transition-colors"
          >
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
}
