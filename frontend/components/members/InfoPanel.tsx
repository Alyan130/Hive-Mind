'use client';
import { useState } from 'react';
import Avatar, { getInitials } from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { removeMember, deleteProject } from '@/api/projects';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import type { Project, Member } from '@/types';

function MemberRow({
  member,
  canRemove,
  onRequestRemove,
}: {
  member: Member;
  canRemove: boolean;
  onRequestRemove: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px',
        borderRadius: 9, background: hovered ? '#F7FAFB' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <Avatar
        initials={member.initials || getInitials(member.name)}
        size={30}
        bg={member.role === 'manager' ? '#1D546D' : '#5F9598'}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#061E29', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {member.name}
        </div>
        <Badge label={member.role} variant={member.role} />
      </div>
      {canRemove && hovered && (
        <button
          onClick={onRequestRemove}
          title="Remove member"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#DC2626', fontSize: 16, lineHeight: 1,
            padding: '2px 4px', borderRadius: 4, flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function InfoPanel({
  project, members, onAddMember, onMemberRemoved, onProjectDeleted,
}: {
  project: Project;
  members: Member[];
  onAddMember: () => void;
  onMemberRemoved: (userId: string) => void;
  onProjectDeleted: () => void;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const isManager = user?.role === 'manager';

  // Remove member confirmation
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const confirmRemoveMember = members.find(m => m.user_id === confirmRemoveId);

  // Delete project confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleRemove(userId: string) {
    await removeMember(project.id, userId);
    setConfirmRemoveId(null);
    onMemberRemoved(userId);
  }

  async function handleDelete() {
    await deleteProject(project.id);
    onProjectDeleted();
    router.push('/dashboard');
  }

  return (
    <>
      <div style={{
        width: 280, background: '#fff', display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid #E8EFF1', overflowY: 'auto',
        animation: 'slideInRight 0.3s ease', flexShrink: 0,
      }}>
        {/* Project info */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #F0F5F6' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5C7F8A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Project Info
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 14.5, fontWeight: 700, color: '#061E29' }}>{project.name}</h3>
          <p style={{ margin: '0 0 10px', fontSize: 12.5, color: '#4A5568', lineHeight: 1.5 }}>
            {project.description || 'No description.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#7A9BA8' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="#7A9BA8" strokeWidth="1.2" />
              <path d="M1 5h10" stroke="#7A9BA8" strokeWidth="1.2" />
              <path d="M4 1v2M8 1v2" stroke="#7A9BA8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Created {new Date(project.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Members */}
        <div style={{ padding: '16px 18px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#5C7F8A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Members ({members.length})
            </div>
            {isManager && (
              <button
                onClick={onAddMember}
                style={{
                  background: '#EBF3F5', border: 'none', borderRadius: 6,
                  color: '#1D546D', fontSize: 12, fontWeight: 700,
                  padding: '4px 9px', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                + Add
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {members.map(m => (
              <MemberRow
                key={m.user_id}
                member={m}
                canRemove={isManager && m.user_id !== user?.id}
                onRequestRemove={() => setConfirmRemoveId(m.user_id)}
              />
            ))}
          </div>
        </div>

        {/* Danger zone (manager only) */}
        {isManager && (
          <div style={{ padding: '12px 18px 18px', borderTop: '1px solid #F0F5F6' }}>
            <Button
              variant="danger-outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ width: '100%' }}
            >
              Delete Project
            </Button>
          </div>
        )}
      </div>

      {/* Remove Member confirmation */}
      {confirmRemoveId && confirmRemoveMember && (
        <ConfirmDialog
          title="Remove Member?"
          message={`${confirmRemoveMember.name} will lose access to this project. This cannot be undone.`}
          confirmLabel="Remove"
          variant="danger"
          onConfirm={() => handleRemove(confirmRemoveId)}
          onCancel={() => setConfirmRemoveId(null)}
        />
      )}

      {/* Delete Project confirmation */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Project?"
          message={`This will permanently delete "${project.name}" and all its data. This action cannot be undone.`}
          confirmLabel="Delete Project"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
