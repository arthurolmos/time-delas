// /app/sockets/receivers.server.sockets.js
let socketIO;
exports.receivers = (io) => {
  socketIO = io;
  io.emit("FromAPI", "hello");
};
// handle different type of notification.
