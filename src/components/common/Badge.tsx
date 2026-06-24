type BadgeColor = 'amber' | 'blue' | 'green' | 'yellow' | 'red' | 'slate';

const colorStyles: Record<BadgeColor, React.CSSProperties> = {
  amber: { backgroundColor: 'rgba(232,168,56,0.12)', color: '#e8a838', border: '1px solid rgba(232,168,56,0.3)' },
  blue: { backgroundColor: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' },
  green: { backgroundColor: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
  yellow: { backgroundColor: 'rgba(234,179,8,0.12)', color: '#fde047', border: '1px solid rgba(234,179,8,0.3)' },
  red: { backgroundColor: 'rgba(192,57,43,0.12)', color: '#e06050', border: '1px solid rgba(192,57,43,0.3)' },
  slate: { backgroundColor: 'rgba(100,100,110,0.15)', color: '#9e9e9e', border: '1px solid rgba(100,100,110,0.3)' },
};

export default function Badge({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 500,
      fontFamily: "'Inter', system-ui, sans-serif",
      ...colorStyles[color],
    }}>
      {children}
    </span>
  );
}
