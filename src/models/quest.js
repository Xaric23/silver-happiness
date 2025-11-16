/**
 * Quest and mission system
 */

export const QuestType = {
    COMBAT: 'combat',
    ESPIONAGE: 'espionage',
    RESOURCE_GATHERING: 'resource_gathering',
    SOCIAL: 'social',
    EXPLORATION: 'exploration',
    TRANSFORMATION: 'transformation'
};

export const QuestStatus = {
    AVAILABLE: 'available',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

/**
 * A quest or mission
 */
export class Quest {
    constructor(id, title, description, type, requirements, rewards) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.requirements = requirements; // { stat: minValue }
        this.rewards = rewards; // { gold: 100, reputation: 10, ... }
        this.status = QuestStatus.AVAILABLE;
        this.assignedNPC = null;
        this.turnsRemaining = 0;
    }

    /**
     * Check if an NPC meets the quest requirements
     */
    canNPCComplete(npc) {
        for (const [stat, minValue] of Object.entries(this.requirements)) {
            if (npc.getEffectiveStat(stat) < minValue) {
                return false;
            }
        }
        return true;
    }

    /**
     * Assign an NPC to this quest
     */
    assignNPC(npc, duration = 3) {
        this.assignedNPC = npc;
        this.status = QuestStatus.IN_PROGRESS;
        this.turnsRemaining = duration;
        npc.assignedTask = this.id;
    }

    /**
     * Process quest turn
     */
    processTurn() {
        if (this.status !== QuestStatus.IN_PROGRESS) {
            return null;
        }

        this.turnsRemaining--;
        
        if (this.turnsRemaining <= 0) {
            return this.complete();
        }
        
        return null;
    }

    /**
     * Complete the quest
     */
    complete() {
        this.status = QuestStatus.COMPLETED;
        if (this.assignedNPC) {
            this.assignedNPC.assignedTask = null;
        }
        
        // Generate outcome text
        const outcome = this._generateOutcome();
        
        return {
            quest: this,
            outcome,
            rewards: this.rewards
        };
    }

    _generateOutcome() {
        const outcomes = {
            [QuestType.COMBAT]: [
                `${this.assignedNPC.name} returns victorious, covered in blood and glory.`,
                `The battle was fierce, but ${this.assignedNPC.name} emerged triumphant.`,
                `${this.assignedNPC.name} defeated the enemies with brutal efficiency.`
            ],
            [QuestType.ESPIONAGE]: [
                `${this.assignedNPC.name} infiltrated the target location undetected.`,
                `Valuable intelligence was gathered by ${this.assignedNPC.name}.`,
                `${this.assignedNPC.name} returns with secrets that could change everything.`
            ],
            [QuestType.RESOURCE_GATHERING]: [
                `${this.assignedNPC.name} secured the resources successfully.`,
                `The mission was a success - materials have been added to your stores.`,
                `${this.assignedNPC.name} found more than expected!`
            ],
            [QuestType.SOCIAL]: [
                `${this.assignedNPC.name} charmed the target completely.`,
                `Through seduction and wit, ${this.assignedNPC.name} achieved the goal.`,
                `${this.assignedNPC.name} returns with a satisfied smile.`
            ]
        };

        const typeOutcomes = outcomes[this.type] || ['The quest was completed successfully.'];
        return typeOutcomes[Math.floor(Math.random() * typeOutcomes.length)];
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            type: this.type,
            requirements: this.requirements,
            rewards: this.rewards,
            status: this.status,
            assignedNPC: this.assignedNPC ? this.assignedNPC.id : null,
            turnsRemaining: this.turnsRemaining
        };
    }

    static fromJSON(data, npcs) {
        const quest = new Quest(
            data.id,
            data.title,
            data.description,
            data.type,
            data.requirements,
            data.rewards
        );
        quest.status = data.status;
        quest.turnsRemaining = data.turnsRemaining;
        
        if (data.assignedNPC) {
            quest.assignedNPC = npcs.find(npc => npc.id === data.assignedNPC) || null;
        }
        
        return quest;
    }
}

/**
 * Quest manager for generating and tracking quests
 */
export class QuestManager {
    constructor() {
        this.quests = [];
        this.nextQuestId = 1;
    }

    generateRandomQuest() {
        const types = Object.values(QuestType);
        const type = types[Math.floor(Math.random() * types.length)];
        
        const questTemplates = {
            [QuestType.COMBAT]: [
                { title: 'Clear the Ruins', desc: 'Hostile creatures have taken over the eastern ruins.' },
                { title: 'Defend the Fort', desc: 'Raiders approach from the north.' },
                { title: 'Eliminate Rival', desc: 'A rival faction leader must be dealt with.' }
            ],
            [QuestType.ESPIONAGE]: [
                { title: 'Gather Intelligence', desc: 'Spy on the merchant guild.' },
                { title: 'Steal Documents', desc: 'Infiltrate the archives.' },
                { title: 'Sabotage Enemy', desc: 'Disrupt rival operations.' }
            ],
            [QuestType.RESOURCE_GATHERING]: [
                { title: 'Collect Materials', desc: 'Gather building materials from the quarry.' },
                { title: 'Hunt for Food', desc: 'Secure food supplies for the faction.' },
                { title: 'Mine Arcane Essence', desc: 'Extract magical essence from the caves.' }
            ],
            [QuestType.SOCIAL]: [
                { title: 'Seduce Noble', desc: 'Win the favor of a powerful noble.' },
                { title: 'Negotiate Alliance', desc: 'Convince a neutral faction to join you.' },
                { title: 'Entertain Guests', desc: 'Host and entertain visiting dignitaries.' }
            ]
        };

        const templates = questTemplates[type] || [{ title: 'Mystery Quest', desc: 'Complete the objective.' }];
        const template = templates[Math.floor(Math.random() * templates.length)];

        const requirements = this._generateRequirements(type);
        const rewards = this._generateRewards(type);

        const quest = new Quest(
            `quest_${this.nextQuestId++}`,
            template.title,
            template.desc,
            type,
            requirements,
            rewards
        );

        this.quests.push(quest);
        return quest;
    }

    _generateRequirements(type) {
        const baseReq = {
            [QuestType.COMBAT]: { brawn: 6 },
            [QuestType.ESPIONAGE]: { intrigue: 6 },
            [QuestType.RESOURCE_GATHERING]: { survival: 5 },
            [QuestType.SOCIAL]: { seduction: 6 }
        };
        return baseReq[type] || { brawn: 5 };
    }

    _generateRewards(type) {
        const goldAmount = Math.floor(Math.random() * 100) + 50;
        const repAmount = Math.floor(Math.random() * 10) + 5;
        
        return {
            gold: goldAmount,
            reputation: repAmount
        };
    }

    getAvailableQuests() {
        return this.quests.filter(q => q.status === QuestStatus.AVAILABLE);
    }

    getActiveQuests() {
        return this.quests.filter(q => q.status === QuestStatus.IN_PROGRESS);
    }

    processAllQuests() {
        const completedQuests = [];
        
        for (const quest of this.quests) {
            const result = quest.processTurn();
            if (result) {
                completedQuests.push(result);
            }
        }
        
        return completedQuests;
    }

    toJSON() {
        return {
            quests: this.quests.map(q => q.toJSON()),
            nextQuestId: this.nextQuestId
        };
    }

    static fromJSON(data, npcs) {
        const manager = new QuestManager();
        manager.quests = data.quests.map(q => Quest.fromJSON(q, npcs));
        manager.nextQuestId = data.nextQuestId;
        return manager;
    }
}
