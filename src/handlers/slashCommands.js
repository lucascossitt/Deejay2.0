const fs = require('fs')
const path = require('path')

module.exports = async (client) => {
    try {
        const commands = []
        const files = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'))

        for (const file of files) {
            const command = require(path.join(
                __dirname,
                `../commands/${file}`
            ))

            if (command.name) {
                client.commands.set(command.name, command)
                commands.push(command)
            }
        }

        client.on('ready', async () => {
            await client.application.commands.set(commands)
            console.log(`${commands.length} comandos registrados`)
        })
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}