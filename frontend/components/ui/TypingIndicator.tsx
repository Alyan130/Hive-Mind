export default function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '4px 0', animation: 'fadeUp 0.25s ease' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #5F9598, #1D546D)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', color: '#fff', fontWeight: 700, flexShrink: 0,
        boxShadow: '0 2px 8px rgba(95,149,152,0.25)',
      }}>AI</div>
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: '12px 12px 12px 3px', padding: '12px 16px',
        display: 'flex', gap: '6px', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: '#5F9598',
            animation: `bounce 1.2s ease ${i * 0.16}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
