'use client';
import { useState } from 'react';
import { Scale, Lightbulb, ListChecks, ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';
import { runAgent } from '@/api/agents';
import type { AgentType, AgentResult } from '@/types';
import Spinner from '@/components/ui/Spinner';

const AGENT_META: Record<AgentType, { title: string; description: string; emptyText: string; buttonLabel: string; Icon: React.ElementType }> = {
  decisions: {
    title: 'Decision Tracker',
    description: 'Extracts key decisions made in this project\'s conversations.',
    emptyText: 'No decisions analyzed yet.',
    buttonLabel: 'Extract Decisions',
    Icon: Scale,
  },
  ideas: {
    title: 'Ideator',
    description: 'Generates improvement ideas based on project context and discussions.',
    emptyText: 'No ideas generated yet.',
    buttonLabel: 'Generate Ideas',
    Icon: Lightbulb,
  },
  actions: {
    title: 'Action Items',
    description: 'Pulls tasks and assignments mentioned in the conversation.',
    emptyText: 'No action items found yet.',
    buttonLabel: 'Find Action Items',
    Icon: ListChecks,
  },
  risks: {
    title: 'Risk Analyzer',
    description: 'Flags concerns, blockers, and unresolved issues from discussions.',
    emptyText: 'No risks identified yet.',
    buttonLabel: 'Analyze Risks',
    Icon: ShieldAlert,
  },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

interface Props {
  type: AgentType;
  projectId: string;
}

export default function AgentTab({ type, projectId }: Props) {
  const meta = AGENT_META[type];
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<AgentResult | null>(null);

  async function handleRun() {
    setStatus('loading');
    try {
      const data = await runAgent(projectId, type);
      setResult({ items: data.items, generatedAt: new Date().toISOString() });
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 14px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1D546D', marginBottom: 4 }}>{meta.title}</div>
        <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.5 }}>{meta.description}</div>
      </div>

      {/* Generate / Refresh button + timestamp */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleRun}
          disabled={status === 'loading'}
          style={{
            width: '100%', padding: '9px 14px', borderRadius: 9,
            background: status === 'loading'
              ? 'rgba(29,84,109,0.5)'
              : 'linear-gradient(135deg, #1D546D 0%, #5F9598 100%)',
            border: 'none', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 7, transition: 'all 0.15s',
            boxShadow: '0 2px 8px rgba(29,84,109,0.2)',
          }}
        >
          {status === 'loading' ? (
            <><Spinner />{' '}Analyzing…</>
          ) : result ? (
            <><RefreshCw size={13} />Refresh</>
          ) : (
            <><Sparkles size={13} />{meta.buttonLabel}</>
          )}
        </button>
        {result && (
          <div style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 5 }}>
            Last run {timeAgo(result.generatedAt)}
          </div>
        )}
      </div>

      {/* Content area */}
      {status === 'idle' && !result && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', color: '#6B7280', textAlign: 'center', gap: 10, padding: '20px 10px',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <meta.Icon size={22} color="#5F9598" strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 12.5 }}>{meta.emptyText}</div>
          <div style={{ fontSize: 11.5, color: '#8DA5AE' }}>Click the button above to run.</div>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9,
          padding: '12px 14px', color: '#DC2626', fontSize: 12.5,
        }}>
          Something went wrong. Please try again.
        </div>
      )}

      {status === 'done' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.items.length === 0 ? (
            <div style={{ color: '#6B7280', fontSize: 12.5, textAlign: 'center', padding: '20px 0' }}>
              No {type} found in the conversation yet.
            </div>
          ) : (
            result.items.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#fff', borderRadius: 9, padding: '10px 12px',
                  borderLeft: '3px solid #5F9598',
                  boxShadow: '0 1px 4px rgba(6,30,41,0.06)',
                  fontSize: 12.5, color: '#1D3644', lineHeight: 1.55,
                  animation: 'fadeUp 0.2s ease both',
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {item}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
