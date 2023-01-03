module.exports = {
    name: 'ping',
    description: 'Exibe o ping do BOT',
    inVc: false,
    sameVc: false,
    player: false,
    run: async (client, interaction) => {
        try {
            await interaction.deferReply()
            await interaction.repliy(`${client.ws.ping}ms`)
        } catch (err) {
            await client.errorLogger(client, err, interaction)
        }
    }
}