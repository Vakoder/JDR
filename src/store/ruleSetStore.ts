import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  RuleSet,
  Stat,
  Race,
  Class,
  Character,
  Item,
  Skill,
  DiceSystem,
} from '../types';
import { createEmptyRuleSet } from '../utils/defaults';

interface RuleSetStore {
  ruleSet: RuleSet | null;
  // Lifecycle
  createNew: (name?: string) => void;
  loadRuleSet: (rs: RuleSet) => void;
  clearRuleSet: () => void;
  updateMeta: (fields: Partial<Pick<RuleSet, 'name' | 'description' | 'version'>>) => void;
  // Stats
  addStat: (stat: Omit<Stat, 'id'>) => void;
  updateStat: (id: string, fields: Partial<Omit<Stat, 'id'>>) => void;
  deleteStat: (id: string) => void;
  // Races
  addRace: (race: Omit<Race, 'id'>) => void;
  updateRace: (id: string, fields: Partial<Omit<Race, 'id'>>) => void;
  deleteRace: (id: string) => void;
  // Classes
  addClass: (cls: Omit<Class, 'id'>) => void;
  updateClass: (id: string, fields: Partial<Omit<Class, 'id'>>) => void;
  deleteClass: (id: string) => void;
  // Characters
  addCharacter: (char: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, fields: Partial<Omit<Character, 'id'>>) => void;
  deleteCharacter: (id: string) => void;
  // Items
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (id: string, fields: Partial<Omit<Item, 'id'>>) => void;
  deleteItem: (id: string) => void;
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, fields: Partial<Omit<Skill, 'id'>>) => void;
  deleteSkill: (id: string) => void;
  // Dice system
  updateDiceSystem: (fields: Partial<DiceSystem>) => void;
}

const touch = (rs: RuleSet): RuleSet => ({ ...rs, updatedAt: new Date().toISOString() });

export const useRuleSetStore = create<RuleSetStore>((set) => ({
  ruleSet: null,

  createNew: (name) => set({ ruleSet: createEmptyRuleSet(name) }),
  loadRuleSet: (rs) => set({ ruleSet: rs }),
  clearRuleSet: () => set({ ruleSet: null }),
  updateMeta: (fields) =>
    set((s) => s.ruleSet ? { ruleSet: touch({ ...s.ruleSet, ...fields }) } : s),

  // ── Stats ──────────────────────────────────────────────────────────────────
  addStat: (stat) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, stats: [...s.ruleSet.stats, { id: uuidv4(), ...stat }] }) }
      : s),
  updateStat: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, stats: s.ruleSet.stats.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteStat: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, stats: s.ruleSet.stats.filter((x) => x.id !== id) }) }
      : s),

  // ── Races ──────────────────────────────────────────────────────────────────
  addRace: (race) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, races: [...s.ruleSet.races, { id: uuidv4(), ...race }] }) }
      : s),
  updateRace: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, races: s.ruleSet.races.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteRace: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, races: s.ruleSet.races.filter((x) => x.id !== id) }) }
      : s),

  // ── Classes ────────────────────────────────────────────────────────────────
  addClass: (cls) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, classes: [...s.ruleSet.classes, { id: uuidv4(), ...cls }] }) }
      : s),
  updateClass: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, classes: s.ruleSet.classes.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteClass: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, classes: s.ruleSet.classes.filter((x) => x.id !== id) }) }
      : s),

  // ── Characters ─────────────────────────────────────────────────────────────
  addCharacter: (char) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, characters: [...s.ruleSet.characters, { id: uuidv4(), ...char }] }) }
      : s),
  updateCharacter: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, characters: s.ruleSet.characters.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteCharacter: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, characters: s.ruleSet.characters.filter((x) => x.id !== id) }) }
      : s),

  // ── Items ──────────────────────────────────────────────────────────────────
  addItem: (item) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, items: [...s.ruleSet.items, { id: uuidv4(), ...item }] }) }
      : s),
  updateItem: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, items: s.ruleSet.items.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteItem: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, items: s.ruleSet.items.filter((x) => x.id !== id) }) }
      : s),

  // ── Skills ─────────────────────────────────────────────────────────────────
  addSkill: (skill) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, skills: [...s.ruleSet.skills, { id: uuidv4(), ...skill }] }) }
      : s),
  updateSkill: (id, fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, skills: s.ruleSet.skills.map((x) => x.id === id ? { ...x, ...fields } : x) }) }
      : s),
  deleteSkill: (id) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, skills: s.ruleSet.skills.filter((x) => x.id !== id) }) }
      : s),

  // ── Dice System ────────────────────────────────────────────────────────────
  updateDiceSystem: (fields) =>
    set((s) => s.ruleSet
      ? { ruleSet: touch({ ...s.ruleSet, diceSystem: { ...s.ruleSet.diceSystem, ...fields } }) }
      : s),
}));
