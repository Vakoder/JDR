import { useState } from 'react';
import { Plus, Pencil, Trash2, Sword } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Class } from '../types';
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

const emptyForm = (): Omit<Class, 'id'> => ({
  name: '',
  description: '',
  statModifiers: [],
  conditions: [],
  specialRules: '',
  primaryStatIds: [],
});

type Tab = 'info' | 'modifiers' | 'conditions';

export default function ClassesPage() {
  const { ruleSet, addClass, updateClass, deleteClass } = useRuleSetStore();
  const classes = ruleSet?.classes ?? [];
  const stats = ruleSet?.stats ?? [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Class | null>(null);

  const filtered = classes.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setActiveTab('info'); setModalOpen(true); };
  const openEdit = (cls: Class) => { setEditing(cls); setForm({ ...cls }); setActiveTab('info'); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    editing ? updateClass(editing.id, form) : addClass(form);
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const togglePrimaryStat = (statId: string) =>
    setForm((f) => ({
      ...f,
      primaryStatIds: f.primaryStatIds.includes(statId)
        ? f.primaryStatIds.filter((id) => id !== statId)
        : [...f.primaryStatIds, statId],
    }));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Informations' },
    { key: 'modifiers', label: 'Modificateurs' },
    { key: 'conditions', label: 'Conditions' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Classes" subtitle="Gérez les classes de personnages" />
      <div className="p-8">
        <PageHeader
          title="Classes"
          subtitle={`${classes.length} classe${classes.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvelle classe
            </Button>
          }
        />

        {classes.length > 0 && (
          <div className="mb-6 max-w-sm">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une classe…" />
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cls) => (
              <div key={cls.id} className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3a3d4a] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                      <Sword size={18} className="text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-white">{cls.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(cls)} className="text-slate-500 hover:text-amber-400 p-1.5 rounded hover:bg-amber-600/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(cls)} className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-red-600/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {cls.description && <p className="text-xs text-slate-500 line-clamp-2">{cls.description}</p>}
                {cls.primaryStatIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1e2130]">
                    <span className="text-xs text-slate-600">Stats primaires:</span>
                    {cls.primaryStatIds.map((sid) => {
                      const stat = stats.find((s) => s.id === sid);
                      return stat ? (
                        <span key={sid} className="text-xs px-2 py-0.5 bg-amber-600/20 text-amber-300 rounded font-mono">
                          {stat.abbreviation}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Sword size={24} />}
            title={search ? 'Aucun résultat' : 'Aucune classe'}
            description="Créez des classes (Guerrier, Mage, Voleur…) avec leurs règles spécifiques."
            action={!search ? <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Créer une classe</Button> : undefined}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier "${editing.name}"` : 'Nouvelle classe'}
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
            <FormField label="Nom" required value={form.name} placeholder="ex: Guerrier" onChange={(e) => setField('name', e.target.value)} />
            <FormField as="textarea" label="Description" value={form.description} placeholder="Décrivez cette classe…" onChange={(e) => setField('description', e.target.value)} rows={3} />
            <FormField as="textarea" label="Règles spéciales" value={form.specialRules} placeholder="Capacités uniques, restrictions…" onChange={(e) => setField('specialRules', e.target.value)} rows={3} />
            {stats.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Statistiques primaires</label>
                <div className="flex flex-wrap gap-2">
                  {stats.map((stat) => (
                    <label key={stat.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${form.primaryStatIds.includes(stat.id) ? 'bg-amber-600/20 border-amber-600/40 text-amber-300' : 'border-[#2a2d3a] text-slate-400 hover:border-slate-500'}`}>
                      <input type="checkbox" checked={form.primaryStatIds.includes(stat.id)} onChange={() => togglePrimaryStat(stat.id)} className="hidden" />
                      {stat.abbreviation}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'modifiers' && (
          <div>
            <p className="text-xs text-slate-500 mb-4">Bonus/malus apportés par cette classe.</p>
            <StatModifiersEditor modifiers={form.statModifiers} stats={stats} onChange={(mods) => setField('statModifiers', mods)} />
          </div>
        )}
        {activeTab === 'conditions' && (
          <div>
            <p className="text-xs text-slate-500 mb-4">Conditions propres à cette classe.</p>
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
        onConfirm={() => deleteTarget && deleteClass(deleteTarget.id)}
        message={`Supprimer la classe "${deleteTarget?.name}" ?`}
      />
    </div>
  );
}
