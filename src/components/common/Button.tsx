import { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#e8a838',
    color: '#141414',
    border: '1px solid #e8a838',
    fontWeight: 600,
  },
  secondary: {
    backgroundColor: '#222224',
    color: '#c0b090',
    border: '1px solid #2e2e32',
  },
  danger: {
    backgroundColor: 'rgba(192,57,43,0.12)',
    color: '#e06050',
    border: '1px solid rgba(192,57,43,0.35)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#7a7a80',
    border: '1px solid transparent',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: '12px', gap: '6px' },
  md: { padding: '8px 16px', fontSize: '13px', gap: '7px' },
  lg: { padding: '10px 20px', fontSize: '14px', gap: '8px' },
};

const hoverStyles: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: '#f0b840', borderColor: '#f0b840' },
  secondary: { backgroundColor: '#2a2a2c', borderColor: '#404046', color: '#f0e6d3' },
  danger: { backgroundColor: 'rgba(192,57,43,0.2)', borderColor: 'rgba(192,57,43,0.5)' },
  ghost: { backgroundColor: '#222224', color: '#c0b090' },
};

export default function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  children,
  style = {},
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7px',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'all 0.15s ease',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign((e.currentTarget as HTMLButtonElement).style, hoverStyles[variant]);
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign((e.currentTarget as HTMLButtonElement).style, variantStyles[variant], sizeStyles[size]);
        }
        onMouseLeave?.(e);
      }}
    >
      {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}
