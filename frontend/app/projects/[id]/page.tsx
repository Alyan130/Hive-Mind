'use client';
import { use } from 'react';
import AppShell from '@/components/layout/AppShell';
import ProjectView from '@/components/chat/ProjectView';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AppShell>
      <ProjectView projectId={id} />
    </AppShell>
  );
}
