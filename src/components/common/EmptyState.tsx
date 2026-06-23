import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-[#1e2130] border border-[#2a2d3a] flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <div>
        <p className="text-slate-300 font-medium">{title}</p>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
