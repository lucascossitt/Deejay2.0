module.exports = {
    name: 'skip',
    description: 'Pula a musica atual',
    inVc: true,
    sameVc: true,
    player: true,
    run: async (client, interaction) => {
        await interaction.deferReply()

        const player = client.music.players.get(interaction.guild.id)

        if (interaction.user.id !== player.currentTrack.info.requester.id && interaction.user.id != process.env.OWNER)
            return interaction.reply({
                content: 'Você não pode pular esta musica',
                ephemeral: true
            })

        player.stop()

        await interaction.deleteReply()
    }
}