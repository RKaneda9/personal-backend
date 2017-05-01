'use strict';

let fs         = require('fs'),
    Log        = require('../models/logging/log'),
    utils      = require('../helpers/utils'),
    dateHelper = require('../helpers/date'),
    enums      = require('../helpers/enums')    .logging,
    constants  = require('../helpers/constants').logging;

let prefixes = Object.keys(enums.levels).map(key => key.toUpperCase());
let pending  = { raw: [], str: [] };
let writeTimeout;

class LogService {
    constructor() {
        this.parseErrorArg     = this.parseErrorArg    .bind(this);
        this.formatRawEntryArg = this.formatRawEntryArg.bind(this);
        this.formatStrEntryArg = this.formatStrEntryArg.bind(this);
        this.writePending      = this.writePending     .bind(this);
    }

    parseErrorArg (err) {
        return {
            type:    err.name,
            message: err.message,
            stack:   err.stack
        }
    }

    getRawFilename () { return `${constants.filePaths.raw}${dateHelper.getDateStr()}${constants.fileExt.raw}`; }
    getStrFilename () { return `${constants.filePaths.str}${dateHelper.getDateStr()}${constants.fileExt.str}`; }

    formatRawEntryArg (arg) {
        return arg instanceof Error 
             ? this.parseErrorArg(arg)
             : arg;
    }

    formatStrEntryArg (arg) {
        if (arg instanceof Error) { 
            return JSON.stringify(this.parseErrorArg(arg));
        }    

        if (typeof arg === 'object') { 
            return JSON.stringify(arg);
        }
    
        return arg;
    }

    addRawEntry (entry, session) {

        pending.raw.push(
            JSON.stringify({

                id:      utils.rand(),
                level:   entry.level,
                prefix:  prefixes[entry.level],
                session: session,
                time:    dateHelper.getTimeStr(entry.time),
                args:    utils.map(entry.args, this.formatRawEntryArg)

            })
        );
    }

    addStrEntry (entry, session) {
        pending.str.push(
            `${prefixes[entry.level]} ${dateHelper.getTimeStr(entry.time)} ${session} ${utils.map(entry.args, this.formatStrEntryArg).join(' ')}`
        );
    }

    flushLog(log) {
        let str;

        utils.foreach(log.entries, entry => {
            if (log.settings.logRawLevel >= entry.level) { this.addRawEntry(entry, log.settings.session); }
            if (log.settings.logStrLevel >= entry.level) { this.addStrEntry(entry, log.settings.session); }
        });

        if (!writeTimeout) { writeTimeout = setTimeout(this.writePending, constants.writeTimeout); }
    }

    newLog(props) {
        if (!props) { props = {}; }

        props.session     = props.session     || utils.rand(10);
        props.logRawLevel = props.logRawLevel || enums.levels.error;
        props.logStrLevel = props.logStrLevel || enums.levels.debug;

        return new Log(props);
    }

    writePending () {
        writeTimeout = null;

        let raw = pending.raw.splice(0),
            str = pending.str.splice(0);

        if (raw.length) {
            fs.appendFile(this.getRawFilename(), raw.join('\n') + '\n', (err) => { 
                if (err) console.error('Error saving to log file!', err, this.getRawFilename()); 
            });
        }

        if (str.length) {
            fs.appendFile(this.getStrFilename(), str.join('\n') + '\n', (err) => { 
                if (err) console.error('Error saving to log file!', err, this.getStrFilename()); 
            });
        }
    }
}

const service  = new LogService();
Object.freeze(service);

module.exports = {
    flush:      service.flushLog.bind(service),
    newSession: service.newLog  .bind(service)
};