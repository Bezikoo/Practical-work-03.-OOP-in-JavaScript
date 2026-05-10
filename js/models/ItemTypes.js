import Item from './Item.js';

export class Weapon extends Item {
    #damage;
    
    constructor(id, name, width, height, description, damage) {
        super(id, name, width, height, description);
        this.#damage = damage;
    }

    get damage() { return this.#damage; }

    clone() {
        return new Weapon(this.id, this.name, this.width, this.height, this.description, this.#damage);
    }

    upgrade(amount) {
        this.#damage += amount;
    }

    getInfo() {
        return `${super.getInfo()} [Урон: ${this.#damage}]`;
    }
}

export class Consumable extends Item {
    #healAmount;
    
    constructor(id, name, width, height, description, healAmount) {
        super(id, name, width, height, description);
        this.#healAmount = healAmount;
    }

    get healAmount() { return this.#healAmount; }

    clone() {
        return new Consumable(this.id, this.name, this.width, this.height, this.description, this.#healAmount);
    }
}

export class QuestItem extends Item {
    constructor(id, name, width, height, description) {
        super(id, name, width, height, description);
    }

    clone() {
        return new QuestItem(this.id, this.name, this.width, this.height, this.description);
    }
}

export class Resource extends Item {
    constructor(id, name, width, height, description) {
        super(id, name, width, height, description);
    }

    clone() {
        return new Resource(this.id, this.name, this.width, this.height, this.description);
    }
}
