var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const querystring = require('querystring');

var userDB= require('./userDB');


//Middle wares..

app.use(cookieParser()); 
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));

  //console.log("req.cookies['userName']",req.cookies['userName']);
  
  if( !("userName" in req.cookies) || req.cookies['userName'] == undefined){
    return res.redirect('/login');
  }

  return res.sendFile(path.join(__dirname, './views', 'index.html'));
});

app.get('/login', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, './views', 'login.html'));
});
app.post('/login', function(req, res){
  res.cookie('userName', req.body['userName']);

  res.redirect('/');
});
 
// Register events on socket connection
io.on('connection', function(socket){ 
  //Socket connection..
  if(socket && socket.id){

    //Add to db 
    var cookies = socket.request.headers.cookie;
    cookies = cookies.replace(';','&');
    cookies = cookies.replace(' ','');
    var query = querystring.parse(cookies);

    var user = userDB.add({
      id : socket.id,
      userName : query['userName'],
      createdAt : (new Date()).getTime()
    });

    io.emit('userList', userDB.getAll());
    //io.to(socket.id).emit("userList", userDB.getAll());

    //console.log("socket.request",query,cookies,userDB.getAll());
  }
  
  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });
  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });

  socket.on('disconnect', function() {
    //delete.splice(users.indexOf(users), 1);
    //socket.emit('removeUser', userDB.delete(socket.id));
    userDB.delete(socket.id)
    io.emit('userList', userDB.getAll());
  });
});


 
// Listen application request on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});