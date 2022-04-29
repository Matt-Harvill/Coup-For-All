// Dependencies
import "dotenv/config.js";
import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";
import { ServerApiVersion } from "mongodb";
import { User } from "./schemas.js";
import gameSwitch from "./gameSwitch.js";
import { getSocket, socketIDMap } from "./utils/socketUtils.js";
import { allOnlinePlayers } from "./utils/socketUtils.js";

// Dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express Setup
const app = express();
const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
});
app.use(express.json());
const pathToBuild = path.resolve(__dirname, "..", "..", "client", "build");
app.use(express.static(pathToBuild));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

//Mongoose Connect
const mongoURI = `mongodb+srv://${process.env.MONGO_USR}:${process.env.MONGO_PW}@default-cluster.fudbb.mongodb.net/newDB?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
export const conn = mongoose.connection;

// Passport Setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// React Route(s)
app.get("*", (req, res) => {
  const pathToIndexHTML = path.resolve(
    __dirname,
    "..",
    "..",
    "client",
    "build",
    "index.html"
  );
  res.sendFile(pathToIndexHTML);
});

// Login
app.post("/login", (req, res) => {
  passport.authenticate("local")(req, res, () => {
    return res.end();
  });
});

// Register
app.post("/register", (req, res) => {
  User.register({ username: req.body.username }, req.body.password, (err) => {
    if (err) {
      console.log(err);
      return res.sendStatus(401);
    } else {
      passport.authenticate("local")(req, res, () => {
        return res.end();
      });
    }
  });
});

// Logout
app.post("/logout", async (req, res) => {
  const userSocket = getSocket(req.user.username);
  delete socketIDMap[req.user.username];

  userSocket.disconnect(); // Disconnect the associated socket

  req.logout(); // Logout through passport

  return res.end();
});

// Socket.IO
const server = http.createServer(app);
export const io = new Server(server, { transports: ["websocket"] });

// Convert Middleware to Socket.IO Middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    console.log(
      socket.request.user.username,
      "socket passing through middleware"
    );
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  const username = socket.request.user.username;
  socketIDMap[username] = socket.id;

  // Handle events with group and remaining args (args.length > 0)
  socket.onAny(async (group, event, ...args) => {
    console.log(
      `${socket.request.user.username}'s request { group: ${group}, event: ${event}, args:`,
      ...args,
      "}"
    );
    // Call the appropriate event handler for the specified group
    gameSwitch(group).eventSwitch(event, socket, ...args);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    for (const [group, playerSet] of allOnlinePlayers.entries()) {
      const username = socket.request.user.username;
      if (playerSet.has(username)) {
        playerSet.delete(username);
        io.emit(group, "online", Array.from(playerSet));
        break;
      }
    }
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
