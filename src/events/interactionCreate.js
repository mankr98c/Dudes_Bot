const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const { activeLFGs } = require('../commands/lfg');
const { getOrCreateRole } = require('../utils/roleHelper');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // ----------------------------------------------------
    // 1. Slash Command Handling
    // ----------------------------------------------------
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`[COMMAND ERROR] /${interaction.commandName}:`, error);
        const replyPayload = {
          content: '⚠️ There was an error while executing this command!',
          ephemeral: true
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyPayload);
        } else {
          await interaction.reply(replyPayload);
        }
      }
      return;
    }

    // ----------------------------------------------------
    // 2. Button Interaction Handling
    // ----------------------------------------------------
    if (interaction.isButton()) {
      const { customId, guild, member } = interaction;

      // ------------------------------------
      // A. Role Picker Buttons (role_*)
      // ------------------------------------
      if (customId.startsWith('role_')) {
        const roleConf = config.roles[customId];
        if (!roleConf) return;

        // Find or auto-create role on demand
        let targetRole = await getOrCreateRole(guild, customId, roleConf);

        if (!targetRole) {
          return interaction.reply({
            content: `⚠️ Could not find or create the role **${roleConf.name}**. Please verify that the bot has the **Manage Roles** permission enabled!`,
            ephemeral: true
          });
        }

        // Check bot role hierarchy permissions
        const botMember = guild.members.me;
        if (targetRole.position >= botMember.roles.highest.position) {
          return interaction.reply({
            content: `⚠️ I cannot assign the **${targetRole.name}** role because it is higher than or equal to my bot role in Server Settings > Roles. Move my bot role above it!`,
            ephemeral: true
          });
        }

        // Toggle role
        try {
          if (member.roles.cache.has(targetRole.id)) {
            await member.roles.remove(targetRole);
            return interaction.reply({
              content: `❌ Removed the **${targetRole.name}** role. You will no longer receive notifications for it.`,
              ephemeral: true
            });
          } else {
            await member.roles.add(targetRole);
            return interaction.reply({
              content: `✅ Added the **${targetRole.name}** role! You're all set to receive notifications.`,
              ephemeral: true
            });
          }
        } catch (err) {
          console.error('[ROLE ERROR]', err);
          return interaction.reply({
            content: '⚠️ Failed to update your role. Please check my bot permissions.',
            ephemeral: true
          });
        }
      }

      // ------------------------------------
      // B. LFG System Buttons
      // ------------------------------------
      if (customId.startsWith('lfg_')) {
        const messageId = interaction.message.id;
        const session = activeLFGs.get(messageId);

        if (!session) {
          return interaction.reply({
            content: '⚠️ This LFG request has expired or the bot was restarted.',
            ephemeral: true
          });
        }

        const userId = interaction.user.id;

        // --- LFG CANCEL ---
        if (customId === 'lfg_cancel') {
          if (userId !== session.hostId && !member.permissions.has('ManageMessages')) {
            return interaction.reply({
              content: '❌ Only the squad host can cancel this LFG request.',
              ephemeral: true
            });
          }

          const cancelledEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0x7f8c8d)
            .setTitle(`❌ [CANCELLED] ${session.game} LFG`)
            .setDescription(`This LFG request was cancelled by <@${userId}>.`);

          activeLFGs.delete(messageId);

          return interaction.update({
            embeds: [cancelledEmbed],
            components: []
          });
        }

        // --- LFG JOIN ---
        if (customId === 'lfg_join') {
          if (session.members.includes(userId)) {
            return interaction.reply({
              content: '⚠️ You are already in this squad!',
              ephemeral: true
            });
          }

          if (session.members.length >= session.totalCapacity) {
            return interaction.reply({
              content: '⚠️ This squad is already full!',
              ephemeral: true
            });
          }

          session.members.push(userId);
          const remaining = session.totalCapacity - session.members.length;

          const memberListText = session.members
            .map((id, index) => `${index + 1}. <@${id}>${id === session.hostId ? ' (Host)' : ''}`)
            .join('\n');

          const isNowFull = remaining === 0;

          const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setFields(
              { name: '👑 Party Host', value: `<@${session.hostId}>`, inline: true },
              { name: '🎯 Needed Slots', value: isNowFull ? '✅ **FULL**' : `**${remaining}** player(s)`, inline: true },
              { name: '🕹️ Activity / Rank', value: session.activity, inline: true },
              { name: `👥 Current Squad (${session.members.length}/${session.totalCapacity})`, value: memberListText },
              { name: '📝 Notes', value: session.note }
            );

          if (isNowFull) {
            updatedEmbed.setColor(0x5865f2);
            // Disable join button
            const disabledRow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId('lfg_join')
                .setLabel('Squad Full')
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
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

            await interaction.update({
              embeds: [updatedEmbed],
              components: [disabledRow]
            });

            // Announce in channel
            return interaction.followUp({
              content: `🎉 **${session.game} Squad is Full!**\nMembers: ${session.members.map(id => `<@${id}>`).join(' ')}\nGrab a Voice Channel in **Game VC** and hop in!`
            });
          }

          return interaction.update({
            embeds: [updatedEmbed]
          });
        }

        // --- LFG LEAVE ---
        if (customId === 'lfg_leave') {
          if (!session.members.includes(userId)) {
            return interaction.reply({
              content: '⚠️ You are not part of this squad.',
              ephemeral: true
            });
          }

          if (userId === session.hostId) {
            return interaction.reply({
              content: '⚠️ You are the squad host! Use [Cancel] if you want to dismiss the squad.',
              ephemeral: true
            });
          }

          session.members = session.members.filter(id => id !== userId);
          const remaining = session.totalCapacity - session.members.length;

          const memberListText = session.members
            .map((id, index) => `${index + 1}. <@${id}>${id === session.hostId ? ' (Host)' : ''}`)
            .join('\n');

          const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setColor(0x00d26a)
            .setFields(
              { name: '👑 Party Host', value: `<@${session.hostId}>`, inline: true },
              { name: '🎯 Needed Slots', value: `**${remaining}** player(s)`, inline: true },
              { name: '🕹️ Activity / Rank', value: session.activity, inline: true },
              { name: `👥 Current Squad (${session.members.length}/${session.totalCapacity})`, value: memberListText },
              { name: '📝 Notes', value: session.note }
            );

          // Restore normal row
          const activeRow = new ActionRowBuilder().addComponents(
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

          return interaction.update({
            embeds: [updatedEmbed],
            components: [activeRow]
          });
        }
      }
    }
  }
};
