/**
 * Faction and Fort management models
 */

export const RoomType = {
    SLAVE_PEN: 'slave_pen',
    ARCANE_LAB: 'arcane_lab',
    BROTHEL: 'brothel',
    SCOUT_TOWER: 'scout_tower',
    RECREATION_WING: 'recreation_wing',
    ARMORY: 'armory',
    TREASURY: 'treasury',
    THRONE_ROOM: 'throne_room',
    DUNGEON: 'dungeon'
};

/**
 * A room in the fort
 */
export class Room {
    constructor(roomType, level = 1) {
        this.roomType = roomType;
        this.level = level;
        this.capacity = this._calculateCapacity();
        this.bonuses = this._calculateBonuses();
    }

    _calculateCapacity() {
        const baseCapacity = {
            [RoomType.SLAVE_PEN]: 10,
            [RoomType.ARCANE_LAB]: 3,
            [RoomType.BROTHEL]: 5,
            [RoomType.SCOUT_TOWER]: 4,
            [RoomType.RECREATION_WING]: 8,
            [RoomType.ARMORY]: 6,
            [RoomType.TREASURY]: 1,
            [RoomType.THRONE_ROOM]: 1,
            [RoomType.DUNGEON]: 8
        };
        return (baseCapacity[this.roomType] || 5) + (this.level - 1) * 2;
    }

    _calculateBonuses() {
        const bonuses = {
            [RoomType.SLAVE_PEN]: { morale: -5, capacity: 10 },
            [RoomType.ARCANE_LAB]: { arcaneResearch: 10, transformationPower: 5 },
            [RoomType.BROTHEL]: { goldIncome: 20, seductionTraining: 5 },
            [RoomType.SCOUT_TOWER]: { intelGathering: 15, security: 10 },
            [RoomType.RECREATION_WING]: { morale: 10, loyalty: 5 },
            [RoomType.ARMORY]: { combatPower: 15, brawnTraining: 5 },
            [RoomType.TREASURY]: { goldCapacity: 1000 },
            [RoomType.THRONE_ROOM]: { reputation: 10, influence: 10 },
            [RoomType.DUNGEON]: { prisonerCapacity: 8, interrogation: 10 }
        };
        
        const roomBonus = bonuses[this.roomType] || {};
        // Scale bonuses with level
        const scaled = {};
        for (const [key, value] of Object.entries(roomBonus)) {
            scaled[key] = value * this.level;
        }
        return scaled;
    }

    /**
     * Upgrade room, returns cost
     */
    upgrade() {
        const cost = this.getUpgradeCost();
        this.level += 1;
        this.capacity = this._calculateCapacity();
        this.bonuses = this._calculateBonuses();
        return cost;
    }

    getUpgradeCost() {
        return 100 * this.level * this.level;
    }

    toJSON() {
        return {
            roomType: this.roomType,
            level: this.level,
            capacity: this.capacity,
            bonuses: this.bonuses
        };
    }

    static fromJSON(data) {
        return new Room(data.roomType, data.level);
    }
}

/**
 * A district within the fort
 */
export class District {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.cleared = false;
        this.rooms = [];
        this.rubble = 100; // 0-100, needs clearing
    }

    addRoom(room) {
        this.rooms.push(room);
    }

    clearRubble(amount) {
        this.rubble = Math.max(0, this.rubble - amount);
        if (this.rubble === 0) {
            this.cleared = true;
        }
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            cleared: this.cleared,
            rooms: this.rooms.map(r => r.toJSON()),
            rubble: this.rubble
        };
    }

    static fromJSON(data) {
        const district = new District(data.name, data.description);
        district.cleared = data.cleared;
        district.rooms = data.rooms.map(r => Room.fromJSON(r));
        district.rubble = data.rubble;
        return district;
    }
}

/**
 * Player's faction
 */
export class Faction {
    constructor(name) {
        this.name = name;
        this.gold = 500;
        this.reputation = 50;    // 0-100
        this.corruption = 0;     // 0-100
        this.morale = 50;        // 0-100
        this.influence = 10;
        
        // Resources
        this.resources = {
            food: 100,
            materials: 50,
            arcaneEssence: 10
        };
        
        // Districts
        this.districts = [];
        this._initializeDistricts();
    }

    _initializeDistricts() {
        // Throne District
        const throne = new District(
            'Throne District',
            'The heart of your faction, where you rule.'
        );
        throne.cleared = true;
        throne.addRoom(new Room(RoomType.THRONE_ROOM, 1));
        this.districts.push(throne);
        
        // The Slums
        const slums = new District(
            'The Slums',
            'A rundown area filled with rubble and desperate souls.'
        );
        this.districts.push(slums);
        
        // Market Quarter
        const market = new District(
            'Market Quarter',
            'Once a bustling trade center, now in ruins.'
        );
        this.districts.push(market);
    }

    addGold(amount) {
        this.gold += amount;
    }

    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    addResource(resource, amount) {
        if (this.resources[resource] !== undefined) {
            this.resources[resource] += amount;
        } else {
            this.resources[resource] = amount;
        }
    }

    spendResource(resource, amount) {
        if (this.resources[resource] !== undefined && this.resources[resource] >= amount) {
            this.resources[resource] -= amount;
            return true;
        }
        return false;
    }

    getTotalBonuses() {
        const total = {};
        for (const district of this.districts) {
            for (const room of district.rooms) {
                for (const [bonusType, value] of Object.entries(room.bonuses)) {
                    total[bonusType] = (total[bonusType] || 0) + value;
                }
            }
        }
        return total;
    }

    toJSON() {
        return {
            name: this.name,
            gold: this.gold,
            reputation: this.reputation,
            corruption: this.corruption,
            morale: this.morale,
            influence: this.influence,
            resources: this.resources,
            districts: this.districts.map(d => d.toJSON())
        };
    }

    static fromJSON(data) {
        const faction = new Faction(data.name);
        faction.gold = data.gold;
        faction.reputation = data.reputation;
        faction.corruption = data.corruption;
        faction.morale = data.morale;
        faction.influence = data.influence;
        faction.resources = data.resources;
        faction.districts = data.districts.map(d => District.fromJSON(d));
        return faction;
    }
}
