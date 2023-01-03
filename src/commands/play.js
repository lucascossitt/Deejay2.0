const {ApplicationCommandOptionType, EmbedBuilder} = require('discord.js')

module.exports = {
    name: 'play',
    description: 'Toca uma musica pelo nome ou URL',
    inVc: true,
    sameVc: true,
    player: false,
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Nome ou URL da musica',
            required: true,
            autocomplete: true
        }
    ],
    run: async (client, interaction) => {
        try {
            await interaction.deferReply()

            const player = client.music.createConnection({
                guildId: interaction.guildId,
                voiceChannel: interaction.member.voice.channelId,
                textChannel: interaction.channel.id,
                deaf: true
            })

            const query = interaction.options.getString('query', true)
            const resolve = await client.music.resolve(query)

            if (resolve.loadType === "SEARCH_RESULT" || resolve.loadType === "TRACK_LOADED") {
                const track = resolve.tracks.shift()
                track.info.interaction = interaction
                track.info.requester = interaction.member

                player.queue.add(track)

                if (player.currentTrack) {
                    const embed = new EmbedBuilder()
                        .setColor('Purple')
                        .setDescription(`Adicionado a fila: [${track.info.title}](${track.info.uri})`)

                    await interaction.editReply({embeds: [embed]})
                } else {
                    await interaction.deleteReply()
                }

                if (!player.isPlaying && !player.isPaused)
                    return player.play()
            } else {
                return interaction.editReply('Nenhum resultado encontrado')
            }
        } catch (err) {
            await client.errorLogger(client, err, interaction)
        }
    }
}