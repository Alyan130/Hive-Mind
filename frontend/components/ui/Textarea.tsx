'use client';
import { TextareaHTMLAttributes, useState } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, rows = 3, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1D546D', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit',
          border: `1.5px solid ${focused ? '#5F9598' : '#D1DFE3'}`,
          outline: 'none', background: '#fff', color: '#061E29', resize: 'none',
          transition: 'border-color 0.15s ease',
          boxShadow: focused ? '0 0 0 3px rgba(95,149,152,0.12)' : 'none',
          width: '100%',
        }}
        {...props}
      />
    </div>
  );
}
