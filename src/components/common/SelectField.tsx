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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      <select
        {...rest}
        className={`w-full px-3 py-2 text-sm bg-[#1e2130] border rounded-lg text-slate-200 focus:outline-none focus:border-violet-500 transition-colors appearance-none ${
          error ? 'border-red-500' : 'border-[#2a2d3a]'
        }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
