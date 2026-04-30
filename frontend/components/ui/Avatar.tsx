export default function Avatar({
  initials, size = 32, bg = '#1D546D', color = '#fff',
}: {
  initials: string; size?: number; bg?: string; color?: string;
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0, letterSpacing: '0.02em',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
    }}>
      {initials}
    </div>
  );
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}
