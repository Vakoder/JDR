type BadgeColor = 'violet' | 'blue' | 'green' | 'yellow' | 'red' | 'slate';

const colorClasses: Record<BadgeColor, string> = {
  violet: 'bg-violet-600/20 text-violet-300 border-violet-600/30',
  blue: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
  green: 'bg-green-600/20 text-green-300 border-green-600/30',
  yellow: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
  red: 'bg-red-600/20 text-red-300 border-red-600/30',
  slate: 'bg-slate-600/20 text-slate-300 border-slate-600/30',
};

export default function Badge({
  children,
  color = 'slate',
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClasses[color]}`}>
      {children}
    </span>
  );
}
