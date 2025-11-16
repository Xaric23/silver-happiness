/**
 * Story Mode System - Manages campaign narrative progression
 */

export const StoryChapter = {
    PROLOGUE: 'prologue',
    ACT_1: 'act_1',
    ACT_2: 'act_2',
    ACT_3: 'act_3',
    EPILOGUE: 'epilogue'
};

export const StoryObjectiveType = {
    REACH_DAY: 'reach_day',
    BUILD_ROOM: 'build_room',
    REACH_REPUTATION: 'reach_reputation',
    COMPLETE_QUEST: 'complete_quest',
    RECRUIT_NPCS: 'recruit_npcs',
    ACCUMULATE_GOLD: 'accumulate_gold',
    DEFEAT_ENEMY: 'defeat_enemy',
    CLEAR_DISTRICT: 'clear_district'
};

/**
 * Represents a story objective with completion tracking
 */
export class StoryObjective {
    constructor(id, type, description, target, data = {}) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.target = target;
        this.current = 0;
        this.completed = false;
        this.data = data; // Additional data for the objective
    }

    /**
     * Update objective progress
     */
    updateProgress(value) {
        this.current = value;
        if (this.current >= this.target) {
            this.completed = true;
        }
        return this.completed;
    }

    /**
     * Check if objective is complete
     */
    isComplete() {
        return this.completed;
    }

    /**
     * Get progress percentage
     */
    getProgress() {
        return Math.min(100, Math.floor((this.current / this.target) * 100));
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            description: this.description,
            target: this.target,
            current: this.current,
            completed: this.completed,
            data: this.data
        };
    }

    static fromJSON(data) {
        const objective = new StoryObjective(
            data.id,
            data.type,
            data.description,
            data.target,
            data.data
        );
        objective.current = data.current;
        objective.completed = data.completed;
        return objective;
    }
}

/**
 * Represents a story event or scene
 */
export class StoryEvent {
    constructor(id, title, description, chapter, choices = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.chapter = chapter;
        this.choices = choices; // Array of {text, outcome}
        this.triggered = false;
    }

    trigger() {
        this.triggered = true;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            chapter: this.chapter,
            choices: this.choices,
            triggered: this.triggered
        };
    }

    static fromJSON(data) {
        const event = new StoryEvent(
            data.id,
            data.title,
            data.description,
            data.chapter,
            data.choices
        );
        event.triggered = data.triggered;
        return event;
    }
}

/**
 * Main Story Manager - Tracks campaign progression
 */
export class StoryManager {
    constructor(engine) {
        this.engine = engine;
        this.currentChapter = StoryChapter.PROLOGUE;
        this.objectives = [];
        this.completedObjectives = [];
        this.availableEvents = [];
        this.triggeredEvents = [];
        this.storyChoices = {}; // Track player choices
        this.unlocks = {}; // Track unlocked content
    }

    /**
     * Initialize story mode
     */
    initializeStory() {
        this.currentChapter = StoryChapter.PROLOGUE;
        this._loadPrologueObjectives();
        this._loadPrologueEvents();
    }

    /**
     * Load objectives for prologue chapter
     */
    _loadPrologueObjectives() {
        this.objectives = [
            new StoryObjective(
                'prologue_survive',
                StoryObjectiveType.REACH_DAY,
                'Survive your first 5 days in the fortress',
                5
            ),
            new StoryObjective(
                'prologue_clear_slums',
                StoryObjectiveType.CLEAR_DISTRICT,
                'Clear the rubble from The Slums',
                100,
                { districtName: 'The Slums' }
            ),
            new StoryObjective(
                'prologue_first_room',
                StoryObjectiveType.BUILD_ROOM,
                'Build your first room in the fortress',
                1
            )
        ];
    }

    /**
     * Load story events for prologue
     */
    _loadPrologueEvents() {
        this.availableEvents = [
            new StoryEvent(
                'prologue_arrival',
                'Arrival at the Forsaken Fortress',
                'You stand before the crumbling gates of what was once a mighty fortress. Dark clouds gather overhead as you step into your new domain. The air is thick with ancient magic and decay. This place will be your seat of power... if you can tame it.',
                StoryChapter.PROLOGUE
            ),
            new StoryEvent(
                'prologue_first_night',
                'The First Night',
                'As darkness falls on your first day, strange whispers echo through the halls. A shadowy figure appears before you, claiming to be a former servant of the fortress. They offer knowledge... for a price.',
                StoryChapter.PROLOGUE,
                [
                    {
                        text: 'Accept their offer and learn the fortress secrets',
                        outcome: { corruption: 5, arcaneEssence: 20, reputation: -5 }
                    },
                    {
                        text: 'Refuse and drive them away',
                        outcome: { reputation: 5, gold: -50 }
                    },
                    {
                        text: 'Attempt to capture and interrogate them',
                        outcome: { intrigue_check: true, success: { prisoner: true }, failure: { morale: -10 } }
                    }
                ]
            )
        ];
    }

    /**
     * Load objectives for Act 1
     */
    _loadAct1Objectives() {
        this.objectives = [
            new StoryObjective(
                'act1_expand',
                StoryObjectiveType.BUILD_ROOM,
                'Expand your fortress with 3 different room types',
                3
            ),
            new StoryObjective(
                'act1_reputation',
                StoryObjectiveType.REACH_REPUTATION,
                'Reach 60 reputation to gain recognition',
                60
            ),
            new StoryObjective(
                'act1_recruit',
                StoryObjectiveType.RECRUIT_NPCS,
                'Recruit and maintain 8 NPCs in your faction',
                8
            ),
            new StoryObjective(
                'act1_wealth',
                StoryObjectiveType.ACCUMULATE_GOLD,
                'Accumulate 1000 gold to establish economic power',
                1000
            )
        ];
    }

    /**
     * Load objectives for Act 2
     */
    _loadAct2Objectives() {
        this.objectives = [
            new StoryObjective(
                'act2_clear_all',
                StoryObjectiveType.CLEAR_DISTRICT,
                'Clear all three districts of rubble',
                3
            ),
            new StoryObjective(
                'act2_power',
                StoryObjectiveType.REACH_REPUTATION,
                'Reach 80 reputation and become a major power',
                80
            ),
            new StoryObjective(
                'act2_transformation',
                StoryObjectiveType.COMPLETE_QUEST,
                'Complete 5 transformation-related encounters',
                5,
                { questType: 'transformation' }
            )
        ];
    }

    /**
     * Load objectives for Act 3
     */
    _loadAct3Objectives() {
        this.objectives = [
            new StoryObjective(
                'act3_dominance',
                StoryObjectiveType.REACH_REPUTATION,
                'Achieve maximum reputation (100) and become legendary',
                100
            ),
            new StoryObjective(
                'act3_final_battle',
                StoryObjectiveType.DEFEAT_ENEMY,
                'Defeat the rival faction leader in combat',
                1,
                { enemyName: 'Lord Malachar' }
            )
        ];
    }

    /**
     * Update story objectives based on game state
     */
    updateObjectives(gameState) {
        let anyCompleted = false;

        for (const objective of this.objectives) {
            if (objective.completed) continue;

            let newValue = objective.current;

            switch (objective.type) {
                case StoryObjectiveType.REACH_DAY:
                    newValue = gameState.day;
                    break;
                case StoryObjectiveType.BUILD_ROOM:
                    newValue = this._countBuiltRooms();
                    break;
                case StoryObjectiveType.REACH_REPUTATION:
                    newValue = gameState.faction.reputation;
                    break;
                case StoryObjectiveType.RECRUIT_NPCS:
                    newValue = this._countRecruitedNPCs();
                    break;
                case StoryObjectiveType.ACCUMULATE_GOLD:
                    newValue = gameState.faction.gold;
                    break;
                case StoryObjectiveType.CLEAR_DISTRICT:
                    if (objective.data.districtName) {
                        newValue = this._getDistrictClearance(objective.data.districtName);
                    } else {
                        newValue = this._countClearedDistricts();
                    }
                    break;
            }

            if (objective.updateProgress(newValue) && !anyCompleted) {
                anyCompleted = true;
            }
        }

        // Check if chapter is complete
        if (this._areAllObjectivesComplete()) {
            return this._advanceChapter();
        }

        return anyCompleted;
    }

    /**
     * Check if all current objectives are complete
     */
    _areAllObjectivesComplete() {
        return this.objectives.length > 0 && this.objectives.every(obj => obj.completed);
    }

    /**
     * Advance to next chapter
     */
    _advanceChapter() {
        // Move completed objectives to history
        this.completedObjectives.push(...this.objectives);
        this.objectives = [];

        // Advance chapter
        switch (this.currentChapter) {
            case StoryChapter.PROLOGUE:
                this.currentChapter = StoryChapter.ACT_1;
                this._loadAct1Objectives();
                break;
            case StoryChapter.ACT_1:
                this.currentChapter = StoryChapter.ACT_2;
                this._loadAct2Objectives();
                break;
            case StoryChapter.ACT_2:
                this.currentChapter = StoryChapter.ACT_3;
                this._loadAct3Objectives();
                break;
            case StoryChapter.ACT_3:
                this.currentChapter = StoryChapter.EPILOGUE;
                break;
            default:
                return { chapterComplete: true, newChapter: null, gameComplete: true };
        }

        return { 
            chapterComplete: true, 
            newChapter: this.currentChapter,
            gameComplete: this.currentChapter === StoryChapter.EPILOGUE
        };
    }

    /**
     * Get next available story event
     */
    getNextEvent() {
        const untriggered = this.availableEvents.filter(e => 
            !e.triggered && e.chapter === this.currentChapter
        );
        return untriggered.length > 0 ? untriggered[0] : null;
    }

    /**
     * Trigger a story event and apply choice outcome
     */
    triggerEvent(eventId, choiceIndex = 0) {
        const event = this.availableEvents.find(e => e.id === eventId);
        if (!event || event.triggered) return null;

        event.trigger();
        this.triggeredEvents.push(event);

        const outcome = { event };
        
        if (event.choices && event.choices.length > choiceIndex) {
            const choice = event.choices[choiceIndex];
            this.storyChoices[eventId] = choiceIndex;
            outcome.choice = choice;
            outcome.effects = choice.outcome;
        }

        return outcome;
    }

    /**
     * Get current chapter name formatted
     */
    getChapterName() {
        const names = {
            [StoryChapter.PROLOGUE]: 'Prologue: The Forsaken Fortress',
            [StoryChapter.ACT_1]: 'Act I: Rise from Shadows',
            [StoryChapter.ACT_2]: 'Act II: Dark Ambitions',
            [StoryChapter.ACT_3]: 'Act III: The Final Confrontation',
            [StoryChapter.EPILOGUE]: 'Epilogue: Legacy of Darkness'
        };
        return names[this.currentChapter] || 'Unknown Chapter';
    }

    /**
     * Helper methods for counting game state
     */
    _countBuiltRooms() {
        let count = 0;
        for (const district of this.engine.faction.districts) {
            count += district.rooms.length;
        }
        return count;
    }

    _countRecruitedNPCs() {
        return this.engine.npcs.filter(npc => npc.role === 'minion').length;
    }

    _getDistrictClearance(districtName) {
        const district = this.engine.faction.districts.find(d => d.name === districtName);
        return district ? 100 - district.rubble : 0;
    }

    _countClearedDistricts() {
        return this.engine.faction.districts.filter(d => d.cleared).length;
    }

    /**
     * Get story progress summary
     */
    getProgressSummary() {
        return {
            chapter: this.currentChapter,
            chapterName: this.getChapterName(),
            objectives: this.objectives.map(obj => ({
                description: obj.description,
                progress: obj.getProgress(),
                completed: obj.completed
            })),
            completedChapters: this._getCompletedChapters()
        };
    }

    _getCompletedChapters() {
        const chapters = [StoryChapter.PROLOGUE, StoryChapter.ACT_1, StoryChapter.ACT_2, StoryChapter.ACT_3];
        const currentIndex = chapters.indexOf(this.currentChapter);
        return chapters.slice(0, currentIndex);
    }

    /**
     * Serialization
     */
    toJSON() {
        return {
            currentChapter: this.currentChapter,
            objectives: this.objectives.map(obj => obj.toJSON()),
            completedObjectives: this.completedObjectives.map(obj => obj.toJSON()),
            availableEvents: this.availableEvents.map(e => e.toJSON()),
            triggeredEvents: this.triggeredEvents.map(e => e.toJSON()),
            storyChoices: this.storyChoices,
            unlocks: this.unlocks
        };
    }

    static fromJSON(data, engine) {
        const manager = new StoryManager(engine);
        manager.currentChapter = data.currentChapter;
        manager.objectives = data.objectives.map(obj => StoryObjective.fromJSON(obj));
        manager.completedObjectives = data.completedObjectives.map(obj => StoryObjective.fromJSON(obj));
        manager.availableEvents = data.availableEvents.map(e => StoryEvent.fromJSON(e));
        manager.triggeredEvents = data.triggeredEvents.map(e => StoryEvent.fromJSON(e));
        manager.storyChoices = data.storyChoices;
        manager.unlocks = data.unlocks;
        return manager;
    }
}
