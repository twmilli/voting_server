import express from 'express';
var app = express();
import {Server} from 'http';
const http = Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.get('*', (req, res) => {
  res.status(200);
});

io.on('connection', (socket) => {
  console.log('CONNECTED TO CLIENT', socket.id);
});

app.set('port', (process.env.PORT || port));

http.listen(port, ()=>{
  console.log('listening on port: ' + app.get('port'));
});
