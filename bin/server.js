#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
const room = require('../app/model/room.model');
const { Server } = require('socket.io');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.clientI, process.env.clientII]
  }
});

io.of('/live').on("connection", (socket) => {
  socket.emit("myID", socket.id);
})

// io.engine.generateId = function (req) {
//   console.log(referer);
//   return Math.random() * 100000;
// }

io.of('/room').on("connection", async (socket) => {
  socket.emit("me", socket.id);
  socket.on("create room", (id) => {
    socket.join(id);
    socket.roomID = id;
  })

  socket.on("join room", (id) => {
    socket.join(id);
    socket.roomID = id;
    socket.broadcast.to(id).emit('join room');
  })

  io.of("/room").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });

  socket.on("end call", (roomID) => {
    socket.broadcast.to(roomID).emit('end call', socket.id);
  });

  socket.on('turn webcam off', (roomID) => {
    socket.broadcast.to(roomID).emit('remote turn webcam off');
  });

  socket.on('turn webcam on', (roomID) => {
    socket.broadcast.to(roomID).emit('remote turn webcam on');
  })

  socket.on('start share screen', (roomID) => {
    socket.broadcast.to(roomID).emit('remote start share screen');
  });

  socket.on('stop share screen', (roomID) => {
    socket.broadcast.to(roomID).emit('remote stop share screen');
  })

  socket.on('my video state', (state) => {
    socket.broadcast.to(socket.roomID).emit('remote video state', state);
  })

  socket.on('disconnect', () => {
    console.log("disconect", socket.id);
    room.findOne({
      $or: [
        { userID1: socket.id },
        { userID2: socket.id }
      ]
    })
      .then((_room) => {
        if (!_room) {
          return;
        }
        if (_room.userCount <= 1) {
          room.findOneAndDelete({
            $or: [
              { userID1: socket.id },
              { userID2: socket.id }
            ]
          }).then(() => console.log('Delete'));
        } else {
          room.findOneAndUpdate({
            $or: [
              { userID1: socket.id },
              { userID2: socket.id }
            ]
          }, { $inc: { userCount: -1 }, $set : {userID2 : ''} })
            .then(() => {
              console.log('leave room');
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
})

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'url ' + 'http://localhost:' + addr.port; //dev
  console.log('Listening on ' + bind);
}
