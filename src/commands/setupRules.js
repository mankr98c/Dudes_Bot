const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-rules')
    .setDescription('Deploy the official rules embed to the rules channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xe11d48)
      .setTitle('📜 THE DUDES — Official Server Rules & Guidelines')
      .setDescription(
        'Welcome to **THE DUDES**! To keep our community friendly, fun, and competitive, please review and abide by our rules below.\n\n' +
        '**1. Respect & Sportsmanship** 🤝\n' +
        '• Treat all members with respect. Toxic behavior, harassment, hate speech, racism, and sexism will result in an immediate ban.\n' +
        '• Keep banter friendly. Win or lose, maintain a positive GG mentality.\n\n' +
        '**2. Voice Channel (VC) Etiquette** 🎙️\n' +
        '• No mic spamming, ear rape, loud soundboards, or echoing in gaming VCs (especially during clutch/ranked moments).\n' +
        '• Respect room limits (e.g., Duo = 2, Apex = 3, Valo = 5).\n\n' +
        '**3. Clean Chat & Content** 💬\n' +
        '• Keep content in appropriate channels (e.g. anime talks in `#anime-stuffs`, clips in `#clips-and-highlights`).\n' +
        '• No NSFW, explicit, gore, or illegal content anywhere on the server.\n\n' +
        '**4. No Unsolicited Promotion or Spam** 🚫\n' +
        '• Do not advertise other Discord servers, YouTube/Twitch channels, or DM members with promo links without staff approval.\n\n' +
        '**5. Staff & Moderation** 🛡️\n' +
        '• Follow instructions from the Moderators and Admin team.\n' +
        '• If you encounter toxicity or rule violations, report them to staff rather than starting drama in chat.\n\n' +
        'Enjoy your stay, find your squad, and have fun playing!'
      )
      .setFooter({ text: 'THE DUDES • Server Guidelines' })
      .setTimestamp();

    await interaction.channel.send({ embeds: [embed] });

    await interaction.reply({
      content: '✅ Rules embed has been posted to this channel!',
      ephemeral: true
    });
  }
};
