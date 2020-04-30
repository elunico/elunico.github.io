const STATUS_YELLOW = 'rgb(255, 221, 0)';
const STATUS_RED = 'red';

function getSelectedDropDown(optionElt) {
    return optionElt.options[optionElt.selectedIndex].value;
}

let addButton = document.getElementById('add-minion-button');
let add24Button = document.getElementById('add-24-minion-button');
let removeAllButton = document.getElementById('remove-all-minion-button');

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

    for (let i = 0; i < 24; i++)
        addMinionFromForm();
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
    }, 6000);
    return;

}

function addMinionFromForm() {
    let name = document.getElementById('minion-name').value;
    let actionTime = document.getElementById('action-int').value;
    let itemsPerAction = document.getElementById('item-action').value;
    let pricePerItem = document.getElementById('item-price').value;
    let fuel = getSelectedDropDown(document.getElementById('fuel'));
    let upgrade1 = getSelectedDropDown(document.getElementById('updrade1'));
    let upgrade2 = getSelectedDropDown(document.getElementById('upgrade2'));
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