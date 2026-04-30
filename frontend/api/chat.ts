import client from './client';
import type { ChatMessage, ChatResponse } from '@/types';

export const sendMessage = (projectId: string, message: string) =>
  client.post<ChatResponse>(`/chat/${projectId}`, { message }).then(r => r.data);

export const getHistory = (projectId: string) =>
  client.get<ChatMessage[]>(`/chat/${projectId}/history`).then(r => r.data);
