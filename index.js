const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const roomRouter = require('./routes/roomRoute');
const liveRouter = require('./routes/liveRoute');
const missionRouter = require('./routes/missionRoute');

require('dotenv').config()

const app = express();
const PORT = 8000;

app.use(cors())
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server Running on port http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome To JKT48 SHOWROOM API',
        author: 'https://github.com/ikhbaldwiyan',
        repository: 'https://github.com/ikhbaldwiyan/jkt48-showroom-api'
    })
});

app.get('/api/trigger', async (req, res) => {
    const channelId = "706168874525261898" // Channel ID
    const botToken = process.env.DISCORD_BOT_TOKEN // Token Bot dari Developer Discord

    const axiosData = await axios.get('https://jkt48-showroom-api-kappa.vercel.app/api/rooms')

    const roomData = axiosData.data[0]

    await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        embeds: [
            {
                "type": "rich",
                "title": roomData.name,
                "description": roomData.description,
            }],
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${botToken}`,
        },
    })

    res.send({ success: true })
})

app.use('/api/rooms', roomRouter);
app.use('/api/lives', liveRouter);
app.use('/api/missions', missionRouter);
