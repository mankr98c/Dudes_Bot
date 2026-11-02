const { ChannelType, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

// In-memory set tracking created temporary voice channels
const tempChannels = new Set();

module.exports = {
  name: 'voiceStateUpdate',
  tempChannels,
  async execute(oldState, newState) {
    const { member, guild } = newState;

    // Helper to check if a channel is the "Join to Create" trigger channel
    const isJoinToCreate = (channel) => {
      if (!channel) return false;
      if (config.joinToCreateChannelId && channel.id === config.joinToCreateChannelId) {
        return true;
      }
      const lower = channel.name.toLowerCase();
      return lower.includes('join to create') || lower.includes('join-to-create');
    };

    // 1. User joins the "Join to Create" channel
    if (newState.channelId && isJoinToCreate(newState.channel)) {
      try {
        const parentCategory = newState.channel.parent;
        const channelName = `🎮・${member.displayName}'s Room`;

        // Create temporary voice channel
        const tempChannel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildVoice,
          parent: parentCategory ? parentCategory.id : null,
          permissionOverwrites: [
            {
              id: member.id,
              allow: [
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.DeafenMembers
              ]
            }
          ]
        });

        tempChannels.add(tempChannel.id);

        // Move member into the newly created voice channel
        await newState.setChannel(tempChannel);
      } catch (err) {
        console.error('[VOICE ERROR] Failed to create or move to temporary channel:', err);
      }
    }

    // 2. User leaves a voice channel: check if it's an empty temp channel
    if (oldState.channelId && oldState.channelId !== newState.channelId) {
      const oldChannel = oldState.channel;
      if (
        oldChannel &&
        (tempChannels.has(oldChannel.id) || oldChannel.name.startsWith('🎮・')) &&
        !isJoinToCreate(oldChannel)
      ) {
        // If no members are left in the temporary voice channel, delete it
        if (oldChannel.members.size === 0) {
          try {
            await oldChannel.delete('Temporary voice channel cleaned up');
            tempChannels.delete(oldChannel.id);
          } catch (err) {
            console.error('[VOICE ERROR] Failed to delete empty temporary channel:', err);
          }
        }
      }
    }
  }
};
