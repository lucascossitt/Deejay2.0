const {InteractionType} = require('discord.js')
const axios = require('axios')
const {parseVideo} = require('../utils/fetchVideo')
const rfc3986EncodeURIComponent = (str) => encodeURIComponent(str).replace(/[!'()*]/g, escape)

module.exports = async (client, interaction) => {
    try {
        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName === 'play') {
                const searchQuery = interaction.options.getFocused(true).value;
                if (searchQuery.length === 0) return interaction.respond([]);

                let fetched = false;
                const res = await axios.get(`https://www.youtube.com/results?q=${rfc3986EncodeURIComponent(searchQuery)}&hl=en`);
                let html = res.data;

                // try to parse html
                try {
                    const data = html.split('ytInitialData = \'')[1]?.split('\';</script>')[0];
                    html = data.replace(/\\x([0-9A-F]{2})/ig, (...items) => String.fromCharCode(parseInt(items[1], 16)));
                    html = html.replaceAll('\\\\"', '');
                    html = JSON.parse(html);
                } catch {
                    null;
                }

                let videos;
                if (html?.contents?.sectionListRenderer?.contents?.length > 0 && html.contents.sectionListRenderer.contents[0]?.itemSectionRenderer?.contents?.length > 0) {
                    videos = html.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
                    fetched = true;
                }

                // backup/ alternative parsing
                if (!fetched) {
                    try {
                        videos = JSON.parse(html.split('{"itemSectionRenderer":{"contents":')[html.split('{"itemSectionRenderer":{"contents":').length - 1].split(',"continuations":[{')[0]);
                        fetched = true;
                    } catch {
                        null;
                    }
                }
                if (!fetched) {
                    try {
                        videos = JSON.parse(html.split('{"itemSectionRenderer":')[html.split('{"itemSectionRenderer":').length - 1].split('},{"continuationItemRenderer":{')[0]).contents;
                        fetched = true;
                    } catch {
                        null;
                    }
                }

                const results = [];
                if (!fetched) return interaction.respond(results);
                for (const video of videos) {
                    if (results.length >= 5) break;
                    const parsed = parseVideo(video);
                    if (parsed) results.push(parsed);
                }

                await interaction.respond(results.map(video => ({
                    name: video.title,
                    value: video.url
                })));
            }
        }

        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.commands.get(interaction.commandName)
            const player = client.music.players.get(interaction.guild.id)
            const memberChannel = interaction.member.voice.channelId
            const botChannel = interaction.guild.members.me.voice.channelId
            if (!command) return;

            if (command.inVc && !memberChannel)
                return interaction.reply({
                    content: 'Você não está em um canal de voz',
                    ephemeral: true
                })

            if (command.sameVc && player && botChannel !== memberChannel)
                return interaction.reply({
                    content: 'Você não está no mesmo canal de voz que eu',
                    ephemeral: true
                })

            if (command.player && !player)
                return interaction.reply({
                    content: 'Não estou tocando musica neste servidor',
                    ephemeral: true
                })

            try {
                command.run(client, interaction)
            } catch (err) {
                await client.errorLogger(client, err, interaction)
            }
        }
    } catch (err) {
        await client.errorLogger(client, err, interaction)
    }
}