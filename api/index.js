const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const { createTeamPair } = require("../modifile");
const { MatchDB, MatchSetDB, RoomDB } = require("./schema.db");
const { createRandomTeamParing } = require("../utls/paring");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/getRoomId", async (req, res) => {
  try {
    const result = await RoomDB.find();
    if (result != null) {
      const response = result.map((x) => x._id);
      return res.status(200).json(response);
    }
    return res.json([]);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});

app.post("/room", async (req, res) => {
  const roomData = {
    roomName: req.body.roomName,
    roomCreateOn: new Date(),
    roomDescription: req.body.description,
  };
  console.log(roomData);
  try {
    const room = new RoomDB(roomData);
    await room.save().then((e) => {
      res.json({ id: e._id });
    });
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});

app.get("/room", async (req, res) => {
  try {
    const result = await RoomDB.find();
    if (result != null) {
      const response = result.map((x) => {
        return {
          roomName: x.roomName,
          roomDescription: x.roomDescription,
          roomCreateOn: x.roomCreateOn,
          roomId: x._id,
        };
      });
      return res.status(200).json(response);
    }
    return res.json([]);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});

app.get("/team/:teamId", async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const result = await MatchDB.findOne({ _id: teamId });
    if (result) {
      return res.json({
        roomId: result.roomId,
        teamId: result._id,
        teamName: result.setName,
        courtNumber: result.courtNumber,
        allTeam: result.allTeam,
        winScore: result.winScore,
        teamLimit: result.teamLimit,
        winStreak: result.winStreak,
      });
    }
    return res.json(500);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.get("/set/:setId", async (req, res) => {
  const setId = req.params.setId;
  try {
    const result = await MatchSetDB.findOne({ _id: setId });
    if (result) {
      return res.json({
        roomId: result.roomId,
        setId: result._id,
        teamName: result.setName,
        courtNumber: result.courtNumber,
        allTeam: result.allTeam,
        winScore: result.winScore,
        teamLimit: result.teamLimit,
        winStreak: result.winStreak,
      });
    }
    return res.json(500);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.get("/team", async (req, res) => {
  const roomId = req.query.roomId;
  try {
    const result = await MatchDB.find({ roomId: roomId });
    const reponse = result != null ? result : [];
    res.json(
      reponse.map((x) => {
        return {
          roomId: x.roomId,
          teamId: x._id,
          teamName: x.setName,
          courtNumber: x.courtNumber,
          allTeam: x.allTeam,
          winScore: x.winScore,
          teamLimit: x.teamLimit,
          winStreak: x.winStreak,
        };
      })
    );
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.get("/set", async (req, res) => {
  const roomId = req.query.roomId;
  try {
    const result = await MatchSetDB.find({ roomId: roomId });
    const reponse = result != null ? result : [];
    res.json(
      reponse.map((x) => {
        return {
          roomId: x.roomId,
          setId: x._id,
          teamName: x.setName,
          courtNumber: x.courtNumber,
          allTeam: x.allTeam,
          winScore: x.winScore,
          teamLimit: x.teamLimit,
          winStreak: x.winStreak,
        };
      })
    );
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.post("/team", async (req, res) => {
  try {
    const members = req.body.members ?? [];
    const limit = req.body.limit ?? 2;
    const start = req.body.start ?? 0;
    const random = req.body.random ?? false;
    const { isSet, limitSet } = req.body.matchSet;
    const { teamLock } = req.body;
    if (req.body.setName.trim() === "") {
      const now = new Date();
      const options = {
        timeZone: "Asia/Bangkok",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const formattedDate = now.toLocaleString("th-TH", options);
      req.body.setName = `วันที่ ${formattedDate}`;
    }
    if (isSet) {
      const teams = await createTeamPair(
        members,
        limit,
        limitSet,
        start,
        random,
        req.body.teamLock.map((x) => x.teamMember)
      );

      const payload = {
        courtNumber: req.body.courtNumber,
        roomId: req.body.roomId,
        winScore: req.body.winScore,
        teamLimit: req.body.teamLimit,
        winStreak: req.body.winStreak,
        allTeam: teams.map((x, index) => {
          return {
            order: index + 1,
            set: x.map((y, idx) => {
              return {
                order: idx + 1,
                member: y,
              };
            }),
          };
        }),
        setName: req.body.setName,
      };
      const team = new MatchSetDB(payload);
      await team.save().then((e) => res.json({ isSet: true, id: e._id }));
    } else {
      const allteam = createRandomTeamParing(members, teamLock, limit);
      const payload = {
        courtNumber: req.body.courtNumber,
        roomId: req.body.roomId,
        winScore: req.body.winScore,
        teamLimit: req.body.teamLimit,
        winStreak: req.body.winStreak,
        allTeam: allteam.map((x, index) => {
          return { member: x, order: index + 1 };
        }),
        setName: req.body.setName,
      };
      return await MatchDB(payload)
        .save()
        .then((e) => res.json({ isSet: false, id: e._id }));
    }
  } catch (e) {
    console.log(e);
    res.json(500);
  }
  // member.value = shufferMember(members)
});
app.get("/deleteTeam/:teamId", async (req, res) => {
  try {
    await MatchDB.deleteOne({ _id: req.params.teamId });
    res.json(200);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.get("/deleteSet/:setId", async (req, res) => {
  try {
    await MatchSetDB.deleteOne({ _id: req.params.setId });
    res.json(200);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.get("/deleteRoom/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  try {
    await MatchSetDB.deleteMany({ roomId: roomId });
    await MatchDB.deleteMany({ roomId: roomId });
    res.json(200);
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});

app.get("/room/:roomId", async (req, res) => {
  try {
    const roomData = await RoomDB.findOne({ _id: req.params.roomId });
    if (roomData != null) {
      return res.json({
        roomId: roomData._id,
        roomName: roomData.roomName,
        roomCreateOn: roomData.roomCreateOn,
        roomDescription: roomData.roomDescription,
      });
    }
    return res.json();
  } catch (e) {
    console.log(e);
    res.json(500);
  }
});
app.listen(3001, async () => {
  console.log("Server is running on port 3001");
});
