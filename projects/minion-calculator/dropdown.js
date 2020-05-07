class DropDown {
    constructor(parentEltOrId, ...options) {
        if (typeof parentEltOrId == 'string') {
            this.element = document.getElementById(parentEltOrId);
            this.parent = this.element.parentNode;
            this.options = new Array(this.element.options.length).fill(0).map((value, idx) => this.element.options[idx].value);
        } else {
            this.parent = parent;
            this.options = options;
            this.element = document.createElement('select');
            options.forEach((option) => this.element.options.add(option));
            this.parent.appendChild(this.element);
        }
    }

    indexOf(optionName) {
        let idx = 0;
        for (const option of this.options) {
            if (option == optionName)
                return idx;
            idx++;
        }
        return -1;
    }

    selectIndex(index) {
        this.element.selectedIndex = index;
    }

    selectItem(optionName) {
        const index = this.indexOf(optionName);
        if (index === -1)
            throw new Error(`No such element in option: ${optionName}`);
        this.element.selectedIndex = index;
    }

    getSelectedItem() {
        return this.element.options[this.element.selectedIndex].value;
    }
}