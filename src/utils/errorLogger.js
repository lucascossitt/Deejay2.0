const {EmbedBuilder} = require('discord.js')
const moment = require('moment')
const util = require('util')

module.exports = async (client, error, interaction) => {
    try {
        const channel = client.channels.cache.get(process.env.ERROR_LOG_CHANNEL_ID)
        const embed = new EmbedBuilder()
            .setTitle('ERRO!')
            .setDescription(`Data: \`${moment().format('DD/MM/YYYY HH:mm:ss')}\`\nServidor: \`${interaction ? `${interaction.guild.name} (${interaction.guild.id})` : 'Não disponivel'}\`\nUsuário: \`${interaction ? `${interaction.user.username}#${interaction.user.discriminator} (${interaction.member.id})` : 'Não disponivel'}\``)
            .addFields(
                {
                    name: 'Mensagem',
                    value: util.inspect(error, {depth: 0}).slice(0, 1024)
                }
            )

        await channel?.send({embeds: [embed]})

        if (interaction)
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: 'Houve um erro ao executar este comando! O erro ja foi relatado ao desenvolvedor',
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: 'Houve um erro ao executar este comando! O erro ja foi relatado ao desenvolvedor',
                    ephemeral: true
                })
            }
    } catch (err) {
        console.error(err)
    }
}