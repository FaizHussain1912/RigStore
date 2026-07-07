import React, { useState, useEffect } from 'react';
import { Activity, Bell, Play, Monitor, Smartphone, Globe, Clock, Compass } from 'lucide-react';
import { io } from 'socket.io-client';

export default function LiveTrackingDashboard({ 
  siteSettings, 
  updateSetting, 
  handleSaveSettings, 
  savingSettings 
}: { 
  siteSettings: any, 
  updateSetting: any, 
  handleSaveSettings: any, 
  savingSettings: boolean 
}) {
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [pollingStatus, setPollingStatus] = useState('CONNECTING...');
  
  const alertSound = siteSettings?.GENERAL_SETTINGS?.visitorAlertSound || 'Double Chime';
  const alertSoundRef = React.useRef(alertSound);
  
  useEffect(() => {
    alertSoundRef.current = alertSound;
  }, [alertSound]);

  const playSound = (sound: string) => {
    if (sound === 'Silent') return;
    const audioUrl = sound === 'Single Ping' 
      ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
      : 'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3';
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("Audio playback failed:", e));
  };
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6767');
    
    if (socket.connected) {
      setPollingStatus('LIVE SOCKET ACTIVE');
      socket.emit('join_admin');
    }

    socket.on('connect', () => {
      setPollingStatus('LIVE SOCKET ACTIVE');
      socket.emit('join_admin');
    });

    socket.on('active_users', (users) => {
      setActiveUsers((prevUsers) => {
        if (users.length > prevUsers.length && prevUsers.length !== 0) {
          playSound(alertSoundRef.current);
        }
        return users;
      });
    });

    socket.on('disconnect', () => {
      setPollingStatus('DISCONNECTED');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const desktopCount = activeUsers.filter(u => u.device === 'Desktop').length;
  const mobileCount = activeUsers.filter(u => u.device !== 'Desktop').length;

  return (
    <div className="w-full bg-rig-surface text-rig-text rounded-2xl min-h-[600px] flex flex-col p-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-rig-border">
        <div className="flex items-center gap-3">
          <Activity className="text-emerald-400" size={32} />
          <div>
            <h2 className="text-2xl font-black tracking-tight text-rig-text">Live Visitor Tracking</h2>
            <p className="text-sm text-rig-muted mt-1">Monitor customer pathways and checkout transitions in real-time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-rig-background border border-rig-border rounded-xl p-2 shadow-sm">
            <button className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 font-semibold text-sm rounded-lg hover:bg-red-500/20 transition-colors">
              <Bell size={16} /> Visitor Alerts
            </button>
            <div className="h-6 w-px bg-rig-border"></div>
            <select 
              value={alertSound}
              onChange={(e) => updateSetting('GENERAL_SETTINGS', 'visitorAlertSound', e.target.value)}
              className="bg-transparent text-sm font-medium text-rig-text outline-none pr-4 cursor-pointer"
            >
              <option value="Double Chime" className="bg-rig-background">Double Chime (Default)</option>
              <option value="Single Ping" className="bg-rig-background">Single Ping</option>
              <option value="Silent" className="bg-rig-background">Silent</option>
            </select>
            <button 
              onClick={() => playSound(alertSound)}
              className="flex items-center gap-2 px-4 py-2 bg-rig-primary text-white font-semibold text-sm rounded-lg hover:bg-rig-primary/90 transition-colors"
            >
              <Play size={14} /> Test
            </button>
          </div>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Visitors */}
        <div className="bg-rig-background border border-rig-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-6 right-6 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <p className="text-xs font-bold text-rig-muted tracking-widest uppercase mb-4">Active Visitors</p>
          <h3 className="text-6xl font-black text-rig-text mb-6">{activeUsers.length}</h3>
          <p className="text-xs font-medium text-rig-muted">Refreshes live on every action</p>
        </div>

        {/* Devices Breakdown */}
        <div className="bg-rig-background border border-rig-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-rig-muted tracking-widest uppercase mb-4">Devices Breakdown</p>
          <div className="flex items-center gap-6 mt-auto">
            <div className="flex items-center gap-2 text-rig-text font-bold text-sm">
              <Monitor size={18} className="text-rig-muted" /> {desktopCount} Desktop
            </div>
            <div className="flex items-center gap-2 text-rig-text font-bold text-sm">
              <Smartphone size={18} className="text-rig-muted" /> {mobileCount} Mobile
            </div>
          </div>
        </div>

        {/* Live Polling */}
        <div className="bg-rig-background border border-rig-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
            <Compass size={24} />
          </div>
          <div>
            <h4 className="font-bold text-rig-text text-lg">Live Polling</h4>
            <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase mt-1">{pollingStatus}</p>
          </div>
        </div>
      </div>

      {/* Active Traffic Table */}
      <div className="bg-rig-background border border-rig-border rounded-2xl shadow-sm overflow-hidden flex-1">
        <div className="p-6 border-b border-rig-border">
          <h3 className="text-lg font-bold text-rig-text">Active Traffic</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-rig-surface text-rig-muted text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Visitor Location</th>
                <th className="px-6 py-4">Device & Browser</th>
                <th className="px-6 py-4">Current Page</th>
                <th className="px-6 py-4">Pathway History</th>
                <th className="px-6 py-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rig-border">
              {activeUsers.map((user, idx) => {
                const isDesktop = user.device === 'Desktop';
                const sessionStartedDate = new Date(user.sessionStarted);
                return (
                  <tr key={user.id || idx} className="hover:bg-rig-surface transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rig-surface flex items-center justify-center text-rig-muted">
                          <Globe size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-rig-text">{user.location}</p>
                          <p className="text-xs text-rig-muted mt-0.5">IP: {user.ip || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-rig-text">
                        {isDesktop ? <Monitor size={16} className="text-rig-muted" /> : <Smartphone size={16} className="text-rig-muted" />} {user.browser}
                      </div>
                      <p className="text-xs text-rig-muted mt-1">{user.device} User</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                        {user.path} <ArrowUpRightIcon />
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-red-500/10 text-red-400 font-medium text-xs rounded border border-red-500/20">
                        {user.path.split('/')[1] || 'home'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-rig-muted font-medium">
                        <Clock size={14} /> {Math.floor((Date.now() - user.lastActive) / 1000)}s ago
                      </div>
                      <p className="text-xs text-rig-muted mt-1">Started: {sessionStartedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                  </tr>
                );
              })}
              {activeUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-rig-muted font-medium">
                    No active visitors at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function ArrowUpRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
}
