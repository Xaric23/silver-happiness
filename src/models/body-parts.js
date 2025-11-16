/**
 * Body parts and physical transformation system
 */

export const BodyPartType = {
    EARS: 'ears',
    TAIL: 'tail',
    WINGS: 'wings',
    HORNS: 'horns',
    EYES: 'eyes',
    TEETH: 'teeth',
    CLAWS: 'claws',
    SCALES: 'scales',
    FUR: 'fur',
    SKIN: 'skin',
    HAIR: 'hair',
    LIMBS: 'limbs',
    ORGANS: 'organs'
};

/**
 * A physical body part transformation
 */
export class BodyPart {
    constructor(type, name, description, species, subspecies, statModifiers, appearance) {
        this.type = type;
        this.name = name;
        this.description = description;
        this.species = species;
        this.subspecies = subspecies;
        this.statModifiers = statModifiers;
        this.appearance = appearance; // Visual description
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            species: this.species,
            subspecies: this.subspecies,
            statModifiers: this.statModifiers,
            appearance: this.appearance
        };
    }

    static fromJSON(data) {
        return new BodyPart(
            data.type,
            data.name,
            data.description,
            data.species,
            data.subspecies,
            data.statModifiers,
            data.appearance
        );
    }
}

/**
 * Collection of body parts for a character
 */
export class BodyPartCollection {
    constructor() {
        this.parts = {
            [BodyPartType.EARS]: null,
            [BodyPartType.TAIL]: null,
            [BodyPartType.WINGS]: null,
            [BodyPartType.HORNS]: null,
            [BodyPartType.EYES]: null,
            [BodyPartType.TEETH]: null,
            [BodyPartType.CLAWS]: null,
            [BodyPartType.SCALES]: [],
            [BodyPartType.FUR]: [],
            [BodyPartType.SKIN]: null,
            [BodyPartType.HAIR]: null,
            [BodyPartType.LIMBS]: [],
            [BodyPartType.ORGANS]: []
        };
    }

    addPart(bodyPart) {
        const type = bodyPart.type;
        
        // Some parts can have multiples (scales, fur patches, etc.)
        if (Array.isArray(this.parts[type])) {
            this.parts[type].push(bodyPart);
        } else {
            // Single parts replace existing
            this.parts[type] = bodyPart;
        }
    }

    removePart(type, index = null) {
        if (Array.isArray(this.parts[type])) {
            if (index !== null) {
                this.parts[type].splice(index, 1);
            }
        } else {
            this.parts[type] = null;
        }
    }

    getAllParts() {
        const allParts = [];
        for (const [type, value] of Object.entries(this.parts)) {
            if (Array.isArray(value)) {
                allParts.push(...value);
            } else if (value !== null) {
                allParts.push(value);
            }
        }
        return allParts;
    }

    getTotalStatModifiers() {
        const total = {};
        const allParts = this.getAllParts();
        
        for (const part of allParts) {
            for (const [stat, value] of Object.entries(part.statModifiers)) {
                total[stat] = (total[stat] || 0) + value;
            }
        }
        
        return total;
    }

    getDescription() {
        const parts = this.getAllParts();
        if (parts.length === 0) {
            return 'Normal human appearance';
        }

        const descriptions = parts.map(p => p.appearance);
        return descriptions.join(', ');
    }

    toJSON() {
        return this.parts;
    }

    static fromJSON(data) {
        const collection = new BodyPartCollection();
        
        for (const [type, value] of Object.entries(data)) {
            if (Array.isArray(value)) {
                collection.parts[type] = value.map(v => BodyPart.fromJSON(v));
            } else if (value !== null) {
                collection.parts[type] = BodyPart.fromJSON(value);
            }
        }
        
        return collection;
    }
}

/**
 * Library of available body part transformations
 */
export const BodyPartLibrary = {
    // DEMON PARTS
    'demon-horns-curved': new BodyPart(
        BodyPartType.HORNS,
        'Curved Demon Horns',
        'Dark curved horns sprout from your forehead',
        'demon',
        'generic',
        { arcane: 2, seduction: 1, intrigue: 1 },
        'curved black horns'
    ),
    
    'demon-horns-straight': new BodyPart(
        BodyPartType.HORNS,
        'Straight Demon Horns',
        'Sharp straight horns emerge from your skull',
        'demon',
        'generic',
        { arcane: 1, brawn: 1, seduction: 1 },
        'straight crimson horns'
    ),
    
    'demon-tail-spaded': new BodyPart(
        BodyPartType.TAIL,
        'Spaded Demon Tail',
        'A long tail with a spaded tip grows from your spine',
        'demon',
        'succubus',
        { seduction: 2, intrigue: 1 },
        'black tail with heart-shaped tip'
    ),
    
    'demon-tail-barbed': new BodyPart(
        BodyPartType.TAIL,
        'Barbed Demon Tail',
        'A thick tail with barbs grows from your lower back',
        'demon',
        'archdemon',
        { brawn: 2, survival: 1 },
        'scaled tail with dangerous barbs'
    ),
    
    'demon-wings': new BodyPart(
        BodyPartType.WINGS,
        'Demon Wings',
        'Large leathery bat-like wings emerge from your back',
        'demon',
        'generic',
        { survival: 2, arcane: 1 },
        'large leathery wings'
    ),
    
    'demon-eyes': new BodyPart(
        BodyPartType.EYES,
        'Demon Eyes',
        'Your eyes turn crimson with slit pupils',
        'demon',
        'generic',
        { seduction: 1, intrigue: 1 },
        'glowing crimson eyes with slit pupils'
    ),
    
    // BEAST-KIN PARTS
    'cat-ears': new BodyPart(
        BodyPartType.EARS,
        'Cat Ears',
        'Soft feline ears replace your human ones',
        'beast-kin',
        'feline',
        { intrigue: 2, seduction: 1 },
        'soft furry cat ears'
    ),
    
    'cat-tail': new BodyPart(
        BodyPartType.TAIL,
        'Cat Tail',
        'A flexible cat tail grows from your tailbone',
        'beast-kin',
        'feline',
        { intrigue: 1, survival: 1 },
        'long fluffy cat tail'
    ),
    
    'wolf-ears': new BodyPart(
        BodyPartType.EARS,
        'Wolf Ears',
        'Sharp wolf ears emerge atop your head',
        'beast-kin',
        'lupine',
        { survival: 2, brawn: 1 },
        'pointed wolf ears'
    ),
    
    'wolf-tail': new BodyPart(
        BodyPartType.TAIL,
        'Wolf Tail',
        'A bushy wolf tail sprouts from your spine',
        'beast-kin',
        'lupine',
        { survival: 2 },
        'bushy wolf tail'
    ),
    
    'fox-ears': new BodyPart(
        BodyPartType.EARS,
        'Fox Ears',
        'Elegant fox ears replace your human ones',
        'beast-kin',
        'vulpine',
        { intrigue: 2, seduction: 1 },
        'fluffy fox ears'
    ),
    
    'fox-tail': new BodyPart(
        BodyPartType.TAIL,
        'Fox Tail',
        'A luxurious fox tail grows from your lower back',
        'beast-kin',
        'vulpine',
        { intrigue: 1, seduction: 2 },
        'magnificent fluffy fox tail'
    ),
    
    'beast-claws': new BodyPart(
        BodyPartType.CLAWS,
        'Beast Claws',
        'Sharp retractable claws extend from your fingertips',
        'beast-kin',
        'generic',
        { brawn: 2 },
        'sharp retractable claws'
    ),
    
    // DRAGON PARTS
    'dragon-horns': new BodyPart(
        BodyPartType.HORNS,
        'Dragon Horns',
        'Majestic draconic horns crown your head',
        'dragon-born',
        'generic',
        { brawn: 2, arcane: 2 },
        'impressive draconic horns'
    ),
    
    'dragon-tail': new BodyPart(
        BodyPartType.TAIL,
        'Dragon Tail',
        'A powerful scaled tail extends from your spine',
        'dragon-born',
        'generic',
        { brawn: 2, survival: 1 },
        'thick scaled dragon tail'
    ),
    
    'dragon-wings': new BodyPart(
        BodyPartType.WINGS,
        'Dragon Wings',
        'Massive dragon wings sprout from your shoulder blades',
        'dragon-born',
        'generic',
        { brawn: 2, survival: 2, arcane: 1 },
        'magnificent scaled wings'
    ),
    
    'dragon-scales-red': new BodyPart(
        BodyPartType.SCALES,
        'Red Dragon Scales',
        'Crimson scales spread across your skin',
        'dragon-born',
        'red-scale',
        { brawn: 2, survival: 1 },
        'patches of red scales'
    ),
    
    'dragon-scales-black': new BodyPart(
        BodyPartType.SCALES,
        'Black Dragon Scales',
        'Dark scales cover parts of your body',
        'dragon-born',
        'black-scale',
        { intrigue: 1, survival: 2 },
        'patches of black scales'
    ),
    
    'dragon-eyes': new BodyPart(
        BodyPartType.EYES,
        'Dragon Eyes',
        'Your eyes become reptilian with golden pupils',
        'dragon-born',
        'generic',
        { arcane: 1, intrigue: 1 },
        'reptilian eyes with golden pupils'
    ),
    
    // VAMPIRE PARTS
    'vampire-fangs': new BodyPart(
        BodyPartType.TEETH,
        'Vampire Fangs',
        'Sharp fangs emerge from your canines',
        'vampire',
        'generic',
        { brawn: 1, seduction: 1 },
        'prominent fangs'
    ),
    
    'vampire-claws': new BodyPart(
        BodyPartType.CLAWS,
        'Vampire Claws',
        'Elegant but deadly claws replace your nails',
        'vampire',
        'generic',
        { brawn: 1, intrigue: 1 },
        'sharp elongated nails'
    ),
    
    'vampire-eyes': new BodyPart(
        BodyPartType.EYES,
        'Vampire Eyes',
        'Your eyes gain a hypnotic crimson glow',
        'vampire',
        'generic',
        { seduction: 2, intrigue: 1 },
        'mesmerizing red eyes'
    ),
    
    // ANGEL PARTS
    'angel-wings-white': new BodyPart(
        BodyPartType.WINGS,
        'White Angel Wings',
        'Pure white feathered wings emerge from your back',
        'angel',
        'seraphim',
        { arcane: 2, seduction: 2 },
        'pristine white feathered wings'
    ),
    
    'angel-wings-black': new BodyPart(
        BodyPartType.WINGS,
        'Black Angel Wings',
        'Dark feathered wings sprout from your shoulders',
        'angel',
        'fallen-angel',
        { arcane: 2, intrigue: 2 },
        'dark feathered wings'
    ),
    
    'angel-halo': new BodyPart(
        BodyPartType.HORNS, // Uses horns slot
        'Angel Halo',
        'A glowing halo forms above your head',
        'angel',
        'seraphim',
        { arcane: 2, seduction: 1 },
        'radiant halo'
    ),
    
    // FAE PARTS
    'fae-wings': new BodyPart(
        BodyPartType.WINGS,
        'Fae Wings',
        'Delicate translucent wings like a dragonfly appear',
        'fae',
        'pixie',
        { arcane: 2, seduction: 1 },
        'shimmering translucent wings'
    ),
    
    'fae-ears': new BodyPart(
        BodyPartType.EARS,
        'Fae Ears',
        'Your ears become pointed and delicate',
        'fae',
        'generic',
        { arcane: 1, seduction: 1 },
        'pointed fae ears'
    ),
    
    // ELF PARTS
    'elf-ears': new BodyPart(
        BodyPartType.EARS,
        'Elf Ears',
        'Your ears elongate into graceful points',
        'elf',
        'generic',
        { arcane: 1, intrigue: 1 },
        'elegant pointed ears'
    ),
    
    // SHAPESHIFTER PARTS
    'werewolf-claws': new BodyPart(
        BodyPartType.CLAWS,
        'Werewolf Claws',
        'Massive claws grow from your fingers',
        'shapeshifter',
        'were-wolf',
        { brawn: 3 },
        'massive wolf claws'
    ),
    
    'werewolf-fangs': new BodyPart(
        BodyPartType.TEETH,
        'Werewolf Fangs',
        'Your teeth sharpen into predatory fangs',
        'shapeshifter',
        'were-wolf',
        { brawn: 2 },
        'sharp predatory fangs'
    ),
    
    'werewolf-fur': new BodyPart(
        BodyPartType.FUR,
        'Werewolf Fur',
        'Thick fur spreads across your body',
        'shapeshifter',
        'were-wolf',
        { survival: 2, brawn: 1 },
        'thick wolf-like fur'
    ),
    
    // UNDEAD PARTS
    'undead-skin': new BodyPart(
        BodyPartType.SKIN,
        'Pale Undead Skin',
        'Your skin becomes deathly pale and cold',
        'undead',
        'generic',
        { survival: 2, seduction: -1 },
        'pale corpse-like skin'
    ),
    
    'lich-eyes': new BodyPart(
        BodyPartType.EYES,
        'Lich Eyes',
        'Your eyes glow with necrotic energy',
        'undead',
        'lich',
        { arcane: 3 },
        'glowing green eyes'
    ),
    
    // SNAKE PARTS
    'snake-tongue': new BodyPart(
        BodyPartType.TEETH, // Uses teeth slot
        'Forked Tongue',
        'Your tongue splits into a forked serpent tongue',
        'beast-kin',
        'serpentine',
        { intrigue: 1, seduction: 1 },
        'forked serpent tongue'
    ),
    
    'snake-scales': new BodyPart(
        BodyPartType.SCALES,
        'Snake Scales',
        'Smooth scales pattern your skin',
        'beast-kin',
        'serpentine',
        { survival: 1, seduction: 1 },
        'smooth serpentine scales'
    ),
    
    'snake-eyes': new BodyPart(
        BodyPartType.EYES,
        'Snake Eyes',
        'Your eyes become reptilian with slit pupils',
        'beast-kin',
        'serpentine',
        { intrigue: 1 },
        'reptilian eyes with vertical slits'
    ),
    
    // BIRD PARTS
    'bird-wings': new BodyPart(
        BodyPartType.WINGS,
        'Bird Wings',
        'Feathered wings emerge from your back',
        'beast-kin',
        'avian',
        { survival: 2 },
        'feathered bird wings'
    )
};

/**
 * Get random body parts for a species/subspecies combination
 */
export function getBodyPartsForSpecies(species, subspecies) {
    const parts = [];
    
    // Filter library for matching species
    for (const [key, bodyPart] of Object.entries(BodyPartLibrary)) {
        if (bodyPart.species === species) {
            // Match subspecies or generic
            if (bodyPart.subspecies === subspecies || bodyPart.subspecies === 'generic') {
                parts.push(bodyPart);
            }
        }
    }
    
    return parts;
}

/**
 * Generate random body part transformation for a species
 */
export function generateRandomBodyPart(species, subspecies) {
    const availableParts = getBodyPartsForSpecies(species, subspecies);
    
    if (availableParts.length === 0) {
        return null;
    }
    
    return availableParts[Math.floor(Math.random() * availableParts.length)];
}
