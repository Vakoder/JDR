import { useState } from 'react';
import { Plus, Pencil, Trash2, Users, User, UserCog } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Character, CharacterType, InventoryEntry } from '../types';
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
import evaluateConditions from '../services/conditionService.ts';

const emptyForm = (): Omit<Character, 'id'> => ({
  name: '',
  type: 'PC',
  raceId: null,
  classId: null,
  stats: {},
  statsMax: {},
  skillIds: [],
  inventory: [],
  description: '',
  notes: '',
});

type Tab = 'identity' | 'stats' | 'skills' | 'inventory';

export default function CharactersPage() {
  const { ruleSet, addCharacter, updateCharacter, deleteCharacter } = useRuleSetStore();
  const characters = ruleSet?.characters ?? [];
  const stats = ruleSet?.stats ?? [];
  const races = ruleSet?.races ?? [];
  const classes = ruleSet?.classes ?? [];
  const skills = ruleSet?.skills ?? [];
  const items = ruleSet?.items ?? [];

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | CharacterType>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [editing, setEditing] = useState<Character | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Character | null>(null);

  const filtered = characters.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || c.type === filterType;
    return matchSearch && matchType;
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setActiveTab('identity');
    setModalOpen(true);
  };

  const openEdit = (char: Character) => {
    setEditing(char);
    setForm({ ...char, statsMax: char.statsMax ?? {}, inventory: char.inventory.map((e) => ({ ...e, quantity: e.quantity ?? 1 })) });
    setActiveTab('identity');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateCharacter(editing.id, form);
    } else {
      addCharacter(form);
    }
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setStat = (statId: string, value: number) =>
    setForm((f) => ({ ...f, stats: { ...f.stats, [statId]: value } }));

  const setStatMax = (statId: string, value: number) =>
    setForm((f) => ({ ...f, statsMax: { ...f.statsMax, [statId]: value } }));

  const toggleSkill = (skillId: string) =>
    setForm((f) => ({
      ...f,
      skillIds: f.skillIds.includes(skillId)
        ? f.skillIds.filter((id) => id !== skillId)
        : [...f.skillIds, skillId],
    }));

  const addInventoryItem = (itemId: string) => {
    const item = items.find((it) => it.id === itemId);
    if (!item) return;
    if (item.stackable) {
      const existing = form.inventory.find((e) => e.itemId === itemId);
      if (existing) {
        setForm((f) => ({
          ...f,
          inventory: f.inventory.map((e) =>
            e.itemId === itemId ? { ...e, quantity: e.quantity + 1 } : e
          ),
        }));
        return;
      }
    }
    setForm((f) => ({
      ...f,
      inventory: [...f.inventory, { instanceId: crypto.randomUUID(), itemId, quantity: 1, equipped: false }],
    }));
  };

  const updateInventoryEntry = (instanceId: string, field: keyof InventoryEntry, value: unknown) =>
    setForm((f) => ({
      ...f,
      inventory: f.inventory.map((e) => (e.instanceId === instanceId ? { ...e, [field]: value } : e)),
    }));

  const removeInventoryItem = (instanceId: string) =>
    setForm((f) => ({ ...f, inventory: f.inventory.filter((e) => e.instanceId !== instanceId) }));

  const tabs: { key: Tab; label: string }[] = [
    { key: 'identity', label: 'Identité' },
    { key: 'stats', label: `Stats (${stats.length})` },
    { key: 'skills', label: `Compétences (${skills.length})` },
    { key: 'inventory', label: `Inventaire (${items.length})` },
  ];

  const getRaceName = (id: string | null) => races.find((r) => r.id === id)?.name ?? '—';
  const getClassName = (id: string | null) => classes.find((c) => c.id === id)?.name ?? '—';

  const currentCharacter: Character = {
    ...(editing ?? {
      id: 'temp',
      type: 'PC',
    }),
    ...form,
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Personnages" subtitle="Gérez vos PJ et PNJ" />
      <div className="p-8">
        <PageHeader
          title="Personnages"
          subtitle={`${characters.length} personnage${characters.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouveau personnage
            </Button>
          }
        />

        {/* Filters */}
        {characters.length > 0 && (
          <div className="flex gap-3 mb-6">
            <div className="max-w-xs flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un personnage…" />
            </div>
            <div className="flex gap-2">
              {(['ALL', 'PC', 'NPC'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${filterType === type
                    ? 'bg-violet-600/20 text-violet-300 border-violet-600/30'
                    : 'text-slate-400 border-[#2a2d3a] hover:border-slate-500'
                    }`}
                >
                  {type === 'ALL' ? 'Tous' : type === 'PC' ? 'PJ' : 'PNJ'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((char) => (
              <div
                key={char.id}
                className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3a3d4a] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${char.type === 'PC' ? 'bg-violet-600/20' : 'bg-blue-600/20'}`}>
                      {char.type === 'PC' ? <User size={18} className="text-violet-400" /> : <UserCog size={18} className="text-blue-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{char.name}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        <Badge color={char.type === 'PC' ? 'violet' : 'blue'}>{char.type === 'PC' ? 'PJ' : 'PNJ'}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(char)} className="text-slate-500 hover:text-violet-400 p-1.5 rounded transition-colors hover:bg-violet-600/10">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(char)} className="text-slate-500 hover:text-red-400 p-1.5 rounded transition-colors hover:bg-red-600/10">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-slate-500">
                  <span>Race: <span className="text-slate-300">{getRaceName(char.raceId)}</span></span>
                  <span>Classe: <span className="text-slate-300">{getClassName(char.classId)}</span></span>
                </div>
                {Object.keys(char.stats).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#1e2130]">
                    {Object.entries(char.stats).slice(0, 6).map(([sid, val]) => {
                      const stat = stats.find((s) => s.id === sid);
                      return stat ? (
                        <span key={sid} className="text-xs px-2 py-0.5 bg-[#1e2130] rounded text-slate-300">
                          <span className="text-slate-500">{stat.abbreviation}:</span> {val}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {char.description && (
                  <p className="text-xs text-slate-500 line-clamp-2">{char.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users size={24} />}
            title={search || filterType !== 'ALL' ? 'Aucun résultat' : 'Aucun personnage'}
            description="Créez des PJ (joueurs) et PNJ (non-joueurs) pour peupler votre univers."
            action={
              !search && filterType === 'ALL' ? (
                <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
                  Créer un personnage
                </Button>
              ) : undefined
            }
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier "${editing.name}"` : 'Nouveau personnage'}
        size="xl"
      >
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#0f1117] rounded-lg p-1 border border-[#2a2d3a]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${activeTab === tab.key
                ? 'bg-violet-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Identity */}
        {activeTab === 'identity' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Nom"
                required
                value={form.name}
                placeholder="ex: Aragorn"
                onChange={(e) => setField('name', e.target.value)}
              />
              <SelectField
                label="Type"
                value={form.type}
                options={[{ value: 'PC', label: 'PJ — Joueur' }, { value: 'NPC', label: 'PNJ — Non-Joueur' }]}
                onChange={(e) => setField('type', e.target.value as CharacterType)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Race"
                value={form.raceId ?? ''}
                placeholder="— Aucune race —"
                options={races.map(
                  (r) => {
                    const usable =
                      r.conditions.length === 0 ||
                      evaluateConditions(
                        r.conditions,
                        currentCharacter,
                        r,
                        ruleSet
                      );
                    return ({ value: r.id, label: r.name + (usable ? " ✓" : " ✗") });
                  }
                )}
                onChange={(e) => setField('raceId', e.target.value || null)}
              />
              <SelectField
                label="Classe"
                value={form.classId ?? ''}
                placeholder="— Aucune classe —"
                options={classes.map(
                  (c) => {
                    const usable =
                      c.conditions.length === 0 ||
                      evaluateConditions(
                        c.conditions,
                        currentCharacter,
                        c,
                        ruleSet
                      );
                    return ({ value: c.id, label: c.name + (usable ? " ✓" : " ✗") });
                  }
                )}
                onChange={(e) => setField('classId', e.target.value || null)}
              />
            </div>
            <FormField
              as="textarea"
              label="Description"
              value={form.description}
              placeholder="Description physique et comportementale…"
              onChange={(e) => setField('description', e.target.value)}
              rows={3}
            />
            <FormField
              as="textarea"
              label="Notes"
              value={form.notes}
              placeholder="Notes libres…"
              onChange={(e) => setField('notes', e.target.value)}
              rows={2}
            />
          </div>
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-3">
            {stats.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">Créez d'abord des statistiques dans la section "Statistiques".</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.id} className="bg-[#1a1d28] border border-[#2a2d3a] rounded-lg p-3">
                    <label className="text-xs text-slate-400 font-medium block mb-1.5">
                      {stat.name}
                      <span className="text-slate-600 ml-1">({stat.abbreviation})</span>
                    </label>
                    {stat.maxValue !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={form.stats[stat.id] ?? stat.defaultValue}
                          onChange={(e) => setStat(stat.id, parseInt(e.target.value) || stat.defaultValue)}
                          className="w-full px-3 py-1.5 text-sm bg-[#13151c] border border-[#2a2d3a] rounded text-slate-200 focus:outline-none focus:border-violet-500"
                        />
                        <span className="text-slate-600 text-sm">/</span>
                        <input
                          type="number"
                          value={(form.statsMax ?? {})[stat.id] ?? stat.maxValue}
                          onChange={(e) => setStatMax(stat.id, parseInt(e.target.value) || stat.maxValue!)}
                          className="w-full px-3 py-1.5 text-sm bg-[#13151c] border border-[#2a2d3a] rounded text-slate-500 focus:outline-none focus:border-violet-500/50"
                        />
                      </div>
                    ) : (
                      <input
                        type="number"
                        value={form.stats[stat.id] ?? stat.defaultValue}
                        onChange={(e) => setStat(stat.id, parseInt(e.target.value) || stat.defaultValue)}
                        className="w-full px-3 py-1.5 text-sm bg-[#13151c] border border-[#2a2d3a] rounded text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-2">
            {skills.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">Créez d'abord des compétences dans la section "Compétences".</p>
            ) : (
              skills.map((skill) => {
                const linkedStat = stats.find((s) => s.id === skill.linkedStatId);
                const usable =
                  skill.conditions.length === 0 ||
                  evaluateConditions(
                    skill.conditions,
                    currentCharacter,
                    skill,
                    ruleSet
                  );
                return (
                  <label
                    key={skill.id}
                    className="flex items-center gap-3 p-3 bg-[#1a1d28] border border-[#2a2d3a] rounded-lg cursor-pointer hover:border-violet-500/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.skillIds.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                      className="accent-violet-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-200">{skill.name}</p>
                      <p className="text-xs text-slate-500">
                        {linkedStat ? `Lié à ${linkedStat.name}` : 'Aucune stat'} · {skill.cost} {skill.costType === 'CUSTOM' ? skill.costTypeCustomName : skill.costType}
                      </p>
                      <p
                        className={`text-xs mt-1 ${usable ? 'text-green-400' : 'text-red-400'
                          }`}
                      >
                        {usable ? '✓ Utilisable' : '✗ Conditions non remplies'}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        )}

        {/* Inventory */}
        {activeTab === 'inventory' && (
          <div className="flex flex-col gap-4">
            {/* Add item */}
            <SelectField
              label="Ajouter un objet"
              value=""
              placeholder="— Sélectionner un objet —"
              options={items.map((it) => ({ value: it.id, label: it.name }))}
              onChange={(e) => e.target.value && addInventoryItem(e.target.value)}
            />
            {/* Inventory list */}
            {form.inventory.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">Inventaire vide.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {form.inventory.map((entry) => {
                  const item = items.find((it) => it.id === entry.itemId);
                  if (!item) return null;
                  const usable =
                    item.conditions.length === 0 ||
                    evaluateConditions(
                      item.conditions,
                      currentCharacter,
                      item,
                      ruleSet
                    );

                  const sameInstances = form.inventory.filter((e) => e.itemId === item.id);
                  const instanceLabel = !item.stackable && sameInstances.length > 1
                    ? ` #${sameInstances.findIndex((e) => e.instanceId === entry.instanceId) + 1}`
                    : '';
                  return (
                    <div key={entry.instanceId} className="flex items-center gap-3 p-3 bg-[#1a1d28] border border-[#2a2d3a] rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">
                          {item.name}
                          {instanceLabel && <span className="text-slate-500 font-normal">{instanceLabel}</span>}
                        </p>
                        <p className="text-xs text-slate-500">{item.type} · {item.slot}</p>
                      </div>
                      {item.stackable && (
                        <input
                          type="number"
                          min={1}
                          value={entry.quantity}
                          onChange={(e) => updateInventoryEntry(entry.instanceId, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-sm bg-[#13151c] border border-[#2a2d3a] rounded text-slate-200 focus:outline-none focus:border-violet-500 text-center"
                        />
                      )}
                      {item.equippable && (
                        <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={entry.equipped}
                            onChange={(e) => updateInventoryEntry(entry.instanceId, 'equipped', e.target.checked)}
                            className="accent-violet-500"
                          />
                          Équipé
                          <p
                            className={`text-xs mt-1 ${usable ? 'text-green-400' : 'text-red-400'
                              }`}
                          >
                            {usable ? '✓ Utilisable' : '✗ Conditions non remplies'}
                          </p>
                        </label>
                      )}
                      <button onClick={() => removeInventoryItem(entry.instanceId)} className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
        onConfirm={() => deleteTarget && deleteCharacter(deleteTarget.id)}
        message={`Supprimer le personnage "${deleteTarget?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
