const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Display server statistics, member counts, and boost status'),

  async execute(interaction) {
    const { guild } = interaction;
    await guild.members.fetch(); // Ensure member cache is loaded

    const totalMembers = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = totalMembers - botCount;

    const textChannels = guild.channels.cache.filter(c => c.isTextBased() && !c.isVoiceBased()).size;
    const voiceChannels = guild.channels.cache.filter(c => c.isVoiceBased()).size;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📊 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👑 Server Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '⭐ Boost Tier', value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} Boosts)`, inline: true },
        { name: '👥 Members', value: `Total: **${totalMembers}**\nHumans: **${humanCount}** | Bots: **${botCount}**`, inline: true },
        { name: '💬 Channels', value: `Text: **${textChannels}** | Voice: **${voiceChannels}**`, inline: true },
        { name: '🎭 Roles', value: `**${guild.roles.cache.size}** roles`, inline: true }
      )
      .setFooter({ text: 'THE DUDES • Gaming & Community' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
