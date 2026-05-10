export default class Item {
    #id;
    #name;
    #width;
    #height;
    #description;

    constructor(id, name, width, height, description) {
        if (new.target === Item) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.#id = id;
        this.#name = name;
        this.#width = width;
        this.#height = height;
        this.#description = description;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get width() { return this.#width; }
    get height() { return this.#height; }
    get size() { return this.#width * this.#height; }
    get description() { return this.#description; }
    get type() { return this.constructor.name; }

    getInfo() {
        return `${this.#name} (${this.#width}x${this.#height}): ${this.#description}`;
    }
}
