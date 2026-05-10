export default class InventoryUI {
    #inventory;
    #gridEl;
    #usedCellsEl;
    #selectedEntries;

    constructor(inventory, gridElId, usedCellsElId) {
        this.#inventory = inventory;
        this.#gridEl = document.getElementById(gridElId);
        this.#usedCellsEl = document.getElementById(usedCellsElId);
        this.#selectedEntries = new Set();

        // Subscribe to inventory changes (Observer pattern)
        this.#inventory.subscribe(() => this.render());
    }

    get selectedEntries() {
        return Array.from(this.#selectedEntries);
    }

    clearSelection() {
        this.#selectedEntries.clear();
        this.render(); // re-render to update classes
    }

    render() {
        this.#gridEl.innerHTML = '';
        
        // Render 10x8 grid cells
        for (let y = 0; y < this.#inventory.rows; y++) {
            for (let x = 0; x < this.#inventory.cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                this.#gridEl.appendChild(cell);
            }
        }

        // Render items on top
        this.#inventory.items.forEach(entry => {
            const el = document.createElement('div');
            el.className = 'grid-item-visual';
            if (this.#selectedEntries.has(entry.id)) {
                el.classList.add('selected');
            }
            
            // Calculate position and size based on CSS variables or inline styles
            // Here we use inline styles with percentage or calc based on grid size
            // Cell size is 50px as per CSS
            const cellSize = 50;
            const gap = 2; // 2px gap
            
            el.style.left = `${entry.x * (cellSize + gap)}px`;
            el.style.top = `${entry.y * (cellSize + gap)}px`;
            el.style.width = `${entry.item.width * cellSize + (entry.item.width - 1) * gap}px`;
            el.style.height = `${entry.item.height * cellSize + (entry.item.height - 1) * gap}px`;
            
            // Item styling
            el.innerHTML = `<div><strong>${entry.item.name}</strong><br>${entry.item.width}x${entry.item.height}</div>`;
            el.style.backgroundColor = this.#getColorForType(entry.item.type);

            el.onclick = () => {
                if (this.#selectedEntries.has(entry.id)) {
                    this.#selectedEntries.delete(entry.id);
                } else {
                    this.#selectedEntries.add(entry.id);
                }
                this.render(); // Simple re-render
                // Dispatch event for main app to handle bottom panel
                document.dispatchEvent(new CustomEvent('inventorySelectionChanged'));
            };

            this.#gridEl.appendChild(el);
        });

        // Update stats
        this.#usedCellsEl.textContent = this.#inventory.getUsedCellsCount();
    }

    #getColorForType(type) {
        switch(type) {
            case 'Weapon': return '#4a148c'; // Dark purple
            case 'Consumable': return '#1b5e20'; // Dark green
            case 'QuestItem': return '#b71c1c'; // Dark red
            case 'Resource': return '#0d47a1'; // Dark blue
            default: return '#333';
        }
    }
}
