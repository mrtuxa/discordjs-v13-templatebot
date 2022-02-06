const { Client, Intents } = require('discord.js');
const { token, applicationId, guildId } = require('./config.json');
const fs = require('fs');
const client = new Client({ intents: 32767});
// all urgent imports for slash commands
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());

}
// 
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


const rest = new REST({ version: '9'}).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    console.log(commands)
    // await rest.put(
     await rest.post(
      Routes.applicationGuildCommands(applicationId, guildId),     
      { body: commands.toString() }
    );

    console.log('Sucesfully reloaded Application Commands');
  } catch (error) {
      console.error(error)
  }
})();

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));

// welcome message


//


client.login(token);
