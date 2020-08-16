let io = null;
let socket = null;

exports.set = function (socketio) {
  io = socketio;
};

exports.get = function () {
  return io;
};

exports.setSocket = function (socketIO) {
  socket = socketIO;
};

exports.getSocket = function () {
  return socket;
};
