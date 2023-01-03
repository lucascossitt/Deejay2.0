module.exports = async (client, player) => {
    try {
        const channel = client.channels.cache.get(player.textChannel)
        await channel?.send('A fila terminou')

        return player.destroy()
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}