const { HOME, LIVE, ROOM, BASE_URL } = require("../utils/api");
const fetchService = require("../utils/fetchService");
const getCustomRoom = require("../utils/customRoom");

const Rooms = {
  getRoomList: async (req, res) => {
    let roomList = [];
    try {
      const response = await fetchService(HOME, res);
      const rooms = response.data;

      for (let i = 0; i < rooms.length; i++) {
        const index = rooms[i];
        if (
          index.name.includes("JKT48") &&
          !index.url_key.includes("JKT48_Eve") &&
          !index.url_key.includes("JKT48_Ariel") &&
          !index.url_key.includes("JKT48_Anin") &&
          !index.url_key.includes("JKT48_Cindy")
        ) {
          roomList.push(index);
        }
      }

      res.send(roomList);
    } catch (error) {
      return error;
    }
  },

  getRoomLive: async (req, res) => {
    try {
      let onLive = [];
      let roomIsLive = [];
      let findSisca = [];

      const response = await fetchService(`${LIVE}/onlives`, res);
      const data = response.data.onlives;

      // Find Member Live
      for (let i = 0; i < data.length; i++) {
        const index = data[i];
        if (index.genre_name === "Idol") {
          onLive.push(index);
        }
      }

      if (onLive.length) {
        const roomLive = onLive[0].lives;

        roomLive.forEach((item) => {
          if (item.room_url_key.includes("JKT48")) {
            roomIsLive.push(item);
          }
        });
      }

      // Find Sisca
      for (let i = 0; i < data.length; i++) {
        const index = data[i];
        if (index.genre_name === "Music") {
          findSisca.push(index);
        }
      }

      if (findSisca.length) {
        const siscaLive = findSisca[0].lives;

        siscaLive.forEach((item) => {
          if (item.room_url_key.includes("JKT48")) {
            roomIsLive.push(item);
          }
        });
      }

      // if (roomIsLive.length === 0) {
      //   res.send({
      //     message: "Room Not Live",
      //     is_live: false,
      //     data: [],
      //   });
      // }

      return res.send({
        "message": "Room Is Live",
        "is_live": true,
        "data": [
          {
            "room_url_key": "JKT48_Feni",
            "official_lv": 1,
            "follower_num": 249104,
            "started_at": 1699005658,
            "live_id": 18782278,
            "image_square": "https://static.showroom-live.com/image/room/cover/bc8b10acffc5adee44b5d8b7dade3bc9435607fe3a766ae772ec633ac08b649b_square_s.jpeg?v=1675092939",
            "is_follow": false,
            "streaming_url_list": [
              {
                "is_default": true,
                "url": "https://hls-origin250.showroom-cdn.com/liveedge/34b0732dcf68e1d2b3eaf538e44ce0cfc65f0a024de3a016b98c181a34264541_low/chunklist.m3u8",
                "label": "low quality",
                "type": "hls",
                "id": 4,
                "quality": 150
              }
            ],
            "live_type": 0,
            "tags": [

            ],
            "image": "https://static.showroom-live.com/image/room/cover/bc8b10acffc5adee44b5d8b7dade3bc9435607fe3a766ae772ec633ac08b649b_s.jpeg?v=1675092939",
            "view_num": 2622,
            "genre_id": 102,
            "main_name": "Feni/フェニ（JKT48）",
            "premium_room_type": 0,
            "cell_type": 100,
            "bcsvr_key": "11e9846:tP93rorc",
            "room_id": 317738
          }
        ]
      })
      res.send({
        message: "Room Is Live",
        is_live: true,
        data: roomIsLive,
      });
    } catch (error) {
      return error;
    }
  },

  getProfile: async (req, res) => {
    try {
      const { roomId, cookies } = req.params;
      const config = {
        headers: {
          Cookie: cookies,
        },
      };
      const getProfile = await fetchService(
        `${ROOM}/profile?room_id=${roomId}`,
        res,
        config
      );
      const profile = getProfile.data;

      res.send(profile);
    } catch (error) {
      res.send(error);
    }
  },

  getNextLive: async (req, res) => {
    try {
      const { roomId } = req.params;
      const getNextLive = await fetchService(
        `${ROOM}/next_live?room_id=${roomId}`,
        res
      );
      const nextLive = getNextLive.data;

      res.send(nextLive);
    } catch (error) {
      res.send(error);
    }
  },

  getTotalRank: async (req, res) => {
    try {
      const { roomId } = req.params;
      const getTotalRank = await fetchService(
        `${LIVE}/summary_ranking?room_id=${roomId}`,
        res
      );
      const totalRank = getTotalRank.data.ranking;

      res.send(totalRank);
    } catch (error) {
      res.send(error);
    }
  },

  getGen10Member: async (req, res) => {
    const ROOMS = getCustomRoom('gen_10')
    const promises = Object.values(ROOMS).map(async (room_id) => {
      const response = await fetchService(
        `${ROOM}/profile?room_id=${room_id}`,
        res
      );
      return response.data;
    });

    try {
      const newMember = await Promise.all(promises);
      res.send(newMember);
    } catch (error) {
      res.send(error);
    }
  },

  getTrainee: async (req, res) => {
    const ROOMS = getCustomRoom('trainee')
    const promises = Object.values(ROOMS).map(async (room_id) => {
      const response = await fetchService(
        `${ROOM}/profile?room_id=${room_id}`,
        res
      );
      return response.data;
    });

    try {
      const newMember = await Promise.all(promises);
      res.send(newMember);
    } catch (error) {
      res.send(error);
    }
  },

  getFanLetter: async (req, res) => {
    try {
      const { roomId } = req.params;
      const getFanLetter = await fetchService(
        `${ROOM}/recommend_comments?room_id=${roomId}`,
        res
      );
      const fanLetter = getFanLetter.data.recommend_comments;

      res.send(fanLetter);
    } catch (error) {
      res.send(error);
    }
  },

  getTheaterSchedule: async (req, res) => {
    try {
      const data = await fetchService(
        `${BASE_URL}/premium_live/search?page=1&count=24&is_pickup=0`,
        res
      );
      const schedule = data.data.result.filter(
        (room) => room.room_name === "JKT48 Official SHOWROOM"
      );

      res.send(schedule);
    } catch (error) {
      res.send(error);
    }
  },
};

module.exports = Rooms;
