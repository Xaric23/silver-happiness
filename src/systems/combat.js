/**
 * Turn-based combat system
 */

export class CombatAction {
    static ATTACK = 'attack';
    static DEFEND = 'defend';
    static SPECIAL = 'special';
    static SEDUCE = 'seduce';
}

/**
 * Combat encounter
 */
export class Combat {
    constructor(playerParty, enemyParty, onDefeatTransformations = []) {
        this.playerParty = playerParty; // Array of characters
        this.enemyParty = enemyParty;
        this.turn = 0;
        this.combatLog = [];
        this.isActive = true;
        this.winner = null;
        this.onDefeatTransformations = onDefeatTransformations; // Transformations applied if player loses
        this.capturedCharacters = []; // Characters captured by enemies
    }

    /**
     * Execute a turn of combat
     */
    executeTurn(playerActions) {
        this.turn++;
        this.combatLog.push(`\n--- Turn ${this.turn} ---`);

        // Player actions
        for (let i = 0; i < this.playerParty.length; i++) {
            const character = this.playerParty[i];
            const action = playerActions[i] || CombatAction.DEFEND;
            const target = this.enemyParty[Math.floor(Math.random() * this.enemyParty.length)];
            
            if (target) {
                this._executeAction(character, target, action, true);
            }
        }

        // Check if enemies defeated
        if (this.enemyParty.every(e => e.defeated)) {
            this.isActive = false;
            this.winner = 'player';
            this.combatLog.push('\nVictory! All enemies have been defeated!');
            return { finished: true, winner: 'player' };
        }

        // Enemy actions (simple AI)
        for (const enemy of this.enemyParty) {
            if (!enemy.defeated) {
                const action = Math.random() > 0.5 ? CombatAction.ATTACK : CombatAction.DEFEND;
                const target = this.playerParty[Math.floor(Math.random() * this.playerParty.length)];
                
                if (target && !target.defeated) {
                    this._executeAction(enemy, target, action, false);
                }
            }
        }

        // Check if player defeated
        if (this.playerParty.every(c => c.defeated)) {
            this.isActive = false;
            this.winner = 'enemy';
            this.combatLog.push('\nDefeat! Your party has been overwhelmed!');
            
            // Apply defeat consequences
            const consequences = this._applyDefeatConsequences();
            
            return { 
                finished: true, 
                winner: 'enemy',
                consequences: consequences
            };
        }

        return { finished: false };
    }

    /**
     * Apply consequences when player is defeated
     */
    _applyDefeatConsequences() {
        const consequences = {
            transformations: [],
            captures: [],
            corruptions: []
        };

        // Apply transformations to defeated characters
        for (const character of this.playerParty) {
            if (character.defeated && character.isPlayer) {
                // Player character gets transformed by enemies
                const transformation = this._generateDefeatTransformation();
                if (transformation) {
                    consequences.transformations.push({
                        character: character,
                        transformation: transformation,
                        appliedBy: this.enemyParty[0] // The enemy who applied it
                    });
                    this.combatLog.push(`\n${character.name} is transformed by the enemy forces!`);
                }
            } else if (character.defeated) {
                // NPCs might be captured
                if (Math.random() > 0.5) {
                    this.capturedCharacters.push(character);
                    consequences.captures.push(character);
                    this.combatLog.push(`\n${character.name} has been captured!`);
                }
            }

            // Increase corruption from defeat
            if (character.personality && character.personality.corruption !== undefined) {
                const corruptionGain = Math.floor(Math.random() * 10) + 5;
                character.personality.corruption = Math.min(100, character.personality.corruption + corruptionGain);
                consequences.corruptions.push({
                    character: character,
                    amount: corruptionGain
                });
                this.combatLog.push(`\n${character.name} gains ${corruptionGain} corruption from the defeat.`);
            }
        }

        return consequences;
    }

    /**
     * Generate a transformation based on the enemies
     */
    _generateDefeatTransformation() {
        // If specific transformations were set, use one randomly
        if (this.onDefeatTransformations.length > 0) {
            return this.onDefeatTransformations[Math.floor(Math.random() * this.onDefeatTransformations.length)];
        }

        // Otherwise try to generate a body part transformation
        const enemy = this.enemyParty[0];
        
        // Try to import body parts (dynamic import to avoid circular dependency)
        try {
            const { generateRandomBodyPart } = this._getBodyPartGenerator();
            const bodyPart = generateRandomBodyPart(enemy.species, enemy.subspecies);
            if (bodyPart) {
                return { isBodyPart: true, data: bodyPart };
            }
        } catch (e) {
            // Fall back to old system
        }

        // Fallback to old transformation system
        const transformations = this._getSpeciesTransformations(enemy.species, enemy.subspecies);
        
        if (transformations.length > 0) {
            return transformations[Math.floor(Math.random() * transformations.length)];
        }

        return null;
    }

    /**
     * Helper to get body part generator (avoids circular dependency)
     */
    _getBodyPartGenerator() {
        // In actual implementation, this would import from body-parts.js
        return {
            generateRandomBodyPart: () => null
        };
    }

    /**
     * Get transformations based on enemy species
     */
    _getSpeciesTransformations(species, subspecies) {
        const { Transformation } = this._getTransformationClass();
        const transformations = [];

        // Species-specific transformations
        const speciesTransforms = {
            'demon': [
                new Transformation(
                    'Demonic Corruption',
                    'Dark energy corrupts your form, granting demonic features.',
                    { brawn: 2, arcane: 2, seduction: 1 }
                ),
                new Transformation(
                    'Succubus Curse',
                    'You are cursed with insatiable desires.',
                    { seduction: 3, intrigue: 1, brawn: -1 }
                )
            ],
            'vampire': [
                new Transformation(
                    'Vampiric Thrall',
                    'You become a thrall to vampiric powers.',
                    { brawn: 1, survival: 2, seduction: 1 }
                ),
                new Transformation(
                    'Blood Addiction',
                    'A craving for blood overwhelms you.',
                    { brawn: 2, survival: 1, arcane: 1 }
                )
            ],
            'shapeshifter': [
                new Transformation(
                    'Forced Shift',
                    'Your form is forcibly altered to beast-like features.',
                    { brawn: 2, survival: 2, intrigue: -1 }
                ),
                new Transformation(
                    'Feral Curse',
                    'Wild instincts begin to dominate your mind.',
                    { brawn: 3, survival: 1, arcane: -1 }
                )
            ],
            'fae': [
                new Transformation(
                    'Fae Enchantment',
                    'Fae magic weaves into your being.',
                    { arcane: 2, seduction: 2, intrigue: 1 }
                ),
                new Transformation(
                    'Glamour Binding',
                    'You are bound by fae glamour.',
                    { seduction: 3, intrigue: 2 }
                )
            ],
            'undead': [
                new Transformation(
                    'Undeath Touch',
                    'The touch of undeath leaves its mark.',
                    { survival: 3, arcane: 2, seduction: -2 }
                ),
                new Transformation(
                    'Necrotic Curse',
                    'Necrotic energy courses through you.',
                    { arcane: 3, survival: 2, brawn: -1 }
                )
            ],
            'dragon-born': [
                new Transformation(
                    'Draconic Binding',
                    'Dragon magic alters your essence.',
                    { brawn: 2, arcane: 2, survival: 1 }
                )
            ],
            'elf': [
                new Transformation(
                    'Elven Enchantment',
                    'Elven magic subtly changes you.',
                    { arcane: 2, intrigue: 1, seduction: 1 }
                )
            ],
            'angel': [
                new Transformation(
                    'Divine Binding',
                    'Divine power marks your soul.',
                    { arcane: 2, seduction: 1 }
                )
            ],
            'beast-kin': [
                new Transformation(
                    'Bestial Influence',
                    'Animal instincts become stronger.',
                    { brawn: 2, survival: 2 }
                )
            ]
        };

        const speciesArray = speciesTransforms[species] || [];
        transformations.push(...speciesArray);

        // Add a generic transformation as fallback
        if (transformations.length === 0) {
            transformations.push(
                new Transformation(
                    'Defeated Mark',
                    'The defeat leaves a lasting mark on your body and soul.',
                    { corruption: 5 }
                )
            );
        }

        return transformations;
    }

    /**
     * Helper to get Transformation class (avoids circular dependency)
     */
    _getTransformationClass() {
        // In actual implementation, this would import from character.js
        // For now, return a basic implementation
        class Transformation {
            constructor(name, description, statModifiers) {
                this.name = name;
                this.description = description;
                this.statModifiers = statModifiers;
            }
        }
        return { Transformation };
    }

    _executeAction(attacker, target, action, isPlayer) {
        const attackerName = attacker.name;
        const targetName = target.name;

        switch (action) {
            case CombatAction.ATTACK:
                const damage = Math.floor(attacker.getEffectiveStat('brawn') * (Math.random() * 0.5 + 0.75));
                target.currentHealth = (target.currentHealth || 100) - damage;
                this.combatLog.push(`${attackerName} attacks ${targetName} for ${damage} damage!`);
                
                if (target.currentHealth <= 0) {
                    target.defeated = true;
                    target.currentHealth = 0;
                    this.combatLog.push(`${targetName} has been defeated!`);
                }
                break;

            case CombatAction.DEFEND:
                this.combatLog.push(`${attackerName} takes a defensive stance.`);
                break;

            case CombatAction.SEDUCE:
                const seductionPower = attacker.getEffectiveStat('seduction');
                const success = Math.random() * 10 + seductionPower > 8;
                
                if (success) {
                    this.combatLog.push(`${attackerName} seduces ${targetName}, reducing their will to fight!`);
                    target.moraleDamage = (target.moraleDamage || 0) + 20;
                    
                    if (target.moraleDamage >= 50) {
                        target.defeated = true;
                        this.combatLog.push(`${targetName} surrenders, overwhelmed by desire!`);
                    }
                } else {
                    this.combatLog.push(`${attackerName} attempts to seduce ${targetName}, but fails.`);
                }
                break;

            case CombatAction.SPECIAL:
                const arcanePower = attacker.getEffectiveStat('arcane');
                const spellDamage = Math.floor(arcanePower * 1.5);
                target.currentHealth = (target.currentHealth || 100) - spellDamage;
                this.combatLog.push(`${attackerName} casts a spell at ${targetName} for ${spellDamage} damage!`);
                
                if (target.currentHealth <= 0) {
                    target.defeated = true;
                    target.currentHealth = 0;
                    this.combatLog.push(`${targetName} has been defeated!`);
                }
                break;
        }
    }

    getCombatLog() {
        return this.combatLog.join('\n');
    }

    getStatus() {
        return {
            turn: this.turn,
            playerParty: this.playerParty.map(c => ({
                name: c.name,
                health: c.currentHealth || 100,
                defeated: c.defeated || false
            })),
            enemyParty: this.enemyParty.map(e => ({
                name: e.name,
                health: e.currentHealth || 100,
                defeated: e.defeated || false
            })),
            isActive: this.isActive,
            winner: this.winner
        };
    }
}
