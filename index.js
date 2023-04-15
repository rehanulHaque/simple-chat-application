const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const message = require("./utils/format");
const {
  joinUser,
  currentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const port = 3000;
app.use(express.static("public"));

const botName = "Chat Bot";
//  Runn when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);
    //  Welcome Current User
    socket.emit("message", message(botName, "Wlcome to chat application"));

    //  Broadcast when user connected
    socket.broadcast
      .to(user.room)
      .emit("message", message(botName, `${user.username} has joined chat`));

    //    Send Users and Room info
    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //  Listening chatMessage on server
  socket.on("chatMessage", (msg) => {
    const user = currentUser(socket.id);

    io.to(user.room).emit("message", message(user.username, msg));
  });

  //  Run when client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        message(botName, `${user.username} has left the chat`)
      );

      //    Send Users and Room info
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

http.listen(port, () => console.log(`App listening on port ${port}!`));
