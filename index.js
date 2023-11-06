const firebaseAdmin = require('firebase-admin')
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

    const { data: liveData } = await axios.get('https://jkt48-showroom-api-kappa.vercel.app/api/rooms/onlives')
    
    if (liveData.is_live) {
        // Check whether Firebase Admin has been initialized
        if (!firebaseAdmin.apps.length) {
            // Initialize Firebase Admin
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert({
                    projectId: "bot-discord-67549",
                    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5wWX3j72SSO/s\n32ncxcPJsGzMPQdT/TQxyg15xBVBknQe10owr8WlACwKgjTxAE2Qs2t1bpXzZiJ0\n7blwZ4kpoO4rt/o0a6ciAcNUqYs7RLtN/Vw3OVcXNppbRdu2EB0/ViZuz5CgWzbf\nKeuFRHGp2BKameSqDW1mSqd9CNUZ1eiNax0arsYIYPxB1A9NCT3GbaCvkr17LTk8\nNEX5VgMwlDxH5cb6Vb6xv1GhNKQg2tj40GcRuefzDAMn243XAEZpuT++71ZZUbdI\nzbJ/pqmVBZdvE+K4FxbYbDOYAyncL9s4pfEm2/H1GDWEodW3s9YxHHDQNFf441Kx\n7cWEnTbBAgMBAAECggEACebezh8J7nHX5EsWhA/Au5AdhJeeO+Jr9Vl9dWe38Fpj\nuT8ls8my4fRL5LWDJ/OprtR5nnVqJeLkZFJFx9GlFKSA/bCddEzmyF/Kr0koZFzq\nFSKz1zfFxjWBbesf5qkePgGUI+UJoxqppqS/6sc2veSIPViFwXDcy46gNgCSB4Hx\nzbXBAnt7vBNrhlZGiPP3RbjUZUI8Gy0MjLfaYN82puo948PK2BZg8LgWBBIUElfN\n2ElACEkxeU+4pLCFopwpuneSvSD0YmDuk0gtOXoU6D4mB8iOlpXUz43M+f+hjHhS\n1BS/ODDj4B5DGpgMS/GV6nY/2gu2zjxZjGGb7doIVwKBgQDm2f9JN7pxjDKOR84M\nvUfjnKOQv+wHcZeYVRbYddDOTs0z0+6d3SowxZJdq4pJnn9UFQAWffkudG9HSzaf\nJCfLo9kcKdGk8tC+axFJ75RjlX6yUtxUsm+hLZ2DowhET7j0u0lwtU0Mb+NOj8sH\nI+dbE+Qb37pCG5891rOtHLe+rwKBgQDN/cIruw32NRbmUYh+F9WPiH6vrYHl9+mz\nF9Dhf3JV4ns9gafBP/YYaaCR5qLnwph5Mf7S0+28R2HbhmIBQ+EjajfWvBYSLW7W\nxpkWZ+RfZvTBuLKi3Amf2QBnpTVCiEKhbmgq7n2ibs9SP1Dlzq/gMu9lcS/BOxaX\nUAWkOZY9jwKBgHatw8xEVhlh1evHhmqONJMTSBN2V0VMZH7v35rQltQ5Ns1aOuX1\neWcxaxm0wpcuYI89bJojkSMMwNiKFj6iO8M5LLiJ1zlRi3cZW/4CqOq5RDUw3Ay+\n3xyhcsTl364evhsy3YKP8lhefSE6U0oMbzgndbHOxtaNlMQZyK1KgjwJAoGADnyX\nKD4qeDM5ng8D22JPuZ1u02oPZZ3uyJKXNRSidNnNswCoTJXz97mN+lTPBh+QW42h\njzAqWwBmKGsl/1LHxZbVwHtPzg116xLid0ntLKxv8CPOJFf3MU+wkJl0ym4MyY+b\nMdG98it61xzu0oqbodfTMD4qjptaNmABVZBbOY8CgYB9sNgHVcVBGEIgAdVG81Rg\ngARx9fjCEmxyVY8uyfcxqStWzb/tfmxdqtO2AIiEa4Gfa0znvx97rPUbAK8A0DGs\nlrk4nShufFRGmKUVJT1VlBYaeY7PwshI2lkTJJKa2D94yksHqLgNBNY/WDl8yWeK\ntMXRWp38ByZmdb686YrffQ==\n-----END PRIVATE KEY-----\n",
                    client_email: "firebase-adminsdk-eqy3b@bot-discord-67549.iam.gserviceaccount.com",
                })
            })
        }

        const streamCollection = firebaseAdmin.firestore().collection('stream')
        
        await Promise.all(liveData.data.map(async (liveDataItem) => {
            const liveId = String(liveDataItem.live_id)
            
            const firebaseStreamDoc = streamCollection.doc(liveId);
            const firebaseStreamDocQuery = await firebaseStreamDoc.get()
            
            if (!firebaseStreamDocQuery.exists) {
                await streamCollection.doc(liveId).set({
                    recorded: firebaseAdmin.firestore.Timestamp.now()
                })

                const { data: roomData } = await axios.get(`https://jkt48-showroom-api-kappa.vercel.app/api/rooms/profile/${liveDataItem.room_id}/cookie`)

                await axios.post(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                    embeds: [
                        {
                            image: {
                                name: roomData.main_name,
                                url: roomData.image,
                            },
                            title: roomData.main_name,
                            description: roomData.description,
                            url: liveDataItem.streaming_url_list[0].url
                        }
                    ],
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bot ${botToken}`,
                    },
                })
            }
        }))
    }

    return res.send({})
})

app.use('/api/rooms', roomRouter);
app.use('/api/lives', liveRouter);
app.use('/api/missions', missionRouter);
