'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.token, data.user);
      router.push('/');
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
        <div className="absolute top-0 left-0 w-64 h-64 bg-rig-secondary/10 blur-3xl -z-10 rounded-full mix-blend-screen transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-rig-secondary/20 rounded-xl flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-rig-secondary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-rig-muted text-sm mt-2">Join RigStore for faster checkout</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rig-muted mb-1">Full name</label>
            <input 
              type="text" 
              required
              className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-secondary transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-rig-muted mb-1">Email address</label>
            <input 
              type="email" 
              required
              className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-secondary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-rig-muted mb-1">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              className="w-full bg-rig-background border border-rig-border rounded-lg px-4 py-2.5 text-rig-text focus:outline-none focus:border-rig-secondary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-rig-secondary text-rig-text font-semibold py-2.5 rounded-lg hover:bg-rig-secondary-dark transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-rig-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-rig-secondary hover:text-rig-text transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
