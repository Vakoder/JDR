import type { RuleSet } from '../types';

export function importFromFile(file: File): Promise<RuleSet> {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Le fichier doit être au format JSON.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as RuleSet;
        validateRuleSet(data);
        resolve(data);
      } catch (err) {
        reject(new Error('Fichier JSON invalide ou structure incorrecte.'));
      }
    };
    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
    reader.readAsText(file);
  });
}

function validateRuleSet(data: unknown): asserts data is RuleSet {
  if (typeof data !== 'object' || data === null) throw new Error();
  const rs = data as Record<string, unknown>;
  if (typeof rs.id !== 'string') throw new Error();
  if (typeof rs.name !== 'string') throw new Error();
  if (!Array.isArray(rs.stats)) throw new Error();
  if (!Array.isArray(rs.races)) throw new Error();
  if (!Array.isArray(rs.classes)) throw new Error();
  if (!Array.isArray(rs.characters)) throw new Error();
  if (!Array.isArray(rs.items)) throw new Error();
  if (!Array.isArray(rs.skills)) throw new Error();
  if (!Array.isArray(rs.monetarySystem)) throw new Error();
  if (typeof rs.diceSystem !== 'object') throw new Error();
}
