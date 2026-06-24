import { useState } from 'react';
import { Dice6, RefreshCw } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { DiceType } from '../types';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import FormField from '../components/common/FormField';

const DICE_TYPES: { value: DiceType; label: string; max: number }[] = [
  { value: 'D4', label: 'D4', max: 4 },
  { value: 'D6', label: 'D6', max: 6 },
  { value: 'D8', label: 'D8', max: 8 },
  { value: 'D10', label: 'D10', max: 10 },
  { value: 'D12', label: 'D12', max: 12 },
  { value: 'D20', label: 'D20', max: 20 },
  { value: 'D100', label: 'D100', max: 100 },
];

type RollResult = 'critical_success' | 'success' | 'failure' | 'critical_failure';

interface DiceRoll {
  values: number[];
  total: number;
  result: RollResult;
}

function rollDie(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

export default function DiceSystemPage() {
  const { ruleSet, updateDiceSystem } = useRuleSetStore();
  const ds = ruleSet?.diceSystem;

  const [rolls, setRolls] = useState<DiceRoll[]>([]);
  const [saved, setSaved] = useState(false);

  if (!ds) return null;

  const diceInfo = DICE_TYPES.find((d) => d.value === ds.diceType) ?? DICE_TYPES[5];

  const handleChange = (field: keyof typeof ds, value: unknown) => {
    updateDiceSystem({ [field]: value } as any);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const classifyResult = (total: number): RollResult => {
    if (ds.criticalSuccessThreshold !== null) {
      const crit = ds.criticalSuccessThreshold;
      if (ds.higherIsBetter ? total >= crit : total <= crit) return 'critical_success';
    }
    if (ds.criticalFailureThreshold !== null) {
      const critFail = ds.criticalFailureThreshold;
      if (ds.higherIsBetter ? total <= critFail : total >= critFail) return 'critical_failure';
    }
    const success = ds.successThreshold;
    if (ds.higherIsBetter ? total >= success : total <= success) return 'success';
    return 'failure';
  };

  const rollDice = () => {
    const values = Array.from({ length: ds.numberOfDice }, () => rollDie(diceInfo.max));
    const total = values.reduce((a, b) => a + b, 0);
    const result = classifyResult(total);
    setRolls((prev) => [{ values, total, result }, ...prev].slice(0, 10));
  };

  const resultConfig: Record<RollResult, { label: string; color: string; bg: string }> = {
    critical_success: { label: 'Réussite Critique', color: 'text-yellow-300', bg: 'bg-yellow-600/20 border-yellow-600/30' },
    success: { label: 'Réussite', color: 'text-emerald-300', bg: 'bg-emerald-600/20 border-emerald-600/30' },
    failure: { label: 'Échec', color: 'text-red-300', bg: 'bg-red-600/20 border-red-600/30' },
    critical_failure: { label: 'Échec Critique', color: 'text-red-400', bg: 'bg-red-800/20 border-red-800/30' },
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Système de dés" subtitle="Configurez la résolution des actions" />
      <div className="p-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Config panel */}
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6 flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Dice6 size={20} className="text-amber-400" />
              Configuration
            </h3>

            {/* Dice selection */}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Type de dé</label>
              <div className="grid grid-cols-4 gap-2">
                {DICE_TYPES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => handleChange('diceType', d.value)}
                    className={`py-3 rounded-lg border text-sm font-bold transition-all ${
                      ds.diceType === d.value
                        ? 'bg-amber-600 border-amber-500 text-white scale-105 shadow-lg shadow-amber-900/30'
                        : 'bg-[#1e2130] border-[#2a2d3a] text-slate-400 hover:border-amber-500/50 hover:text-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <FormField
              label="Nombre de dés"
              type="number"
              min={1}
              max={10}
              value={ds.numberOfDice}
              onChange={(e) => handleChange('numberOfDice', parseInt(e.target.value) || 1)}
            />

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-400">Direction</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleChange('higherIsBetter', true)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${ds.higherIsBetter ? 'bg-amber-600/20 border-amber-600/30 text-amber-300' : 'border-[#2a2d3a] text-slate-400 hover:border-slate-500'}`}
                >
                  Plus haut = mieux
                </button>
                <button
                  onClick={() => handleChange('higherIsBetter', false)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${!ds.higherIsBetter ? 'bg-amber-600/20 border-amber-600/30 text-amber-300' : 'border-[#2a2d3a] text-slate-400 hover:border-slate-500'}`}
                >
                  Plus bas = mieux
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                label={ds.higherIsBetter ? 'Seuil de réussite (≥)' : 'Seuil de réussite (≤)'}
                type="number"
                min={1}
                max={diceInfo.max * ds.numberOfDice}
                value={ds.successThreshold}
                onChange={(e) => handleChange('successThreshold', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Réussite critique (optionnel)</label>
                <input
                  type="number"
                  value={ds.criticalSuccessThreshold ?? ''}
                  placeholder="ex: 20"
                  min={1}
                  max={diceInfo.max * ds.numberOfDice}
                  onChange={(e) => handleChange('criticalSuccessThreshold', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 text-sm bg-[#1e2130] border border-[#2a2d3a] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">Échec critique (optionnel)</label>
                <input
                  type="number"
                  value={ds.criticalFailureThreshold ?? ''}
                  placeholder="ex: 1"
                  min={1}
                  max={diceInfo.max * ds.numberOfDice}
                  onChange={(e) => handleChange('criticalFailureThreshold', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 text-sm bg-[#1e2130] border border-[#2a2d3a] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Description du système</label>
              <textarea
                value={ds.description}
                placeholder="Décrivez votre système de résolution…"
                rows={3}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1e2130] border border-[#2a2d3a] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <Button variant="primary" onClick={handleSave}>
              {saved ? '✓ Enregistré' : 'Enregistrer la configuration'}
            </Button>
          </div>

          {/* Preview panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Prévisualisation</h3>

              {/* Summary */}
              <div className="bg-[#0f1117] border border-[#2a2d3a] rounded-lg p-4 mb-4 text-sm text-slate-400 space-y-1">
                <p>Lancer: <span className="text-amber-300 font-medium">{ds.numberOfDice}{ds.diceType}</span></p>
                <p>Réussite {ds.higherIsBetter ? '≥' : '≤'} <span className="text-emerald-300 font-medium">{ds.successThreshold}</span></p>
                {ds.criticalSuccessThreshold !== null && (
                  <p>Critique ✦ {ds.higherIsBetter ? '≥' : '≤'} <span className="text-yellow-300 font-medium">{ds.criticalSuccessThreshold}</span></p>
                )}
                {ds.criticalFailureThreshold !== null && (
                  <p>Fumble ✦ {ds.higherIsBetter ? '≤' : '≥'} <span className="text-red-400 font-medium">{ds.criticalFailureThreshold}</span></p>
                )}
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={<RefreshCw size={18} />}
                onClick={rollDice}
                className="w-full"
              >
                Lancer {ds.numberOfDice}{ds.diceType}
              </Button>
            </div>

            {/* Roll history */}
            {rolls.length > 0 && (
              <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-6">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Historique des lancers</h4>
                <div className="flex flex-col gap-2">
                  {rolls.map((roll, i) => {
                    const conf = resultConfig[roll.result];
                    return (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${conf.bg} ${i === 0 ? 'scale-[1.01]' : 'opacity-70'} transition-all`}>
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-white">{roll.total}</div>
                          {roll.values.length > 1 && (
                            <div className="text-xs text-slate-400">[{roll.values.join(', ')}]</div>
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${conf.color}`}>{conf.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

