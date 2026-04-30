'use client';
import { useEffect, useState } from 'react';
import { listProjects, listMembers } from '@/api/projects';
import ProjectCard from './ProjectCard';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import type { Project, Member } from '@/types';

export default function ProjectsDashboard({ onNewProject }: { onNewProject?: () => void }) {
  const { user } = useAuthStore();
  const isManager = user?.role === 'manager';
  const [projects, setProjects] = useState<Project[]>([]);
  const [membersMap, setMembersMap] = useState<Record<string, Member[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProjects()
      .then(async (ps) => {
        setProjects(ps);
        const entries = await Promise.all(
          ps.map(p => listMembers(p.id).then(ms => [p.id, ms] as [string, Member[]]))
        );
        setMembersMap(Object.fromEntries(entries));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '32px 36px', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#061E29', letterSpacing: '-0.03em' }}>Your Projects</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#4A5568' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} you&apos;re a member of
          </p>
        </div>
        {isManager && (
          <Button variant="primary" onClick={onNewProject}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Project
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', color: '#8DA5AE', fontSize: 14 }}>Loading projects…</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 16, border: '1.5px dashed #C8DCE0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
          <h3 style={{ color: '#1D546D', margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>No projects yet</h3>
          <p style={{ color: '#8DA5AE', margin: 0, fontSize: 14 }}>
            {isManager ? 'Create your first project to get started.' : 'Ask your manager to add you to a project.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              members={membersMap[project.id] || []}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
