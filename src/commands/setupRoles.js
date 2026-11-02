const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-roles')
    .setDescription('Deploy the interactive role picker embed with buttons')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('🎭 THE DUDES — Choose Your Game & Ping Roles')
      .setDescription(
        'Welcome to **THE DUDES** gaming hub!\n\n' +
        'Click the buttons below to **add or remove** roles. Roles allow you to get pinged for squad matches, co-op sessions, and watchparties.\n\n' +
        '🎮 **Available Games:**\n' +
        '• 🎯 **Valorant** — 5-Stacks & Premier comms\n' +
        '• 🪂 **Apex Legends** — Trios & Ranked grinding\n' +
        '• ✨ **Genshin Impact** — Co-op domains, boss carries & wish flex\n' +
        '• 📱 **BGMI** — Squad games & room matches\n\n' +
        '🍿 **Community:**\n' +
        '• ⛩️ **Anime Lounge** — Episode talks & watch parties\n' +
        '• 🍿 **Movie Night** — Weekend movie streams\n' +
        '• 🔔 **Server Pings** — Major updates & events\n\n' +
        '_Tip: Click a button again anytime to remove the role._'
      )
      .setFooter({ text: 'THE DUDES • Official Self-Role System' })
      .setTimestamp();

    // Row 1: Game Roles (Valorant, Apex, Genshin, BGMI)
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('role_valorant')
        .setLabel(config.roles.role_valorant.label)
        .setEmoji(config.roles.role_valorant.emoji)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('role_apex')
        .setLabel(config.roles.role_apex.label)
        .setEmoji(config.roles.role_apex.emoji)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('role_genshin')
        .setLabel(config.roles.role_genshin.label)
        .setEmoji(config.roles.role_genshin.emoji)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('role_bgmi')
        .setLabel(config.roles.role_bgmi.label)
        .setEmoji(config.roles.role_bgmi.emoji)
        .setStyle(ButtonStyle.Secondary)
    );

    // Row 2: Community & Ping Roles (Anime, Movie Night, Announcements)
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('role_anime')
        .setLabel(config.roles.role_anime.label)
        .setEmoji(config.roles.role_anime.emoji)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('role_movies')
        .setLabel(config.roles.role_movies.label)
        .setEmoji(config.roles.role_movies.emoji)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('role_notifications')
        .setLabel(config.roles.role_notifications.label)
        .setEmoji(config.roles.role_notifications.emoji)
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

    await interaction.reply({
      content: '✅ Role selection embed has been posted to this channel!',
      ephemeral: true
    });
  }
};
