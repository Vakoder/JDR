import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Rechercher…' }: SearchBarProps) {
  return (
    <div style={{ position: 'relative' }}>
      <Search size={14} style={{
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#5a5a5e',
        pointerEvents: 'none',
      }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          paddingLeft: '32px',
          paddingRight: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          fontSize: '13px',
          backgroundColor: '#1a1a1c',
          border: '1px solid #2e2e32',
          borderRadius: '7px',
          color: '#f0e6d3',
          fontFamily: "'Inter', system-ui, sans-serif",
          outline: 'none',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#e8a838'; }}
        onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = '#2e2e32'; }}
      />
    </div>
  );
}
