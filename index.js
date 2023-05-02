const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log("Server started on port 3000");
});
const io = require("socket.io")(server);

const DB_URL =
    "mongodb+srv://decobee:decobee2000@decobeedb.bqaczwd.mongodb.net/chatApp";
mongoose
    .connect(DB_URL)
    .then(() => console.log(`MongoDB is connected.`))
    .catch((err) => console.log(err));

// Serve static files from the public directory
app.use(express.static("public"));

let socketsConnected = new Set();

// Handle incoming socket connections
io.on("connection", onConnected);

function onConnected(socket) {
    console.log(`New client connected: ${socket.id}`);
    socketsConnected.add(socket.id);

    io.emit("clients-total", socketsConnected.size);

    socket.on("disconnect", () => {
        console.log(`socket disconnected ${socket.id}`);
        socketsConnected.delete(socket.id);
        io.emit("clients-total", socketsConnected.size);
    });

    socket.on("message", (data) => {
        // console.log(data)
        socket.broadcast.emit("chat-message", data);
    });

    socket.on("feedback", (data) => {
        socket.broadcast.emit("feedback", data);
    });
}
