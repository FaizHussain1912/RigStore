import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | RigStore',
  description: 'Understand how RigStore collects, stores, and protects your personal information and orders.',
};

export default function PrivacyPage() {
  return (
    <div className="container-dense py-12 md:py-20 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-rig-primary font-bold tracking-wider text-xs uppercase bg-rig-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
          Data Security
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Privacy <span className="text-rig-primary">Policy</span>
        </h1>
        <p className="text-rig-muted text-base max-w-xl mx-auto">
          Your privacy and security are our top priorities. Here is how we safeguard your information.
        </p>
      </div>

      <div className="space-y-8 bg-rig-surface border border-rig-border p-8 rounded-2xl text-rig-text">
        <section>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Eye className="text-rig-primary w-5 h-5" /> 1. Information We Collect
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed mb-3">
            When you register, build a custom PC, or place an order on RigStore, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-rig-muted pl-2">
            <li>Contact details: Name, email address, phone number, and physical delivery address.</li>
            <li>Order information: Hardware components selected, invoices, and delivery area preferences.</li>
            <li>Device & session data: IP address and browser type to ensure secure checkout and prevent fraudulent orders.</li>
          </ul>
        </section>

        <section className="border-t border-rig-border/50 pt-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Lock className="text-rig-primary w-5 h-5" /> 2. How We Protect Your Data
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed">
            All customer passwords are encrypted using industry-standard bcrypt hashing. Communication with our servers is protected using TLS/SSL encryption. We do not sell, rent, or lease customer data to third-party marketing companies.
          </p>
        </section>

        <section className="border-t border-rig-border/50 pt-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <FileText className="text-rig-primary w-5 h-5" /> 3. Payment Privacy
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed">
            For Cash on Delivery (COD), order values are collected upon physical arrival. For digital wallet transfers (JazzCash/NayaPay), transactions are conducted through official channels and verified securely.
          </p>
        </section>

        <section className="border-t border-rig-border/50 pt-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Shield className="text-rig-primary w-5 h-5" /> 4. Your Rights
          </h2>
          <p className="text-sm text-rig-muted leading-relaxed">
            You may request deletion or updates to your profile data at any time directly through your account dashboard under "My Profile" or by reaching out to support@rigstore.pk.
          </p>
        </section>
      </div>
    </div>
  );
}
