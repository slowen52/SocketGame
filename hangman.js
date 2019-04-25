(function(){

  // Types of players
  var P1 = 'X', P2 = 'O';
  var socket = io.connect('http://localhost:3000'),
    player,
    game;

  /**
   * Create a new game. Emit newGame event.
   */
  $('#new').on('click', function(){
    var name = $('#nameNew').val();
    if(!name){
      alert('Please enter your name.');
      return;
    }
    socket.emit('createGame', {name: name});
    player = new Player(name, P1);
  });

  /** 
   *  Join an existing game on the entered roomId. Emit the joinGame event.
   */ 
  $('#join').on('click', function(){
    var name = $('#nameJoin').val();
    var roomID = $('#room').val();
    if(!name || !roomID){
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('joinGame', {name: name, room: roomID});
    player = new Player(name, P2);
  });
})();