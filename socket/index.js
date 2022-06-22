const { Server } = require("socket.io");

// Our models
const roomModel = require("../models/rooms");
const historyModel = require("../models/history");

const logger = require("../logger");

// Set of online users
const online = new Set();

module.exports = (server) => {
  // create a socket io server
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    logger.write({ msg: "a user connected to socket" });
    next();
  });

  // We got an connection
  io.on("connection", (socket) => {
    console.log("User connected");

    // user disconnect lets remove him from online list
    socket.on("disconnect", () => {
      console.log("user disconnected");
      online.delete(socket.data.username);
      io.emit("action", { action: "onlinelist", list: Array.from(online) });
    });

    // user wants to set his name
    socket.on("setName", (data) => {
      console.log("setName", data);
      logger.write({ msg: "user set name to", name: data.name });
      socket.data.username = data.name;
      online.add(data.name);

      io.emit("action", { action: "onlinelist", list: Array.from(online) });
    });

    // user sent a message
    socket.on("message", async (data) => {
      logger.write({ msg: "user sent message", data });

      if (data.msg.trim() !== "") {
        // add message to history
        const entryId = await historyModel.insert({
          message: data.msg,
          room: data.room,
          username: socket.data.username,
        });
        // find entry in database
        const entry = await historyModel.findOne(entryId[0]);
        // send to everyone in the room
        io.to(data.room).emit("action", {
          action: "message",
          ...entry,
        });
      } else {
        // send an error message
        socket.emit("action", {
          action: "error",
          msg: "You need to enter a message",
        });
      }
    });

    // all actions regarding rooms
    socket.on("room", async (data) => {
      logger.write({ msg: "room action", data });
      // switch our different actions
      switch (data.action) {
        // create a room
        case "create":
          try {
            // insert into our database
            const resp = await roomModel.insert({ room: data.room });
          } catch (err) {
            // send an error message
            socket.emit("action", {
              action: "error",
              msg: "Room already exists",
            });
            console.log("room already exists");
          }
          // Find all rooms and send to all users
          roomModel
            .find()
            .then((rooms) => io.emit("action", { action: "roomList", rooms }));
          break;

        case "remove":
          // remove rooms
          try {
            // remove room from database
            await roomModel.remove({ room: data.room });
            // remove all history from database
            await historyModel.removeRoom(data.room);
          } catch (err) {
            console.log("cant remove room");
          }
          // Find all rooms and send to all users
          roomModel
            .find()
            .then((rooms) => io.emit("action", { action: "roomList", rooms }));
          break;

        case "join":
          // a user wants to join a room

          // does the remove exists
          const exists = await roomModel.findOne(data.room);
          if (exists) {
            // room exists lets join
            socket.join(data.room);
            // tell everyone that user join room
            socket.emit("action", {
              action: "joined",
              room: data.room,
              name: socket.data.username,
            });
            // send history of chat messages in room
            const historyForRoom = await historyModel.findByRoom(data.room);
            socket.emit("action", { action: "history", list: historyForRoom });
          }
          break;
        default:
          console.log("do nothing with action");
          break;
      }
    });
  });
};
