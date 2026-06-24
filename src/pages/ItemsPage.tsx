import { useState } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Item, ItemType, ItemSlot, MonetaryUnit } from '../types';
import Header from '../components/layout/Header';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FormField from '../components/common/FormField';
import SelectField from '../components/common/SelectField';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import ConditionsEditor from '../components/common/ConditionsEditor';
import StatModifiersEditor from '../components/common/StatModifiersEditor';

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'WEAPON', label: 'Arme' },
  { value: 'ARMOR', label: 'Armure' },
  { value: 'ACCESSORY', label: 'Accessoire' },
  { value: 'CONSUMABLE', label: 'Consommable' },
  { value: 'MISC', label: 'Divers' },
];

const ITEM_SLOTS: { value: ItemSlot; label: string }[] = [
  { value: 'NONE', label: 'Aucun' },
  { value: 'HEAD', label: 'Tête' },
  { value: 'CHEST', label: 'Torse' },
  { value: 'LEGS', label: 'Jambes' },
  { value: 'FEET', label: 'Pieds' },
  { value: 'HANDS', label: 'Mains' },
  { value: 'MAIN_HAND', label: 'Main principale' },
  { value: 'OFF_HAND', label: 'Main secondaire' },
  { value: 'NECK', label: 'Cou' },
  { value: 'RING', label: 'Anneau' },
];

const TYPE_COLORS: Record<ItemType, 'amber' | 'blue' | 'green' | 'yellow' | 'slate'> = {
  WEAPON: 'red' as any,
  ARMOR: 'blue',
  ACCESSORY: 'amber',
  CONSUMABLE: 'green',
  MISC: 'slate',
};

const TYPE_LABELS: Record<ItemType, string> = {
  WEAPON: 'Arme',
  ARMOR: 'Armure',
  ACCESSORY: 'Accessoire',
  CONSUMABLE: 'Consommable',
  MISC: 'Divers',
};

const emptyForm = (monetarySystem: MonetaryUnit[]): Omit<Item, 'id'> => {
  var baseValue: { id: string, value: number }[] = [];

  monetarySystem.forEach(monetaryUnit => {
    baseValue.push({ id: monetaryUnit.id, value: 0 });
  });

  return {
    name: '',
    description: '',
    type: 'MISC',
    slot: 'NONE',
    statModifiers: [],
    conditions: [],
    weight: 0,
    value: baseValue,
    equippable: false,
    stackable: false,
  }
};

type Tab = 'info' | 'effects' | 'conditions';

export default function ItemsPage() {
  const { ruleSet, addItem, updateItem, deleteItem } = useRuleSetStore();
  const items = ruleSet?.items ?? [];
  const stats = ruleSet?.stats ?? [];
  const monetarySystem = ruleSet?.monetarySystem ?? [];

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ItemType | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState(emptyForm(ruleSet?.monetarySystem ?? []));
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  const filtered = items.filter((it) => {
    const matchSearch = it.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || it.type === filterType;
    return matchSearch && matchType;
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm(ruleSet?.monetarySystem ?? [])); setActiveTab('info'); setModalOpen(true); };
  const openEdit = (item: Item) => { setEditing(item); setForm({ ...item }); setActiveTab('info'); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    editing ? updateItem(editing.id, form) : addItem(form);
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Informations' },
    { key: 'effects', label: 'Effets & Stats' },
    { key: 'conditions', label: 'Conditions' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Objets" subtitle="Gérez l'équipement et les objets de votre système" />
      <div className="p-8">
        <PageHeader
          title="Objets"
          subtitle={`${items.length} objet${items.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvel objet
            </Button>
          }
        />

        {items.length > 0 && (
          <div className="flex gap-3 mb-6">
            <div className="max-w-xs flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un objet…" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['ALL', ...ITEM_TYPES.map((t) => t.value)] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    filterType === type
                      ? 'bg-amber-600/20 text-amber-300 border-amber-600/30'
                      : 'text-slate-400 border-[#2a2d3a] hover:border-slate-500'
                  }`}
                >
                  {type === 'ALL' ? 'Tous' : TYPE_LABELS[type as ItemType]}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="bg-[#13151c] border border-[#2a2d3a] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d3a]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Nom</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Emplacement</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Poids</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Valeur</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Propriétés</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  return <tr key={item.id} className={`border-b border-[#1e2130] last:border-0 hover:bg-[#1a1d28] transition-colors ${i % 2 === 0 ? '' : 'bg-[#111318]'}`}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{item.name}</p>
                      {item.description && <p className="text-xs text-slate-400 truncate max-w-xs">{item.description}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <Badge color={TYPE_COLORS[item.type] as any}>{TYPE_LABELS[item.type]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{ITEM_SLOTS.find((s) => s.value === item.slot)?.label ?? item.slot}</td>
                    <td className="px-5 py-3 text-slate-400">{item.weight} kg</td>
                    <td className="px-5 py-3 text-slate-400">
                      {
                        item.value.map(monetaryUnit => {
                          return <div>{monetaryUnit.value} {monetarySystem.find(x => x.id == monetaryUnit.id)?.name}</div>;
                        })
                      }
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {item.equippable && <Badge color="amber">Équipable</Badge>}
                        {item.stackable && <Badge color="blue">Empilable</Badge>}
                        {item.statModifiers.length > 0 && <Badge color="green">{item.statModifiers.length} modificateur{item.statModifiers.length !== 1 ? 's' : ''}</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-amber-400 p-1.5 rounded hover:bg-amber-600/10 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(item)} className="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-red-600/10 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Package size={24} />}
            title={search || filterType !== 'ALL' ? 'Aucun résultat' : 'Aucun objet'}
            description="Créez des armes, armures et objets utilisables par vos personnages."
            action={!search && filterType === 'ALL' ? <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Créer un objet</Button> : undefined}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier "${editing.name}"` : 'Nouvel objet'}
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
            <FormField label="Nom" required value={form.name} placeholder="ex: Épée longue" onChange={(e) => setField('name', e.target.value)} />
            <FormField as="textarea" label="Description" value={form.description} placeholder="Décrivez cet objet…" onChange={(e) => setField('description', e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Type" value={form.type} options={ITEM_TYPES} onChange={(e) => setField('type', e.target.value as ItemType)} />
              <SelectField label="Emplacement" value={form.slot} options={ITEM_SLOTS} onChange={(e) => setField('slot', e.target.value as ItemSlot)} />
            </div>
            <div className="flex flex-col gap-4">
              <FormField label="Poids (kg)" type="number" min={0} step={0.1} value={form.weight} onChange={(e) => setField('weight', parseFloat(e.target.value) || 0)} />
            </div>
            <div className={"grid grid-cols-" + monetarySystem.length + " gap-4"}>
              {
                monetarySystem.map((monetaryUnit, i) => {
                  const value: number = form.value.find((x) => x.id == monetaryUnit.id)?.value ?? 0;

                  function changeValue(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>, id: string) {
                    const t = form.value.find((x) => x.id === id);

                    if (t == null) return;

                    t.value = parseInt(e.target.value);

                    setField('value', form.value);
                  }

                  if (i === monetarySystem.length - 1) {
                    return <FormField label={monetaryUnit.name} type="number" min={0} value={value} onChange={(e) => changeValue(e, monetaryUnit.id)} />;
                  }
                  return <FormField label={monetaryUnit.name} type="number" min={0} value={value} onChange={(e) => changeValue(e, monetaryUnit.id)} />;
                })
              }
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.equippable} onChange={(e) => setField('equippable', e.target.checked)} className="accent-amber-500" />
                Équipable
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.stackable} onChange={(e) => setField('stackable', e.target.checked)} className="accent-amber-500" />
                Empilable
              </label>
            </div>
          </div>
        )}
        {activeTab === 'effects' && (
          <div>
            <p className="text-xs text-slate-400 mb-4">Modificateurs de statistiques apportés par cet objet quand il est équipé.</p>
            <StatModifiersEditor modifiers={form.statModifiers} stats={stats} onChange={(mods) => setField('statModifiers', mods)} />
          </div>
        )}
        {activeTab === 'conditions' && (
          <div>
            <p className="text-xs text-slate-400 mb-4">Conditions liées à l'utilisation de cet objet.</p>
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
        onConfirm={() => deleteTarget && deleteItem(deleteTarget.id)}
        message={`Supprimer l'objet "${deleteTarget?.name}" ?`}
      />
    </div>
  );
}

