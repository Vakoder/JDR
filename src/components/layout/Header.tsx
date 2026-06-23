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
    <header className="flex items-center justify-between px-8 py-4 border-b border-[#2a2d3a] bg-[#13151c]/80 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {ruleSet && (
          <span className="text-xs text-slate-500 bg-[#1e2130] px-3 py-1 rounded-full border border-[#2a2d3a]">
            v{ruleSet.version}
          </span>
        )}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1e2130]"
        >
          <Home size={16} />
          <span>Accueil</span>
        </button>
      </div>
    </header>
  );
}
