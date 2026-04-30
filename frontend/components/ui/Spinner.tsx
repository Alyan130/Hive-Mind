'use client';
import { useEffect, useState } from 'react';

export default function Spinner({ size = 16, color = '#fff' }: { size?: number; color?: string }) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle(a => (a + 10) % 360), 30);
    return () => clearInterval(id);
  }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ transform: `rotate(${angle}deg)` }}>
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.3" />
      <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
