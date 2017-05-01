let utils = require('./utils');

module.exports = {
    getDateStr (date, spacer) {
        let today = date || new Date(),
            month = (today.getMonth() + 1).toString(),
            day   =  today.getDate ()     .toString(),
            year  =  today.getFullYear();

        if (month.length < 2) { month  = '0' + month; }
        if (day  .length < 2) { day    = '0' + day;   }
        if (!spacer)          { spacer = '-';         }

        return `${year}${spacer}${month}${spacer}${day}`;
    },

    getTimeStr (date, spacer) {

        let now     = date || new Date(),
            hours   = utils.pad(now.getHours()),
            minutes = utils.pad(now.getMinutes()),
            seconds = utils.pad(now.getSeconds());

        if (!spacer) { spacer = ':'; }

        return `${hours}${spacer}${minutes}${spacer}${seconds}`;
    },
};