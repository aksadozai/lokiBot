const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'gives list of commands',
	execute(message) {
		return message.reply('~prank (@someone), ~fix (@someone), ~move (@someone), ~joke')
	},
};