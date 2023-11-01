const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const roomRouter = require('./routes/roomRoute');
const liveRouter = require('./routes/liveRoute');
const missionRouter = require('./routes/missionRoute');

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

app.get('/api/trigger', (req, res) => {
    const channelId = "706168874525261898" // Channel ID
    const botToken = "MTE2OTE5NzM3MzI0MzgwNTc1OA.G3QP0L.kGYcqDf5FMbgUtIH1YvoIX5OONhdaRZ1Va6-J4" // Token Bot dari Developer Discord

    axios.get('https://jkt48-showroom-api-kappa.vercel.app/api/rooms').then(({ data }) => {
        const roomData = data[0]

        axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, {
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
        }).catch(() => {
            res.send({
                success: false
            })
        });
        
        res.send({
            success: true
        })
    }).catch(() => {
        res.send({
            success: false
        })
    })
})

app.use('/api/rooms', roomRouter);
app.use('/api/lives', liveRouter);
app.use('/api/missions', missionRouter);