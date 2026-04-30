'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Avatar, { getInitials } from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import type { Project, Member } from '@/types';

interface Props {
  project: Project;
  members: Member[];
  index: number;
}

export default function ProjectCard({ project, members, index }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const preview = members.slice(0, 3);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', borderRadius: 14,
        border: `1.5px solid ${hovered ? '#B8D4DC' : '#E8EFF1'}`,
        padding: '22px 22px 18px',
        boxShadow: hovered ? '0 8px 28px rgba(6,30,41,0.1)' : '0 2px 8px rgba(6,30,41,0.05)',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        animation: `fadeUp 0.35s ease ${index * 0.07}s both`,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      {/* Top */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#061E29', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {project.name}
          </h3>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EBF3F5, #D0E7ED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#1D546D" opacity="0.8" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="#5F9598" opacity="0.8" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="#5F9598" opacity="0.5" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#1D546D" opacity="0.4" />
            </svg>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#4A5568', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div style={{ height: 1, background: '#F0F5F6' }} />

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', marginRight: 4 }}>
            {preview.map((m, i) => (
              <div key={m.user_id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: preview.length - i }}>
                <Avatar initials={m.initials || getInitials(m.name)} size={24} bg={i % 2 === 0 ? '#1D546D' : '#5F9598'} />
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#8DA5AE', fontWeight: 500 }}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
          Open Chat →
        </Button>
      </div>
    </div>
  );
}
