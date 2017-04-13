'use strict';

let check  = require('../../helpers/validator').check,
    trim   = require('../../helpers/validator').trim,
    action = require('../../helpers/action');

const fields = {
    firstname: 'firstname',
    lastname : 'lastname',
    email    : 'email',
    message  : 'message'
}

module.exports = class MessageMe {

    constructor (data) {

        this.firstname = trim(data.firstname,  100);
        this.lastname  = trim(data.lastname,   100);
        this.email     = trim(data.email,      100);
        this.message   = trim(data.message,   1000);
    }

    unload () {

        return {
            firstname: this.firstname,
            lastname : this.lastname,
            email    : this.email,
            message  : this.message
        };
    }

    toTemplate () {
        return `First Name: ${this.firstname}
Last Name: ${this.lastname}
Email: ${this.email}
Message: ${this.message}`;
    }

    static validateStructure (data) {

        if (!check(data)          .isObject().notNull().isValid) { return action.invalid(null,             'Data posted is not an object.');  }
        if (!check(data.firstname).isString()          .isValid) { return action.invalid(fields.firstname, 'First name is not a string.');    }
        if (!check(data.lastname) .isString()          .isValid) { return action.invalid(fields.lastname,  'Last name is not a string.');     }
        if (!check(data.email)    .isString()          .isValid) { return action.invalid(fields.email,     'Email Address is not a string.'); }
        if (!check(data.message)  .isString()          .isValid) { return action.invalid(fields.message,   'Message is not a string.');       }

        return action.valid();
    }

    static validateData (data) {

        if (!check(data.firstname).notEmpty      ().isValid) { return action.error(fields.firstname, 'Please enter a first name.');          }
        if (!check(data.lastname) .notEmpty      ().isValid) { return action.error(fields.lastname,  'Please enter a last name.');           }
        if (!check(data.email)    .notEmpty      ().isValid) { return action.error(fields.email,     'Please enter an email address.');      }
        if (!check(data.email)    .isEmailAddress().isValid) { return action.error(fields.email,     'Please enter a valid email address.'); }
        if (!check(data.message)  .notEmpty      ().isValid) { return action.error(fields.message,   'Please enter a message.');             }

        return action.valid();
    }

    static validate (data) {

        var response = Mail.validateStructure(data);

        if (!response.isValid) { return response; }

        return Mail.validateData(data);
    }
}