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

- **Transformation System**:
  - Combat defeat transformations
  - Species-specific transformations (61 unique types)
  - Random encounters with transformation risks
  - Permanent stat modifications
  - Corruption and personality changes
  - NPC transformation on victory

- **Encounter System**:
  - Random daily encounters
  - Combat, Social, Magical, Trap, and Ambush types
  - Success/failure with consequences
  - Transformation risks based on difficulty
  - Relationship changes with NPCs

- **Game Modes**:
  - **Sandbox Mode**: Open-ended gameplay focused on faction growth
  - **Campaign Mode**: Structured quest lines with progression goals

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
- **[SPECIES_GUIDE.md](SPECIES_GUIDE.md)** - Complete species and subspecies reference
- **[TRANSFORMATION_GUIDE.md](TRANSFORMATION_GUIDE.md)** - Transformation and defeat mechanics

## Roadmap

Future features planned:
- [ ] More quest types and variety
- [ ] Voluntary transformations via Arcane Labs
- [ ] Transformation reversal system
- [ ] Campaign mode story content
- [ ] Combat refinements and combat viewer
- [ ] Additional room types
- [ ] Relationship system expansion
- [ ] Mod support
