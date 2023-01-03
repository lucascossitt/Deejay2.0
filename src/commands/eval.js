const {ApplicationCommandOptionType} = require('discord.js')

module.exports = {
    name: 'eval',
    description: 'Executar codigos',
    inVc: false,
    sameVc: false,
    player: false,
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Codigo a ser executado',
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            if (interaction.user.id !== process.env.OWNER) return;

            await interaction.deferReply()

            const query = interaction.options.getString('query', true)
            const result = new Promise(async (resolve, reject) => {
                try {
                    const output = eval(query)
                    resolve(output)
                } catch (err) {
                    reject(err)
                }
            })

            result
                .then(async output => {
                    if (typeof output !== 'string') {
                        output = require('util').inspect(output, {depth: 0})
                    }

                    await interaction.editReply(`\`\`\`${output}\`\`\``, {code: 'js'})
                })
                .catch(async err => {
                    if (typeof err !== 'string') {
                        err = require('util').inspect(err, {depth: 0})
                    }

                    await interaction.editReply(`\`\`\`${err}\`\`\``, {code: 'js'})
                })
        } catch (err) {
            await client.errorLogger(client, err, interaction)
        }
    }
}