import { useRuleSetStore } from '../../store/ruleSetStore';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const ruleSet = useRuleSetStore((s) => s.ruleSet);
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderBottom: '1px solid #2e2e32',
        backgroundColor: 'rgba(23,23,25,0.85)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '22px',
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontWeight: 600,
          color: '#f0e6d3',
          letterSpacing: '0.01em',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: 0, fontSize: '12px', color: '#5a5a5e', marginTop: '1px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {ruleSet && (
          <span style={{
            fontSize: '11px',
            color: '#5a5a5e',
            backgroundColor: '#222224',
            padding: '3px 10px',
            borderRadius: '20px',
            border: '1px solid #2e2e32',
            fontFamily: 'monospace',
          }}>
            v{ruleSet.version}
          </span>
        )}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#7a7a80',
            background: 'none',
            border: '1px solid #2e2e32',
            borderRadius: '7px',
            padding: '6px 12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#f0e6d3';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#404046';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#7a7a80';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e32';
          }}
        >
          <Home size={14} />
          <span>Accueil</span>
        </button>
      </div>
    </header>
  );
}
