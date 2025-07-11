const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

// Routes imports
const users = require("./routes/users");
const friends = require("./routes/friends");
const messages = require("./routes/messages");
const auth = require("./routes/auth");
const search = require("./routes/search");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
require("./routes/socket")(server);
require("./startup/db")();

app.use("/api/users", users);
app.use("/api/friends", friends);
app.use("/api/messages", messages);
app.use("/api/auth", auth);
app.use("/api/search", search);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
