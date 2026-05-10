export default class Inventory {
    #cols;
    #rows;
    #grid;
    #items; // Array of { item, x, y }
    #subscribers;

    constructor(cols = 8, rows = 10) {
        this.#cols = cols;
        this.#rows = rows;
        this.#items = [];
        this.#subscribers = [];
        this.#initializeGrid();
    }

    #initializeGrid() {
        this.#grid = Array.from({ length: this.#rows }, () => Array(this.#cols).fill(null));
    }

    subscribe(callback) {
        this.#subscribers.push(callback);
    }

    #notify() {
        this.#subscribers.forEach(cb => cb(this));
    }

    get items() { return [...this.#items]; }
    get cols() { return this.#cols; }
    get rows() { return this.#rows; }

    getUsedCellsCount() {
        return this.#items.reduce((acc, curr) => acc + curr.item.size, 0);
    }

    findFreeSpace(width, height) {
        for (let y = 0; y <= this.#rows - height; y++) {
            for (let x = 0; x <= this.#cols - width; x++) {
                if (this.#canPlaceAt(x, y, width, height)) {
                    return { x, y };
                }
            }
        }
        return null; // No space found
    }

    #canPlaceAt(startX, startY, width, height) {
        if (startX + width > this.#cols || startY + height > this.#rows) return false;
        
        for (let y = startY; y < startY + height; y++) {
            for (let x = startX; x < startX + width; x++) {
                if (this.#grid[y][x] !== null) return false;
            }
        }
        return true;
    }

    addItem(item) {
        const pos = this.findFreeSpace(item.width, item.height);
        if (pos) {
            this.#placeItem(item, pos.x, pos.y);
            this.#notify();
            return true;
        }
        return false;
    }

    #placeItem(item, x, y) {
        const entry = { item, x, y, id: Math.random().toString(36).substr(2, 9) };
        this.#items.push(entry);
        
        for (let iy = y; iy < y + item.height; iy++) {
            for (let ix = x; ix < x + item.width; ix++) {
                this.#grid[iy][ix] = entry.id;
            }
        }
    }

    removeItemByEntryId(entryId) {
        const index = this.#items.findIndex(e => e.id === entryId);
        if (index > -1) {
            const entry = this.#items[index];
            this.#items.splice(index, 1);
            
            // Clear from grid
            for (let y = entry.y; y < entry.y + entry.item.height; y++) {
                for (let x = entry.x; x < entry.x + entry.item.width; x++) {
                    this.#grid[y][x] = null;
                }
            }
            this.#notify();
            return true;
        }
        return false;
    }

    clear() {
        this.#items = [];
        this.#initializeGrid();
        this.#notify();
    }

    defragment() {
        // Sort items by size (largest first helps pack better), then recreate grid
        const sortedItems = [...this.#items].map(e => e.item).sort((a, b) => b.size - a.size);
        
        this.#items = [];
        this.#initializeGrid();
        
        sortedItems.forEach(item => {
            const pos = this.findFreeSpace(item.width, item.height);
            if (pos) {
                this.#placeItem(item, pos.x, pos.y);
            }
        });
        this.#notify();
    }
}
