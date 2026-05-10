import { Consumable, Weapon } from '../models/ItemTypes.js';

export default class CraftingSystem {
    #recipes;

    constructor() {
        this.#recipes = [
            {
                ingredients: ['green_herb', 'green_herb'],
                result: () => new Consumable('mixed_herb_gg', 'Mixed Herb (G+G)', 1, 1, 'Сильна лікувальна суміш.', 50)
            },
            {
                ingredients: ['handgun', 'upgrade_kit'],
                result: (items) => {
                    const weapon = items.find(i => i.id === 'handgun');
                    // Create a new weapon instance with upgraded stats
                    const upgradedWeapon = new Weapon(
                       weapon.id, 
                       weapon.name + ' (Mk.II)', 
                       weapon.width, 
                       weapon.height, 
                       weapon.description, 
                       weapon.damage + 5
                    );
                    return upgradedWeapon;
                }
                }        ];
    }

    getRecipeResult(item1, item2) {
        const ids = [item1.id, item2.id].sort();
        
        for (const recipe of this.#recipes) {
            const recipeIds = [...recipe.ingredients].sort();
            if (JSON.stringify(ids) === JSON.stringify(recipeIds)) {
                return recipe.result([item1, item2]);
            }
        }
        return null;
    }
}
