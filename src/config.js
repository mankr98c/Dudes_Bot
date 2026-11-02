require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  joinToCreateChannelId: process.env.JOIN_TO_CREATE_CHANNEL_ID,

  // Mapping of button customId to role lookup configuration
  roles: {
    role_valorant: {
      id: process.env.ROLE_VALORANT_ID,
      name: 'Valorant',
      label: 'Valorant',
      emoji: '🎯',
      description: 'Get notified for 5-stacks, custom games & news'
    },
    role_apex: {
      id: process.env.ROLE_APEX_ID,
      name: 'Apex Legends',
      label: 'Apex Legends',
      emoji: '🪂',
      description: 'Get notified for Trios, Ranked grinding & updates'
    },
    role_genshin: {
      id: process.env.ROLE_GENSHIN_ID,
      name: 'Genshin',
      label: 'Genshin Impact',
      emoji: '✨',
      description: 'Co-op domains, boss carries & wish flex'
    },
    role_bgmi: {
      id: process.env.ROLE_BGMI_ID,
      name: 'BGMI',
      label: 'BGMI',
      emoji: '📱',
      description: 'Squad matches & room tournaments'
    },
    role_anime: {
      id: process.env.ROLE_ANIME_ID,
      name: 'Anime',
      label: 'Anime Lounge',
      emoji: '⛩️',
      description: 'Seasonal anime talks & watchalongs'
    },
    role_movies: {
      id: process.env.ROLE_MOVIES_ID,
      name: 'Movie Night',
      label: 'Movie Night',
      emoji: '🍿',
      description: 'Weekend movie streams and watchparties'
    },
    role_notifications: {
      id: process.env.ROLE_NOTIFICATIONS_ID,
      name: 'Announcements',
      label: 'Server Pings',
      emoji: '🔔',
      description: 'Important server announcements and events'
    }
  }
};
