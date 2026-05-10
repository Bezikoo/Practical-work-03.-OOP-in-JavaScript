import Item from './Item.js';

/**
 * Specialized class for consumable items.
 * Demonstrates Inheritance.
 */
export default class Consumable extends Item {
    #healAmount;

    constructor(id, name, width, height, color, healAmount) {
        super(id, name, width, height, 'Consumable', color);
        this.#healAmount = healAmount;
    }

    get healAmount() { return this.#healAmount; }

    getInfo() {
        return `${super.getInfo()} - Heals: ${this.#healAmount} HP`;
    }
}
