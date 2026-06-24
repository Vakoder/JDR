import { useState } from 'react';
import { Plus, Pencil, Trash2, Shield } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Race } from '../types';
import Header from '../components/layout/Header';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FormField from '../components/common/FormField';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import ConditionsEditor from '../components/common/ConditionsEditor';
import StatModifiersEditor from '../components/common/StatModifiersEditor';

const emptyForm = (): Omit<Race, 'id'> => ({
  name: '',
  description: '',
  statModifiers: [],
  conditions: [],
  specialRules: '',
});

type Tab = 'info' | 'modifiers' | 'conditions';

export default function RacesPage() {
  const { ruleSet, addRace, updateRace, deleteRace } = useRuleSetStore();
  const races = ruleSet?.races ?? [];
  const stats = ruleSet?.stats ?? [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [editing, setEditing] = useState<Race | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Race | null>(null);

  const filtered = races.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setActiveTab('info'); setModalOpen(true); };
  const openEdit = (race: Race) => { setEditing(race); setForm({ ...race }); setActiveTab('info'); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    editing ? updateRace(editing.id, form) : addRace(form);
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Informations' },
    { key: 'modifiers', label: 'Modificateurs' },
    { key: 'conditions', label: 'Conditions' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Races" subtitle="Gérez les races disponibles dans votre système" />
      <div className="p-8">
        <PageHeader
          title="Races"
          subtitle={`${races.length} race${races.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvelle race
            </Button>
          }
        />

        {races.length > 0 && (
          <div className="mb-6 max-w-sm">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une race…" />
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((race) => (
              <div key={race.id} className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3a3d4a] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                      <Shield size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">{race.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(race)} className="text-slate-400 hover:text-amber-400 p-1.5 rounded hover:bg-amber-600/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(race)} className="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-red-600/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {race.description && <p className="text-xs text-slate-400 line-clamp-2">{race.description}</p>}
                {race.statModifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1e2130]">
                    {race.statModifiers.map((mod) => {
                      const stat = stats.find((s) => s.id === mod.statId);
                      return (
                        <span key={mod.statId} className={`text-xs px-2 py-0.5 rounded font-mono ${mod.modifier >= 0 ? 'bg-emerald-600/20 text-emerald-300' : 'bg-red-600/20 text-red-300'}`}>
                          {stat?.abbreviation ?? '?'}: {mod.modifier > 0 ? '+' : ''}{mod.modifier}
                        </span>
                      );
                    })}
                  </div>
                )}
                {race.conditions.length > 0 && (
                  <p className="text-xs text-slate-400">{race.conditions.length} condition{race.conditions.length !== 1 ? 's' : ''}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Shield size={24} />}
            title={search ? 'Aucun résultat' : 'Aucune race'}
            description="Créez des races (Humain, Elfe, Nain…) avec leurs modificateurs et conditions."
            action={!search ? <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Créer une race</Button> : undefined}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier "${editing.name}"` : 'Nouvelle race'}
        size="lg"
      >
        <div className="flex gap-1 mb-6 bg-[#0f1117] rounded-lg p-1 border border-[#2a2d3a]">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${activeTab === tab.key ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="flex flex-col gap-4">
            <FormField label="Nom" required value={form.name} placeholder="ex: Elfe des bois" onChange={(e) => setField('name', e.target.value)} />
            <FormField as="textarea" label="Description" value={form.description} placeholder="Décrivez cette race…" onChange={(e) => setField('description', e.target.value)} rows={4} />
            <FormField as="textarea" label="Règles spéciales" value={form.specialRules} placeholder="Règles particulières liées à cette race…" onChange={(e) => setField('specialRules', e.target.value)} rows={3} />
          </div>
        )}
        {activeTab === 'modifiers' && (
          <div>
            <p className="text-xs text-slate-400 mb-4">Définissez les bonus/malus apportés par cette race aux statistiques.</p>
            <StatModifiersEditor modifiers={form.statModifiers} stats={stats} onChange={(mods) => setField('statModifiers', mods)} />
          </div>
        )}
        {activeTab === 'conditions' && (
          <div>
            <p className="text-xs text-slate-400 mb-4">Ajoutez des conditions spécifiques à cette race (blessures, états, etc.).</p>
            <ConditionsEditor conditions={form.conditions} onChange={(c) => setField('conditions', c)} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-[#2a2d3a]">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSave} disabled={!form.name.trim()}>
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteRace(deleteTarget.id)}
        message={`Supprimer la race "${deleteTarget?.name}" ?`}
      />
    </div>
  );
}

