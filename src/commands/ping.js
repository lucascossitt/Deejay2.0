module.exports = {
    name: 'ping',
    description: 'Exibe o ping do BOT',
    inVc: false,
    sameVc: false,
    player: false,
    run: async (client, interaction) => {
        await interaction.reply(`${client.ws.ping}ms`)
    }
}