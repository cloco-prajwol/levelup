class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        this.logs = [];
        Logger.instance = this;
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push(`[${timestamp}] ${message}`);
    }

    getLogs() {
        return this.logs;
    }
}
module.exports = Logger;
