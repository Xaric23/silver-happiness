# Dark Fantasy Fort Management RPG

A text-based management RPG that fuses elements of dark fantasy, faction management, and transformation mechanics. Lead your faction in a magically corrupt city-fort, balancing power, intrigue, and strategic decision-making.

## Features

### Core Gameplay
- **Faction Management**: Build and expand your fort with specialized rooms
- **Character System**: Deep customization with transformation mechanics
- **Quest System**: Assign NPCs to combat, espionage, resource gathering, and social missions
- **Turn-Based Combat**: Strategic battles with multiple action types
- **RPG Stats**: Brawn, Intrigue, Arcane, Survival, and Seduction
- **Dynamic NPCs**: Randomly generated characters with unique stats and relationships

### Game Systems
- **Districts & Rooms**: Upgrade your fort with:
  - Slave Pens
  - Arcane Labs
  - Brothels
  - Scout Towers
  - Recreation Wings
  - Armories
  - Treasury
  - Throne Room
  - Dungeons

- **Resource Management**: 
  - Gold economy
  - Food, materials, and arcane essence
  - Reputation and influence systems
  - Morale and corruption mechanics

- **Physical Body Part Transformation System**:
  - 50+ unique body parts (ears, tails, wings, horns, claws, fangs, etc.)
  - Combat defeat gives enemy body parts
  - Species-specific parts for all 10 species
  - Parts replace or stack based on type
  - Permanent stat bonuses that accumulate
  - Dynamic appearance descriptions
  - Example: Lose to cat beast-kin → gain cat ears and tail
  
- **Transformation & Defeat System**:
  - Combat defeat transformations
  - Random encounters with transformation risks  
  - Corruption and personality changes
  - NPC transformation on victory (10% chance)
  - Transformation probability based on enemy species and difficulty

- **Encounter System**:
  - Random daily encounters
  - Combat, Social, Magical, Trap, and Ambush types
  - Success/failure with consequences
  - Transformation risks based on difficulty
  - Relationship changes with NPCs

- **Game Modes**:
  - **Sandbox Mode**: Open-ended gameplay focused on faction growth and experimentation
  - **Story Mode (Campaign)**: Narrative-driven experience with chapters, objectives, and branching storylines
    - 4 Acts: Prologue, Act I, Act II, and Act III
    - Story objectives tracking your progress
    - Character-driven events with meaningful choices
    - Multiple endings based on your decisions
    - Integrated with all core game mechanics

## Installation

```bash
# Clone the repository
git clone https://github.com/Xaric23/silver-happiness.git
cd silver-happiness

# Install dependencies (none required - uses Node.js built-ins)
npm install

# Run the game
npm start
```

## Requirements

- Node.js 14.0 or higher (for ES modules support)

## How to Play

1. Start the game with `npm start`
2. Create a new character and faction
3. Manage your fort by building rooms and clearing rubble
4. Recruit NPCs and assign them to quests
5. Advance through days to complete missions and earn rewards
6. Save your progress anytime

### Controls
Navigate menus by entering the number or letter of your choice and pressing Enter.

## Game Mechanics

### Stats
- **Brawn**: Physical combat prowess
- **Intrigue**: Social manipulation and espionage
- **Arcane**: Magical knowledge and power
- **Survival**: Resourcefulness and endurance
- **Seduction**: Influence through erotic encounters

### Quest Types
- **Combat**: Direct confrontation and battle
- **Espionage**: Stealth, infiltration, and intelligence gathering
- **Resource Gathering**: Collecting materials and supplies
- **Social**: Negotiation, seduction, and relationship building
- **Exploration**: Discovering new areas and secrets
- **Transformation**: Magical alterations and enhancements

### Room Bonuses
Each room provides unique bonuses:
- **Slave Pen**: Increased capacity (negative morale)
- **Arcane Lab**: Research and transformation power
- **Brothel**: Gold income and seduction training
- **Scout Tower**: Intelligence gathering and security
- **Recreation Wing**: Morale and loyalty boost
- **Armory**: Combat power and training
- **Treasury**: Gold storage capacity
- **Throne Room**: Reputation and influence
- **Dungeon**: Prisoner capacity and interrogation

## Development

The game is built with vanilla JavaScript using ES modules and Node.js built-in libraries.

### Project Structure
```
silver-happiness/
├── game.js              # Main entry point
├── src/
│   ├── game-engine.js   # Core game logic
│   ├── models/
│   │   ├── character.js # Character and NPC classes
│   │   ├── faction.js   # Faction and fort management
│   │   └── quest.js     # Quest system
│   ├── systems/
│   │   └── combat.js    # Turn-based combat
│   └── ui/
│       └── menu.js      # Menu interface
├── data/                # Game data files
└── saves/               # Save game files
```

## License

ISC

## Contributing

This is a community-driven project. Feel free to submit issues and pull requests!

## Documentation

- **[README.md](README.md)** - Main documentation (you are here)
- **[QUICKSTART.md](QUICKSTART.md)** - Getting started guide
- **[SPECIES_GUIDE.md](SPECIES_GUIDE.md)** - Complete species and subspecies reference (10,000+ words)
- **[TRANSFORMATION_GUIDE.md](TRANSFORMATION_GUIDE.md)** - Transformation and defeat mechanics (11,000+ words)
- **[BODY_PARTS_GUIDE.md](BODY_PARTS_GUIDE.md)** - Physical body part transformations catalog (50+ parts)
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete feature list and project summary

## Story Mode (Campaign)

The game features a fully implemented story mode with:

### Structure
- **Prologue**: The Forsaken Fortress - Establish your base and survive your first days
- **Act I**: Rise from Shadows - Build your power and face your first rival
- **Act II**: Dark Ambitions - Wage war and make difficult moral choices
- **Act III**: The Final Confrontation - Face Lord Malachar in an epic finale

### Features
- **Story Objectives**: Track your progress through clear, measurable goals
- **Branching Narrative**: Your choices affect the story and lead to different outcomes
- **Multiple Endings**: 4+ different endings based on your decisions throughout the campaign
- **Character-Driven Events**: Meet interesting characters and make impactful decisions
- **Integrated Gameplay**: Story mode uses all existing mechanics (combat, quests, transformation, etc.)

### Playing Story Mode
1. Select "New Game (Campaign Mode)" from the main menu
2. Complete objectives to progress through chapters
3. Make choices in story events that shape your character and the world
4. View your progress anytime through the "View Story Progress" menu
5. Experience unique narrative content while enjoying all core game features

## Roadmap

Future features planned:
- [x] Story mode with chapters and branching narratives
- [ ] More quest types and variety
- [ ] Voluntary transformations via Arcane Labs
- [ ] Transformation reversal system
- [ ] Additional story mode content and side stories
- [ ] Combat refinements and combat viewer
- [ ] Additional room types
- [ ] Relationship system expansion
- [ ] Mod support
