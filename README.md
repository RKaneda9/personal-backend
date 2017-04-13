# personal-backend

This is the backend structure for my personal website. 

## Project Setup 

| Folder/File | Description                                                       |
| -----------| ------------------------------------------------------------------ |
| `/controllers` | contains the api endpoints for the application. |
| `/database` |  |
| `/helpers` | contains helper files such as constants, enums, mailer. |
| `/logs` | contains log entries in .log format. |
| `/middleware`| contains application middleware such as logging and security. |
| `/models` |  |
| `/public` | contains all application public files (such as html, js, and css files). |
| `app.js` | start point for the application. |
| `mailer.json` | mailer settings file. the setup for this file is below. |

## mailer.json setup

This file contains the settings for the mailer located at `/helpers/mailer.js`. Since one of the endpoints is for sending mail, the smtp settings are defined in this file. The send() function in mailer also has the option of overwriting the "toAddress" per each outgoing message. The mailer.json file should be setup like below (note that this example is for a gmail setup):

```json
{
    "toAddress": "example@gmail.com",
    "fromAddress": "noreply.example@gmail.com",
    "fromPassword": "asdfasdf",
    "host": "smtp.gmail.com",
    "port": 465
}
```
