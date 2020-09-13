module.exports = {
	name: 'fix',
	description: 'fix someone after they\'ve been pranked',
	guildOnly: true,
	async execute(message) {

		if (!message.mentions.users.size) {
			return message.reply('Please tell me who to fix.');
		}

		if (message.mentions.users.size > 1) {
			return message.reply('I can only fix one person at a time.');
		}

		let taggedUser = message.mentions.members.first();

		if (!taggedUser.voice.channel) {
			return message.reply('I can\'t fix someone not in a voice channel.')
		}

		var pranked = false;

		if (taggedUser.voice.deaf === true) {
			pranked = true;
		}

		if (!pranked) {
			return message.reply('I didn\'t do anything to them... yet!')
		}
		else {
			const connection = await taggedUser.voice.channel.join();

			taggedUser.voice.setDeaf(false);

			const dispatcher = connection.play('/Loki/Audio/fix.ogg', {
				volume: 0.5,
			});
			dispatcher.resume();

			setTimeout(function(){ 
				message.channel.send('Hey, it was just a prank!');
			}, 3000);
		}
	},
};