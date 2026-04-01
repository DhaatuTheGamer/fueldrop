import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Circle } from 'lucide-react';
import { useForm } from 'react-hook-form';

const SAFETY_ITEMS = [
  { id: 'outdoor', label: 'Vehicle is parked outdoors or in a well-ventilated area' },
  { id: 'cap', label: 'Fuel cap is accessible and not obstructed' },
  { id: 'flames', label: 'No open flames, sparks, or smoking nearby' },
  { id: 'engine', label: 'Vehicle engine is turned off' },
];

type ChecklistForm = Record<string, boolean>;

interface SafetyChecklistProps {
  onAllChecked: (allChecked: boolean) => void;
}

export default function SafetyChecklist({ onAllChecked }: SafetyChecklistProps) {
  const { register, watch, setValue, formState: { touchedFields } } = useForm<ChecklistForm>({
    defaultValues: SAFETY_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
  });

  const values = watch();
  const allDone = SAFETY_ITEMS.every(item => values[item.id]);

  useEffect(() => {
    onAllChecked(allDone);
  }, [allDone, onAllChecked]);

  const toggleItem = (id: string) => {
    setValue(id, !values[id], { shouldTouch: true });
  };

  return (
    <section className="card-brutal p-6 transition-colors">
      <h2 className="label-small mb-4 flex items-center">
        <ShieldCheck size={16} className="mr-2 text-accent" />
        Safety Checklist
      </h2>
      <p className="text-xs text-muted font-body mb-4">Please confirm the following before placing your order:</p>
      <div className="space-y-3">
        {SAFETY_ITEMS.map((item, index) => {
          const isChecked = values[item.id];
          const isTouched = touchedFields[item.id];

          return (
            <motion.button
              key={item.id}
              type="button"
              role="checkbox"
              aria-checked={isChecked}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start space-x-3 p-3 rounded-sm border-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isChecked
                  ? 'border-accent bg-accent/5'
                  : isTouched
                  ? 'border-primary bg-bg'
                  : 'border-border bg-bg hover:border-muted'
              }`}
            >
              <input type="hidden" {...register(item.id)} />
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckCircle2 size={20} className="text-accent" />
                ) : (
                  <Circle size={20} className="text-muted" />
                )}
              </div>
              <span className={`text-sm font-body ${isChecked ? 'text-text' : 'text-muted'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      {allDone && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm font-heading font-bold text-accent uppercase tracking-wider text-center"
        >
          ✓ All safety checks passed
        </motion.p>
      )}
    </section>
  );
}
