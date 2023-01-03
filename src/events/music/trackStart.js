const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')
const ms = require('ms')

module.exports = async (client, player, track, payload) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('volume-')
                .setEmoji(`🔉`)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('p/p')
                .setEmoji(`▶`)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('volume+')
                .setEmoji(`🔊`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('skip')
                .setEmoji(`⏭`)
                .setStyle(ButtonStyle.Secondary),
        );

    const embed = new EmbedBuilder()
        .setAuthor({
            name: 'Tocando agora',
            iconURL: track.info.requester.displayAvatarURL()
        })
        .setColor('Purple')
        .setDescription(`**Titulo:** [${track.info.title}](${track.info.uri})\n**Autor:** \`${track.info.author}\`\n**Duração:** \`${ms(track.info.length)}\``)
        .setImage(track.info.image)

    const channel = client.channels.cache.get(player.textChannel)
    return await channel?.send({embeds: [embed], components: [row]})
}