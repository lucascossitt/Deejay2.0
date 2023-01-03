module.exports = async (client, oldVoice, newVoice) => {
    const player = client.music.players.get(oldVoice.guild.id)
    if (!player) return

    if (!newVoice.guild.members.me.voice.channel) {
        player.destroy()
    }
}