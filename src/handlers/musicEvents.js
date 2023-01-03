const fs = require('fs')
const path = require('path')

module.exports = async (client) => {
    try {
        const files = fs.readdirSync('./src/events/music/').filter(file => file.endsWith('.js'))

        for (const file of files) {
            const event = require(path.join(
                __dirname,
                `../events/music/${file}`
            ))

            const eventName = file.replace('.js', '')

            client.music.on(eventName, event.bind(null, client))
        }

        console.log(`${files.length} eventos de musica carregados`)
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}