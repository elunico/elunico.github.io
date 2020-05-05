const MAX_MINION_SLOTS = 24;

const SLOT_REGISTER = {};
for (let i = 1; i <= MAX_MINION_SLOTS; i++) {
    SLOT_REGISTER[i] = null;
}

function updateCoinTotals() {
    const formatter = Intl.NumberFormat('en-US');
    let hourTotal = 0
    for (let value of Object.values(SLOT_REGISTER)) {
        if (value !== null)
            hourTotal += value.calculateHourlyCoins();
    }
    document.getElementById('coin-total-hour').textContent = formatter.format(hourTotal);
    document.getElementById('coin-total-day').textContent = formatter.format(hourTotal * 24);
    document.getElementById('coin-total-week').textContent = formatter.format(hourTotal * 24 * 7);
}

function getFuelSpeedMultiplier(fuel) {
    switch (fuel) {
        case "coal":
        case "blockcoal":
        case "ebread":
            return 0.05;
        case 'ecoal':
            return 0.1;
        case 'echarcoal':
            return 0.2;
        case 'solarpanel':
        case 'elava':
            return 0.25;
        case 'hamsterwheel':
            return 0.5
        case 'foulflesh':
            return 0.9

    }
    return 0;
}

function calculateNewSpeed(baseSpeed, fuel, up1, up2, addbonus) {
    // totalSpeed = total fraction of speed multipliers of all sources
    // i.e 0.25 (elava) + 0.3 (rabbit pet) = 0.55 total bus sum
    // bonus speed = base speed * (1 - (totalSpeed / (1 + totalSpeed)))
    let bonus1 = getFuelSpeedMultiplier(fuel);
    let totalSpeed = bonus1 + Number(addbonus);
    if (up1 == 'flycatcher')
        totalSpeed += 0.2;

    if (up2 == 'flycatcher')
        totalSpeed += 0.2;

    if (up1 == 'minionexpander')
        totalSpeed += 0.05;

    if (up2 == 'minionexpander')
        totalSpeed += 0.05;

    return baseSpeed * (1 - (totalSpeed / (1 + totalSpeed)));
}

function calculateHour(actionInterval, itemsPerAction, pricePerItem, fuel, up1, up2, addbonus) {
    // items per action is (drops / 2) because minion actions consist of 
    // placing/spawning and mining/killing. Only every OTHER action results 
    // in drops user should enter value as a drops/2 but this can be changed
    // later if needed (farms can kill mobs without minions so it is more 
    // flexible to keep it as items per action)

    let speed = calculateNewSpeed(actionInterval, fuel, up1, up2, addbonus); // get speed
    if (fuel == 'catalyst')
        itemsPerAction *= 3;

    let diamondspreading = 0;
    if (up1 == 'diamondspreading' || up2 == 'diamondspreading')
        diamondspreading = (5760 / speed);

    // (money for drops per hour) + (diamond spreading per hour if applicable)
    return (3600 / speed * itemsPerAction * pricePerItem) + diamondspreading;
}

class MinionSlot {
    static totalSlots = 0;
    static minionSlotContainer = null;

    constructor(name, actionTime, itemsPerAction, pricePerItem, fuel, upgrade1, upgrade2, additionalBonusPercentage) {
        this.name = name;
        this.id = MinionSlot.getNextSlot();
        this.actionTime = actionTime;
        this.itemsPerAction = itemsPerAction;
        this.pricePerItem = pricePerItem;
        this.fuel = fuel;
        this.upgrade1 = upgrade1;
        this.upgrade2 = upgrade2;
        this.additionalBonusPercentage = additionalBonusPercentage;
        this.occupied = true;
        this._htmlExists = false;

        SLOT_REGISTER[this.id] = this;
    }

    static isFull() {
        return Object.values(SLOT_REGISTER).filter((v) => v === null).length == 0;
    }

    static getNextSlot() {
        for (let key of Object.keys(SLOT_REGISTER)) {
            if (SLOT_REGISTER[key] === null) {
                MinionSlot.incrementMinionCount();
                return key;
            }
        }
        throw 'No More Minion Slots';
        // MinionSlot.incrementMinionCount();
        // return MinionSlot.totalSlots;
    }

    static fromLocalStorage(id) {
        const str = localStorage.getItem(`minion-slot-${id}`);
        if (!str) return;
        const data = JSON.parse(str);

        const obj = new MinionSlot();

        obj.name = data[`sl${id}-minion-name`];
        obj.actionTime = data[`sl${id}-action-int`];
        obj.itemsPerAction = data[`sl${id}-item-action`];
        obj.pricePerItem = data[`sl${id}-item-price`];
        obj.fuel = data[`sl${id}-fuel`];
        obj.upgrade1 = data[`sl${id}-updrade1`];
        obj.upgrade2 = data[`sl${id}-upgrade2`];
        obj.additionalBonusPercentage = data[`sl${id}-additional-bonus`];
        obj.occupied = true;

        obj.render();
        console.log(JSON.stringify(obj));
    }

    static setParentContainer(elt) {
        MinionSlot.minionSlotContainer = elt;
    }

    buildHTMLForSlot(parentElt) {
        this._htmlExists = true;

        let table = document.createElement('table');
        let tbody = document.createElement('tbody');
        let tr1 = document.createElement('tr');
        let tr2 = document.createElement('tr');
        let tr3 = document.createElement('tr');
        let tr4 = document.createElement('tr');

        let p = document.createElement('p');
        p.id = `minion-slot-${this.id}`;

        let contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Minion Name: ';
        let fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-minion-name`;
        fieldSpan.className = 'minion-stat-cell';
        tr1.appendChild(contDiv);
        tr1.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Action interval: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-action-int`;
        fieldSpan.className = 'minion-stat-cell';
        tr2.appendChild(contDiv);
        tr2.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Items per action: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-item-action`;
        fieldSpan.className = 'minion-stat-cell';
        tr3.appendChild(contDiv);
        tr3.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Price per Item: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-item-price`;
        fieldSpan.className = 'minion-stat-cell';
        tr4.appendChild(contDiv);
        tr4.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Fuel: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-fuel`;
        fieldSpan.className = 'minion-stat-cell';
        tr1.appendChild(contDiv);
        tr1.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Upgrade 1: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-updrade1`;
        fieldSpan.className = 'minion-stat-cell';
        tr2.appendChild(contDiv);
        tr2.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Upgrade 2: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-upgrade2`;
        fieldSpan.className = 'minion-stat-cell';
        tr3.appendChild(contDiv);
        tr3.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = "Addt'l speed factor: ";
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-additional-bonus`;
        fieldSpan.className = 'minion-stat-cell';
        tr4.appendChild(contDiv);
        tr4.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Coins/Hour: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-coinshour`;
        fieldSpan.className = 'minion-stat-cell-coins';
        tr1.appendChild(contDiv);
        tr1.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Coins/Day: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-coinsday`;
        fieldSpan.className = 'minion-stat-cell-coins';
        tr2.appendChild(contDiv);
        tr2.appendChild(fieldSpan);

        contDiv = document.createElement('td');
        contDiv.className = 'minion-cell'
        contDiv.textContent = 'Coins/Week: ';
        fieldSpan = document.createElement('td');
        fieldSpan.id = `sl${this.id}-coinsweek`;
        fieldSpan.className = 'minion-stat-cell-coins';
        tr3.appendChild(contDiv);
        tr3.appendChild(fieldSpan);

        let removeButton = document.createElement('input');
        removeButton.type = "button";
        removeButton.value = "Remove Minion";
        removeButton.onclick = () => MinionSlot.removeMinion(this.id);

        let editButton = document.createElement('input');
        editButton.type = 'button';
        editButton.value = 'Edit Minion';
        editButton.onclick = () => this.editMinion();

        table.appendChild(tbody);
        tbody.appendChild(tr1);
        tbody.appendChild(tr2);
        tbody.appendChild(tr3);
        tbody.appendChild(tr4);
        p.appendChild(table);

        p.appendChild(editButton);
        p.appendChild(removeButton);
        parentElt.appendChild(p);
    }

    static decrementMinionCount() {
        MinionSlot.totalSlots--;
        document.getElementById('slot-count').textContent = MinionSlot.totalSlots;
    }

    static incrementMinionCount() {
        MinionSlot.totalSlots++;
        document.getElementById('slot-count').textContent = MinionSlot.totalSlots;
    }

    static removeFromLocalStorage(id) {
        localStorage.removeItem(`minion-slot-${id}`);
    }

    static removeMinion(id) {
        let elt = document.getElementById(`minion-slot-${id}`);
        if (!elt) return;

        MinionSlot.removeFromLocalStorage(id);
        MinionSlot.decrementMinionCount();

        MinionSlot.minionSlotContainer.removeChild(elt);

        SLOT_REGISTER[id] = null;

        updateCoinTotals();
    }

    editMinion() {
        document.getElementById('minion-name').value = this.name;
        document.getElementById('action-int').value = this.actionTime;
        document.getElementById('item-action').value = this.itemsPerAction;
        document.getElementById('item-price').value = this.pricePerItem;
        fuelDropdown.selectItem(this.fuel);
        upgrade1Dropdown.selectItem(this.upgrade1);
        upgrade2Dropdown.selectItem(this.upgrade2);
        document.getElementById('additional-bonus').value = this.additionalBonusPercentage * 100; // back to a percent for the form

        MinionSlot.removeMinion(this.id);
    }

    toLocalStorage() {
        localStorage.setItem(`minion-slot-${this.id}`, JSON.stringify(this.toJSON()));
    }

    calculateHourlyCoins() {
        if (this.upgrade1 == 'diamondspreading' && this.upgrade2 == 'diamondspreading') {
            showStatus('Having 2 diamond spreadings will yield inaccurate results since only 1 diamond spreading upgrade will be able to affect a minion.', STATUS_YELLOW);
        }
        return calculateHour(this.actionTime, this.itemsPerAction, this.pricePerItem, this.fuel, this.upgrade1, this.upgrade2, this.additionalBonusPercentage);
    }

    render() {
        if (!this._htmlExists)
            this.buildHTMLForSlot(MinionSlot.minionSlotContainer);

        const formatter = Intl.NumberFormat('en-US');

        document.getElementById(`sl${this.id}-minion-name`).innerHTML = this.name
        document.getElementById(`sl${this.id}-action-int`).innerHTML = this.actionTime
        document.getElementById(`sl${this.id}-item-action`).innerHTML = this.itemsPerAction
        document.getElementById(`sl${this.id}-item-price`).innerHTML = this.pricePerItem
        document.getElementById(`sl${this.id}-fuel`).innerHTML = this.fuel
        document.getElementById(`sl${this.id}-updrade1`).innerHTML = this.upgrade1
        document.getElementById(`sl${this.id}-upgrade2`).innerHTML = this.upgrade2
        document.getElementById(`sl${this.id}-additional-bonus`).innerHTML = this.additionalBonusPercentage

        let hour = this.calculateHourlyCoins().toFixed(1);

        document.getElementById(`sl${this.id}-coinshour`).innerHTML = formatter.format(hour);
        document.getElementById(`sl${this.id}-coinsday`).innerHTML = formatter.format(hour * 24);
        document.getElementById(`sl${this.id}-coinsweek`).innerHTML = formatter.format(hour * 24 * 7);

        updateCoinTotals();

    }

    toJSON() {
        const data = {};
        data[`sl${this.id}-minion-name`] = this.name;
        data[`sl${this.id}-action-int`] = this.actionTime;
        data[`sl${this.id}-item-action`] = this.itemsPerAction;
        data[`sl${this.id}-item-price`] = this.pricePerItem;
        data[`sl${this.id}-fuel`] = this.fuel;
        data[`sl${this.id}-updrade1`] = this.upgrade1;
        data[`sl${this.id}-upgrade2`] = this.upgrade2;
        data[`sl${this.id}-additional-bonus`] = this.additionalBonusPercentage;
        return data;
    }
}