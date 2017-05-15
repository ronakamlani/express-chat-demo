//var socket = io.connect('http://localhost:3000',{reconnect: true});
var socket = io.connect();
var users = [];
function submitfunction(){
  var from = decodeURIComponent($('#user').val());
  var message = $('#m').val();
  if(message != '') {
  socket.emit('chatMessage', from, message);
}
$('#m').val('').focus();
  return false;
}
 
function notifyTyping() { 
  var user = decodeURIComponent($('#user').val());
  socket.emit('notifyUser', user);
}

socket.on('connect', function(data) {
  //console.log("data",data);
  socket.emit('chatMessage', 'Hello server from client');
});

socket.on('disconnect', function() {
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has disconnect.');
});

socket.on('userList', function(usersList){
  console.log("users",usersList);
  users = usersList;
  userListRedraw();
});

socket.on('chatMessage', function(from, msg){
  var me = decodeURIComponent($('#user').val());
  var color = (from == me) ? 'green' : '#009afd';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
 
socket.on('notifyUser', function(user){
  var me = decodeURIComponent($('#user').val());
  if(user != me) {
    $('#notifyUser').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#notifyUser').text(''); }, 10000);;
});
 
$(document).ready(function(){

  var name = getCookie('userName');
  $('#user').val(name);
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');
});

function disconnectChat(){
  var name = decodeURIComponent($('#user').val());
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has disconnect.');
  socket.disconnect();
}
 
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function userListRedraw(){
  var me = decodeURIComponent($('#user').val());
  console.log("user",users);
  $('#userList').html('');
  
  users.forEach(function(user,key){
    //var createdAt = new Date(user.createdAt).format("DD-MM-YYYY");
    //var createdAt = user.createdAt;
    var timerKey ='timer_'+key;

    if(user.userName != me){
      $('#userList').append(
        '<li>'+ user.userName 
        +'&nbsp;<b>Since, <span id="'+timerKey+'"></span></b>: </li>');
      timer(timerKey,new Date(user.createdAt));
    }
  });
}

function checkUserExists(checkUserName){
    var arr_len = users.length;
    for(var x=0; x<arr_len; x++){
        var userName = users[x]['userName'];
        //console.log("userName==checkUserName",userName,checkUserName);
        if(userName==checkUserName){
            //it means the item exists
            return users[x];
        }
    }

    return false;
}

function timer(id,createdAt){
  var now = new Date();

  var sec_num =  (now.getTime() - createdAt.getTime());
  var seconds = Math.floor((sec_num) / (1000));


/*  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  var t_str   = [hours, //otherwise: what's the use of AM/PM?
                (minutes < 10 ? "0" + minutes : minutes),
                (seconds < 10 ? "0" + seconds : seconds)]
                 .join(':');*/

  document.getElementById(id).innerHTML = formatTime(seconds,true);

  setTimeout(function(){
     timer(id,createdAt)
    },1000);
}

function formatTime(nbSeconds, hasHours) {
    var time = [],
        s = 1;
    var calc = nbSeconds;

    if (hasHours) {
        s = 3600;
        calc = calc / s;
        time.push(format(Math.floor(calc)));//hour
    }

    calc = ((calc - (time[time.length-1] || 0)) * s) / 60;
    time.push(format(Math.floor(calc)));//minute

    calc = (calc - (time[time.length-1])) * 60;
    time.push(format(Math.round(calc)));//second


    function format(n) {//it makes "0X"/"00"/"XX"
        return (("" + n) / 10).toFixed(1).replace(".", "");
    }

    //if (!hasHours) time.shift();//you can set only "min: sec"

    return time.join(":");
};