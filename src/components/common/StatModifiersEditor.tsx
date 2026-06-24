import { Plus, Trash2 } from 'lucide-react';
import type { Stat, StatModifier } from '../../types';
import Button from './Button';
import SelectField from './SelectField';

interface StatModifiersEditorProps {
  modifiers: StatModifier[];
  stats: Stat[];
  onChange: (modifiers: StatModifier[]) => void;
}

export default function StatModifiersEditor({ modifiers, stats, onChange }: StatModifiersEditorProps) {
  const add = () => {
    if (stats.length === 0) return;
    const usedIds = new Set(modifiers.map((m) => m.statId));
    const available = stats.find((s) => !usedIds.has(s.id));
    if (!available) return;
    onChange([...modifiers, { statId: available.id, modifier: 0 }]);
  };

  const update = (index: number, field: keyof StatModifier, value: string | number) =>
    onChange(modifiers.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  const remove = (index: number) => onChange(modifiers.filter((_, i) => i !== index));

  const statOptions = stats.map((s) => ({ value: s.id, label: `${s.name} (${s.abbreviation})` }));

  if (stats.length === 0) {
    return <p className="text-xs text-slate-400 italic">Créez d'abord des statistiques pour définir des modificateurs.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {modifiers.map((mod, i) => (
        <div key={i} className="flex gap-2 items-end bg-[#1a1d28] border border-[#2a2d3a] rounded-lg p-3">
          <div className="flex-1">
            <SelectField
              label="Statistique"
              value={mod.statId}
              options={statOptions}
              onChange={(e) => update(i, 'statId', e.target.value)}
            />
          </div>
          <div className="w-28">
            <label className="text-xs font-medium text-slate-400 block mb-1.5">Modificateur</label>
            <input
              type="number"
              value={mod.modifier}
              onChange={(e) => update(i, 'modifier', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-[#1e2130] border border-[#2a2d3a] rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => remove(i)}
            className="mb-0.5 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {modifiers.length < stats.length && (
        <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={add} className="self-start">
          Ajouter un modificateur
        </Button>
      )}
    </div>
  );
}

