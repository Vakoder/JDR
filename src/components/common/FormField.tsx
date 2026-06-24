import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '13px',
  backgroundColor: '#1a1a1c',
  border: '1px solid #2e2e32',
  borderRadius: '7px',
  color: '#f0e6d3',
  fontFamily: "'Inter', system-ui, sans-serif",
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: '#7a7a80',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '5px',
  display: 'block',
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  as?: 'input';
  label: string;
  error?: string;
  hint?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: 'textarea';
  label: string;
  error?: string;
  hint?: string;
  rows?: number;
}

type FormFieldProps = InputProps | TextareaProps;

export default function FormField(props: FormFieldProps) {
  if (props.as === 'textarea') {
    const { label, error, hint, as: _as, ...rest } = props;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={labelStyle}>{label}</label>
        <textarea
          {...rest}
          rows={rest.rows ?? 3}
          style={{
            ...inputStyle,
            resize: 'none',
            borderColor: error ? '#c0392b' : '#2e2e32',
          }}
          onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = error ? '#c0392b' : '#e8a838'; }}
          onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = error ? '#c0392b' : '#2e2e32'; }}
        />
        {error && <p style={{ fontSize: '11px', color: '#e06050', margin: 0 }}>{error}</p>}
        {hint && !error && <p style={{ fontSize: '11px', color: '#5a5a5e', margin: 0 }}>{hint}</p>}
      </div>
    );
  }

  const { label, error, hint, as: _as, required, ...rest } = props as InputProps;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#c0392b', marginLeft: '2px' }}>*</span>}
      </label>
      <input
        {...rest}
        required={required}
        style={{
          ...inputStyle,
          borderColor: error ? '#c0392b' : '#2e2e32',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = error ? '#c0392b' : '#e8a838'; }}
        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = error ? '#c0392b' : '#2e2e32'; }}
      />
      {error && <p style={{ fontSize: '11px', color: '#e06050', margin: 0 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: '11px', color: '#5a5a5e', margin: 0 }}>{hint}</p>}
    </div>
  );
}
