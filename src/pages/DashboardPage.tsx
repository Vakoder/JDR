import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Users, Shield, Sword, Package, Zap, Dice6,
  Download, ArrowRight, BookOpen, Calendar
} from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import Header from '../components/layout/Header';

const navCards = [
  { to: '/stats', icon: BarChart2, label: 'Statistiques', color: 'violet', key: 'stats' as const },
  { to: '/characters', icon: Users, label: 'Personnages', color: 'blue', key: 'characters' as const },
  { to: '/races', icon: Shield, label: 'Races', color: 'emerald', key: 'races' as const },
  { to: '/classes', icon: Sword, label: 'Classes', color: 'amber', key: 'classes' as const },
  { to: '/items', icon: Package, label: 'Objets', color: 'orange', key: 'items' as const },
  { to: '/skills', icon: Zap, label: 'Compétences', color: 'cyan', key: 'skills' as const },
  { to: '/dice', icon: Dice6, label: 'Système de dés', color: 'pink', key: null },
  { to: '/export', icon: Download, label: 'Export', color: 'green', key: null },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  violet: { bg: 'bg-violet-600/20', icon: 'text-violet-400', border: 'hover:border-violet-500/40' },
  blue: { bg: 'bg-blue-600/20', icon: 'text-blue-400', border: 'hover:border-blue-500/40' },
  emerald: { bg: 'bg-emerald-600/20', icon: 'text-emerald-400', border: 'hover:border-emerald-500/40' },
  amber: { bg: 'bg-amber-600/20', icon: 'text-amber-400', border: 'hover:border-amber-500/40' },
  orange: { bg: 'bg-orange-600/20', icon: 'text-orange-400', border: 'hover:border-orange-500/40' },
  cyan: { bg: 'bg-cyan-600/20', icon: 'text-cyan-400', border: 'hover:border-cyan-500/40' },
  pink: { bg: 'bg-pink-600/20', icon: 'text-pink-400', border: 'hover:border-pink-500/40' },
  green: { bg: 'bg-green-600/20', icon: 'text-green-400', border: 'hover:border-green-500/40' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { ruleSet, updateMeta } = useRuleSetStore();

  if (!ruleSet) return null;

  const counts: Record<string, number> = {
    stats: ruleSet.stats.length,
    characters: ruleSet.characters.length,
    races: ruleSet.races.length,
    classes: ruleSet.classes.length,
    items: ruleSet.items.length,
    skills: ruleSet.skills.length,
  };

  const totalElements = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Dashboard" subtitle="Vue d'ensemble de votre set de règles" />
      <div className="p-8">
        {/* Set header */}
        <div className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 border border-violet-600/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center shrink-0">
              <BookOpen size={26} className="text-violet-400" />
            </div>
            <div className="flex-1">
              <input
                value={ruleSet.name}
                onChange={(e) => updateMeta({ name: e.target.value })}
                className="text-2xl font-bold text-white bg-transparent border-none outline-none w-full placeholder-slate-600 focus:ring-0"
                placeholder="Nom du set…"
              />
              <input
                value={ruleSet.description}
                onChange={(e) => updateMeta({ description: e.target.value })}
                className="text-sm text-slate-400 bg-transparent border-none outline-none w-full mt-1 placeholder-slate-600 focus:ring-0"
                placeholder="Description…"
              />
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Créé le {new Date(ruleSet.createdAt).toLocaleDateString('fr-FR')}
                </span>
                <span>v{ruleSet.version}</span>
                <span>{totalElements} élément{totalElements !== 1 ? 's' : ''} au total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {navCards.filter((c) => c.key).map((card) => {
            const c = colorMap[card.color];
            const count = card.key ? counts[card.key] : 0;
            return (
              <button
                key={card.to}
                onClick={() => navigate(card.to)}
                className={`bg-[#13151c] border border-[#2a2d3a] rounded-xl p-4 text-center hover:bg-[#1a1d28] ${c.border} transition-all cursor-pointer group`}
              >
                <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <card.icon size={18} className={c.icon} />
                </div>
                <div className="text-2xl font-bold text-white">{count}</div>
                <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
              </button>
            );
          })}
        </div>

        {/* Navigation cards */}
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {navCards.map((card) => {
            const c = colorMap[card.color];
            const count = card.key ? counts[card.key] : null;
            return (
              <button
                key={card.to}
                onClick={() => navigate(card.to)}
                className={`flex items-center justify-between gap-3 p-4 bg-[#13151c] border border-[#2a2d3a] rounded-xl hover:bg-[#1a1d28] ${c.border} transition-all text-left group cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center shrink-0`}>
                    <card.icon size={16} className={c.icon} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{card.label}</p>
                    {count !== null && (
                      <p className="text-xs text-slate-500">{count} élément{count !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Completeness hints */}
        {totalElements === 0 && (
          <div className="mt-8 p-5 bg-violet-600/10 border border-violet-600/20 rounded-xl">
            <p className="text-violet-300 font-medium mb-1">Commencez par les statistiques</p>
            <p className="text-violet-400/70 text-sm">
              Les statistiques sont la base de votre système. Créez-en quelques-unes (Force, Intelligence, Agilité…) pour pouvoir les référencer dans les races, classes, compétences et personnages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
