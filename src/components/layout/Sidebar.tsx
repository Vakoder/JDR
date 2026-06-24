import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Shield,
  Sword,
  Package,
  Zap,
  Dice6,
  Download,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useRuleSetStore } from '../../store/ruleSetStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/stats', icon: BarChart2, label: 'Statistiques' },
  { to: '/monetary', icon: BarChart2, label: 'Système Monétaire' },
  { to: '/characters', icon: Users, label: 'Personnages' },
  { to: '/races', icon: Shield, label: 'Races' },
  { to: '/classes', icon: Sword, label: 'Classes' },
  { to: '/items', icon: Package, label: 'Objets' },
  { to: '/skills', icon: Zap, label: 'Compétences' },
  { to: '/dice', icon: Dice6, label: 'Système de dés' },
  { to: '/export', icon: Download, label: 'Export' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const ruleSet = useRuleSetStore((s) => s.ruleSet);

  return (
    <aside
      className={`flex flex-col bg-[#13151c] border-r border-[#2a2d3a] transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} min-h-screen`}
    >
      {/* Logo / title */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2a2d3a]">
        <BookOpen size={22} className="text-violet-400 shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">JDR Ruleset</p>
            {ruleSet && (
              <p className="text-xs text-slate-500 truncate">{ruleSet.name}</p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
                  : 'text-slate-400 hover:bg-[#1e2130] hover:text-slate-200'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center py-3 border-t border-[#2a2d3a] text-slate-500 hover:text-slate-300 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
