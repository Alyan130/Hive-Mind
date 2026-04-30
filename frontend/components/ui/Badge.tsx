type Variant = 'manager' | 'employee' | 'success' | 'danger' | 'neutral';

const styles: Record<Variant, React.CSSProperties> = {
  manager:  { background: 'linear-gradient(135deg, #D0E7ED, #C4DAE1)', color: '#1D546D', border: '1px solid #A8C9D3' },
  employee: { background: 'linear-gradient(135deg, #E0F2F4, #D4EAED)', color: '#3D7477', border: '1px solid #B5D9DD' },
  success:  { background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' },
  danger:   { background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA' },
  neutral:  { background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' },
};

export default function Badge({ label, variant = 'neutral' }: { label: string; variant?: Variant }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em',
      textTransform: 'uppercase', whiteSpace: 'nowrap',
      ...styles[variant],
    }}>
      {label}
    </span>
  );
}
