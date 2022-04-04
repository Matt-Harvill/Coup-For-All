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
import * as coup from "./coup.js";

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
app.use(express.static("client/build"));
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

// Passport Setup
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// React Route(s)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Login
app.post("/login", (req, res) => {
  passport.authenticate("local")(req, res, () => {
    return res.end();
  });
});

// Logout
app.post("/logout", async (req, res) => {
  req.logout();
  return res.end();
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

  // Get User
  socket.on("get user", (callback) => {
    callback(socket.request.user.username); // Pass the user's name
  });

  // Coup
  coup.socketInit(socket);

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
