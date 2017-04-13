let enums = require('./enums');

module.exports = {
	port: 3000,

	logging: {
		filePaths: {
			raw: 'database/logs/',
			str: 'logs/'
		},

		fileExt: {
			raw: '.json',
			str: '.log'
		},

		flushTimeout: 3000 // 15000
	}
};