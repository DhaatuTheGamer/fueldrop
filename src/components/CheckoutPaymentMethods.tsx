import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

interface CheckoutPaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export default function CheckoutPaymentMethods({ paymentMethod, setPaymentMethod }: CheckoutPaymentMethodsProps) {
  return (
    <section className="card-brutal p-6 transition-colors">
      <h2 className="label-small mb-4">Payment Method</h2>
      <div className="space-y-3">
        {[
          { id: 'upi', label: 'UPI (GPay, PhonePe)', icon: <span className="font-heading font-bold text-primary text-xs uppercase tracking-wider">UPI</span> },
          { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
          { id: 'cash', label: 'Cash on Delivery', icon: <Wallet size={20} /> },
        ].map(method => (
          <label key={method.id} className={`flex items-center justify-between p-4 rounded-sm border-2 cursor-pointer transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:outline-none has-[:focus-visible]:ring-offset-2 ${
            paymentMethod === method.id ? 'border-primary bg-surface shadow-brutal-sm' : 'border-border bg-bg hover:border-muted'
          }`}>
            <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-bg border-2 border-border rounded-sm flex items-center justify-center shadow-brutal-sm transition-colors text-text">
                {method.icon}
              </div>
              <span className="font-heading font-bold text-text uppercase tracking-wider text-sm">{method.label}</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-primary' : 'border-border'}`}>
              {paymentMethod === method.id && <div className="w-3 h-3 bg-primary rounded-full" />}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
