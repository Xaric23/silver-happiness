/**
 * Main menu and UI system
 */

import { GameMode } from '../game-engine.js';
import { RoomType } from '../models/faction.js';

/**
 * Utility to prompt user for input
 */
export function prompt(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Main menu
 */
export class MainMenu {
    constructor(engine, rl) {
        this.engine = engine;
        this.rl = rl;
    }

    async show() {
        while (true) {
            console.clear();
            console.log('='.repeat(60));
            console.log('  DARK FANTASY FORT MANAGEMENT RPG');
            console.log('='.repeat(60));
            console.log();
            console.log('1. New Game (Sandbox Mode)');
            console.log('2. New Game (Campaign Mode)');
            console.log('3. Load Game');
            console.log('4. About');
            console.log('5. Exit');
            console.log();

            const choice = await prompt(this.rl, 'Choose an option: ');

            switch (choice) {
                case '1':
                    await this.startNewGame(GameMode.SANDBOX);
                    break;
                case '2':
                    await this.startNewGame(GameMode.CAMPAIGN);
                    break;
                case '3':
                    await this.loadGame();
                    break;
                case '4':
                    await this.showAbout();
                    break;
                case '5':
                    console.log('\nThanks for playing! Goodbye!');
                    this.rl.close();
                    return;
                default:
                    console.log('\nInvalid choice. Press Enter to continue...');
                    await prompt(this.rl, '');
            }
        }
    }

    async startNewGame(mode) {
        console.clear();
        console.log('='.repeat(60));
        console.log(`  NEW GAME - ${mode.toUpperCase()} MODE`);
        console.log('='.repeat(60));
        console.log();

        const playerName = await prompt(this.rl, 'Enter your character name: ');
        
        // Choose gender
        console.log('\nChoose your gender:');
        console.log('1. Male');
        console.log('2. Female');
        console.log('3. Other');
        const genderChoice = await prompt(this.rl, 'Choice: ');
        const genders = ['male', 'female', 'other'];
        const gender = genders[parseInt(genderChoice) - 1] || 'other';
        
        // Choose species
        const { Species, SubSpecies } = await import('../models/character.js');
        const speciesList = Object.keys(Species);
        
        console.log('\nChoose your species:');
        speciesList.forEach((sp, idx) => {
            console.log(`${idx + 1}. ${Species[sp]}`);
        });
        const speciesChoice = await prompt(this.rl, 'Choice: ');
        const speciesKey = speciesList[parseInt(speciesChoice) - 1] || speciesList[0];
        const species = Species[speciesKey];
        
        // Choose subspecies
        const subspeciesList = SubSpecies[species] || ['common'];
        console.log(`\nChoose your ${species} subspecies:`);
        subspeciesList.forEach((sub, idx) => {
            console.log(`${idx + 1}. ${sub}`);
        });
        const subspeciesChoice = await prompt(this.rl, 'Choice: ');
        const subspecies = subspeciesList[parseInt(subspeciesChoice) - 1] || subspeciesList[0];
        
        const factionName = await prompt(this.rl, '\nEnter your faction name: ');

        const gameData = this.engine.newGame(mode, playerName, factionName, gender, species, subspecies);

        console.log(`\nWelcome, ${playerName}, ${subspecies} ${species} leader of ${factionName}!`);
        console.log('\nYour dark reign begins...');
        await prompt(this.rl, '\nPress Enter to continue...');

        // Show game menu
        const gameMenu = new GameMenu(this.engine, this.rl);
        await gameMenu.show();
    }

    async loadGame() {
        console.clear();
        console.log('='.repeat(60));
        console.log('  LOAD GAME');
        console.log('='.repeat(60));
        console.log();

        const filename = await prompt(this.rl, 'Enter save filename (without .json): ');

        try {
            await this.engine.loadGame(filename);
            console.log('\nGame loaded successfully!');
            await prompt(this.rl, 'Press Enter to continue...');

            const gameMenu = new GameMenu(this.engine, this.rl);
            await gameMenu.show();
        } catch (error) {
            console.log(`\nError loading game: ${error.message}`);
            await prompt(this.rl, 'Press Enter to continue...');
        }
    }

    async showAbout() {
        console.clear();
        console.log('='.repeat(60));
        console.log('  ABOUT');
        console.log('='.repeat(60));
        console.log();
        console.log('Dark Fantasy Fort Management RPG');
        console.log();
        console.log('A text-based management RPG where you lead a faction in a');
        console.log('magically corrupt city-fort. Balance power, intrigue, and');
        console.log('transformation mechanics while managing combat and building');
        console.log('your empire.');
        console.log();
        console.log('Features:');
        console.log('- Deep character customization and transformation');
        console.log('- Turn-based combat system');
        console.log('- Quest system (combat, espionage, social, resource gathering)');
        console.log('- Fort management with upgradable rooms');
        console.log('- Reputation, morale, and corruption mechanics');
        console.log('- Sandbox and Campaign modes');
        console.log();
        await prompt(this.rl, 'Press Enter to continue...');
    }
}

/**
 * In-game menu
 */
export class GameMenu {
    constructor(engine, rl) {
        this.engine = engine;
        this.rl = rl;
    }

    async show() {
        while (this.engine.isRunning) {
            console.clear();
            this.displayStatus();

            console.log('\n' + '='.repeat(60));
            console.log('  MAIN MENU');
            console.log('='.repeat(60));
            console.log();
            console.log('1. View Faction Status');
            console.log('2. Manage Fort');
            console.log('3. View NPCs');
            console.log('4. View Quests');
            console.log('5. Advance Day');
            console.log('6. Save Game');
            console.log('7. Return to Main Menu');
            console.log();

            const choice = await prompt(this.rl, 'Choose an option: ');

            switch (choice) {
                case '1':
                    await this.viewFactionStatus();
                    break;
                case '2':
                    await this.manageFort();
                    break;
                case '3':
                    await this.viewNPCs();
                    break;
                case '4':
                    await this.viewQuests();
                    break;
                case '5':
                    await this.advanceDay();
                    break;
                case '6':
                    await this.saveGame();
                    break;
                case '7':
                    return;
                default:
                    console.log('\nInvalid choice.');
                    await prompt(this.rl, 'Press Enter to continue...');
            }
        }
    }

    displayStatus() {
        const state = this.engine.getGameState();
        console.log('='.repeat(60));
        console.log(`  Day ${state.day} - ${state.faction.name}`);
        console.log('='.repeat(60));
        console.log(`Gold: ${state.faction.gold} | Reputation: ${state.faction.reputation}/100`);
        console.log(`Morale: ${state.faction.morale}/100 | Corruption: ${state.faction.corruption}/100`);
    }

    async viewFactionStatus() {
        console.clear();
        console.log('='.repeat(60));
        console.log('  FACTION STATUS');
        console.log('='.repeat(60));
        console.log();
        
        const faction = this.engine.faction;
        console.log(`Faction Name: ${faction.name}`);
        console.log(`Gold: ${faction.gold}`);
        console.log(`Reputation: ${faction.reputation}/100`);
        console.log(`Morale: ${faction.morale}/100`);
        console.log(`Corruption: ${faction.corruption}/100`);
        console.log(`Influence: ${faction.influence}`);
        console.log();
        console.log('Resources:');
        for (const [resource, amount] of Object.entries(faction.resources)) {
            console.log(`  ${resource}: ${amount}`);
        }
        console.log();
        console.log('Active Bonuses:');
        const bonuses = faction.getTotalBonuses();
        for (const [bonus, value] of Object.entries(bonuses)) {
            console.log(`  ${bonus}: +${value}`);
        }
        
        console.log();
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async manageFort() {
        while (true) {
            console.clear();
            console.log('='.repeat(60));
            console.log('  FORT MANAGEMENT');
            console.log('='.repeat(60));
            console.log();
            
            const faction = this.engine.faction;
            
            console.log('Districts:');
            faction.districts.forEach((district, idx) => {
                console.log(`\n${idx + 1}. ${district.name}`);
                console.log(`   ${district.description}`);
                console.log(`   Cleared: ${district.cleared ? 'Yes' : `No (${district.rubble}% rubble)`}`);
                console.log(`   Rooms: ${district.rooms.length}`);
                
                district.rooms.forEach(room => {
                    console.log(`     - ${room.roomType} (Level ${room.level})`);
                });
            });
            
            console.log();
            console.log('Actions:');
            console.log('c. Clear rubble from a district (50 gold)');
            console.log('b. Build a room (200 gold)');
            console.log('u. Upgrade a room');
            console.log('r. Return');
            console.log();
            
            const choice = await prompt(this.rl, 'Choose an action: ');
            
            if (choice === 'r') {
                break;
            } else if (choice === 'c') {
                await this.clearRubble();
            } else if (choice === 'b') {
                await this.buildRoom();
            } else if (choice === 'u') {
                await this.upgradeRoom();
            }
        }
    }

    async clearRubble() {
        const districtIdx = await prompt(this.rl, 'Enter district number: ');
        const idx = parseInt(districtIdx) - 1;
        
        if (idx >= 0 && idx < this.engine.faction.districts.length) {
            const district = this.engine.faction.districts[idx];
            
            if (this.engine.faction.spendGold(50)) {
                district.clearRubble(20);
                console.log(`\nCleared rubble from ${district.name}. Rubble remaining: ${district.rubble}%`);
            } else {
                console.log('\nNot enough gold!');
            }
        } else {
            console.log('\nInvalid district number.');
        }
        
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async buildRoom() {
        const districtIdx = await prompt(this.rl, 'Enter district number: ');
        const idx = parseInt(districtIdx) - 1;
        
        if (idx >= 0 && idx < this.engine.faction.districts.length) {
            const district = this.engine.faction.districts[idx];
            
            if (!district.cleared) {
                console.log('\nDistrict must be fully cleared first!');
                await prompt(this.rl, 'Press Enter to continue...');
                return;
            }
            
            console.log('\nAvailable room types:');
            const types = Object.keys(RoomType);
            types.forEach((type, i) => {
                console.log(`${i + 1}. ${type}`);
            });
            
            const roomChoice = await prompt(this.rl, 'Choose room type: ');
            const roomIdx = parseInt(roomChoice) - 1;
            
            if (roomIdx >= 0 && roomIdx < types.length) {
                if (this.engine.faction.spendGold(200)) {
                    const { Room } = await import('../models/faction.js');
                    const room = new Room(RoomType[types[roomIdx]], 1);
                    district.addRoom(room);
                    console.log(`\nBuilt ${types[roomIdx]} in ${district.name}!`);
                } else {
                    console.log('\nNot enough gold!');
                }
            }
        }
        
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async upgradeRoom() {
        console.log('\nUpgrade feature coming soon!');
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async viewNPCs() {
        while (true) {
            console.clear();
            console.log('='.repeat(60));
            console.log('  NPCs');
            console.log('='.repeat(60));
            console.log();
            
            this.engine.npcs.forEach((npc, idx) => {
                console.log(`${idx + 1}. ${npc.name}`);
                console.log(`   Species: ${npc.subspecies} ${npc.species} (${npc.gender})`);
                console.log(`   Role: ${npc.role}`);
                console.log(`   Stats: B:${npc.stats.brawn} I:${npc.stats.intrigue} A:${npc.stats.arcane} Su:${npc.stats.survival} Se:${npc.stats.seduction}`);
                console.log(`   Relationship: ${npc.relationshipPlayer}`);
                if (npc.assignedTask) {
                    console.log(`   Status: On mission (${npc.assignedTask})`);
                }
                console.log();
            });
            
            console.log('Actions:');
            console.log('v. View NPC details');
            console.log('r. Return');
            console.log();
            
            const choice = await prompt(this.rl, 'Choose an action: ');
            
            if (choice === 'r') {
                break;
            } else if (choice === 'v') {
                await this.viewNPCDetails();
            }
        }
    }

    async viewNPCDetails() {
        const npcNum = await prompt(this.rl, 'Enter NPC number: ');
        const idx = parseInt(npcNum) - 1;
        
        if (idx >= 0 && idx < this.engine.npcs.length) {
            const npc = this.engine.npcs[idx];
            
            console.clear();
            console.log('='.repeat(60));
            console.log(`  ${npc.name}`);
            console.log('='.repeat(60));
            console.log();
            console.log(`Species: ${npc.subspecies} ${npc.species}`);
            console.log(`Gender: ${npc.gender}`);
            console.log(`Role: ${npc.role}`);
            console.log();
            console.log('Stats:');
            console.log(`  Brawn: ${npc.stats.brawn}`);
            console.log(`  Intrigue: ${npc.stats.intrigue}`);
            console.log(`  Arcane: ${npc.stats.arcane}`);
            console.log(`  Survival: ${npc.stats.survival}`);
            console.log(`  Seduction: ${npc.stats.seduction}`);
            console.log();
            console.log('Appearance:');
            console.log(`  Height: ${npc.appearance.height}`);
            console.log(`  Build: ${npc.appearance.build}`);
            console.log(`  Hair: ${npc.appearance.hairColor}`);
            console.log(`  Eyes: ${npc.appearance.eyeColor}`);
            console.log(`  Skin: ${npc.appearance.skinTone}`);
            console.log(`  Features: ${npc.appearance.features}`);
            console.log();
            console.log('Personality:');
            console.log(`  Submissive: ${npc.personality.submissive}/100`);
            console.log(`  Corruption: ${npc.personality.corruption}/100`);
            console.log(`  Loyalty: ${npc.personality.loyalty}/100`);
            console.log();
            console.log(`Relationship with player: ${npc.relationshipPlayer}`);
            
            if (npc.transformations.length > 0) {
                console.log();
                console.log('Transformations:');
                npc.transformations.forEach(t => {
                    console.log(`  - ${t.name}: ${t.description}`);
                });
            }
        } else {
            console.log('\nInvalid NPC number.');
        }
        
        await prompt(this.rl, '\nPress Enter to continue...');
    }

    async viewQuests() {
        while (true) {
            console.clear();
            console.log('='.repeat(60));
            console.log('  QUESTS');
            console.log('='.repeat(60));
            console.log();
            
            const available = this.engine.questManager.getAvailableQuests();
            const active = this.engine.questManager.getActiveQuests();
            
            console.log('Available Quests:');
            if (available.length === 0) {
                console.log('  None');
            } else {
                available.forEach((quest, idx) => {
                    console.log(`${idx + 1}. ${quest.title} (${quest.type})`);
                    console.log(`   ${quest.description}`);
                    console.log(`   Requirements: ${JSON.stringify(quest.requirements)}`);
                    console.log(`   Rewards: Gold ${quest.rewards.gold}, Rep ${quest.rewards.reputation}`);
                    console.log();
                });
            }
            
            console.log('\nActive Quests:');
            if (active.length === 0) {
                console.log('  None');
            } else {
                active.forEach((quest) => {
                    console.log(`- ${quest.title} (${quest.turnsRemaining} days remaining)`);
                    console.log(`  Assigned: ${quest.assignedNPC ? quest.assignedNPC.name : 'None'}`);
                });
            }
            
            console.log();
            console.log('a. Assign NPC to quest');
            console.log('r. Return');
            console.log();
            
            const choice = await prompt(this.rl, 'Choose an action: ');
            
            if (choice === 'r') {
                break;
            } else if (choice === 'a') {
                await this.assignQuest();
            }
        }
    }

    async assignQuest() {
        const questNum = await prompt(this.rl, 'Enter quest number: ');
        const qIdx = parseInt(questNum) - 1;
        
        const available = this.engine.questManager.getAvailableQuests();
        
        if (qIdx >= 0 && qIdx < available.length) {
            const quest = available[qIdx];
            
            console.log('\nAvailable NPCs:');
            const availableNPCs = this.engine.npcs.filter(npc => !npc.assignedTask);
            availableNPCs.forEach((npc, idx) => {
                const canComplete = quest.canNPCComplete(npc);
                console.log(`${idx + 1}. ${npc.name} ${canComplete ? '✓' : '✗'}`);
            });
            
            const npcNum = await prompt(this.rl, '\nEnter NPC number: ');
            const nIdx = parseInt(npcNum) - 1;
            
            if (nIdx >= 0 && nIdx < availableNPCs.length) {
                const result = this.engine.assignNPCToQuest(availableNPCs[nIdx].id, quest.id);
                
                if (result.success) {
                    console.log(`\n${availableNPCs[nIdx].name} assigned to ${quest.title}!`);
                } else {
                    console.log(`\nFailed: ${result.reason}`);
                }
            }
        }
        
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async advanceDay() {
        console.clear();
        console.log('='.repeat(60));
        console.log('  ADVANCING DAY...');
        console.log('='.repeat(60));
        console.log();
        
        const result = this.engine.advanceDay();
        
        console.log(`Day ${result.day} begins...`);
        console.log();
        
        if (result.goldIncome > 0) {
            console.log(`Daily income: +${result.goldIncome} gold`);
        }
        
        if (result.completedQuests.length > 0) {
            console.log('\nCompleted Quests:');
            result.completedQuests.forEach(completion => {
                console.log(`\n${completion.quest.title}`);
                console.log(completion.outcome);
                console.log(`Rewards: +${completion.rewards.gold} gold, +${completion.rewards.reputation} reputation`);
            });
        }
        
        if (result.events.length > 0) {
            console.log('\nEvents:');
            for (const event of result.events) {
                if (event.type === 'encounter') {
                    console.log(`\n! ${event.message}`);
                    await this.handleEncounter(event.encounter);
                } else {
                    console.log(`- ${event.message}`);
                }
            }
        }
        
        console.log();
        await prompt(this.rl, 'Press Enter to continue...');
    }

    async handleEncounter(encounter) {
        console.log('\n' + '='.repeat(60));
        console.log(`  ENCOUNTER: ${encounter.type.toUpperCase()}`);
        console.log('='.repeat(60));
        console.log();
        console.log(`${encounter.npc.name} (${encounter.npc.subspecies} ${encounter.npc.species})`);
        console.log(`Difficulty: ${encounter.difficulty}/10`);
        console.log(`Transformation Risk: ${Math.floor(encounter.transformationRisk)}%`);
        console.log();
        console.log('Choose your action:');
        console.log('1. Fight');
        console.log('2. Talk');
        console.log('3. Use Magic');
        console.log('4. Try to Escape');
        console.log();

        const choice = await prompt(this.rl, 'Choice: ');
        
        // Resolve encounter
        const result = encounter.resolve(this.engine.player, choice);
        
        console.log('\n' + result.message);
        
        if (result.success) {
            console.log('\nSuccess!');
            if (result.rewards) {
                console.log(`Rewards:`);
                if (result.rewards.gold) {
                    console.log(`  +${result.rewards.gold} gold`);
                    this.engine.faction.addGold(result.rewards.gold);
                }
                if (result.rewards.reputation) {
                    console.log(`  +${result.rewards.reputation} reputation`);
                    this.engine.faction.reputation = Math.min(100, this.engine.faction.reputation + result.rewards.reputation);
                }
            }
            
            if (result.npcTransformed) {
                console.log(`\nYou dominate ${encounter.npc.name}!`);
                console.log(`${result.npcTransformation.description}`);
                encounter.npc.applyTransformation(result.npcTransformation);
            }
            
            // Improve relationship
            encounter.npc.relationshipPlayer += result.relationshipChange;
        } else {
            console.log('\nDefeat...');
            
            if (result.penalties) {
                console.log(`Penalties:`);
                if (result.penalties.gold) {
                    console.log(`  -${result.penalties.gold} gold`);
                    this.engine.faction.gold = Math.max(0, this.engine.faction.gold - result.penalties.gold);
                }
                if (result.penalties.reputation) {
                    console.log(`  -${result.penalties.reputation} reputation`);
                    this.engine.faction.reputation = Math.max(0, this.engine.faction.reputation - result.penalties.reputation);
                }
                if (result.penalties.morale) {
                    console.log(`  -${result.penalties.morale} morale`);
                    this.engine.faction.morale = Math.max(0, this.engine.faction.morale - result.penalties.morale);
                }
            }
            
            if (result.corruptionGain) {
                console.log(`\n+${result.corruptionGain} corruption`);
            }
            
            if (result.transformed) {
                console.log('\n*** YOU HAVE BEEN TRANSFORMED! ***');
                console.log(`Transformation: ${result.transformation.name}`);
                console.log(`Effect: ${result.transformation.description}`);
                console.log('\nYour stats have changed:');
                for (const [stat, modifier] of Object.entries(result.transformation.statModifiers)) {
                    if (modifier > 0) {
                        console.log(`  ${stat}: +${modifier}`);
                    } else if (modifier < 0) {
                        console.log(`  ${stat}: ${modifier}`);
                    }
                }
            }
            
            // Worsen relationship
            encounter.npc.relationshipPlayer += result.relationshipChange;
        }
        
        await prompt(this.rl, '\nPress Enter to continue...');
    }

    async saveGame() {
        const filename = await prompt(this.rl, 'Enter save filename (without .json): ');
        
        try {
            const path = await this.engine.saveGame(filename);
            console.log(`\nGame saved to ${path}`);
        } catch (error) {
            console.log(`\nError saving game: ${error.message}`);
        }
        
        await prompt(this.rl, 'Press Enter to continue...');
    }
}
