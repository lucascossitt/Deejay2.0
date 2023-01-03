module.exports = async (client) => {
    try {
        client.music.init(client)
        console.log('Iniciado')
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}