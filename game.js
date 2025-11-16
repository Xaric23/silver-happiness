#!/usr/bin/env node
/**
 * Dark Fantasy Fort Management RPG
 * Main entry point for the game
 */

import readline from 'readline';
import { GameEngine } from './src/game-engine.js';
import { MainMenu } from './src/ui/menu.js';

// Set up readline interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Main game entry point
 */
async function main() {
    console.clear();
    console.log('='.repeat(60));
    console.log('  DARK FANTASY FORT MANAGEMENT RPG');
    console.log('='.repeat(60));
    console.log();
    
    // Initialize game engine
    const engine = new GameEngine();
    
    // Show main menu
    const menu = new MainMenu(engine, rl);
    await menu.show();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nGame interrupted by user. Goodbye!');
    rl.close();
    process.exit(0);
});

// Start the game
main().catch(error => {
    console.error('\n\nFatal error:', error);
    console.error(error.stack);
    rl.close();
    process.exit(1);
});
