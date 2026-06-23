import { useState } from 'react';
import { Plus, Pencil, Trash2, BarChart2 } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Stat } from '../types';
import Header from '../components/layout/Header';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FormField from '../components/common/FormField';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';

const emptyForm = (): Omit<Stat, 'id'> => ({
  name: '',
  abbreviation: '',
  description: '',
  minValue: 1,
  maxValue: 20,
  defaultValue: 10,
});

export default function StatsPage() {
  const { ruleSet, addStat, updateStat, deleteStat } = useRuleSetStore();
  const stats = ruleSet?.stats ?? [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Stat | null>(null);

  const filtered = stats.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.abbreviation.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (stat: Stat) => {
    setEditing(stat);
    setForm({ name: stat.name, abbreviation: stat.abbreviation, description: stat.description, minValue: stat.minValue, maxValue: stat.maxValue, defaultValue: stat.defaultValue });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateStat(editing.id, form);
    } else {
      addStat(form);
    }
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Statistiques" subtitle="Gérez les attributs de votre système" />
      <div className="p-8">
        <PageHeader
          title="Statistiques"
          subtitle={`${stats.length} statistique${stats.length !== 1 ? 's' : ''} définie${stats.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvelle statistique
            </Button>
          }
        />

        {/* Search */}
        {stats.length > 0 && (
          <div className="mb-6 max-w-sm">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une statistique…" />
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d3a]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nom</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Abrév.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plage</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Défaut</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((stat, i) => (
                  <tr
                    key={stat.id}
                    className={`border-b border-[#1e2130] last:border-0 hover:bg-[#1a1d28] transition-colors ${i % 2 === 0 ? '' : 'bg-[#111318]'}`}
                  >
                    <td className="px-5 py-3 font-medium text-white">{stat.name}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-violet-600/20 text-violet-300 rounded text-xs font-mono font-bold">
                        {stat.abbreviation}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {stat.minValue} – {stat.maxValue}
                    </td>
                    <td className="px-5 py-3 text-slate-400">{stat.defaultValue}</td>
                    <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{stat.description || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(stat)}
                          className="text-slate-500 hover:text-violet-400 transition-colors p-1.5 rounded hover:bg-violet-600/10"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(stat)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-600/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<BarChart2 size={24} />}
            title={search ? 'Aucun résultat' : 'Aucune statistique'}
            description={search ? 'Essayez un autre terme de recherche.' : 'Créez votre première statistique (Force, Intelligence, Agilité…)'}
            action={
              !search ? (
                <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
                  Créer une statistique
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la statistique' : 'Nouvelle statistique'}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nom"
              required
              value={form.name}
              placeholder="ex: Force"
              onChange={(e) => setField('name', e.target.value)}
            />
            <FormField
              label="Abréviation"
              value={form.abbreviation}
              placeholder="ex: FOR"
              maxLength={6}
              onChange={(e) => setField('abbreviation', e.target.value.toUpperCase())}
            />
          </div>
          <FormField
            as="textarea"
            label="Description"
            value={form.description}
            placeholder="Décrit la capacité physique brute du personnage…"
            onChange={(e) => setField('description', e.target.value)}
            rows={2}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Valeur minimale"
              type="number"
              value={form.minValue}
              onChange={(e) => setField('minValue', Number(e.target.value))}
            />
            <FormField
              label="Valeur maximale"
              type="number"
              value={form.maxValue}
              onChange={(e) => setField('maxValue', Number(e.target.value))}
            />
            <FormField
              label="Valeur par défaut"
              type="number"
              value={form.defaultValue}
              onChange={(e) => setField('defaultValue', Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#2a2d3a] mt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button variant="primary" onClick={handleSave} disabled={!form.name.trim()}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteStat(deleteTarget.id)}
        message={`Supprimer la statistique "${deleteTarget?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
