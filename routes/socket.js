const { Message } = require("../models/message");
const { Server } = require("socket.io");

module.exports = function (server) {
  const onlineUsers = {}; // Example: { "adithya": "socketId1234" }

  const io = new Server(server, {
    cors: {
      origin: "https://chatapp-client-tawny.vercel.app",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Save who they are (Save users temporary, that are come online and thier socketID)
    socket.on("register_user", async (username) => {
      onlineUsers[username] = socket.id; // Save who they are
      console.log(`User Added to Onliner list: ${onlineUsers[username]}`);

      // Load unread messages from database
      const unread = await Message.find({
        receiver: username,
        read: false,
      });

      // Send those unread messages to the user now
      if (unread) io.to(socket.id).emit("unread_messages", unread);
    });

    // socket.on("mark_read", async ({ sender, receiver }) => {
    //   await Message.updateMany(
    //     { sender, receiver, read: false },
    //     { $set: { read: true } }
    //   );
    // });

    socket.on("send_private_message", async (data) => {
      console.log("ON: send_private_message triggered");
      const message = new Message({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        // time: data.time,
      });
      await message.save();

      // If receiver is online, deliver it instantly
      const receiverSocket = onlineUsers[data.receiver];
      console.log(data);
      console.log(onlineUsers);
      if (receiverSocket) {
        console.log("EMIT: receive_private_message triggered");
        io.to(receiverSocket).emit("receive_private_message", message);
      }
    });

    socket.on("disconnect", () => {
      for (let user in onlineUsers) {
        if (onlineUsers[user] === socket.id) {
          console.log("User is Deleted fromthe list ", onlineUsers[user]);
          delete onlineUsers[user]; // Remove user from online map
        }
      }
    });
  });
};
