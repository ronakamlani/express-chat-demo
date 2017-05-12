var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

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

  console.log("req.cookies['userName']",req.cookies['userName']);
  if(req.cookies['userName'] == undefined){
    res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, './views', 'index.html'));
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

  socket.on('chatMessage', function(from, msg){
    io.emit('chatMessage', from, msg);
  });
  socket.on('notifyUser', function(user){
    io.emit('notifyUser', user);
  });
});
 
// Listen application request on port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});