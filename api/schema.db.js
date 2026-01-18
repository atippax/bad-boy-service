const mongoose = require("mongoose");
mongoose.connect(process.env.connection, {
  useNewUrlParser: true,
});
const Schema = mongoose.Schema;
const setSchma = new Schema(
  {
    roomId: String,
    setName: String,
    allTeam: [{ member: [String], order: Number }],
    courtNumber: Number,
    teamLimit: Number,
    winScore: Number,
    winStreak: Number,
  },
  { versionKey: false },
);
const teamShema = new Schema(
  { member: [String], order: Number },
  { _id: false },
);

const matchShema = new Schema(
  {
    roomId: String,
    setName: String,
    allTeam: [teamShema],
    courtNumber: Number,
    teamLimit: Number,
    winScore: Number,
    winStreak: Number,
  },
  { versionKey: false },
);

const matchSetShema = new Schema(
  {
    setName: String,
    roomId: String,
    allTeam: [
      {
        order: Number,
        set: [teamShema],
      },
      { _id: false },
    ],
    courtNumber: Number,
    teamLimit: Number,
    winScore: Number,
    winStreak: Number,
  },
  { versionKey: false },
);
const roomShema = new Schema(
  {
    roomName: String,
    roomCreateOn: Date,
    roomDescription: String,
  },
  { versionKey: false },
);
const MatchSetDB = mongoose.model("MatchSet", matchSetShema);
const MatchDB = mongoose.model("Match", matchShema);
const RoomDB = mongoose.model("Room", roomShema);

module.exports = { RoomDB, MatchDB, MatchSetDB };
