import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Rating() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const tips = [10, 20, 50];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
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
          <p className="text-muted font-body">Your feedback helps us improve our service.</p>
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
