'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../ToastContext';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767';

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast('Invalid or missing reset token', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toast('Password has been reset successfully!', 'success');
        setTimeout(() => router.push('/login'), 2500);
      } else {
        toast(data.error || 'Failed to reset password', 'error');
      }
    } catch (err) {
      toast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
        <p className="text-xs text-rig-muted mb-6">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className="bg-rig-primary text-white text-xs font-bold px-4 py-2 rounded-lg">
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 size={40} className="text-green-500 mx-auto" />
        <h2 className="text-xl font-bold">Password Updated!</h2>
        <p className="text-xs text-rig-muted">
          Your password has been changed. Redirecting to login...
        </p>
        <Link href="/login" className="inline-block bg-rig-primary text-white text-xs font-bold px-6 py-2 rounded-lg mt-2">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleReset} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">
          New Password
        </label>
        <div className="relative">
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full bg-rig-background border border-rig-border rounded-xl pl-10 pr-4 py-3 text-sm text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
          />
          <Lock size={16} className="text-rig-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-rig-muted block mb-1.5 uppercase tracking-wider">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full bg-rig-background border border-rig-border rounded-xl pl-10 pr-4 py-3 text-sm text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
          />
          <Lock size={16} className="text-rig-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rig-primary hover:bg-rig-primary/90 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Update Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-rig-border shadow-2xl animate-in fade-in duration-300">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rig-muted hover:text-rig-text mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-rig-text tracking-tight">Set New Password</h1>
          <p className="text-xs text-rig-muted mt-1.5">
            Choose a strong password to protect your account and orders.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-xs text-rig-muted">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
