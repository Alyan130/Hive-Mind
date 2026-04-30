'use client';
import { InputHTMLAttributes, useState } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1D546D', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
          border: `1.5px solid ${error ? '#DC2626' : focused ? '#5F9598' : '#D1DFE3'}`,
          outline: 'none', background: '#fff', color: '#061E29',
          transition: 'border-color 0.15s ease',
          boxShadow: focused ? '0 0 0 3px rgba(95,149,152,0.12)' : 'none',
          width: '100%',
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: '#DC2626' }}>{error}</span>}
    </div>
  );
}
