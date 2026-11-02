const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

if (!config.token || !config.clientId) {
  console.error('[CONFIG ERROR] Missing DISCORD_TOKEN or CLIENT_ID in your .env file!');
  process.exit(1);
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`[DEPLOY] Started refreshing ${commands.length} application (/) commands.`);

    let data;
    if (config.guildId) {
      // Instant guild deployment (immediate without waiting for global cache)
      data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      console.log(`[DEPLOY SUCCESS] Successfully reloaded ${data.length} guild (/) commands for server: ${config.guildId}`);
    } else {
      // Global deployment
      data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      );
      console.log(`[DEPLOY SUCCESS] Successfully reloaded ${data.length} global (/) commands.`);
    }
  } catch (error) {
    console.error('[DEPLOY ERROR]', error);
  }
})();
