// SERVER
const express = require('express');
const http =  require('http');
const app = express();
const io = require('socket.io')(http.createServer(app));
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3000));

//SERVER
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/' + 'index.html');
});

// POST http://localhost:8080/api/users
// parameters sent with 
app.post('/api/message', function(req, res) {
    var isOriginal = req.body.original; //boolean
    var text = req.body.text; //string

    if (isOriginal == 'true') {
        io.emit('original text', text);
    } else if (isOriginal == 'false') {
        io.emit('translated text', text);
    }

    res.send('OK');
});

io.configure(function () {  
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
