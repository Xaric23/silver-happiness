/**
 * Encounter system for NPC interactions and transformation events
 */

import { Transformation } from '../models/character.js';

export const EncounterType = {
    COMBAT: 'combat',
    SOCIAL: 'social',
    MAGICAL: 'magical',
    TRAP: 'trap',
    AMBUSH: 'ambush'
};

export const EncounterOutcome = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    ESCAPE: 'escape',
    SURRENDER: 'surrender'
};

/**
 * Encounter with potential transformation consequences
 */
export class Encounter {
    constructor(type, npc, difficulty) {
        this.type = type;
        this.npc = npc; // The NPC involved
        this.difficulty = difficulty; // 1-10 scale
        this.outcome = null;
        this.transformationRisk = this._calculateTransformationRisk();
    }

    _calculateTransformationRisk() {
        // Higher difficulty = higher transformation risk on failure
        const baseRisk = this.difficulty * 10; // 10-100%
        
        // Some species are more likely to transform others
        const speciesMultiplier = {
            'demon': 1.5,
            'vampire': 1.3,
            'fae': 1.4,
            'shapeshifter': 1.6,
            'undead': 1.2
        };
        
        const multiplier = speciesMultiplier[this.npc.species] || 1.0;
        return Math.min(100, baseRisk * multiplier);
    }

    /**
     * Resolve the encounter
     */
    resolve(playerCharacter, playerChoice) {
        const roll = Math.random() * 100;
        const requiredStat = this._getRequiredStat();
        const playerStatValue = playerCharacter.getEffectiveStat(requiredStat);
        const npcStatValue = this.npc.getEffectiveStat(requiredStat);
        
        // Calculate success chance
        const statDifference = playerStatValue - npcStatValue;
        let successChance = 50 + (statDifference * 5); // Base 50% ±5% per stat point difference
        
        // Adjust for difficulty
        successChance -= (this.difficulty * 5);
        
        // Clamp between 5% and 95%
        successChance = Math.max(5, Math.min(95, successChance));
        
        // Determine outcome
        if (roll < successChance) {
            this.outcome = EncounterOutcome.SUCCESS;
            return this._handleSuccess(playerCharacter);
        } else {
            this.outcome = EncounterOutcome.FAILURE;
            return this._handleFailure(playerCharacter);
        }
    }

    _getRequiredStat() {
        const statMap = {
            [EncounterType.COMBAT]: 'brawn',
            [EncounterType.SOCIAL]: 'seduction',
            [EncounterType.MAGICAL]: 'arcane',
            [EncounterType.TRAP]: 'survival',
            [EncounterType.AMBUSH]: 'intrigue'
        };
        return statMap[this.type] || 'brawn';
    }

    _handleSuccess(playerCharacter) {
        const result = {
            success: true,
            message: this._getSuccessMessage(),
            rewards: this._generateRewards(),
            transformation: null,
            relationshipChange: Math.floor(Math.random() * 10) + 5 // +5 to +15
        };

        // Small chance player transforms NPC on success instead
        if (Math.random() < 0.1) {
            result.npcTransformed = true;
            result.npcTransformation = this._generatePlayerDominantTransformation();
        }

        return result;
    }

    _handleFailure(playerCharacter) {
        const result = {
            success: false,
            message: this._getFailureMessage(),
            penalties: this._generatePenalties(),
            transformation: null,
            relationshipChange: -(Math.floor(Math.random() * 10) + 5), // -5 to -15
            corruptionGain: Math.floor(Math.random() * 15) + 5 // +5 to +20 corruption
        };

        // Apply corruption
        playerCharacter.adjustPersonality('corruption', result.corruptionGain);

        // Check if transformation occurs
        const transformRoll = Math.random() * 100;
        if (transformRoll < this.transformationRisk) {
            result.transformed = true;
            result.transformation = this._generateTransformation();
            
            // Apply the transformation
            playerCharacter.applyTransformation(result.transformation);
            
            result.message += `\n\n${this.npc.name} transforms you! ${result.transformation.description}`;
        }

        // Adjust personality based on encounter type
        this._adjustPersonalityOnDefeat(playerCharacter);

        return result;
    }

    _generateTransformation() {
        // Generate transformation based on NPC species and subspecies
        const transformations = {
            'demon-succubus': new Transformation(
                'Succubus Touch',
                'The succubus\'s touch awakens forbidden desires within you, your form becoming more alluring and seductive.',
                { seduction: 3, intrigue: 1, arcane: 1 }
            ),
            'demon-incubus': new Transformation(
                'Incubus Mark',
                'Marked by an incubus, your charisma becomes supernaturally compelling.',
                { seduction: 3, brawn: 1, intrigue: 1 }
            ),
            'vampire-noble-vampire': new Transformation(
                'Vampiric Bond',
                'A vampiric bond forms, granting you enhanced senses and a thirst for blood.',
                { brawn: 2, survival: 2, intrigue: 1 }
            ),
            'shapeshifter-were-wolf': new Transformation(
                'Lycanthropic Curse',
                'The curse of lycanthropy takes hold, giving you bestial strength and instincts.',
                { brawn: 3, survival: 2, intrigue: -1 }
            ),
            'fae-nymph': new Transformation(
                'Fae Binding',
                'Bound by fae magic, your beauty becomes otherworldly but you feel tethered to nature.',
                { seduction: 3, arcane: 2, brawn: -1 }
            ),
            'undead-lich': new Transformation(
                'Necrotic Touch',
                'The lich\'s touch spreads undeath through your body, granting dark power.',
                { arcane: 4, survival: 2, seduction: -2 }
            ),
            'dragon-born-red-scale': new Transformation(
                'Draconic Essence',
                'Dragon essence infuses your being with scales and fire.',
                { brawn: 3, arcane: 2, survival: 1 }
            ),
            'elf-dark-elf': new Transformation(
                'Shadow Elf Curse',
                'Dark elf magic corrupts your form, pulling you toward the shadows.',
                { intrigue: 2, arcane: 2, seduction: 1 }
            ),
            'beast-kin-feline': new Transformation(
                'Feline Features',
                'You gain cat-like features: ears, tail, and enhanced agility.',
                { intrigue: 2, survival: 1, seduction: 2 }
            ),
            'angel-fallen-angel': new Transformation(
                'Fallen Grace',
                'Divine power corrupted into something darker marks your soul.',
                { arcane: 2, intrigue: 2, seduction: 2 }
            )
        };

        const key = `${this.npc.species}-${this.npc.subspecies}`;
        let transformation = transformations[key];

        // Fallback generic transformation
        if (!transformation) {
            transformation = new Transformation(
                `${this.npc.subspecies} Influence`,
                `The ${this.npc.subspecies} ${this.npc.species} leaves a lasting mark on your body and mind.`,
                this._getSpeciesGenericModifiers()
            );
        }

        return transformation;
    }

    _getSpeciesGenericModifiers() {
        const modifiers = {
            'demon': { seduction: 2, arcane: 1 },
            'vampire': { brawn: 1, survival: 2 },
            'shapeshifter': { brawn: 2, survival: 1 },
            'fae': { arcane: 2, seduction: 1 },
            'undead': { arcane: 2, survival: 2 },
            'dragon-born': { brawn: 2, arcane: 1 },
            'elf': { arcane: 1, intrigue: 1 },
            'angel': { arcane: 2 },
            'beast-kin': { brawn: 1, survival: 1 },
            'human': { intrigue: 1 }
        };
        return modifiers[this.npc.species] || { intrigue: 1 };
    }

    _generatePlayerDominantTransformation() {
        return new Transformation(
            'Subjugation Mark',
            `You dominate ${this.npc.name}, leaving them forever changed by your power.`,
            { intrigue: -2, loyalty: 50 } // They become more loyal but lose independence
        );
    }

    _adjustPersonalityOnDefeat(playerCharacter) {
        // Different encounter types affect personality differently
        switch (this.type) {
            case EncounterType.SOCIAL:
                playerCharacter.adjustPersonality('submissive', 10);
                break;
            case EncounterType.COMBAT:
                playerCharacter.adjustPersonality('submissive', 5);
                break;
            case EncounterType.MAGICAL:
                playerCharacter.adjustPersonality('corruption', 10);
                break;
        }
    }

    _getSuccessMessage() {
        const messages = {
            [EncounterType.COMBAT]: [
                `You defeat ${this.npc.name} in combat!`,
                `${this.npc.name} falls before your might!`,
                `Victory! ${this.npc.name} is no match for you!`
            ],
            [EncounterType.SOCIAL]: [
                `You successfully seduce ${this.npc.name}.`,
                `${this.npc.name} is utterly captivated by you.`,
                `Your charm overwhelms ${this.npc.name}.`
            ],
            [EncounterType.MAGICAL]: [
                `Your magic overpowers ${this.npc.name}!`,
                `${this.npc.name} cannot resist your arcane might.`,
                `Your spells dominate ${this.npc.name}.`
            ],
            [EncounterType.TRAP]: [
                `You cleverly avoid ${this.npc.name}'s trap!`,
                `You outmaneuver ${this.npc.name}.`
            ],
            [EncounterType.AMBUSH]: [
                `You turn the tables on ${this.npc.name}!`,
                `${this.npc.name}'s ambush fails!`
            ]
        };
        
        const typeMessages = messages[this.type] || [`You overcome ${this.npc.name}!`];
        return typeMessages[Math.floor(Math.random() * typeMessages.length)];
    }

    _getFailureMessage() {
        const messages = {
            [EncounterType.COMBAT]: [
                `${this.npc.name} defeats you in combat...`,
                `You fall before ${this.npc.name}'s power...`,
                `${this.npc.name} overpowers you!`
            ],
            [EncounterType.SOCIAL]: [
                `${this.npc.name} seduces you instead...`,
                `You find yourself helpless before ${this.npc.name}'s charms...`,
                `${this.npc.name}'s allure is too much to resist...`
            ],
            [EncounterType.MAGICAL]: [
                `${this.npc.name}'s magic overwhelms you!`,
                `You cannot resist ${this.npc.name}'s spell...`,
                `${this.npc.name}'s power is too great!`
            ],
            [EncounterType.TRAP]: [
                `You fall into ${this.npc.name}'s trap!`,
                `${this.npc.name} ensnares you!`
            ],
            [EncounterType.AMBUSH]: [
                `${this.npc.name}'s ambush succeeds!`,
                `You are caught off-guard by ${this.npc.name}!`
            ]
        };
        
        const typeMessages = messages[this.type] || [`${this.npc.name} defeats you...`];
        return typeMessages[Math.floor(Math.random() * typeMessages.length)];
    }

    _generateRewards() {
        return {
            gold: Math.floor(Math.random() * 50) + 25,
            reputation: Math.floor(Math.random() * 5) + 3,
            experience: this.difficulty * 10
        };
    }

    _generatePenalties() {
        return {
            gold: Math.floor(Math.random() * 30) + 10,
            reputation: Math.floor(Math.random() * 3) + 1,
            morale: Math.floor(Math.random() * 10) + 5
        };
    }
}

/**
 * Manage random encounters
 */
export class EncounterManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.activeEncounters = [];
    }

    /**
     * Generate a random encounter
     */
    generateEncounter() {
        // Pick a random NPC
        const availableNPCs = this.gameEngine.npcs.filter(npc => !npc.assignedTask);
        if (availableNPCs.length === 0) {
            return null;
        }

        const npc = availableNPCs[Math.floor(Math.random() * availableNPCs.length)];
        
        // Pick encounter type based on NPC stats
        const type = this._selectEncounterType(npc);
        
        // Set difficulty based on day and NPC strength
        const difficulty = Math.min(10, Math.floor(this.gameEngine.currentDay / 5) + 3);
        
        const encounter = new Encounter(type, npc, difficulty);
        this.activeEncounters.push(encounter);
        
        return encounter;
    }

    _selectEncounterType(npc) {
        const highestStat = this._getHighestStat(npc);
        
        const typeMap = {
            'brawn': EncounterType.COMBAT,
            'seduction': EncounterType.SOCIAL,
            'arcane': EncounterType.MAGICAL,
            'intrigue': EncounterType.AMBUSH,
            'survival': EncounterType.TRAP
        };
        
        return typeMap[highestStat] || EncounterType.COMBAT;
    }

    _getHighestStat(npc) {
        const stats = {
            brawn: npc.stats.brawn,
            intrigue: npc.stats.intrigue,
            arcane: npc.stats.arcane,
            survival: npc.stats.survival,
            seduction: npc.stats.seduction
        };
        
        return Object.entries(stats).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    }

    /**
     * Check for random encounters (called each day)
     */
    checkForEncounter() {
        // 20% chance of encounter per day
        if (Math.random() < 0.2) {
            return this.generateEncounter();
        }
        return null;
    }
}
