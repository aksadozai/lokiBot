module.exports = {
	name: 'joke',
	description: 'tell a joke',
	cooldown: 7,
	guildOnly: true,
	async execute(message) {
        if (!message.member.voice.channel) {
			return message.reply('You need to be in a voice channel for me to tell a joke.')
		}
		
		var jokes = ["/Loki/Audio/joke1.ogg", "/Loki/Audio/joke2.ogg", "/Loki/Audio/joke3.ogg"];
		var joke = Math.floor(Math.random() * jokes.length);
		
		const connection = await message.member.voice.channel.join();
		
        const dispatcher = connection.play(jokes[joke], {
            volume: 0.5,
        });
        dispatcher.resume();

	},
};