const Discord = require('discord.js');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

console.log('Intents:', client.options.intents);

const prefix = '!';

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async (message) => {
    console.log('Raw message content:', message.content);
    console.log('Message length:', message.content.length);
    console.log('Message received:', message.content);
    console.log('Author:', message.author.tag);
    console.log('Channel:', message.channel.name);
    console.log('Guild:', message.guild ? message.guild.name : 'Direct Message');
    console.log('------');

    if (!message.content.startsWith(prefix) || message.author.bot) {
        console.log('Message does not start with the prefix or is from a bot. Ignoring.');
        return;
    }

    console.log('Command detected');

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    console.log('Command:', command);
    console.log('Arguments:', args);

    try {
        if (command === 'steamlogin') {
            console.log('Steam login command detected');

            const steamApiKey = 'TON_STEAM_API_KEY';
            const steamLoginUrl = `https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.return_to=${encodeURIComponent(
                'https://localhost:3000/auth/steam/callback'
            )}&openid.realm=${encodeURIComponent('https://localhost:3000')}`;

            await message.author.send(`Click the following link to login with Steam: ${steamLoginUrl}`);

            console.log('Steam login logic executed successfully');
        } else {
            console.log('Unknown command. Ignoring.');
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
});


const io = require('socket.io-client');
const socket = io.connect('https://steambiblioapi.lakel.dev');

socket.on('steamDataAvailable', (steamData) => {
    console.log('Nouvelles données Steam disponibles:', steamData);

});

client.login('TON_TOKEN_DISCORD');
