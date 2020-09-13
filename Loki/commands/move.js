const { voiceChann, voiceChann2 } = require('/Loki/config.json');

module.exports = {
	name: 'move',
	description: 'move someone',
	guildOnly: true,
	async execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('I need to know who to move.');
		}

		if (message.mentions.users.size > 1) {
			return message.reply('I can only move one person at a time.');
		}

		let taggedUser = message.mentions.members.first();

		if (!taggedUser.voice.channel) {
			return message.reply('I can\'t move someone not in a voice channel.')
		}

		else {
			
			if (taggedUser.voice.channelID === voiceChann) {
				taggedUser.voice.setChannel(voiceChann2);
			}
			else if (taggedUser.voice.channelID === voiceChann2)	{
				taggedUser.voice.setChannel(voiceChann);
			}
			else {
				return message.reply('I don\'t recognize that voice channel.')
			}
		}
	},
};