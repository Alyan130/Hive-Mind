import client from './client';
import type { AuthResponse, LoginRequest, SignUpRequest, User } from '@/types';

export const login = (data: LoginRequest) =>
  client.post<AuthResponse>('/auth/login', data).then(r => r.data);

export const signup = (data: SignUpRequest) =>
  client.post<AuthResponse>('/auth/signup', data).then(r => r.data);

export const getMe = () =>
  client.get<User>('/auth/me').then(r => r.data);
