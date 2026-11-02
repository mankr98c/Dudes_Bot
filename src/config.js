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
      color: 0xFD4556,
      aliases: ['valorant', 'valo'],
      description: 'Get notified for 5-stacks, custom games & news'
    },
    role_apex: {
      id: process.env.ROLE_APEX_ID,
      name: 'Apex Legends',
      label: 'Apex Legends',
      emoji: '🪂',
      color: 0xE11D48,
      aliases: ['apex legends', 'apex'],
      description: 'Get notified for Trios, Ranked grinding & updates'
    },
    role_genshin: {
      id: process.env.ROLE_GENSHIN_ID,
      name: 'Genshin Impact',
      label: 'Genshin Impact',
      emoji: '✨',
      color: 0x38BDF8,
      aliases: ['genshin impact', 'genshin'],
      description: 'Co-op domains, boss carries & wish flex'
    },
    role_bgmi: {
      id: process.env.ROLE_BGMI_ID,
      name: 'BGMI',
      label: 'BGMI',
      emoji: '📱',
      color: 0xF59E0B,
      aliases: ['bgmi', 'battlegrounds mobile india'],
      description: 'Squad matches & room tournaments'
    },
    role_anime: {
      id: process.env.ROLE_ANIME_ID,
      name: 'Anime Lounge',
      label: 'Anime Lounge',
      emoji: '⛩️',
      color: 0xA855F7,
      aliases: ['anime lounge', 'anime', 'anime stuffs', 'anime-stuffs'],
      description: 'Seasonal anime talks & watchalongs'
    },
    role_movies: {
      id: process.env.ROLE_MOVIES_ID,
      name: 'Movie Night',
      label: 'Movie Night',
      emoji: '🍿',
      color: 0xEAB308,
      aliases: ['movie night', 'movie', 'movies'],
      description: 'Weekend movie streams and watchparties'
    },
    role_notifications: {
      id: process.env.ROLE_NOTIFICATIONS_ID,
      name: 'Server Announcements',
      label: 'Server Pings',
      emoji: '🔔',
      color: 0x3B82F6,
      aliases: ['server announcements', 'announcements', 'server pings', 'pings', 'notifications'],
      description: 'Important server announcements and events'
    }
  }
};
