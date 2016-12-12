import express from 'express';
var app = express();
import {Server} from 'http';
const http = Server(app);
const io = require('socket.io')(http);
const port = 3000;
import store from './store.js';

store.subscribe(
  () => io.emit('state', store.getState().toJS())
)

app.get('*', (req, res) => {
  res.status(200);
});

io.on('connection', (socket) => {
  console.log('CONNECTED TO CLIENT', socket.id);
  socket.emit('state', store.getState().toJS());
  socket.on('action', store.dispatch.bind(store));
});

app.set('port', (process.env.PORT || port));

http.listen(port, ()=>{
  console.log('listening on port: ' + app.get('port'));
});
