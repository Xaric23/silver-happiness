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
    BEAST_KIN: 'beast-kin',
    DRAGON_BORN: 'dragon-born',
    VAMPIRE: 'vampire',
    ANGEL: 'angel',
    FAE: 'fae',
    UNDEAD: 'undead'
};

export const SubSpecies = {
    // Human subspecies
    human: ['pure-blood', 'corrupted', 'enhanced', 'tribal', 'noble'],
    
    // Elf subspecies
    elf: ['high-elf', 'dark-elf', 'wood-elf', 'blood-elf', 'moon-elf'],
    
    // Demon subspecies
    demon: ['succubus', 'incubus', 'shadow-demon', 'fire-demon', 'ice-demon', 'archdemon'],
    
    // Shapeshifter subspecies
    shapeshifter: ['were-wolf', 'were-cat', 'were-bear', 'were-fox', 'chimera', 'doppelganger'],
    
    // Beast-kin subspecies
    'beast-kin': ['feline', 'canine', 'lupine', 'vulpine', 'serpentine', 'avian', 'equine'],
    
    // Dragon-born subspecies
    'dragon-born': ['red-scale', 'black-scale', 'blue-scale', 'green-scale', 'white-scale', 'gold-scale'],
    
    // Vampire subspecies
    vampire: ['noble-vampire', 'feral-vampire', 'dhampir', 'nosferatu', 'blood-mage'],
    
    // Angel subspecies
    angel: ['seraphim', 'fallen-angel', 'guardian', 'valkyrie', 'nephilim'],
    
    // Fae subspecies
    fae: ['pixie', 'dryad', 'nymph', 'satyr', 'sidhe', 'changeling'],
    
    // Undead subspecies
    undead: ['lich', 'revenant', 'wraith', 'ghoul', 'death-knight', 'banshee']
};

/**
 * Get stat modifiers for a species/subspecies combination
 */
export function getSpeciesModifiers(species, subspecies) {
    const modifiers = {
        // Human modifiers
        'human-pure-blood': { brawn: 0, intrigue: 1, arcane: 0, survival: 1, seduction: 0 },
        'human-corrupted': { brawn: 1, intrigue: 1, arcane: 2, survival: 0, seduction: 1 },
        'human-enhanced': { brawn: 2, intrigue: 0, arcane: 1, survival: 1, seduction: 0 },
        'human-tribal': { brawn: 1, intrigue: 0, arcane: 0, survival: 3, seduction: 0 },
        'human-noble': { brawn: 0, intrigue: 2, arcane: 1, survival: 0, seduction: 1 },
        
        // Elf modifiers
        'elf-high-elf': { brawn: -1, intrigue: 1, arcane: 3, survival: 0, seduction: 1 },
        'elf-dark-elf': { brawn: 1, intrigue: 2, arcane: 2, survival: 0, seduction: 2 },
        'elf-wood-elf': { brawn: 0, intrigue: 1, arcane: 1, survival: 3, seduction: 0 },
        'elf-blood-elf': { brawn: 1, intrigue: 1, arcane: 2, survival: 0, seduction: 2 },
        'elf-moon-elf': { brawn: 0, intrigue: 2, arcane: 2, survival: 1, seduction: 1 },
        
        // Demon modifiers
        'demon-succubus': { brawn: 0, intrigue: 2, arcane: 2, survival: 0, seduction: 4 },
        'demon-incubus': { brawn: 1, intrigue: 2, arcane: 1, survival: 0, seduction: 4 },
        'demon-shadow-demon': { brawn: 0, intrigue: 4, arcane: 2, survival: 1, seduction: 1 },
        'demon-fire-demon': { brawn: 3, intrigue: 0, arcane: 2, survival: 2, seduction: 0 },
        'demon-ice-demon': { brawn: 2, intrigue: 1, arcane: 3, survival: 2, seduction: 0 },
        'demon-archdemon': { brawn: 2, intrigue: 2, arcane: 3, survival: 1, seduction: 2 },
        
        // Shapeshifter modifiers
        'shapeshifter-were-wolf': { brawn: 3, intrigue: 0, arcane: 0, survival: 2, seduction: 0 },
        'shapeshifter-were-cat': { brawn: 1, intrigue: 2, arcane: 0, survival: 2, seduction: 2 },
        'shapeshifter-were-bear': { brawn: 4, intrigue: -1, arcane: 0, survival: 3, seduction: -1 },
        'shapeshifter-were-fox': { brawn: 0, intrigue: 3, arcane: 1, survival: 2, seduction: 2 },
        'shapeshifter-chimera': { brawn: 2, intrigue: 0, arcane: 2, survival: 2, seduction: 0 },
        'shapeshifter-doppelganger': { brawn: 0, intrigue: 4, arcane: 1, survival: 1, seduction: 2 },
        
        // Beast-kin modifiers
        'beast-kin-feline': { brawn: 1, intrigue: 2, arcane: 0, survival: 1, seduction: 2 },
        'beast-kin-canine': { brawn: 2, intrigue: 0, arcane: 0, survival: 2, seduction: 1 },
        'beast-kin-lupine': { brawn: 2, intrigue: 1, arcane: 0, survival: 2, seduction: 0 },
        'beast-kin-vulpine': { brawn: 0, intrigue: 3, arcane: 1, survival: 1, seduction: 2 },
        'beast-kin-serpentine': { brawn: 1, intrigue: 2, arcane: 2, survival: 1, seduction: 2 },
        'beast-kin-avian': { brawn: 0, intrigue: 2, arcane: 1, survival: 2, seduction: 1 },
        'beast-kin-equine': { brawn: 3, intrigue: 0, arcane: 0, survival: 2, seduction: 1 },
        
        // Dragon-born modifiers
        'dragon-born-red-scale': { brawn: 3, intrigue: 0, arcane: 2, survival: 2, seduction: 1 },
        'dragon-born-black-scale': { brawn: 2, intrigue: 2, arcane: 2, survival: 2, seduction: 1 },
        'dragon-born-blue-scale': { brawn: 1, intrigue: 1, arcane: 4, survival: 1, seduction: 1 },
        'dragon-born-green-scale': { brawn: 1, intrigue: 3, arcane: 2, survival: 2, seduction: 0 },
        'dragon-born-white-scale': { brawn: 2, intrigue: 0, arcane: 2, survival: 3, seduction: 0 },
        'dragon-born-gold-scale': { brawn: 2, intrigue: 2, arcane: 2, survival: 1, seduction: 2 },
        
        // Vampire modifiers
        'vampire-noble-vampire': { brawn: 2, intrigue: 3, arcane: 2, survival: 2, seduction: 3 },
        'vampire-feral-vampire': { brawn: 4, intrigue: 0, arcane: 0, survival: 3, seduction: 0 },
        'vampire-dhampir': { brawn: 2, intrigue: 2, arcane: 1, survival: 2, seduction: 2 },
        'vampire-nosferatu': { brawn: 3, intrigue: 2, arcane: 2, survival: 3, seduction: -2 },
        'vampire-blood-mage': { brawn: 1, intrigue: 2, arcane: 4, survival: 1, seduction: 2 },
        
        // Angel modifiers
        'angel-seraphim': { brawn: 2, intrigue: 1, arcane: 4, survival: 1, seduction: 2 },
        'angel-fallen-angel': { brawn: 2, intrigue: 3, arcane: 3, survival: 1, seduction: 3 },
        'angel-guardian': { brawn: 3, intrigue: 1, arcane: 2, survival: 2, seduction: 1 },
        'angel-valkyrie': { brawn: 3, intrigue: 1, arcane: 2, survival: 2, seduction: 2 },
        'angel-nephilim': { brawn: 2, intrigue: 2, arcane: 2, survival: 2, seduction: 2 },
        
        // Fae modifiers
        'fae-pixie': { brawn: -2, intrigue: 3, arcane: 3, survival: 1, seduction: 3 },
        'fae-dryad': { brawn: 0, intrigue: 1, arcane: 3, survival: 3, seduction: 2 },
        'fae-nymph': { brawn: -1, intrigue: 2, arcane: 2, survival: 2, seduction: 4 },
        'fae-satyr': { brawn: 2, intrigue: 1, arcane: 1, survival: 2, seduction: 3 },
        'fae-sidhe': { brawn: 0, intrigue: 3, arcane: 4, survival: 1, seduction: 2 },
        'fae-changeling': { brawn: 0, intrigue: 4, arcane: 2, survival: 2, seduction: 2 },
        
        // Undead modifiers
        'undead-lich': { brawn: -1, intrigue: 2, arcane: 5, survival: 4, seduction: -2 },
        'undead-revenant': { brawn: 4, intrigue: 0, arcane: 1, survival: 4, seduction: -1 },
        'undead-wraith': { brawn: 0, intrigue: 3, arcane: 3, survival: 3, seduction: 0 },
        'undead-ghoul': { brawn: 3, intrigue: 0, arcane: 0, survival: 4, seduction: -2 },
        'undead-death-knight': { brawn: 4, intrigue: 1, arcane: 2, survival: 4, seduction: 0 },
        'undead-banshee': { brawn: 0, intrigue: 2, arcane: 3, survival: 3, seduction: 1 }
    };
    
    const key = `${species}-${subspecies}`;
    return modifiers[key] || { brawn: 0, intrigue: 0, arcane: 0, survival: 0, seduction: 0 };
}

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
    constructor(name, gender, species, subspecies = null) {
        this.id = randomUUID().slice(0, 8);
        this.name = name;
        this.gender = gender;
        this.species = species;
        this.subspecies = subspecies || this._getDefaultSubspecies(species);
        this.stats = new CharacterStats();
        this._applySpeciesModifiers();
        this.transformations = [];
        this.appearance = {
            height: 'average',
            build: 'average',
            hairColor: 'brown',
            eyeColor: 'brown',
            skinTone: 'tan',
            features: this._getSpeciesFeatures()
        };
        this.personality = {
            submissive: 50,    // 0-100 scale
            corruption: 0,     // 0-100 scale
            loyalty: 50        // 0-100 scale
        };
        this.isPlayer = false;
    }

    _getDefaultSubspecies(species) {
        const subspecies = SubSpecies[species];
        if (subspecies && subspecies.length > 0) {
            return subspecies[0];
        }
        return 'common';
    }

    _applySpeciesModifiers() {
        const modifiers = getSpeciesModifiers(this.species, this.subspecies);
        for (const [stat, modifier] of Object.entries(modifiers)) {
            if (this.stats[stat] !== undefined) {
                this.stats[stat] += modifier;
            }
        }
    }

    _getSpeciesFeatures() {
        const features = {
            'human': 'typical human features',
            'elf': 'pointed ears, graceful features',
            'demon': 'horns, tail, otherworldly aura',
            'shapeshifter': 'shifting features, wild eyes',
            'beast-kin': 'animal ears, tail, claws',
            'dragon-born': 'scales, draconic eyes, sharp teeth',
            'vampire': 'pale skin, fangs, hypnotic gaze',
            'angel': 'ethereal beauty, radiant aura',
            'fae': 'delicate features, magical shimmer',
            'undead': 'cold skin, unnatural presence'
        };
        return features[this.species] || 'unique features';
    }

    /**
     * Change subspecies (transformation or evolution)
     */
    changeSubspecies(newSubspecies) {
        const validSubspecies = SubSpecies[this.species];
        if (validSubspecies && validSubspecies.includes(newSubspecies)) {
            // Remove old modifiers
            const oldModifiers = getSpeciesModifiers(this.species, this.subspecies);
            for (const [stat, modifier] of Object.entries(oldModifiers)) {
                if (this.stats[stat] !== undefined) {
                    this.stats[stat] -= modifier;
                }
            }
            
            // Apply new subspecies
            this.subspecies = newSubspecies;
            const newModifiers = getSpeciesModifiers(this.species, this.subspecies);
            for (const [stat, modifier] of Object.entries(newModifiers)) {
                if (this.stats[stat] !== undefined) {
                    this.stats[stat] += modifier;
                }
            }
            
            this.appearance.features = this._getSpeciesFeatures();
            return true;
        }
        return false;
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
            subspecies: this.subspecies,
            stats: this.stats.toJSON(),
            transformations: this.transformations.map(t => t.toJSON()),
            appearance: this.appearance,
            personality: this.personality,
            isPlayer: this.isPlayer
        };
    }

    static fromJSON(data) {
        const char = new Character(data.name, data.gender, data.species, data.subspecies);
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
    constructor(name, gender, species, subspecies, role) {
        super(name, gender, species, subspecies);
        this.role = role; // "slave", "minion", "merchant", "enemy", etc.
        this.relationshipPlayer = 0; // -100 to 100
        this.canRecruit = true;
        this.assignedTask = null;
    }

    /**
     * Generate a random NPC
     */
    static generateRandom() {
        const firstNames = ['Aria', 'Zara', 'Kael', 'Draven', 'Luna', 'Thorn', 'Raven', 'Ash', 'Sylas', 'Nyx', 'Seraphina', 'Morrigan', 'Vesper', 'Corvus', 'Thane'];
        const lastNames = ['Shadowborn', 'Nightwhisper', 'Bloodmoon', 'Darkclaw', 'Stormchaser', 'Voidwalker', 'Ashenfell', 'Grimwood', 'Soulreaver'];
        
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const genders = Object.values(Gender);
        const speciesList = Object.values(Species);
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const species = speciesList[Math.floor(Math.random() * speciesList.length)];
        
        // Pick random subspecies for the species
        const subspeciesList = SubSpecies[species] || ['common'];
        const subspecies = subspeciesList[Math.floor(Math.random() * subspeciesList.length)];
        
        const role = ['slave', 'minion', 'merchant', 'wanderer'][Math.floor(Math.random() * 4)];
        
        const npc = new NPC(name, gender, species, subspecies, role);
        
        // Add some randomization on top of species modifiers
        const statNames = ['brawn', 'intrigue', 'arcane', 'survival', 'seduction'];
        statNames.forEach(stat => {
            const randomBonus = Math.floor(Math.random() * 3) - 1; // -1 to +1
            npc.stats[stat] = Math.max(1, npc.stats[stat] + randomBonus);
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
        const npc = new NPC(data.name, data.gender, data.species, data.subspecies, data.role);
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
