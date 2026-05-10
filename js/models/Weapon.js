import Item from './Item.js';

/**
 * Specialized class for weapons.
 * Demonstrates Inheritance.
 */
export default class Weapon extends Item {
    #damage;
    #ammoType;

    constructor(id, name, width, height, color, damage, ammoType) {
        super(id, name, width, height, 'Weapon', color);
        this.#damage = damage;
        this.#ammoType = ammoType;
    }

    get damage() { return this.#damage; }
    get ammoType() { return this.#ammoType; }

    getInfo() {
        return `${super.getInfo()} - Damage: ${this.#damage}, Ammo: ${this.#ammoType}`;
    }
}
