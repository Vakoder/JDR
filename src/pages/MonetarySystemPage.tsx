import { useState } from 'react';
import { Plus, Pencil, Trash2, BarChart2 } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { MonetaryUnit } from '../types';
import Header from '../components/layout/Header';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FormField from '../components/common/FormField';
import EmptyState from '../components/common/EmptyState';

const emptyForm = (): Omit<MonetaryUnit, 'id'> => ({
  name: '',
  value: 0.001,
});

export default function StatsPage() {
  const { ruleSet, addMonetaryUnit, updateMonetaryUnit, deleteMonetaryUnit } = useRuleSetStore();
  const monetarySystem = ruleSet?.monetarySystem ?? [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MonetaryUnit | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<MonetaryUnit | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (monetaryUnit: MonetaryUnit) => {
    setEditing(monetaryUnit);
    setForm({ name: monetaryUnit.name, value: monetaryUnit.value });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateMonetaryUnit(editing.id, form);
    } else {
      addMonetaryUnit(form);
    }
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const currentMonetaryUnit: MonetaryUnit = {
      ...(editing ?? {
        id: 'temp',
      }),
      ...form,
    };

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Système Monétaire" subtitle="Gérez l'économie de votre système" />
      <div className="p-8">
        <PageHeader
          title="Système Monétaire"
          subtitle={`${monetarySystem.length} unité monétaire${monetarySystem.length !== 1 ? 's' : ''} définie${monetarySystem.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvelle unité
            </Button>
          }
        />

        {/* Table */}
        {monetarySystem.length > 0 ? (
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d3a]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nom</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{monetarySystem.length > 0 ? "Valeur par rapport à '" + monetarySystem[0].name + "'": "Valeur"}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {monetarySystem.map((monetaryUnit, i) => (
                  <tr
                    key={monetaryUnit.name}
                    className={`border-b border-[#1e2130] last:border-0 hover:bg-[#1a1d28] transition-colors ${i % 2 === 0 ? '' : 'bg-[#111318]'}`}
                  >
                    <td className="px-5 py-3 font-medium text-white">{monetaryUnit.name}</td>
                    <td className="px-5 py-3 text-slate-400">{i === 0 ? '—' : monetaryUnit.value}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(monetaryUnit)}
                          className="text-slate-400 hover:text-violet-400 transition-colors p-1.5 rounded hover:bg-violet-600/10"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(monetaryUnit)}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-600/10"
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
            title={'Aucune unité monétaire'}
            description={'Créez votre première Unité Monétaire (Or, Arget, Euro...)'}
            action={
              (
                <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
                  Créer une unité monétaire
                </Button>
              )
            }
          />
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l\'unité' : 'Nouvelle unité'}
        size="md"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Nom"
              required
              value={form.name}
              placeholder="ex: Argent"
              onChange={(e) => setField('name', e.target.value)}
            />
            { currentMonetaryUnit?.id != monetarySystem[0]?.id && (
              <FormField
                label={"Valeur par rapport à '" + monetarySystem[0]?.name + "'"}
                type="number"
                value={form.value}
                min={0}
                placeholder="ex: 10"
                onChange={(e) => { const val = Math.max(parseFloat(e.target.value), 0.001); setField('value', val); }}
              />
            )}

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
        onConfirm={() => deleteTarget && deleteMonetaryUnit(deleteTarget.id)}
        message={`Supprimer l'unité "${deleteTarget?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}

