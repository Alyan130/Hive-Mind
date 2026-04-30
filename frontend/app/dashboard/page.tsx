'use client';
import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import ProjectsDashboard from '@/components/projects/ProjectsDashboard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);

  function handleCreated(p: Project) {
    setShowCreate(false);
    router.push(`/projects/${p.id}`);
  }

  return (
    <AppShell>
      <ProjectsDashboard onNewProject={() => setShowCreate(true)} />
      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
    </AppShell>
  );
}
