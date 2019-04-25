const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//app.set('view engine', 'ejs')

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/index.html');})

http.listen(3000, () => {
    console.log('listening on *3000')
});
var rooms = 0;

io.on('connection', (socket) => {
    console.log('new user connected!')
    /**
 * Create a new game room and notify the creator of game. 
 */
socket.on('createGame', function(data){
  socket.join('room-' + ++rooms);
  socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
});

/**
 * Connect the Player 2 to the room he requested. Show error if room full.
 */
socket.on('joinGame', function(data){
  var room = io.nsps['/'].adapter.rooms[data.room];
  if( room && room.length == 1){
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('player1', {});
    socket.emit('player2', {name: data.name, room: data.room })
  }
  else {
    socket.emit('err', {message: 'Sorry, The room is full!'});
  }
});
/**
 * Handle the turn played by either player and notify the other. 
 */
socket.on('playTurn', function(data){
  socket.broadcast.to(data.room).emit('turnPlayed', {
    guess: data.guess,
    room: data.room
  });
});
    /**
 * Notify the players about the victor.
 */
socket.on('gameEnded', function(data){
  socket.broadcast.to(data.room).emit('gameEnd', data);
});

});

