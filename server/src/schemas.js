import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  gameTitle: {
    type: String,
    default: "",
  },
  gameID: {
    type: String,
    default: "",
  },
  gameStatus: {
    type: String,
    default: "",
  },
  pStat: {
    player: String,
    coins: Number,
    roles: [String],
  },
});

const coupGameSchema = new mongoose.Schema({
  gameTitle: String,
  gameID: String,
  founder: String,
  status: String, // 'forming', 'in progress', 'completed'
  privacy: String, // 'public', 'private'
  maxPlayers: Number,
  players: [String],
  pStats: [
    {
      player: String,
      coins: Number,
      roles: [String],
    },
  ], // { player: "", coins: 2, roles: ["",""] }
  calloutTargets: [
    {
      target: String,
      action: String,
    },
  ],
  turn: {
    player: String,
    action: String,
    status: String, // Turn can be preCallout, callout, postCallout
    targets: [
      {
        target: String,
        action: String,
      },
    ],
  },
  availRoles: [],
  winner: String,
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
const CoupGame = new mongoose.model("CoupGame", coupGameSchema, "games");

export { User, CoupGame };
