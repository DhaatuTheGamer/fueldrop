import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LEGAL_CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    content: `
Last updated: March 2025

1. Information We Collect
We collect information you provide directly, such as your name, phone number, email address, and vehicle details when you create an account and use our services. We also collect location data to facilitate fuel delivery to your specified address.

2. How We Use Your Information
We use the information we collect to provide and improve our fuel delivery service, process transactions, send notifications about your orders, and communicate with you about promotions and updates.

3. Data Security
We implement appropriate security measures to protect your personal information. Your payment information is encrypted and processed through secure payment gateways.

4. Third-Party Sharing
We do not sell your personal information. We may share data with delivery partners and payment processors solely to fulfill your orders.

5. Your Rights
You may access, update, or delete your personal information at any time through the app settings. You may also contact us to exercise your data rights.

6. Contact Us
For any privacy-related concerns, reach out to us at privacy@fueldrop.in.
    `.trim()
  },
  terms: {
    title: 'Terms & Conditions',
    content: `
Last updated: March 2025

1. Acceptance of Terms
By using FuelDrop, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our service.

2. Service Description
FuelDrop provides an on-demand fuel delivery service. We connect users with fuel delivery partners who deliver fuel directly to the specified location.

3. User Responsibilities
- Provide accurate delivery location and vehicle information
- Ensure the vehicle is accessible for fueling
- Be present at the delivery location or designate a representative
- Follow all safety guidelines provided during the delivery process

4. Pricing and Payment
Fuel prices are displayed at the time of ordering and may vary based on market rates. Delivery fees and applicable taxes will be clearly shown before checkout.

5. Cancellations and Refunds
Orders may be cancelled before a delivery partner is assigned. Refunds for cancelled orders will be processed within 5-7 business days.

6. Safety
Users must comply with all safety requirements during fuel delivery. FuelDrop reserves the right to refuse service if safety conditions are not met.

7. Limitation of Liability
FuelDrop is not liable for any indirect, incidental, or consequential damages arising from the use of our service.

8. Changes to Terms
We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the modified terms.
    `.trim()
  }
};

export default function Legal({ type }: { type: 'privacy' | 'terms' }) {
  const navigate = useNavigate();
  const content = LEGAL_CONTENT[type];

  return (
    <div className="min-h-screen bg-bg flex flex-col transition-colors">
      <header className="bg-surface border-b-2 border-border px-6 py-4 flex items-center sticky top-0 z-10 transition-colors">
        <button onClick={() => navigate(-1)} className="mr-4 text-text hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-heading font-bold text-xl text-text uppercase tracking-wider">{content.title}</h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full">
        <div className="card-brutal p-6 transition-colors">
          <div className="prose prose-sm max-w-none">
            {content.content.split('\n').map((line, i) => {
              if (!line.trim()) return null;
              if (/^\d+\./.test(line.trim())) {
                return <h3 key={i} className="font-heading font-bold text-text mt-6 mb-2 text-sm uppercase tracking-wider">{line.trim()}</h3>;
              }
              if (line.trim().startsWith('-')) {
                return <li key={i} className="text-text font-body text-sm ml-4 mb-1">{line.trim().slice(1).trim()}</li>;
              }
              return <p key={i} className="text-text font-body text-sm mb-3 leading-relaxed">{line.trim()}</p>;
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
