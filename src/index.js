require('dotenv').config()
const {Client, GatewayIntentBits, Collection} = require('discord.js')
const {Poru} = require('poru')
const nodes = [{name: "VPS", host: process.env.LAVALINK_HOST, port: 8080, password: process.env.LAVALINK_PASSWORD, secure: false}]

const client = new Client({
    failIfNotExists: true,
    allowedMentions: {
        parse: ['roles', 'users', 'everyone'],
        repliedUser: false,
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.commands = new Collection()
client.music = new Poru(client, nodes, {
    library: 'discord.js',
    defaultPlatform: 'ytsearch',
    spotify: {
        clientID: process.env.SPOTIFT_CLIENT_ID,
        clientSecret: process.env.SPOTIFT_CLIENT_SECRET,
        playlistLimit: 5
    }
})

require('./handlers/slashCommands')(client)
require('./handlers/events')(client)
require('./handlers/musicEvents')(client)

client.login(process.env.TOKEN)