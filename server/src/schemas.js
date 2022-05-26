import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
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
});

const CoupGameSchema = new mongoose.Schema({
  gameTitle: String,
  gameID: String,
  founder: String,
  status: String, // 'forming', 'in progress', 'completed'
  privacy: String, // 'public', 'private'
  maxPlayers: Number,
  players: [String],
  outPlayers: [String],
  pStats: [
    {
      player: String,
      coins: Number,
      roles: [String],
    },
  ],
  availRoles: [String],
  unavailRoles: {
    Assassin: Number,
    Ambassador: Number,
    Captain: Number,
    Contessa: Number,
    Duke: Number,
  },
  winner: String,
});

// Splendor Schemas -> Don't need subdocuments so use ".obj"

const Splendor5ColorSchema = new mongoose.Schema({
  green: Number,
  blue: Number,
  red: Number,
  black: Number,
  white: Number,
});

const SplendorCardSchema = new mongoose.Schema({
  points: Number,
  resource: {
    color: String,
    count: Number, // 1 for regular game
  },
  requirements: Splendor5ColorSchema.obj,
});

const SplendorNobleSchema = new mongoose.Schema({
  points: Number,
  cardRequirements: Splendor5ColorSchema.obj,
});

const SplendorPStatSchema = new mongoose.Schema({
  player: String,
  points: Number,
  permanentResources: Splendor5ColorSchema.obj,
  coins: {
    // Can't be more than 10
    ...Splendor5ColorSchema.obj,
    yellow: Number,
  },
  cardsInHand: [SplendorCardSchema.obj], // Max length is 3
  cardsOwned: [SplendorCardSchema.obj],
});

const SplendorGameSchema = new mongoose.Schema({
  gameTitle: String, // "Splendor"
  gameID: String,
  founder: String,
  status: String, // 'forming', 'in progress', 'completed'
  privacy: String, // 'public', 'private'
  maxPlayers: Number, // 4
  players: [String],
  pStats: [SplendorPStatSchema.obj],
  activeCards: {
    // Max 4 per level
    level1: [SplendorCardSchema.obj],
    level2: [SplendorCardSchema.obj],
    level3: [SplendorCardSchema.obj],
  },
  inactiveCards: {
    // Remaining cards not owned yet, next card is popped off each level
    level1: [SplendorCardSchema.obj],
    level2: [SplendorCardSchema.obj],
    level3: [SplendorCardSchema.obj],
  },
  nobles: [SplendorNobleSchema.obj],
  coins: {
    ...Splendor5ColorSchema.obj,
    yellow: Number,
  },
  winner: String,
});

UserSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", UserSchema);
const CoupGame = new mongoose.model("CoupGame", CoupGameSchema, "games");
const SplendorGame = new mongoose.model(
  "SplendorGame",
  SplendorGameSchema,
  "games"
);

export { User, CoupGame, SplendorGame };
