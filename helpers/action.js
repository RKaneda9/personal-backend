'use strict';

class ActionResponse {
    constructor (isValid, message, data, error, target) {

        this.isValid = isValid;
        this.message = message || 'There was an error processing your request.'; // pretty print
        this.error   = error; 
        this.data    = data;
        this.target  = target;      
    }

    changeTargetParent (str) {
        if (this.target) { 
            this.target = str + '.' + this.target.split('.').shift().join('.');
        }
    }

    static valid (msg, data) {
        return new ActionResponse(true, msg, data);
    }

    static error (target, msg, error) {
        return new ActionResponse(false, msg, null, error, target);
    }

    static invalid (target, error) {
        return new ActionResponse(false, null, null, error, target);
    }
}

module.exports = ActionResponse;