'use client';
import { useState } from 'react';
import { Users, Scale, Lightbulb, ListChecks, ShieldAlert, X } from 'lucide-react';
import InfoPanel from '@/components/members/InfoPanel';
import AgentTab from './AgentTab';
import type { Project, Member, AgentType } from '@/types';

type Tab = 'members' | AgentType;

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'members',   label: 'Members',   Icon: Users },
  { id: 'decisions', label: 'Decisions', Icon: Scale },
  { id: 'ideas',     label: 'Ideas',     Icon: Lightbulb },
  { id: 'actions',   label: 'Actions',   Icon: ListChecks },
  { id: 'risks',     label: 'Risks',     Icon: ShieldAlert },
];

interface Props {
  project: Project;
  members: Member[];
  open: boolean;
  onClose: () => void;
  onAddMember: () => void;
  onMemberRemoved: (userId: string) => void;
  onProjectDeleted: () => void;
}

export default function AgentsPanel({ project, members, open, onClose, onAddMember, onMemberRemoved, onProjectDeleted }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('members');

  return (
    <aside style={{
      width: open ? '50%' : 0,
      flexShrink: 0,
      background: '#fff',
      borderLeft: open ? '1px solid #E8EFF1' : 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '1px solid #E8EFF1',
        background: '#fff', flexShrink: 0, minWidth: 0,
        alignItems: 'center',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                style={{
                  flex: 1, minWidth: 52, padding: '10px 4px 9px',
                  border: 'none', background: 'transparent',
                  borderBottom: isActive ? '2px solid #5F9598' : '2px solid transparent',
                  color: isActive ? '#1D546D' : 'rgba(0,0,0,0.5)',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                <tab.Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                <span style={{ fontSize: 9, letterSpacing: '0.04em', fontWeight: isActive ? 700 : 500 }}>
                  {tab.label.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          title="Close panel"
          style={{
            width: 32, height: 32, borderRadius: 7, border: '1px solid #E8EFF1',
            background: 'transparent', color: '#8DA5AE',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 10px', flexShrink: 0, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1D546D'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1D546D'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8DA5AE'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E8EFF1'; }}
        >
          <X size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'members' ? (
          <InfoPanel
            project={project}
            members={members}
            onAddMember={onAddMember}
            onMemberRemoved={onMemberRemoved}
            onProjectDeleted={onProjectDeleted}
          />
        ) : (
          <AgentTab key={`${project.id}-${activeTab}`} type={activeTab} projectId={project.id} />
        )}
      </div>
    </aside>
  );
}
