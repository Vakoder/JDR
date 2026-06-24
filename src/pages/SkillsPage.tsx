import { useState } from 'react';
import { Plus, Pencil, Trash2, Zap } from 'lucide-react';
import { useRuleSetStore } from '../store/ruleSetStore';
import type { Skill, CostType } from '../types';
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

const COST_TYPES: { value: CostType; label: string }[] = [
  { value: 'XP', label: 'XP' },
  { value: 'MANA', label: 'Mana' },
  { value: 'STAMINA', label: 'Endurance' },
  { value: 'CUSTOM', label: 'Personnalisé' },
];

const emptyForm = (): Omit<Skill, 'id'> => ({
  name: '',
  description: '',
  linkedStatId: null,
  cost: 0,
  costType: 'XP',
  costTypeCustomName: '',
  conditions: [],
  allowedClassIds: [],
});

export default function SkillsPage() {
  const { ruleSet, addSkill, updateSkill, deleteSkill } = useRuleSetStore();
  const skills = ruleSet?.skills ?? [];
  const stats = ruleSet?.stats ?? [];
  const classes = ruleSet?.classes ?? [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'conditions'>('info');
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setActiveTab('info'); setModalOpen(true); };
  const openEdit = (skill: Skill) => { setEditing(skill); setForm({ ...skill }); setActiveTab('info'); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    editing ? updateSkill(editing.id, form) : addSkill(form);
    setModalOpen(false);
  };

  const setField = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleClass = (classId: string) =>
    setForm((f) => ({
      ...f,
      allowedClassIds: f.allowedClassIds.includes(classId)
        ? f.allowedClassIds.filter((id) => id !== classId)
        : [...f.allowedClassIds, classId],
    }));

  const getStatName = (id: string | null) => stats.find((s) => s.id === id)?.name ?? null;

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Compétences" subtitle="Gérez les compétences et capacités" />
      <div className="p-8">
        <PageHeader
          title="Compétences"
          subtitle={`${skills.length} compétence${skills.length !== 1 ? 's' : ''}`}
          actions={
            <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
              Nouvelle compétence
            </Button>
          }
        />

        {skills.length > 0 && (
          <div className="mb-6 max-w-sm">
            <SearchBar value={search} onChange={setSearch} placeholder="Rechercher une compétence…" />
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill) => {
              const linkedStat = getStatName(skill.linkedStatId);
              const costLabel = skill.costType === 'CUSTOM' ? skill.costTypeCustomName || 'Personnalisé' : skill.costType;
              return (
                <div key={skill.id} className="bg-[#13151c] border border-[#2a2d3a] rounded-xl p-5 flex flex-col gap-3 hover:border-[#3a3d4a] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-600/20 flex items-center justify-center shrink-0">
                        <Zap size={18} className="text-cyan-400" />
                      </div>
                      <h3 className="font-semibold text-white leading-tight">{skill.name}</h3>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(skill)} className="text-slate-500 hover:text-amber-400 p-1.5 rounded hover:bg-amber-600/10 transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget(skill)} className="text-slate-500 hover:text-red-400 p-1.5 rounded hover:bg-red-600/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {skill.description && <p className="text-xs text-slate-500 line-clamp-2">{skill.description}</p>}
                  <div className="flex gap-2 flex-wrap pt-1 border-t border-[#1e2130]">
                    {skill.cost > 0 && <Badge color="yellow">{skill.cost} {costLabel}</Badge>}
                    {linkedStat && <Badge color="blue">{linkedStat}</Badge>}
                    {skill.conditions.length > 0 && <Badge color="slate">{skill.conditions.length} cond.</Badge>}
                    {skill.allowedClassIds.length > 0 && (
                      <Badge color="amber">{skill.allowedClassIds.length} classe{skill.allowedClassIds.length !== 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Zap size={24} />}
            title={search ? 'Aucun résultat' : 'Aucune compétence'}
            description="Créez des compétences (attaques, sorts, aptitudes…) liées à vos statistiques."
            action={!search ? <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>Créer une compétence</Button> : undefined}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Modifier "${editing.name}"` : 'Nouvelle compétence'}
        size="lg"
      >
        <div className="flex gap-1 mb-6 bg-[#0f1117] rounded-lg p-1 border border-[#2a2d3a]">
          {[{ key: 'info', label: 'Informations' }, { key: 'conditions', label: 'Conditions' }].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${activeTab === tab.key ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="flex flex-col gap-4">
            <FormField label="Nom" required value={form.name} placeholder="ex: Attaque vicieuse" onChange={(e) => setField('name', e.target.value)} />
            <FormField as="textarea" label="Description" value={form.description} placeholder="Décrivez cette compétence…" onChange={(e) => setField('description', e.target.value)} rows={3} />
            <SelectField
              label="Statistique liée"
              value={form.linkedStatId ?? ''}
              placeholder="— Aucune statistique —"
              options={stats.map((s) => ({ value: s.id, label: `${s.name} (${s.abbreviation})` }))}
              onChange={(e) => setField('linkedStatId', e.target.value || null)}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Coût"
                type="number"
                min={0}
                value={form.cost}
                onChange={(e) => setField('cost', parseInt(e.target.value) || 0)}
              />
              <SelectField
                label="Type de coût"
                value={form.costType}
                options={COST_TYPES}
                onChange={(e) => setField('costType', e.target.value as CostType)}
              />
            </div>
            {form.costType === 'CUSTOM' && (
              <FormField
                label="Nom du coût personnalisé"
                value={form.costTypeCustomName}
                placeholder="ex: Âme, Sang, Points de foi…"
                onChange={(e) => setField('costTypeCustomName', e.target.value)}
              />
            )}
            {classes.length > 0 && (
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Classes autorisées <span className="text-slate-600">(vide = toutes)</span></label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((cls) => (
                    <label key={cls.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${form.allowedClassIds.includes(cls.id) ? 'bg-cyan-600/20 border-cyan-600/40 text-cyan-300' : 'border-[#2a2d3a] text-slate-400 hover:border-slate-500'}`}>
                      <input type="checkbox" checked={form.allowedClassIds.includes(cls.id)} onChange={() => toggleClass(cls.id)} className="hidden" />
                      {cls.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'conditions' && (
          <div>
            <p className="text-xs text-slate-500 mb-4">Conditions nécessaires pour utiliser cette compétence.</p>
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
        onConfirm={() => deleteTarget && deleteSkill(deleteTarget.id)}
        message={`Supprimer la compétence "${deleteTarget?.name}" ?`}
      />
    </div>
  );
}
