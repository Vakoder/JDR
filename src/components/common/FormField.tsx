import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const inputClass =
  'w-full px-3 py-2 text-sm bg-[#1e2130] border border-[#2a2d3a] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors';

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
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-400">{label}</label>
        <textarea
          {...rest}
          rows={rest.rows ?? 3}
          className={`${inputClass} resize-none ${error ? 'border-red-500' : ''}`}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }

  const { label, error, hint, as: _as, required, ...rest } = props as InputProps;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-400">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        {...rest}
        required={required}
        className={`${inputClass} ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
