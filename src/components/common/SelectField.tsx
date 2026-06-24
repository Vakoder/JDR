import type { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function SelectField({
  label,
  error,
  options,
  placeholder,
  ...rest
}: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{
        fontSize: '11px',
        fontWeight: 500,
        color: '#7a7a80',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </label>
      <select
        {...rest}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '13px',
          backgroundColor: '#1a1a1c',
          border: `1px solid ${error ? '#c0392b' : '#2e2e32'}`,
          borderRadius: '7px',
          color: '#f0e6d3',
          fontFamily: "'Inter', system-ui, sans-serif",
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = error ? '#c0392b' : '#e8a838'; }}
        onBlur={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = error ? '#c0392b' : '#2e2e32'; }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: '#1c1c1e' }}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p style={{ fontSize: '11px', color: '#e06050', margin: 0 }}>{error}</p>}
    </div>
  );
}
