import Inventory from './core/Inventory.js';
import CraftingSystem from './core/CraftingSystem.js';
import InventoryUI from './ui/InventoryUI.js';
import { Weapon, Consumable, QuestItem, Resource } from './models/ItemTypes.js';

// --- INIT ---
const inventory = new Inventory(10, 8); // 10 columns x 8 rows
const ui = new InventoryUI(inventory, 'inventory-grid', 'used-cells');
const craftingSystem = new CraftingSystem();

// Initial Items Catalog
const catalogItems = [
    new Weapon('handgun', 'Handgun', 2, 2, 'Стандартний пістолет.', 10),
    new Weapon('shotgun', 'Shotgun', 4, 1, 'Потужний дробовик.', 25),
    new Consumable('green_herb', 'Green Herb', 1, 1, 'Лікувальна трава.', 20),
    new QuestItem('keycard', 'Blue Keycard', 1, 1, 'Відкриває сині двері.'),
    new Resource('upgrade_kit', 'Upgrade Kit', 1, 2, 'Модифікація зброї.'),
    new Resource('gunpowder', 'Gunpowder', 1, 1, 'Для набоїв.')
];

// --- DOM ELEMENTS ---
const catalogListEl = document.getElementById('catalog-list');
const itemInfoEl = document.getElementById('item-info');
const craftBtn = document.getElementById('craft-btn');
const deleteBtn = document.getElementById('delete-btn');
const sortBtn = document.getElementById('sort-btn');
const clearBtn = document.getElementById('clear-btn');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

// --- CATALOG RENDERING ---
function renderCatalog(filterText = '', filterCategory = 'all') {
    catalogListEl.innerHTML = '';
    
    catalogItems.forEach(item => {
        if (filterCategory !== 'all' && item.type !== filterCategory) return;
        if (filterText && !item.name.toLowerCase().includes(filterText.toLowerCase())) return;

        const el = document.createElement('div');
        el.className = 'catalog-item';
        el.innerHTML = `
            <div class="details">
                <span class="name">${item.name}</span>
                <span class="type">${item.type}</span>
                <span class="size">${item.width}x${item.height}</span>
            </div>
            <div>
                <button class="btn-primary btn-small add-btn">Додати</button>
            </div>
        `;
        
        el.querySelector('.add-btn').onclick = () => {
            // Add a clone to inventory using the proper OOP method
            const clone = item.clone();
            if (!inventory.addItem(clone)) {
                alert('Немає вільного місця в інвентарі!');
            }
        };
        
        catalogListEl.appendChild(el);
    });
}

// --- ACTION PANEL UPDATES ---
document.addEventListener('inventorySelectionChanged', () => {
    const selectedIds = ui.selectedEntries;
    
    if (selectedIds.length === 0) {
        itemInfoEl.innerHTML = '<span class="placeholder-text">Нічого не вибрано.</span>';
        craftBtn.disabled = true;
        deleteBtn.disabled = true;
        return;
    }

    const entries = selectedIds.map(id => inventory.items.find(e => e.id === id));
    
    if (selectedIds.length === 1) {
        itemInfoEl.innerHTML = `<strong>${entries[0].item.name}</strong><br>${entries[0].item.description}`;
        craftBtn.disabled = true;
        deleteBtn.disabled = false;
    } else if (selectedIds.length === 2) {
        itemInfoEl.innerHTML = `<strong>Вибрано 2 предмети:</strong> ${entries[0].item.name} та ${entries[1].item.name}`;
        deleteBtn.disabled = false;
        
        // Check if craftable
        const result = craftingSystem.getRecipeResult(entries[0].item, entries[1].item);
        craftBtn.disabled = !result;
    } else {
        itemInfoEl.innerHTML = `<strong>Вибрано ${selectedIds.length} предметів.</strong>`;
        craftBtn.disabled = true;
        deleteBtn.disabled = false;
    }
});

// --- BUTTON LISTENERS ---
deleteBtn.onclick = () => {
    ui.selectedEntries.forEach(id => inventory.removeItemByEntryId(id));
    ui.clearSelection();
    document.dispatchEvent(new CustomEvent('inventorySelectionChanged'));
};

craftBtn.onclick = () => {
    const selectedIds = ui.selectedEntries;
    if (selectedIds.length === 2) {
        const item1 = inventory.items.find(e => e.id === selectedIds[0]).item;
        const item2 = inventory.items.find(e => e.id === selectedIds[1]).item;
        
        const result = craftingSystem.getRecipeResult(item1, item2);
        if (result) {
            inventory.removeItemByEntryId(selectedIds[0]);
            inventory.removeItemByEntryId(selectedIds[1]);
            
            // Спроба додати предмет
            if (!inventory.addItem(result)) {
                // Якщо не влізло через фрагментацію — дефрагментуємо і пробуємо знову
                inventory.defragment();
                if (!inventory.addItem(result)) {
                    alert('Навіть після дефрагментації предмет не поміщається!');
                }
            }
            
            ui.clearSelection();
            document.dispatchEvent(new CustomEvent('inventorySelectionChanged'));
            itemInfoEl.innerHTML = `<strong style="color: #4caf50;">Успішно скрафчено: ${result.name}!</strong>`;
        }
    }
};

sortBtn.onclick = () => inventory.defragment();

clearBtn.onclick = () => {
    if (confirm('Очистити весь інвентар?')) {
        inventory.clear();
        ui.clearSelection();
        document.dispatchEvent(new CustomEvent('inventorySelectionChanged'));
    }
};

searchInput.oninput = (e) => renderCatalog(e.target.value, categoryFilter.value);
categoryFilter.onchange = (e) => renderCatalog(searchInput.value, e.target.value);

// --- START ---
renderCatalog();
ui.render();
ART ---
renderCatalog();
ui.render();
