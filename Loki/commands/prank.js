module.exports = {
	name: 'prank',
	description: 'prank someone',
	guildOnly: true,
	async execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('Tell me who to prank.');
		}

		if (message.mentions.users.size > 1) {
			return message.reply('I can only prank one person at a time.');
		}

		let taggedUser = message.mentions.members.first();

		if (!taggedUser.voice.channel) {
			return message.reply('I can\'t prank someone not in a voice channel.')
		}

		var isPranked = false;

		if (taggedUser.voice.deaf === true) {
			isPranked = true;
		}

		if (isPranked) {
			return message.reply('That person has already been pranked!')
		}
		else {
			var laughs = ["/Loki/Audio/laugh1.ogg", "/Loki/Audio/laugh2.ogg", "/Loki/Audio/laugh3.ogg"];
			var laugh = Math.floor(Math.random() * laughs.length);

			const connection = await taggedUser.voice.channel.join();

			const dispatcher = connection.play(laughs[laugh], {
				volume: 0.5,
			});
			dispatcher.resume();
			
			taggedUser.voice.setDeaf(true);

			message.channel.send('Haha! Get pranked!');
		}
	},
};