import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, Zap } from 'lucide-react';

interface SchedulePickerProps {
  isScheduled: boolean;
  scheduledDate: string;
  onScheduleChange: (isScheduled: boolean, scheduledDate: string) => void;
}

export default function SchedulePicker({ isScheduled, scheduledDate, onScheduleChange }: SchedulePickerProps) {
  const [selectedDay, setSelectedDay] = useState(0); // 0=today, 1-3=future days
  const [selectedSlot, setSelectedSlot] = useState('');

  const days = Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      index: i,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      date: d.toISOString().split('T')[0],
    };
  });

  const currentHour = new Date().getHours();
  const timeSlots = [
    { label: '6–8 AM', value: '06:00', hour: 6 },
    { label: '8–10 AM', value: '08:00', hour: 8 },
    { label: '10–12 PM', value: '10:00', hour: 10 },
    { label: '12–2 PM', value: '12:00', hour: 12 },
    { label: '2–4 PM', value: '14:00', hour: 14 },
    { label: '4–6 PM', value: '16:00', hour: 16 },
    { label: '6–8 PM', value: '18:00', hour: 18 },
    { label: '8–10 PM', value: '20:00', hour: 20 },
  ].filter(slot => {
    // For today, only show future slots
    if (selectedDay === 0) return slot.hour > currentHour;
    return true;
  });

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    const dateStr = `${days[selectedDay].date}T${slot}:00`;
    onScheduleChange(true, dateStr);
  };

  return (
    <section className="card-brutal p-6 transition-colors">
      <h2 className="label-small mb-4">Delivery Time</h2>

      <div className="flex p-1 bg-bg border-2 border-border rounded-sm mb-4 transition-colors">
        <button
          onClick={() => {
            onScheduleChange(false, '');
            setSelectedSlot('');
          }}
          className={`flex-1 py-2.5 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center ${
            !isScheduled ? 'bg-primary text-bg border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
          }`}
        >
          <Zap size={14} className="mr-1.5" /> Now
        </button>
        <button
          onClick={() => onScheduleChange(true, scheduledDate)}
          className={`flex-1 py-2.5 text-sm font-heading font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center ${
            isScheduled ? 'bg-primary text-bg border-2 border-border shadow-brutal-sm' : 'text-muted hover:text-text'
          }`}
        >
          <Calendar size={14} className="mr-1.5" /> Schedule
        </button>
      </div>

      {isScheduled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Day selector */}
          <div>
            <p className="text-xs text-muted font-body uppercase tracking-wider mb-2">Select Day</p>
            <div className="grid grid-cols-4 gap-2">
              {days.map((day) => (
                <button
                  key={day.index}
                  onClick={() => {
                    setSelectedDay(day.index);
                    setSelectedSlot('');
                  }}
                  className={`py-2 px-1 text-sm font-heading font-bold rounded-sm border-2 transition-all text-center ${
                    selectedDay === day.index
                      ? 'border-primary bg-surface text-text shadow-brutal-sm'
                      : 'border-border bg-bg text-muted hover:border-muted'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time slot selector */}
          <div>
            <p className="text-xs text-muted font-body uppercase tracking-wider mb-2">Select Time Slot</p>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.length > 0 ? timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => handleSlotSelect(slot.value)}
                  className={`py-2.5 px-3 text-sm font-heading font-bold rounded-sm border-2 transition-all flex items-center justify-center ${
                    selectedSlot === slot.value
                      ? 'border-primary bg-surface text-text shadow-brutal-sm'
                      : 'border-border bg-bg text-muted hover:border-muted'
                  }`}
                >
                  <Clock size={14} className="mr-1.5 shrink-0" /> {slot.label}
                </button>
              )) : (
                <p className="col-span-2 text-sm text-muted font-body text-center py-4">
                  No more time slots available today. Try tomorrow.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
