import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';
import type { Condition } from '../../types';
import Button from './Button';
import FormField from './FormField';

interface ConditionsEditorProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

export default function ConditionsEditor({ conditions, onChange }: ConditionsEditorProps) {
  const add = () =>
    onChange([...conditions, { id: uuidv4(), forumla: '' }]);

  const update = (id: string, field: keyof Omit<Condition, 'id'>, value: string) =>
    onChange(conditions.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const remove = (id: string) => onChange(conditions.filter((c) => c.id !== id));

  return (
    <div className="flex flex-col gap-3">
      {conditions.length === 0 && (
        <p className="text-xs text-slate-500 italic">Aucune condition définie.</p>
      )}
      {conditions.map((cond) => (
        <div key={cond.id} className="flex gap-2 items-start bg-[#1a1d28] border border-[#2a2d3a] rounded-lg p-3">
          <div className="flex-1 grid grid-cols-1 gap-2">
            <FormField
              label="Formule"
              value={cond.forumla}
              onChange={(e) => update(cond.id, 'forumla', e.target.value)}
              placeholder="ex: Character_Stat < Character_StatMax * 0.5"
            />
          </div>
          <button
            onClick={() => remove(cond.id)}
            className="mt-6 text-slate-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        icon={<Plus size={14} />}
        onClick={add}
        className="self-start"
      >
        Ajouter une condition
      </Button>
    </div>
  );
}
