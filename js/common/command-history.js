
// TODO: persist between pages?
class CommandHistory {
    constructor() {
        this.backLog = [];
        this.foreLog = [];
        this.currentCommand = null;
    }

    pushCommand(input) {
        this.backLog.push(input);
    }

    previousCommand() {
        let c = this.backLog.pop();
        if (c) {
            this.foreLog.push(this.currentCommand);
            this.currentCommand = c;
        }
        return c;
    }

    nextCommand() {
        let c = this.foreLog.pop();
        if (c) {
            this.backLog.push(this.currentCommand);
            this.currentCommand = c;
        }
        return c;
    }

    resetPosition() {
        if (this.currentCommand) {
            this.backLog.push(this.currentCommand);
            this.currentCommand = null;
        }
        // FIXME: this should definitely be an index and a single list
        // because as the history grows, this will get unsustainable
        while (this.foreLog.length > 0) {
            this.backLog.push(this.foreLog.pop());
        }
    }
}