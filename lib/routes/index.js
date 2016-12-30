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
    const end_index = req.user.search('@');
    const username = req.user.slice(0, end_index);
    console.log(username);
    res.redirect(config.front + username);
  }
  else{
    res.send(null);
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
    console.log(req.body);
    next()
  },
	passwordless.requestToken(
		// Simply accept every user
		function(user, delivery, callback) {
      debugger;
			callback(null, user);
		}),

	function(req, res) {
    console.log('sent');
  	res.send('success');
});


router.get('/', (req, res) => {
  res.writeHead(200, {'Content-Type':'text/html'});
  res.write(`<h1>VOTING SERVER</h1>
      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>`);
  res.end();
});

export default router;
