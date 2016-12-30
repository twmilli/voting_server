var front = 'http://project-vote.surge.sh';
var back = 'https://vote-backend.herokuapp.com';

if (process.env.NODE_ENV != "production"){
  front='http://localhost:8080';
  back='http://localhost:3000';
}
export default {
  user: 'project-vote@outlook.com',
  pass: 'sw@gmoney#B0bberB0y',
  front,
  back
}
