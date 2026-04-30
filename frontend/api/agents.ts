import client from './client';
import type { AgentType } from '@/types';

export const runAgent = (projectId: string, type: AgentType) =>
  client.post<{ items: string[] }>(`/agents/${projectId}/${type}`).then(r => r.data);
