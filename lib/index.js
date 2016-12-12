import express from 'express';
import react from 'react';
import store from '../src/store.js';
import Socket from 'socket.io';
import path from 'path';

import http from 'http';

const app = express();
const server = new http.Server(app);
const compiler = webpack(config);
const io = Socket(server);

const port = 3000;

app.get('*', (req, res) => {
});

io.on('connection', function(socket){
  console.log('CONNECTED TO CLIENT');
});

app.set('port', (process.env.PORT || port));

app.listen(port, ()=>{
  console.log('listening on port: ' + app.get('port'));
});
