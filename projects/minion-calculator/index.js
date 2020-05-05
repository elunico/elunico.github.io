const STATUS_YELLOW = 'rgb(255, 191, 0)';
const STATUS_RED = 'red';

const fuelDropdown = new DropDown('fuel');
const upgrade1Dropdown = new DropDown('upgrade1');
const upgrade2Dropdown = new DropDown('upgrade2');

const addButton = document.getElementById('add-minion-button');
const add24Button = document.getElementById('add-24-minion-button');
const removeAllButton = document.getElementById('remove-all-minion-button');
const colorSchemeButton = document.getElementById('color-scheme-button');

let isDark = matchMedia('(prefers-color-scheme: dark)').matches;
colorSchemeButton.value = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";

function switchScheme() {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty('--input-color', '#152689');
        root.style.setProperty('--background-color', '#fff');
        root.style.setProperty('--foreground-color', '#152689');
        root.style.setProperty('--link-visited-color', '#455de4');
        root.style.setProperty('--link-color', '#1657e4');
        root.style.setProperty('--stat-color', '#0060dd');
    } else {
        root.style.setProperty('--input-color', '#000');
        root.style.setProperty('--background-color', '#09165f');
        root.style.setProperty('--foreground-color', '#c0c0c0');
        root.style.setProperty('--link-visited-color', 'rgb(165, 170, 238);');
        root.style.setProperty('--link-color', '#3e75ee');
        root.style.setProperty('--stat-color', '#fff');
    }
    isDark = !isDark;
    colorSchemeButton.value = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
}

function repeat(times, block) { for (let i = 0; i < times; i++) block(); }

removeAllButton.onclick = () => {
    let answer = confirm("Are you sure?");
    if (!answer) return;
    for (let i = 1; i <= MAX_MINION_SLOTS; i++) {
        MinionSlot.removeFromLocalStorage(i);
        MinionSlot.removeMinion(i);
    }
}

add24Button.onclick = () => {
    if (MinionSlot.totalSlots !== 0) {
        showStatus('You must not have any minions to add 24');
        return;
    }

    repeat(24, addMinionFromForm);
}


addButton.onclick = () => {
    if (MinionSlot.isFull()) {
        showStatus('No Free Minion Slots');
        return;
    }

    addMinionFromForm();
};

let timeout = null;

function showStatus(status, color) {
    color = color || 'red';
    if (timeout) {
        clearTimeout(timeout);
    }
    let elt = document.getElementById('add-status');
    elt.style.color = color;
    elt.textContent = status;
    timeout = setTimeout(() => {
        elt.textContent = '';
        timeout = null;
    }, 10000);
    return;

}

function addMinionFromForm() {
    let name = document.getElementById('minion-name').value;
    let actionTime = document.getElementById('action-int').value;
    let itemsPerAction = document.getElementById('item-action').value;
    let pricePerItem = document.getElementById('item-price').value;
    let fuel = fuelDropdown.getSelectedItem(); //getSelectedDropDown(document.getElementById('fuel'));
    let upgrade1 = upgrade1Dropdown.getSelectedItem(); // getSelectedDropDown(document.getElementById('updrade1'));
    let upgrade2 = upgrade2Dropdown.getSelectedItem(); //getSelectedDropDown(document.getElementById('upgrade2'));
    let additionalBonusPercentage = document.getElementById('additional-bonus').value || 0;
    additionalBonusPercentage /= 100; // divide extra percentage to get fractional value
    if (!(actionTime && itemsPerAction && pricePerItem && fuel && upgrade1 && upgrade2)) {
        showStatus("You must enter something in at least the first 3 fields");
        return;
    } else {
        showStatus('');
    } // data verified 
    let minionSlot = new MinionSlot(name, actionTime, itemsPerAction, pricePerItem, fuel, upgrade1, upgrade2, additionalBonusPercentage);
    minionSlot.toLocalStorage();
    minionSlot.render();
}

window.onload = () => {
    for (let i = 1; i <= MAX_MINION_SLOTS; i++)
        MinionSlot.fromLocalStorage(i);
};