const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const axios = require('axios');
const PORT = process.env.PORT || 3000;

let steamData = null;

app.use(express.static('public'));
app.use(express.json());

app.get('/auth/steam/callback', (req, res) => {
    console.log('Steam callback reached');
    res.redirect('/');
});

app.post('/steam-response', async (req, res) => {
	console.log('Steam response received:', req.body);
    steamData = req.body;
    console.log('Données reçues de Steam:', steamData);

    if (steamData && steamData.steamid) {
        try {
            console.log('Tentative de récupération de données Steam pour steamid:', steamData.steamid);
            
            const response = await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=TON_STEAM_API_KEY&steamid=${steamData.steamid}`);
            
            console.log('Réponse de l\'API Steam:', response.data);

            const games = response.data.response.games;
            
            console.log('Bibliothèque de jeux Steam:', games);

            io.emit('steamDataAvailable', { ...steamData, games });

            res.json({ success: true, data: 'Données traitées avec succès' });
        } catch (error) {
            console.error('Erreur lors de la récupération de la bibliothèque de jeux Steam:', error);
            res.status(500).json({ success: false, error: 'Erreur lors de la récupération de la bibliothèque de jeux Steam' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Données Steam invalides' });
    }
});

app.get('/auth/steam/callback', (req, res) => {
    res.redirect('/');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});