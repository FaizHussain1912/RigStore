'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useToast } from '../ToastContext';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokenHint, setTokenHint] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        if (data.resetToken) {
          setTokenHint(data.resetToken);
        }
        toast('Password reset request initiated.', 'success');
      } else {
        toast(data.error || 'Failed to request reset', 'error');
      }
    } catch (err) {
      toast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-rig-border shadow-2xl animate-in fade-in duration-300">
        
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rig-muted hover:text-rig-text mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-rig-primary/10 text-rig-primary flex items-center justify-center mx-auto mb-3">
            <KeyRound size={24} />
          </div>
          <h1 className="text-2xl font-black text-rig-text tracking-tight">Forgot Password</h1>
          <p className="text-xs text-rig-muted mt-1.5 max-w-xs mx-auto">
            Enter your account email address and we will provide a reset link to regain access.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-green-400">Reset instructions sent!</p>
              <p className="text-xs text-rig-muted mt-1">
                Please check your inbox for instructions to reset your password.
              </p>
            </div>

            {tokenHint && (
              <div className="p-4 bg-rig-background rounded-xl border border-rig-border text-center">
                <p className="text-xs text-rig-muted mb-2 font-medium">Click below to proceed directly:</p>
                <Link
                  href={`/reset-password?token=${tokenHint}`}
                  className="inline-block bg-rig-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-rig-primary/90"
                >
                  Enter New Password Now →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-rig-background border border-rig-border rounded-xl pl-10 pr-4 py-3 text-sm text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
                />
                <Mail size={16} className="text-rig-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rig-primary hover:bg-rig-primary/90 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
