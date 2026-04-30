import client from './client';
import type { Project, ProjectCreate, Member } from '@/types';

export const listProjects = () =>
  client.get<Project[]>('/projects').then(r => r.data);

export const createProject = (data: ProjectCreate) =>
  client.post<Project>('/projects', data).then(r => r.data);

export const getProject = (id: string) =>
  client.get<Project>(`/projects/${id}`).then(r => r.data);

export const deleteProject = (id: string) =>
  client.delete(`/projects/${id}`);

export const listMembers = (projectId: string) =>
  client.get<Member[]>(`/projects/${projectId}/members`).then(r => r.data);

export const addMember = (projectId: string, userId: string) =>
  client.post(`/projects/${projectId}/members`, { user_id: userId }).then(r => r.data);

export const removeMember = (projectId: string, userId: string) =>
  client.delete(`/projects/${projectId}/members/${userId}`);
