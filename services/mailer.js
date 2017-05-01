let mailer   = require('nodemailer'),
    utils    = require('../helpers/utils'),
    validate = require('../helpers/validator').utils;

class MailerService {
    constructor(props) {
        this.settings = {
            service: 'gmail'
        };

        utils.extend(this.settings, props, true);

        let format = (name, description) => `Mailer settings file => "${name}" is invalid. ${description} Please see readme for how to setup settings file.`;

        if (!validate.isEmailAddress(this.settings.toAddress)) { 
            throw format("toAddress", `It should be a valid email address that you're sending mail to.`);
        }

        if (!validate.isEmailAddress(this.settings.fromAddress)) {
            throw format("fromAddress", `It should be a valid email address that you're sending mail from.`);
        }

        if (!validate.isNotEmptyString(this.settings.fromPassword)) {
            throw format("fromPassword", `It should be the password associated with the "fromAddress".`);
        }

        if (!validate.isNotEmptyString(this.settings.service)) {
            throw format("Servce", `It should be the email provider you are using. For example, if you are using gmail, then put "gmail".`);
        }

        this.setupMailer();        
    } 

    setupMailer() {
        this.mailer = mailer.createTransport({
            service: this.settings.service,
            auth: {
                user: this.settings.fromAddress,
                pass: this.settings.fromPassword
            }
        });
    }

    send (message) {
        if (!validate.isNotEmptyObject(message)) {
            throw 'Mailer.send(message) => No message params were provided to send method.';
        } 

        return new Promise((resolve, reject) => {
            this.mailer.sendMail({

                from   : this.settings.fromAddress,
                to     : message.to || this.settings.toAddress,
                subject: message.subject,
                text   : message.body

            }, (err, info) => {
                
                if (err) { return reject(err); }

                resolve();
            });
        });
    }
}

const service = new MailerService((require('../settings.json') || {}).mailer);
Object.freeze(service);

module.exports = { 
    send: service.send.bind(service)
};