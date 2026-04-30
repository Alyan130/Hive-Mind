'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { listProjects } from '@/api/projects';
import type { Project } from '@/types';

export default function AppShell({ children }: { children: ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) { router.push('/login'); return; }
    listProjects().then(setProjects).catch(() => {});
  }, [token, router, mounted]);

  function handleProjectCreated(p: Project) {
    setProjects(prev => [...prev, p]);
    setShowCreate(false);
    router.push(`/projects/${p.id}`);
  }

  if (!mounted || !token) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F4' }}>
      <TopBar />
      <Sidebar projects={projects} onNewProject={() => setShowCreate(true)} />
      <main style={{ marginLeft: 260, marginTop: 56, minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
