'use client';
import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'danger-outline' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '9px 18px', fontSize: '13.5px' },
  lg: { padding: '12px 24px', fontSize: '15px' },
};

const variants: Record<Variant, React.CSSProperties> = {
  primary:       { background: 'linear-gradient(135deg, #1D546D 0%, #5F9598 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(29,84,109,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' },
  accent:        { background: '#5F9598', color: '#fff', boxShadow: '0 2px 8px rgba(95,149,152,0.2)' },
  outline:       { background: 'transparent', color: '#475569', border: '1.5px solid #CBD5E1' },
  ghost:         { background: 'transparent', color: '#475569' },
  danger:        { background: '#EF4444', color: '#fff', boxShadow: '0 2px 8px rgba(239,68,68,0.2)' },
  'danger-outline': { background: 'transparent', color: '#DC2626', border: '1.5px solid #FCA5A5' },
  dark:          { background: '#1E293B', color: '#fff' },
};

const hoverMap: Partial<Record<Variant, React.CSSProperties>> = {
  primary:       { background: 'linear-gradient(135deg, #164155 0%, #4D8388 100%)', boxShadow: '0 6px 16px rgba(29,84,109,0.35)' },
  accent:        { background: '#4D8388' },
  outline:       { background: '#F8FAFC', borderColor: '#94A3B8' },
  ghost:         { background: '#F1F5F9' },
  danger:        { background: '#DC2626' },
  'danger-outline': { background: '#FEF2F2' },
  dark:          { background: '#0F172A' },
};

export default function Button({ children, variant = 'primary', size = 'md', disabled, style, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', fontFamily: 'inherit', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: '8px', transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1, outline: 'none', letterSpacing: '-0.01em',
    ...sizes[size],
    ...variants[variant],
    ...(hovered && !disabled ? hoverMap[variant] : {}),
    ...style,
  };
  return (
    <button
      disabled={disabled}
      style={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
}
