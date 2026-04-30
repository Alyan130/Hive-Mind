'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Avatar, { getInitials } from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [hoverLogout, setHoverLogout] = useState(false);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header style={{
      height: 56, background: '#061E29', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 1px 8px rgba(0,0,0,0.15)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg, #1D546D 0%, #5F9598 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(29,84,109,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12h6v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em' }}>ProjectAI</span>
      </div>

      {/* Right: user + logout */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar
              initials={user.initials || getInitials(user.name) || '?'}
              size={30}
              bg="#1D546D"
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600 }}>{user.name}</div>
              <Badge label={user.role} variant={user.role === 'manager' ? 'manager' : 'employee'} />
            </div>
          </div>
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            style={{
              background: hoverLogout ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              color: 'rgba(255,255,255,0.7)', fontSize: 13, padding: '6px 12px',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
