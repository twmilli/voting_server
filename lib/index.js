import express from 'express';
var app = express();
import {Server} from 'http';
const http = Server(app);
const io = require('socket.io')(http);
const port = 3000;
import store from './store.js';
const mongo = require("mongodb").MongoClient;
var db_url = process.env.MONGODB_URI;
import {setState} from './actions/actionCreators';

mongo.connect(db_url, (err,db)=>{
  if (err) throw err;
  db.collection("state")
  .find({
    _id: 1
  }).stream().on('data', (data)=>{
    const start_state = data.state;
    if (start_state !== undefined){
      store.dispatch(setState(start_state));
    }

  });

  store.subscribe(
    () => {
      db.collection("state").update(
        {"_id": 1}, {"_id":1, state: store.getState().toJS()},
        {upsert: true}
      )
      io.emit('state', store.getState().toJS());
    }
  )

});



app.get('*', (req, res) => {
  res.status(200);
});

io.on('connection', (socket) => {
  console.log('CONNECTED TO CLIENT', socket.id);
  console.log("STATE: ", store.getState());
  socket.emit('state', store.getState());
  socket.on('action', store.dispatch.bind(store));
});

app.set('port', (process.env.PORT || port));

http.listen(port, ()=>{
  console.log('listening on port: ' + app.get('port'));
});
