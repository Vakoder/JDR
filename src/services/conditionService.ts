import { Parser } from "expr-eval";

import type {
    Character,
    Class,
    Item,
    Skill,
    RuleSet,
    Condition,
    Race,
} from "../types";

type ConditionTarget = Item | Skill | Class | Race | Record<string, unknown>;

export interface EvaluationContext {
    ruleset: RuleSet;
}

export class ConditionEvaluator {
    private parser = new Parser({
        operators: {
            logical: true,
            comparison: true,
            concatenate: false,
            factorial: false,
            power: true,
        },
    });

    evaluate(
        condition: Condition,
        character: Character,
        target: ConditionTarget,
        context: EvaluationContext
    ): boolean {
        try {
            const expression = this.parser.parse(condition.forumla);

            const variables = this.buildVariables(
                character,
                target,
                context
            );

            return Boolean(expression.evaluate(variables));
        } catch (error) {
            console.error(
                `Failed to evaluate condition '${condition.id}'`,
                error
            );

            return false;
        }
    }

    private buildVariables(
        character: Character,
        target: ConditionTarget,
        context: EvaluationContext
    ): Record<string, unknown> {
        const variables: Record<string, unknown> = {};

        //
        // Character stats
        //
        for (const [statId, value] of Object.entries(character.stats)) {
            const statName = context.ruleset.stats.find((x) => { return x.id == statId})?.name ?? "";

            variables[`Character_${statName}`] = value;

            const statDefinition = context.ruleset.stats.find(
                s => s.id === statId
            );

            if (statDefinition) {
                variables[`Character_${statName}Max`] =
                    statDefinition.maxValue;

                variables[`Character_${statName}Min`] =
                    statDefinition.minValue;
            }
        }

        //
        // Character class
        //
        const characterClass = context.ruleset.classes.find(
            c => c.id === character.classId
        );

        variables["Character_Class"] =
            characterClass?.name ?? "";

        const characterRace = context.ruleset.races.find(
            r => r.id === character.raceId
        );

        variables["Character_Race"] =
            characterRace?.name ?? "";

        

        //
        // Inventory helpers
        //
        variables["Character_InventoryCount"] =
            character.inventory.length;

        //
        // Target values
        //
        if ("name" in target) {
            variables["Target_Name"] = target.name;
        }

        if ("id" in target) {
            variables["Target_Id"] = target.id;
        }

        //
        // Functions
        //
        variables["HasItem"] = (itemName: string) => {
            return character.inventory.some(inv => {
                const item = context.ruleset.items.find(
                    i => i.id === inv.itemId
                );

                return item?.name === itemName;
            });
        };

        variables["HasItemId"] = (itemId: string) => {
            return character.inventory.some(
                inv => inv.itemId === itemId
            );
        };

        variables["HasSkill"] = (skillName: string) => {
            return character.skillIds.some(skillId => {
                const skill = context.ruleset.skills.find(
                    s => s.id === skillId
                );

                return skill?.name === skillName;
            });
        };

        variables["IsClass"] = (className: string) => {
            return characterClass?.name === className;
        };

        return variables;
    }
}

export default function evaluateConditions( conditions: Condition[], character: Character, target: ConditionTarget, ruleset: RuleSet | null) : Boolean {
    if (ruleset == null) return true;

    var finalResult: Boolean = true;
    
    conditions.forEach(condition => {
        const evaluator = new ConditionEvaluator();
        const result = evaluator.evaluate(
            condition,
            character,
            target,
            { ruleset }
        );
        console.log(condition.forumla);
        console.log(result);
        finalResult = finalResult && result;
    });
    return finalResult;
}