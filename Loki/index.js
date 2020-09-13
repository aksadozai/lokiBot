const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token, voiceChann, chann } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();
const talkedRecently = new Set();

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('SMITE | ~help', { type: 'PLAYING' });

	var sounds = ["/Loki/Audio/loki1.mp3", "/Loki/Audio/loki2.mp3", 
                "/Loki/Audio/loki3.mp3", "/Loki/Audio/loki4.mp3", "/Loki/Audio/loki5.mp3",
                "/Loki/Audio/loki6.mp3", "/Loki/Audio/loki7.mp3"];

    setInterval(async function() {
    	var d = Math.random();
        if (d < 0.2) {

            var sound = Math.floor(Math.random() * sounds.length);
            const connection = await client.channels.cache.get(voiceChann).join();
            setTimeout(function(){ 
				const dispatcher = connection.play(sounds[sound], {
					volume: 0.5,
				});
				dispatcher.resume();
			}, 10000);
		}
	}, 120000)	
});

client.on("guildMemberAdd", (member) => {
	const ch = member.guild.channels.cache.find(channel => channel.id === chann);
  	ch.send(`Welcome!`);
  });

client.on('message', async message => {
	if (message.content.includes('!ult')) {
		let user = message.member;
		if (!user.voice.channel) {
			return;
		}
		const connection = await user.voice.channel.join();
		connection.disconnect();

		setTimeout(async function(){ 
			const connection = await user.voice.channel.join();
			const dispatcher = connection.play('/Loki/Audio/thor1.ogg', {
				volume: 0.5,
			});
			dispatcher.resume();
		}, 10000);
	}
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	
	if (talkedRecently.has(message.author.id)) {
		message.channel.send('You\'re sending too many commands, wait please.');
	} else {

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('That command only works in a server.');
	}

	if (command.args && !args.length) {
		let reply = `Give me an argument ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage is \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Wait ${timeLeft.toFixed(1)} second(s) to use this command again.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Error. Please try again.');
	}

	talkedRecently.add(message.author.id);
	setTimeout(() => {
	  talkedRecently.delete(message.author.id);
	}, 5000);
	}
});

client.login(token);