import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
var urlencodedParser = bodyParser.urlencoded({extended: false});
import passwordless from 'passwordless';
import config from '../config';

router.get('/logout', passwordless.logout());

router.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});
//fix favicon at some point
router.get('/login', function(req,res){
  if (req.user){
    if (!process.users){
      process.users={};
    }
    process.users[req.user] = true;
    res.redirect(config.front);
  }
  else{
    res.send(null);
  }
});

router.get('/logged_in/:user', function(req,res){
  const user = req.params.user;
  if (!process.users){
    process.users={};
  }
  if (process.users[user] === true){
    res.send(true);
  }else{
    res.send(false)
  }
});

router.get( '/restricted',
    passwordless.restricted({
      failureRedirect: '/login'
    }),
    function( req, res ) {
      res.render( 'pages/restricted' , { user: req.user });
  });

router.post('/sendtoken',
  bodyParser.json(),
  (req,res,next)=>{
    next()
  },
	passwordless.requestToken(
		// Simply accept every user
		function(user, delivery, callback) {
      debugger;
			callback(null, user);
		}),

	function(req, res) {
  	res.send('success');
});


router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write(`<h1>VOTING SERVER</h1>
      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>`);
  res.end();
});

export default router;
