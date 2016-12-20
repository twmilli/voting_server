import express from 'express';
const router = express.Router();

import passwordless from 'passwordless';

router.get('/logout', passwordless.logout());


routes.post('/sendtoken', passwordless.requestToken(
  (user, delivery, callback)=>{
    callback(null, user);
  }
), (req, res)=>{
  res.send();
});

module.exports = router;
