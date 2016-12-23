import express from 'express';
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
import passwordless from 'passwordless';

router.get('/logout', passwordless.logout());

router.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});
//fix favicon at some point

router.post('/sendtoken',bodyParser.json(),
(req,res, next)=>{
  console.log(req.body);
  next();
},
	passwordless.requestToken(
		// Simply accept every user
		function(user, delivery, callback, req) {
      console.log(req.body);
			callback(null, user);
		}),

	function(req, res) {
    console.log("SENT")
  	res.render('sent');
});


router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write(`<h1>VOTING SERVER</h1>
      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>`);
  res.end();
});

export default router;
