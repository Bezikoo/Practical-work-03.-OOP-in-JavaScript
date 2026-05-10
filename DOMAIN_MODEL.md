# Domain Model: Survival-Horror Inventory System

## 1. Analysis of Mechanics
The system is inspired by classic survival-horror games (Resident Evil). Key features:
- **Spatial Management**: Items have specific dimensions (e.g., 1x1, 1x2, 2x2) and must fit into a fixed 2D grid (8x10).
- **Categorization**: Items are divided into Weapons, Consumables, and Resources, each with unique properties.
- **Crafting**: Players can combine resources to create more useful items (e.g., combining herbs or ammo components).
- **Optimization**: A "Sort" function automatically rearranges items to maximize free space (defragmentation).

## 2. Entities
- **Item**: Abstract base class defining common properties (id, name, width, height).
- **Weapon**: Extends Item; includes combat stats (damage, ammo).
- **Consumable**: Extends Item; includes recovery stats (healing amount).
- **Resource**: Extends Item; used primarily for crafting.
- **Inventory**: Core logic class managing the 2D matrix, item placement, and spatial validation.
- **Recipe**: Defines required ingredients and the resulting item.
- **CraftingSystem**: Manages the list of recipes and executes the crafting logic.

## 3. Class Diagram (Mermaid.js)
```mermaid
classDiagram
    class Item {
        #id: string
        #name: string
        #width: number
        #height: number
        #type: string
        +getDimensions()
        +getInfo()
    }

    class Weapon {
        #damage: number
        #ammo: number
        +fire()
        +reload()
    }

    class Consumable {
        #healAmount: number
        +use()
    }

    class Resource {
        #isCraftable: boolean
    }

    class Inventory {
        -grid: Array[][]
        -items: Map
        +addItem(item, x, y): boolean
        +autoAddItem(item): boolean
        +removeItem(itemId): void
        +canFit(item, x, y): boolean
        +findSpace(item): Object
        +sort(): void
        +clear(): void
    }

    class Recipe {
        +ingredients: Map
        +result: Item
    }

    class CraftingSystem {
        +recipes: Recipe[]
        +checkAvailable(inventory): Recipe[]
        +craft(recipe, inventory): Item
    }

    Item <|-- Weapon
    Item <|-- Consumable
    Item <|-- Resource
    Inventory "1" *-- "many" Item
    CraftingSystem ..> Recipe
    CraftingSystem ..> Inventory
```

## 4. SOLID Principles Justification
- **Single Responsibility Principle (SRP)**: Logic is strictly separated. `Inventory` only cares about the grid, `Item` only cares about its data, and `InventoryUI` (implementation detail) only cares about rendering.
- **Open/Closed Principle (OCP)**: Adding a new item type (e.g., `Armor` or `KeyItem`) doesn't require modifying the `Inventory` or `CraftingSystem` classes.
- **Liskov Substitution Principle (LSP)**: All item types inherit from `Item` and can be treated polymorphically by the `Inventory` system.
- **Interface Segregation Principle (ISP)**: By using specialized classes for different item behaviors, we ensure that a `Resource` doesn't need to implement `fire()` like a `Weapon`.
- **Dependency Inversion Principle (DIP)**: High-level modules (UI) interact with the `Inventory` abstraction, not with low-level grid implementation details.
