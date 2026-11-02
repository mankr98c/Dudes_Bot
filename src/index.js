const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

// ----------------------------------------------------
// 1. Load Slash Commands
// ----------------------------------------------------
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`[LOADED COMMAND] /${command.data.name}`);
  } else {
    console.warn(`[WARNING] Command at ${filePath} missing "data" or "execute".`);
  }
}

// ----------------------------------------------------
// 2. Load Event Listeners
// ----------------------------------------------------
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`[LOADED EVENT] ${event.name}`);
}

// ----------------------------------------------------
// 3. Connect to Discord Gateway
// ----------------------------------------------------
if (!config.token) {
  console.error('\n❌ [ERROR] DISCORD_TOKEN is missing in your .env file!');
  console.log('👉 Please open .env and add your DISCORD_TOKEN, CLIENT_ID, and GUILD_ID.\n');
  process.exit(1);
}

client.login(config.token).catch(err => {
  console.error('\n❌ [LOGIN FAILED] Could not log in to Discord:', err.message);
  console.log('👉 Please verify that your bot token is correct in .env and Privileged Gateway Intents (Server Members, Message Content) are enabled in Discord Developer Portal.\n');
});
