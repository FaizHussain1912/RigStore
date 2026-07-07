'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { io } from 'socket.io-client';

let socket: any;

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize socket connection once
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767');
      
      // Store session start time
      if (!sessionStorage.getItem('trackingSessionStarted')) {
        sessionStorage.setItem('trackingSessionStarted', Date.now().toString());
      }
    }

    const sessionStarted = parseInt(sessionStorage.getItem('trackingSessionStarted') || Date.now().toString());

    // Basic device detection
    let device = 'Desktop';
    let browser = 'Unknown';
    if (typeof window !== 'undefined' && window.navigator) {
      const ua = window.navigator.userAgent;
      if (/mobile/i.test(ua)) device = 'Mobile';
      else if (/tablet/i.test(ua)) device = 'Tablet';
      
      if (/chrome/i.test(ua)) browser = 'Chrome';
      else if (/safari/i.test(ua)) browser = 'Safari';
      else if (/firefox/i.test(ua)) browser = 'Firefox';
      else if (/edge/i.test(ua)) browser = 'Edge';
    }

    // Ping tracking update
    const sendUpdate = () => {
      socket.emit('tracking_update', {
        path: pathname,
        device,
        browser,
        sessionStarted
      });
    };

    sendUpdate();
    const interval = setInterval(sendUpdate, 5000);

    return () => clearInterval(interval);
  }, [pathname]);

  return <>{children}</>;
}
