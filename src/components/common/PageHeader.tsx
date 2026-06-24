import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '24px',
    }}>
      <div>
        <h2 style={{
          margin: 0,
          fontSize: '26px',
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontWeight: 600,
          color: '#f0e6d3',
          letterSpacing: '0.01em',
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#5a5a5e' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
