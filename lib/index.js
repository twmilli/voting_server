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
import middleware from './middleware.js';

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});


// Disable x-powered-by header which shows what software server is running (express);
app.disable('x-powered-by');

app.use(middleware);

//connect to database and load the most recently saved state into the store
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

  /*every time there is a change to the store:
  1. update mongodb
  2. send the state to all of the connected sockets*/
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
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});
//fix favicon at some point
app.get('*', (req, res) => {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write(`<h1>VOTING SERVER</h1>
      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>`);
  res.end();
});

io.on('connection', (socket) => {
  //console.log('CONNECTED TO CLIENT', socket.id);
  socket.emit('state', store.getState());
  socket.on('action', store.dispatch.bind(store));
});

app.set('port', (process.env.PORT || port));

http.listen(app.get('port'), ()=>{
  console.log('listening on port: ' + app.get('port'));
});
