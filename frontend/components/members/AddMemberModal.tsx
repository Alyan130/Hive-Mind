'use client';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Avatar, { getInitials } from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { listUsers } from '@/api/users';
import { addMember } from '@/api/projects';
import type { User, Member } from '@/types';

export default function AddMemberModal({
  projectId, currentMembers, onClose, onMemberAdded,
}: {
  projectId: string;
  currentMembers: Member[];
  onClose: () => void;
  onMemberAdded: (member: Member) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [addedIds, setAddedIds] = useState(new Set(currentMembers.map(m => m.user_id)));
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => { listUsers().then(setUsers); }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  async function toggle(u: User) {
    if (addedIds.has(u.id) || adding) return;
    setAdding(u.id);
    try {
      await addMember(projectId, u.id);
      setAddedIds(prev => new Set([...prev, u.id]));
      onMemberAdded({
        user_id: u.id, name: u.name, email: u.email,
        role: u.role, initials: getInitials(u.name),
      });
    } finally {
      setAdding(null);
    }
  }

  return (
    <Modal title="Add Members" onClose={onClose} width={440}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔍  Search by name or email…"
          style={{
            padding: '9px 14px', borderRadius: 8, border: '1.5px solid #D1DFE3',
            fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
            color: '#061E29', background: '#F7FAFB', width: '100%',
          }}
        />
        <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(u => {
            const isMember = addedIds.has(u.id);
            return (
              <div
                key={u.id}
                onClick={() => toggle(u)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 10, cursor: isMember ? 'default' : 'pointer',
                  background: isMember ? '#F0F8F5' : 'transparent',
                  transition: 'background 0.12s',
                }}
              >
                <Avatar initials={getInitials(u.name)} size={34} bg={u.role === 'manager' ? '#1D546D' : '#5F9598'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#061E29' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#8DA5AE' }}>{u.email}</div>
                </div>
                <Badge label={u.role} variant={u.role} />
                {isMember
                  ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5 L4 7 L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px dashed #C8DCE0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8DA5AE', fontSize: 14, flexShrink: 0 }}>+</div>
                }
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
          <Button variant="primary" onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}
