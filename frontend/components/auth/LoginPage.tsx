'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { login as apiLogin, getMe } from '@/api/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

export default function LoginPage() {
  const router = useRouter();
  const { login, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin({ email, password });
      login(data.access_token, data.user); // store token first so interceptor can use it
      const fullUser = await getMe();      // fetch name + role from /auth/me
      setUser(fullUser);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'inherit' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 48%', background: '#061E29', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 48,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(95,149,152,1) 1px, transparent 1px), linear-gradient(90deg, rgba(95,149,152,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(95,149,152,0.15)', top: '10%', left: '-10%' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(95,149,152,0.08)', top: '20%', left: '-20%' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(95,149,152,0.15), transparent)', bottom: '15%', right: '10%' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'fadeUp 0.6s ease' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #5F9598, #1D546D)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22V12h6v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.03em' }}>ProjectAI</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 40px' }}>
            AI-powered project management for engineering teams that ship.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            {[
              { icon: '⚡', text: 'Sprint planning & velocity tracking' },
              { icon: '🤖', text: 'AI chat across all your projects' },
              { icon: '👥', text: 'Role-based team management' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: '#F3F4F4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380, animation: 'slideInRight 0.5s ease 0.1s both' }}>
          <h2 style={{ color: '#061E29', fontSize: 24, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p style={{ color: '#4A5568', fontSize: 14, margin: '0 0 28px' }}>Sign in to your workspace</p>

          <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(6,30,41,0.08), 0 1px 3px rgba(6,30,41,0.06)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.io" autoFocus />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <div style={{ color: '#DC2626', fontSize: 12.5, background: '#FEF2F2', padding: '8px 12px', borderRadius: 7 }}>{error}</div>}
              <Button variant="primary" size="lg" type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? <Spinner /> : 'Sign in'}
              </Button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: 16, color: '#8DA5AE', fontSize: 13 }}>
            Don&apos;t have an account?{' '}
            <span onClick={() => router.push('/signup')} style={{ color: '#1D546D', fontWeight: 600, cursor: 'pointer' }}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
