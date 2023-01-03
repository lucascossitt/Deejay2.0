const {EmbedBuilder} = require("discord.js");

module.exports = async (client, player, track, error) => {
    try {
        const embed = new EmbedBuilder()
            .setTitle(`${error.exception.message}`)
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .setColor('Purple')

        const channel = client.channels.cache.get(player.textChannel)
        return await channel?.send({embeds: [embed]})
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}