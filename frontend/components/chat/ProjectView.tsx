'use client';
import { useEffect, useState } from 'react';
import ChatPanel from './ChatPanel';
import AgentsPanel from '@/components/agents/AgentsPanel';
import AddMemberModal from '@/components/members/AddMemberModal';
import { getProject, listMembers } from '@/api/projects';
import type { Project, Member } from '@/types';

export default function ProjectView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProject(projectId), listMembers(projectId)])
      .then(([p, ms]) => { setProject(p); setMembers(ms); })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', color: '#8DA5AE', fontSize: 14 }}>
        Loading project…
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', color: '#DC2626', fontSize: 14 }}>
        Project not found.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden', animation: 'fadeIn 0.25s ease' }}>
      <ChatPanel project={project} panelOpen={showPanel} onTogglePanel={() => setShowPanel(p => !p)} />
      <AgentsPanel
        project={project}
        members={members}
        open={showPanel}
        onClose={() => setShowPanel(false)}
        onAddMember={() => setShowAddMember(true)}
        onMemberRemoved={userId => setMembers(prev => prev.filter(m => m.user_id !== userId))}
        onProjectDeleted={() => {}}
      />
      {showAddMember && (
        <AddMemberModal
          projectId={project.id}
          currentMembers={members}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={m => setMembers(prev => [...prev, m])}
        />
      )}
    </div>
  );
}
