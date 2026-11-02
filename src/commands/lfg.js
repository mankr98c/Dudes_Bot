const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// Global in-memory storage for active LFG sessions
const activeLFGs = new Map();

module.exports = {
  activeLFGs,
  data: new SlashCommandBuilder()
    .setName('lfg')
    .setDescription('Find teammates for your game (Valorant, Apex, Genshin, etc.)')
    .addStringOption(option =>
      option
        .setName('game')
        .setDescription('Select the game you are playing')
        .setRequired(true)
        .addChoices(
          { name: '🪂 Apex Legends', value: 'Apex Legends' },
          { name: '🎯 Valorant', value: 'Valorant' },
          { name: '✨ Genshin Impact', value: 'Genshin Impact' },
          { name: '📱 BGMI', value: 'BGMI' },
          { name: '🎮 Other Game', value: 'Other' }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('slots')
        .setDescription('Number of additional players needed (1 - 5)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(5)
    )
    .addStringOption(option =>
      option
        .setName('activity')
        .setDescription('Mode or Rank (e.g. Ranked Plat+, Unrated chill, Weekly Bosses)')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('note')
        .setDescription('Additional notes (e.g. mic required, drop your IGN)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const game = interaction.options.getString('game');
    const slots = interaction.options.getInteger('slots');
    const activity = interaction.options.getString('activity') || 'Casual / Any';
    const note = interaction.options.getString('note') || 'Join in!';

    const gameIcons = {
      'Apex Legends': '🪂',
      'Valorant': '🎯',
      'Genshin Impact': '✨',
      'BGMI': '📱',
      'Other': '🎮'
    };
    const icon = gameIcons[game] || '🎮';

    const embed = new EmbedBuilder()
      .setColor(0x00d26a)
      .setTitle(`${icon} LFG: ${game} Party Request`)
      .setDescription(`**${interaction.user.username}** is looking for teammates!`)
      .addFields(
        { name: '👑 Party Host', value: `<@${interaction.user.id}>`, inline: true },
        { name: '🎯 Needed Slots', value: `**${slots}** player(s)`, inline: true },
        { name: '🕹️ Activity / Rank', value: activity, inline: true },
        { name: '👥 Current Squad (1/' + (slots + 1) + ')', value: `1. <@${interaction.user.id}> (Host)` },
        { name: '📝 Notes', value: note }
      )
      .setFooter({ text: 'Click [Join Squad] below to hop in!' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('lfg_join')
        .setLabel('Join Squad')
        .setEmoji('🟢')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('lfg_leave')
        .setLabel('Leave Squad')
        .setEmoji('🟡')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('lfg_cancel')
        .setLabel('Cancel')
        .setEmoji('🔴')
        .setStyle(ButtonStyle.Danger)
    );

    const replyMsg = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    // Save session in memory
    activeLFGs.set(replyMsg.id, {
      hostId: interaction.user.id,
      game,
      icon,
      neededSlots: slots,
      totalCapacity: slots + 1,
      members: [interaction.user.id],
      activity,
      note,
      isFull: false
    });
  }
};
