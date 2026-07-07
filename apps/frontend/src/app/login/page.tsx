'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import { ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.user);
      
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rig-primary/10 blur-3xl -z-10 rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-rig-primary/20 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-rig-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-rig-muted text-sm mt-2">Log in to your RigStore account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rig-muted mb-1">Email address</label>
            <input 
              type="email" 
              required
              className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rigstore.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rig-muted mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rig-primary text-white font-semibold py-2.5 rounded-lg hover:bg-rig-primary-dark transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-rig-muted mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-rig-primary hover:text-rig-text transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
