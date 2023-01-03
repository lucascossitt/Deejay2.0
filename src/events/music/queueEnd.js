module.exports = async (client, player) => {
    const channel = client.channels.cache.get(player.textChannel)
    await channel?.send('A fila terminou')

    return player.destroy()
}