import Item from './Item.js';

/**
 * Specialized class for resources/crafting materials.
 * Demonstrates Inheritance.
 */
export default class Resource extends Item {
    constructor(id, name, width, height, color) {
        super(id, name, width, height, 'Resource', color);
    }

    getInfo() {
        return `${super.getInfo()} (Crafting Material)`;
    }
}
