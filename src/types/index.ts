// ─── Dice ────────────────────────────────────────────────────────────────────

export type DiceType = 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20' | 'D100';

export interface DiceSystem {
  diceType: DiceType;
  numberOfDice: number;
  successThreshold: number;
  failureThreshold: number;
  criticalSuccessThreshold: number | null;
  criticalFailureThreshold: number | null;
  higherIsBetter: boolean;
  description: string;
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface Stat {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export interface StatModifier {
  statId: string;
  modifier: number;
}

// ─── Condition ───────────────────────────────────────────────────────────────

export interface Condition {
  id: string;
  forumla: string;
}

// ─── Race ────────────────────────────────────────────────────────────────────

export interface Race {
  id: string;
  name: string;
  description: string;
  statModifiers: StatModifier[];
  conditions: Condition[];
  specialRules: string;
}

// ─── Class ───────────────────────────────────────────────────────────────────

export interface Class {
  id: string;
  name: string;
  description: string;
  statModifiers: StatModifier[];
  conditions: Condition[];
  specialRules: string;
  primaryStatIds: string[];
}

// ─── Skill ───────────────────────────────────────────────────────────────────

export type CostType = 'XP' | 'MANA' | 'STAMINA' | 'CUSTOM';

export interface Skill {
  id: string;
  name: string;
  description: string;
  linkedStatId: string | null;
  cost: number;
  costType: CostType;
  costTypeCustomName: string;
  conditions: Condition[];
  allowedClassIds: string[];
}

// ─── Item ────────────────────────────────────────────────────────────────────

export type ItemType = 'WEAPON' | 'ARMOR' | 'ACCESSORY' | 'CONSUMABLE' | 'MISC';
export type ItemSlot =
  | 'HEAD'
  | 'CHEST'
  | 'LEGS'
  | 'FEET'
  | 'HANDS'
  | 'MAIN_HAND'
  | 'OFF_HAND'
  | 'NECK'
  | 'RING'
  | 'NONE';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot: ItemSlot;
  statModifiers: StatModifier[];
  conditions: Condition[];
  weight: number;
  value: number;
  equippable: boolean;
  stackable: boolean;
}

// ─── Character ───────────────────────────────────────────────────────────────

export type CharacterType = 'PC' | 'NPC';

export interface InventoryEntry {
  itemId: string;
  quantity: number;
  equipped: boolean;
}

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  raceId: string | null;
  classId: string | null;
  stats: Record<string, number>;
  skillIds: string[];
  inventory: InventoryEntry[];
  description: string;
  notes: string;
}

// ─── RuleSet (root) ──────────────────────────────────────────────────────────

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  stats: Stat[];
  races: Race[];
  classes: Class[];
  characters: Character[];
  items: Item[];
  skills: Skill[];
  diceSystem: DiceSystem;
}
