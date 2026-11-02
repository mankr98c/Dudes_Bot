const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[BOT ONLINE] Logged in as ${client.user.tag}!`);
    console.log(`[SERVERS] Serving ${client.guilds.cache.size} server(s).`);

    client.user.setPresence({
      activities: [
        {
          name: 'Valorant & Apex | /lfg',
          type: ActivityType.Playing
        }
      ],
      status: 'online'
    });
  }
};
