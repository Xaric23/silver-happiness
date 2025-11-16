/**
 * Game Engine - Core game state and logic
 */

import fs from 'fs/promises';
import path from 'path';
import { Character } from './models/character.js';
import { NPC } from './models/character.js';
import { Faction } from './models/faction.js';
import { QuestManager } from './models/quest.js';
import { EncounterManager } from './systems/encounter.js';
import { StoryManager } from './systems/story.js';

export const GameMode = {
    SANDBOX: 'sandbox',
    CAMPAIGN: 'campaign'
};

/**
 * Main game engine that manages game state
 */
export class GameEngine {
    constructor() {
        this.gameMode = null;
        this.player = null;
        this.faction = null;
        this.npcs = [];
        this.questManager = new QuestManager();
        this.encounterManager = new EncounterManager(this);
        this.storyManager = null; // Initialized only for campaign mode
        this.currentDay = 1;
        this.isRunning = false;
    }

    /**
     * Start a new game
     */
    newGame(mode, playerName, factionName, gender = 'male', species = 'human', subspecies = null) {
        this.gameMode = mode;
        
        // Create player character
        this.player = new Character(playerName, gender, species, subspecies);
        this.player.isPlayer = true;
        
        // Boost player stats slightly (on top of species modifiers)
        this.player.stats.brawn += 2;
        this.player.stats.intrigue += 2;
        this.player.stats.arcane += 1;
        this.player.stats.survival += 1;
        this.player.stats.seduction += 1;
        
        // Create faction
        this.faction = new Faction(factionName);
        
        // Generate initial NPCs
        for (let i = 0; i < 5; i++) {
            this.npcs.push(NPC.generateRandom());
        }
        
        // Generate initial quests
        for (let i = 0; i < 3; i++) {
            this.questManager.generateRandomQuest();
        }
        
        // Initialize story mode if campaign
        if (mode === GameMode.CAMPAIGN) {
            this.storyManager = new StoryManager(this);
            this.storyManager.initializeStory();
        }
        
        this.currentDay = 1;
        this.isRunning = true;
        
        return {
            player: this.player,
            faction: this.faction,
            npcs: this.npcs,
            storyInitialized: mode === GameMode.CAMPAIGN
        };
    }

    /**
     * Advance to next day/turn
     */
    advanceDay() {
        this.currentDay++;
        
        // Process daily income
        const bonuses = this.faction.getTotalBonuses();
        const goldIncome = bonuses.goldIncome || 0;
        this.faction.addGold(goldIncome);
        
        // Process quests
        const completedQuests = this.questManager.processAllQuests();
        
        // Apply quest rewards
        for (const result of completedQuests) {
            if (result.rewards.gold) {
                this.faction.addGold(result.rewards.gold);
            }
            if (result.rewards.reputation) {
                this.faction.reputation = Math.min(100, this.faction.reputation + result.rewards.reputation);
            }
        }
        
        // Chance to generate new NPCs
        if (Math.random() > 0.7) {
            this.npcs.push(NPC.generateRandom());
        }
        
        // Chance to generate new quests
        if (Math.random() > 0.5) {
            this.questManager.generateRandomQuest();
        }
        
        // Update morale based on conditions
        this._updateMorale();
        
        // Update story progress if campaign mode
        let storyProgress = null;
        let storyEvent = null;
        if (this.gameMode === GameMode.CAMPAIGN && this.storyManager) {
            const updated = this.storyManager.updateObjectives(this.getGameState());
            if (updated) {
                storyProgress = this.storyManager.getProgressSummary();
            }
            
            // Check for story events
            storyEvent = this.storyManager.getNextEvent();
        }
        
        return {
            day: this.currentDay,
            completedQuests,
            goldIncome,
            events: this._generateRandomEvents(),
            storyProgress,
            storyEvent
        };
    }

    _updateMorale() {
        const bonuses = this.faction.getTotalBonuses();
        const moraleMod = bonuses.morale || 0;
        
        // Morale naturally drifts toward 50 + bonuses
        const target = 50 + moraleMod;
        if (this.faction.morale < target) {
            this.faction.morale = Math.min(100, this.faction.morale + 1);
        } else if (this.faction.morale > target) {
            this.faction.morale = Math.max(0, this.faction.morale - 1);
        }
    }

    _generateRandomEvents() {
        const events = [];
        
        // Check for encounters
        const encounter = this.encounterManager.checkForEncounter();
        if (encounter) {
            events.push({
                type: 'encounter',
                encounter: encounter,
                message: `You have an encounter with ${encounter.npc.name}, a ${encounter.npc.subspecies} ${encounter.npc.species}!`
            });
        }
        
        // Random events based on game state
        if (Math.random() > 0.8) {
            const eventTypes = [
                'A mysterious traveler arrives at your gates.',
                'Rumors spread of ancient treasure in the ruins.',
                'A rival faction sends a threatening message.',
                'The local merchants offer a trade deal.',
                'Strange magical phenomena occur in the arcane lab.'
            ];
            events.push({
                type: 'story',
                message: eventTypes[Math.floor(Math.random() * eventTypes.length)]
            });
        }
        
        return events;
    }

    /**
     * Recruit an NPC
     */
    recruitNPC(npcId) {
        const npc = this.npcs.find(n => n.id === npcId);
        if (npc && npc.canRecruit) {
            npc.role = 'minion';
            npc.relationshipPlayer = 50;
            return { success: true, npc };
        }
        return { success: false };
    }

    /**
     * Assign NPC to quest
     */
    assignNPCToQuest(npcId, questId) {
        const npc = this.npcs.find(n => n.id === npcId);
        const quest = this.questManager.quests.find(q => q.id === questId);
        
        if (npc && quest && quest.canNPCComplete(npc)) {
            quest.assignNPC(npc);
            return { success: true };
        }
        
        return { success: false, reason: 'NPC does not meet requirements' };
    }

    /**
     * Save game to file
     */
    async saveGame(filename) {
        const saveData = {
            gameMode: this.gameMode,
            player: this.player.toJSON(),
            faction: this.faction.toJSON(),
            npcs: this.npcs.map(n => n.toJSON()),
            questManager: this.questManager.toJSON(),
            currentDay: this.currentDay,
            isRunning: this.isRunning
        };
        
        // Add story manager data if in campaign mode
        if (this.gameMode === GameMode.CAMPAIGN && this.storyManager) {
            saveData.storyManager = this.storyManager.toJSON();
        }
        
        const savePath = path.join(process.cwd(), 'saves', `${filename}.json`);
        await fs.writeFile(savePath, JSON.stringify(saveData, null, 2));
        
        return savePath;
    }

    /**
     * Load game from file
     */
    async loadGame(filename) {
        const savePath = path.join(process.cwd(), 'saves', `${filename}.json`);
        const data = await fs.readFile(savePath, 'utf-8');
        const saveData = JSON.parse(data);
        
        this.gameMode = saveData.gameMode;
        this.player = Character.fromJSON(saveData.player);
        this.faction = Faction.fromJSON(saveData.faction);
        this.npcs = saveData.npcs.map(n => NPC.fromJSON(n));
        this.questManager = QuestManager.fromJSON(saveData.questManager, this.npcs);
        this.currentDay = saveData.currentDay;
        this.isRunning = saveData.isRunning;
        
        // Load story manager if in campaign mode
        if (this.gameMode === GameMode.CAMPAIGN && saveData.storyManager) {
            this.storyManager = StoryManager.fromJSON(saveData.storyManager, this);
        }
        
        return true;
    }

    /**
     * Get game state summary
     */
    getGameState() {
        return {
            day: this.currentDay,
            faction: {
                name: this.faction.name,
                gold: this.faction.gold,
                reputation: this.faction.reputation,
                morale: this.faction.morale,
                corruption: this.faction.corruption
            },
            availableQuests: this.questManager.getAvailableQuests().length,
            activeQuests: this.questManager.getActiveQuests().length,
            npcCount: this.npcs.length
        };
    }
}
