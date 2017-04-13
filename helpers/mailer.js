let mailer    = require('nodemailer'),
    deferred  = require('./deferred'),
    log       = require('./logger'),
    fs        = require('fs'),
    settings  = {},
    transport = {};

let constants = {
    settingsFileLocation: 'mailer.json'
}

let mail = {
    initialize: function () {
        let {log} = console;

        log(`Looking for mailer settings file at ${constants.settingsFileLocation}`);

        if (!fs.existsSync(constants.settingsFileLocation)) {
            throw "Mailer settings file does not exist! Please see readme for how to setup settings file.";
        }

        let settingsContent = fs.readFileSync(constants.settingsFileLocation, 'utf8');
        let params;

        try { params = JSON.parse(settingsContent); }

        catch (ex) {
            throw `Mailer settings file has invalid json. => ${JSON.stringify({
                type    : err.name,
                message : err.message,
                stack   : err.stack
            })}`;
        }

        if (!params || typeof params != 'object') {
            throw "Mailer settings file is in an incorrect format. Please see readme for how to setup settings file.";
        }

        let format = (name, description) => `Mailer settings file => "${name}" is invalid. ${description} Please see readme for how to setup settings file.`;

        if (typeof params.toAddress != 'string' || !params.toAddress.trim().length) {
            throw format("toAddress", `It should be a valid email address that you're sending mail to.`);
        }

        if (typeof params.fromAddress != 'string' || !params.fromAddress.trim().length) {
            throw format("fromAddress", `It should be a valid email address that you're sending mail from.`);
        }

        if (typeof params.fromPassword != 'string' || !params.fromPassword.trim().length) {
            throw format("fromPassword", `It should be the password associated with the "fromAddress".`);
        }

        if (typeof params.host != 'string' || !params.host.trim().length) {
            throw format("host", `It should be the host of the email provider you are using. For example, if you are using gmail, then put "smtp.gmail.com".`);
        }

        if (typeof params.port != 'number' || !params.port) {
            throw format("port", `It should be the port associated with the host of your email provider. For example, if you are using gmail, then put "465" as a number.`);
        }

        settings  = params;
        transport = mailer.createTransport({

            host            : params.host,
            port            : params.port,
            secureConnection: true,
            transportMethod : 'STMP',
            auth: {
                user: params.fromAddress,
                pass: params.fromPassword
            }
        });

        log(`Mailer settings file found and Mailer has been initialized to use "fromAddress" = ${settings.fromAddress} and "toAddress" = ${settings.toAddress}.`);
    },

    send: (params) => {
        var d = new deferred();

        if (typeof params != "object") { 

            log.error('Mailer.send(params) => No params were provided to send method.');
            return d.reject(); 
        } 

        transport.sendMail({

            from   : settings.fromAddress,
            to     : params.to || settings.toAddress,
            subject: params.subject,
            text   : params.body

        }, (err, info) => {
            
            if (err) { 
                
                log.error('Mailer.send(params) => sending mail failed. (err, info, params) => ', err, info, params);
                return d.reject("An error occurred while attempting to send your message! I have been notified of the error."); 
            }

            d.resolve();
        });

        return d.promise;
    }
};

module.exports = mail;