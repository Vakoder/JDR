import { v4 as uuidv4 } from 'uuid';
import type { RuleSet, DiceSystem } from '../types';

export const createDefaultDiceSystem = (): DiceSystem => ({
  diceType: 'D20',
  numberOfDice: 1,
  successThreshold: 10,
  failureThreshold: 5,
  criticalSuccessThreshold: 20,
  criticalFailureThreshold: 1,
  higherIsBetter: true,
  description: '',
});

export const createEmptyRuleSet = (name = 'Nouveau set de règles'): RuleSet => ({
  id: uuidv4(),
  name,
  description: '',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  stats: [],
  races: [],
  classes: [],
  characters: [],
  items: [],
  skills: [],
  diceSystem: createDefaultDiceSystem(),
});
