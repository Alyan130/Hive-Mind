'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { Project } from '@/types';

function SidebarProjectItem({ project, active, onClick }: { project: Project; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 12px', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
        background: active ? 'rgba(95,149,152,0.2)' : hovered ? 'rgba(255,255,255,0.08)' : 'transparent',
        border: active ? '1px solid rgba(95,149,152,0.4)' : '1px solid transparent',
        transition: 'all 0.15s',
        boxShadow: active ? '0 2px 6px rgba(95,149,152,0.15)' : 'none',
      }}
    >
      <div style={{ color: active ? '#fff' : 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: active ? 600 : 500, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {project.name}
      </div>
      <div style={{ color: active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {project.description}
      </div>
    </div>
  );
}

interface SidebarProps {
  projects: Project[];
  onNewProject?: () => void;
}

export default function Sidebar({ projects, onNewProject }: SidebarProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isManager = user?.role === 'manager';
  const isDashboard = pathname === '/dashboard';

  return (
    <aside style={{
      width: 260, background: '#0e394b',
      position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    }}>
      {/* All Projects nav item */}
      <div style={{ padding: '16px 12px 10px' }}>
        <div
          onClick={() => router.push('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            padding: '9px 12px', borderRadius: 10,
            background: isDashboard ? 'rgba(95,149,152,0.15)' : 'transparent',
            border: isDashboard ? '1px solid rgba(95,149,152,0.3)' : '1px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: isDashboard ? 'linear-gradient(135deg, #5F9598, #1D546D)' : 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill={isDashboard ? '#fff' : 'rgba(255,255,255,0.6)'} opacity="0.9" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill={isDashboard ? '#fff' : 'rgba(255,255,255,0.6)'} opacity="0.7" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill={isDashboard ? '#fff' : 'rgba(255,255,255,0.6)'} opacity="0.7" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill={isDashboard ? '#fff' : 'rgba(255,255,255,0.6)'} opacity="0.5" />
            </svg>
          </div>
          <span style={{ color: isDashboard ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13.5, fontWeight: 600 }}>All Projects</span>
        </div>
      </div>

      {/* Label */}
      <div style={{ padding: '8px 12px 6px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Your Projects
        </span>
      </div>

      {/* Project list (scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px', overflowX: 'hidden' }}>
        {projects.length === 0
          ? <div style={{ padding: '12px', color: 'rgba(255,255,255,0.4)', fontSize: 12.5 }}>No projects yet</div>
          : projects.map(p => (
              <SidebarProjectItem
                key={p.id}
                project={p}
                active={pathname === `/projects/${p.id}`}
                onClick={() => router.push(`/projects/${p.id}`)}
              />
            ))
        }
      </div>

      {/* New project button (manager only) */}
      {isManager && (
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={onNewProject}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg, #5F9598, #1D546D)',
              border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, transition: 'all 0.15s',
              boxShadow: '0 4px 12px rgba(95,149,152,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            New Project
          </button>
        </div>
      )}
    </aside>
  );
}
