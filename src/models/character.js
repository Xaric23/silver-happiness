/**
 * Character and NPC models with transformation mechanics
 */

import { randomUUID } from 'crypto';

export const Gender = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
};

export const Species = {
    HUMAN: 'human',
    ELF: 'elf',
    DEMON: 'demon',
    SHAPESHIFTER: 'shapeshifter',
    BEAST_KIN: 'beast-kin'
};

/**
 * RPG stats for characters
 */
export class CharacterStats {
    constructor() {
        this.brawn = 5;        // Physical combat
        this.intrigue = 5;     // Social manipulation, espionage
        this.arcane = 5;       // Magic knowledge and power
        this.survival = 5;     // Resourcefulness, endurance
        this.seduction = 5;    // Erotic encounters
    }

    toJSON() {
        return {
            brawn: this.brawn,
            intrigue: this.intrigue,
            arcane: this.arcane,
            survival: this.survival,
            seduction: this.seduction
        };
    }

    static fromJSON(data) {
        const stats = new CharacterStats();
        Object.assign(stats, data);
        return stats;
    }
}

/**
 * Represents a physical, mental, or moral transformation
 */
export class Transformation {
    constructor(name, description, statModifiers) {
        this.name = name;
        this.description = description;
        this.statModifiers = statModifiers; // e.g., {brawn: 2, seduction: -1}
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            statModifiers: this.statModifiers
        };
    }

    static fromJSON(data) {
        return new Transformation(data.name, data.description, data.statModifiers);
    }
}

/**
 * Base character class for player, NPCs, and minions
 */
export class Character {
    constructor(name, gender, species) {
        this.id = randomUUID().slice(0, 8);
        this.name = name;
        this.gender = gender;
        this.species = species;
        this.stats = new CharacterStats();
        this.transformations = [];
        this.appearance = {
            height: 'average',
            build: 'average',
            hairColor: 'brown',
            eyeColor: 'brown'
        };
        this.personality = {
            submissive: 50,    // 0-100 scale
            corruption: 0,     // 0-100 scale
            loyalty: 50        // 0-100 scale
        };
        this.isPlayer = false;
    }

    /**
     * Apply a transformation to the character
     */
    applyTransformation(transformation) {
        this.transformations.push(transformation);
        // Apply stat modifiers
        for (const [stat, modifier] of Object.entries(transformation.statModifiers)) {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += modifier;
            }
        }
    }

    /**
     * Get stat value including all modifiers
     */
    getEffectiveStat(statName) {
        const base = this.stats[statName] || 0;
        // Could add equipment, temporary effects, etc.
        return Math.max(0, base);
    }

    /**
     * Customize character appearance
     */
    customizeAppearance(attribute, value) {
        this.appearance[attribute] = value;
    }

    /**
     * Adjust personality trait (clamped 0-100)
     */
    adjustPersonality(trait, amount) {
        if (this.personality[trait] !== undefined) {
            this.personality[trait] = Math.max(0, Math.min(100, this.personality[trait] + amount));
        }
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            gender: this.gender,
            species: this.species,
            stats: this.stats.toJSON(),
            transformations: this.transformations.map(t => t.toJSON()),
            appearance: this.appearance,
            personality: this.personality,
            isPlayer: this.isPlayer
        };
    }

    static fromJSON(data) {
        const char = new Character(data.name, data.gender, data.species);
        char.id = data.id;
        char.stats = CharacterStats.fromJSON(data.stats);
        char.transformations = data.transformations.map(t => Transformation.fromJSON(t));
        char.appearance = data.appearance;
        char.personality = data.personality;
        char.isPlayer = data.isPlayer || false;
        return char;
    }
}

/**
 * Non-player character with additional AI behavior
 */
export class NPC extends Character {
    constructor(name, gender, species, role) {
        super(name, gender, species);
        this.role = role; // "slave", "minion", "merchant", "enemy", etc.
        this.relationshipPlayer = 0; // -100 to 100
        this.canRecruit = true;
        this.assignedTask = null;
    }

    /**
     * Generate a random NPC
     */
    static generateRandom() {
        const firstNames = ['Aria', 'Zara', 'Kael', 'Draven', 'Luna', 'Thorn', 'Raven', 'Ash', 'Sylas', 'Nyx'];
        const lastNames = ['Shadowborn', 'Nightwhisper', 'Bloodmoon', 'Darkclaw', 'Stormchaser', 'Voidwalker'];
        
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const genders = Object.values(Gender);
        const species = Object.values(Species);
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const speciesType = species[Math.floor(Math.random() * species.length)];
        const role = ['slave', 'minion', 'merchant', 'wanderer'][Math.floor(Math.random() * 4)];
        
        const npc = new NPC(name, gender, speciesType, role);
        
        // Randomize stats
        const statNames = ['brawn', 'intrigue', 'arcane', 'survival', 'seduction'];
        statNames.forEach(stat => {
            npc.stats[stat] = Math.floor(Math.random() * 6) + 3; // 3-8
        });
        
        return npc;
    }

    toJSON() {
        const data = super.toJSON();
        return {
            ...data,
            role: this.role,
            relationshipPlayer: this.relationshipPlayer,
            canRecruit: this.canRecruit,
            assignedTask: this.assignedTask
        };
    }

    static fromJSON(data) {
        const npc = new NPC(data.name, data.gender, data.species, data.role);
        npc.id = data.id;
        npc.stats = CharacterStats.fromJSON(data.stats);
        npc.transformations = data.transformations.map(t => Transformation.fromJSON(t));
        npc.appearance = data.appearance;
        npc.personality = data.personality;
        npc.relationshipPlayer = data.relationshipPlayer || 0;
        npc.canRecruit = data.canRecruit !== undefined ? data.canRecruit : true;
        npc.assignedTask = data.assignedTask || null;
        return npc;
    }
}
