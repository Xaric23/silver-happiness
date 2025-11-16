# Dark Fantasy Fort Management RPG - Quick Start Guide

## First Steps

When you start the game for the first time, you'll be presented with the main menu:

1. **New Game (Sandbox Mode)** - Free-form gameplay with no restrictions
2. **New Game (Campaign Mode)** - Story-driven experience with chapters and objectives
3. **Load Game** - Continue a saved game
4. **About** - Learn about the game
5. **Exit** - Quit the game

### Choosing Your Mode

**Sandbox Mode** is perfect if you want to:
- Experiment with game mechanics freely
- Build your ideal fortress without constraints
- Focus on optimization and strategy
- Create your own narrative

**Story Mode (Campaign)** is ideal if you want:
- A structured narrative experience
- Clear objectives and goals
- Character-driven events and choices
- Multiple endings based on your decisions
- A guided introduction to the game's features

See the [STORY_MODE_GUIDE.md](STORY_MODE_GUIDE.md) for complete story mode documentation.

## Creating Your Character

1. Choose **New Game (Sandbox Mode)**
2. Enter your character name (e.g., "Draven Shadowborn")
3. Enter your faction name (e.g., "The Dark Order")

Your character starts with:
- **500 Gold**
- **Balanced stats** (slightly boosted above average)
- **3 Districts** (Throne District, The Slums, Market Quarter)
- **5 Random NPCs**
- **3 Available Quests**

## Understanding the Interface

### Main Status Bar
```
Day 1 - The Dark Order
Gold: 500 | Reputation: 50/100
Morale: 50/100 | Corruption: 0/100
```

This shows your current game state at a glance.

### Main Menu Options

#### 1. View Faction Status
See detailed information about your faction:
- Gold and resources
- Reputation, morale, corruption, influence
- Active bonuses from your rooms

#### 2. Manage Fort
- **Clear rubble** - Spend 50 gold to clear 20% rubble from a district
- **Build room** - Spend 200 gold to construct a new room (district must be fully cleared)
- **Upgrade room** - Improve existing rooms for greater bonuses

#### 3. View NPCs
See all characters in your faction:
- Their stats (Brawn, Intrigue, Arcane, Survival, Seduction)
- Current relationship level
- Assignment status (available or on mission)

#### 4. View Quests
Manage available and active quests:
- **Available Quests** - Can be started by assigning an NPC
- **Active Quests** - Currently in progress
- Assign NPCs to quests if they meet the requirements

#### 5. Advance Day
Progress time forward:
- Collect daily income from rooms
- Complete active quests
- Generate new random events
- Spawn new NPCs and quests

#### 6. Save Game
Save your progress to continue later

## Strategy Tips

### Early Game (Days 1-10)

1. **Clear The Slums first**
   - It's the cheapest district to develop
   - Build a Recreation Wing to boost morale
   - Or build a Brothel for gold income

2. **Assign NPCs to quests carefully**
   - Match NPC stats to quest requirements
   - Combat quests need high Brawn
   - Espionage needs Intrigue
   - Social quests need Seduction

3. **Balance your economy**
   - Brothels generate +20 gold/day per level
   - Treasury increases gold storage capacity
   - Don't overspend early on

### Mid Game (Days 11-30)

1. **Expand your fort**
   - Clear and develop the Market Quarter
   - Build an Arcane Lab for transformation research
   - Add an Armory for combat training

2. **Build relationships**
   - Recruit skilled NPCs
   - Higher relationship = better quest performance
   - Some NPCs are better for specific quest types

3. **Manage reputation and corruption**
   - High reputation unlocks better opportunities
   - Corruption affects available transformations
   - Balance these for your playstyle

### Late Game (Days 30+)

1. **Optimize room bonuses**
   - Upgrade high-value rooms
   - Stack bonuses for specific strategies
   - Consider specialized fort layouts

2. **Transform characters**
   - Use Arcane Lab bonuses
   - Apply transformations strategically
   - Each transformation changes stats

3. **Dominate the realm**
   - High influence lets you control more
   - Multiple districts fully developed
   - Powerful transformed NPCs

## Room Types and Strategies

### Economic Rooms
- **Brothel** - Primary gold generator (+20 gold/day/level)
- **Treasury** - Increases gold storage capacity

### Military Rooms
- **Armory** - Combat power and training bonuses
- **Scout Tower** - Intelligence and security

### Magical Rooms
- **Arcane Lab** - Research and transformation power
- **Dungeon** - Prisoner management and interrogation

### Support Rooms
- **Recreation Wing** - Boosts morale and loyalty
- **Slave Pen** - Increases capacity (reduces morale)
- **Throne Room** - Reputation and influence

## Quest Types Guide

### Combat Quests
- **Requirements**: High Brawn stat
- **Rewards**: Good gold, moderate reputation
- **Examples**: "Clear the Ruins", "Defend the Fort"

### Espionage Quests
- **Requirements**: High Intrigue stat
- **Rewards**: Intelligence, moderate rewards
- **Examples**: "Gather Intelligence", "Steal Documents"

### Resource Gathering
- **Requirements**: High Survival stat
- **Rewards**: Materials, food, or arcane essence
- **Examples**: "Collect Materials", "Hunt for Food"

### Social Quests
- **Requirements**: High Seduction stat
- **Rewards**: Reputation, influence, alliances
- **Examples**: "Seduce Noble", "Entertain Guests"

## Example Play Session

```
Day 1: Start with 500 gold
- Spend 50 gold to clear rubble in The Slums (2x)
- Slums now fully cleared
- Assign Kael (high Brawn) to Combat quest
- Assign Aria (high Seduction) to Social quest

Day 2: Advance time
- Kael's quest: 2 days remaining
- Aria's quest: 2 days remaining
- Build Recreation Wing in The Slums (200 gold)
- Gold: 250, Morale: +10

Day 3: Advance time
- Quests still in progress
- Save game

Day 4: Advance time
- Kael returns victorious! +100 gold, +5 reputation
- Aria seduces noble! +75 gold, +8 reputation
- Gold: 425, Rep: 63/100
- New NPC arrives: Luna Bloodmoon
- New quest available: "Mine Arcane Essence"
```

## Save Files

Save files are stored in the `saves/` directory as JSON files.

To save:
1. Choose "Save Game" from main menu
2. Enter a filename (without .json extension)
3. Example: "my_game_day_10"

To load:
1. Choose "Load Game" from main menu
2. Enter the same filename
3. Example: "my_game_day_10"

## Advanced Topics

### Transformation System
- Unlocked through Arcane Labs
- Requires arcane essence and corruption
- Permanently modifies character stats
- Can stack multiple transformations

### Morale Management
- Affected by rooms (Recreation +, Slave Pen -)
- Low morale causes unrest events
- High morale improves quest success

### Corruption
- Gained from dark magic and certain actions
- Opens darker transformation options
- May trigger special events
- Affects reputation with some factions

## Troubleshooting

**Q: My NPC can't be assigned to a quest**
A: Check if they meet the stat requirements. The game shows ✓ or ✗ next to each NPC name.

**Q: I'm running out of gold**
A: Build Brothels for steady income. Complete resource gathering quests. Upgrade your Treasury.

**Q: How do I increase stats?**
A: Build training rooms (Armory for Brawn, Brothel for Seduction). Apply transformations.

**Q: What's the goal?**
A: In Sandbox mode, create your own goals! Build the ultimate fort, max all stats, achieve 100 reputation, or role-play your dark overlord fantasy.

## Content Roadmap

Coming soon:
- Campaign mode with storyline
- More transformation options
- Additional room types
- Relationship system
- Combat encounters
- Special events and scenarios
- Mod support

Enjoy your dark reign!
