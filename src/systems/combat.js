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
    constructor(playerParty, enemyParty) {
        this.playerParty = playerParty; // Array of characters
        this.enemyParty = enemyParty;
        this.turn = 0;
        this.combatLog = [];
        this.isActive = true;
        this.winner = null;
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
            return { finished: true, winner: 'enemy' };
        }

        return { finished: false };
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
