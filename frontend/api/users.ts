import client from './client';
import type { User } from '@/types';

export const listUsers = () =>
  client.get<User[]>('/users').then(r => r.data);
