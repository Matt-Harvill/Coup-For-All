import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  gameTitle: { type: String, default: "" },
  gameID: { type: String, default: "" },
  playerStat: {},
});

const coupGameSchema = new mongoose.Schema({
  gameTitle: String,
  gameID: String,
  status: String, // 'forming', 'in progress'
  privacy: String, // 'public', 'private'
  full: { type: Boolean, default: false },

  activePlayer: String,
  maxPlayers: Number,
  players: [String],
  readyPlayers: [String],
  playerStats: [],
  availableRoles: [],

  winner: { type: String, default: "" },
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
const CoupGame = new mongoose.model("CoupGame", coupGameSchema);

export { userSchema, coupGameSchema, User, CoupGame };
