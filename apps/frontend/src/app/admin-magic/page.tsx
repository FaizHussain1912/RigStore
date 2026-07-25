'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminMagicPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const performMagicLogin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767'}/api/auth/magic-admin`);
        if (res.ok) {
          const data = await res.json();
          login(data.token, data.user);
          router.push('/admin');
        } else {
          setError('Failed to login via magic route.');
        }
      } catch (err) {
        setError('Network error during magic login.');
      }
    };

    performMagicLogin();
  }, [login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rig-background text-rig-text">
      <div className="glass-panel p-8 rounded-2xl text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-rig-primary">Magic Login</h1>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-rig-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-rig-muted">Logging you in as Admin...</p>
          </div>
        )}
      </div>
    </div>
  );
}
