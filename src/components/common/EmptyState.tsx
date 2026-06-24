import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      gap: '16px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#222224',
        border: '1px solid #2e2e32',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5a5a5e',
      }}>
        {icon}
      </div>
      <div>
        <p style={{
          margin: 0,
          fontSize: '16px',
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontWeight: 600,
          color: '#c0b090',
        }}>
          {title}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: '13px',
          color: '#5a5a5e',
        }}>
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
