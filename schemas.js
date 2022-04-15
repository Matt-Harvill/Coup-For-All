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
  pStat: {},
});

const coupGameSchema = new mongoose.Schema({
  gameTitle: String,
  gameID: String,
  founder: String,
  status: String, // 'forming', 'in progress', 'complete'
  privacy: String, // 'public', 'private'
  players: [String],
  pStats: Map,
  availRoles: [],
  winner: String,
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
const CoupGame = new mongoose.model("CoupGame", coupGameSchema);

export { userSchema, coupGameSchema, User, CoupGame };
