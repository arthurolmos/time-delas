const http = require("http");
const https = require("https");
const path = require("path");
const app = require("./app");
const fs = require("fs-extra");
const socketIO = require("socket.io");
const socketIOHelper = require("./helpers/socketio");

require("./database");

const privateKey = fs.readFileSync(
  path.resolve(__dirname, "..", "keys", "ssl", "server.key"),
  "utf-8"
);
const certificate = fs.readFileSync(
  path.resolve(__dirname, "..", "keys", "ssl", "server.crt"),
  "utf-8"
);
const passphrase = "123456";

const { HTTP_PORT, HTTPS_PORT } = process.env;
console.log("SERVER PORT", HTTP_PORT, HTTPS_PORT);

const credentials = { key: privateKey, cert: certificate, passphrase };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const io = socketIO(httpServer);
socketIOHelper.set(io);
io.on("connection", (socket) => {
  console.log("New client connected");

  socketIOHelper.setSocket(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(HTTP_PORT);
httpsServer.listen(HTTPS_PORT);
