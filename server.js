const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : 'process.env.postgres://facerecdb_tqq5_user:tCOBl72sORTIzAy2CPa9woA2DFyhASTW@dpg-chaf6qik728r882qjim0-a/facerecdb_tqq5',
    ssl : {rejectUnauthorized: false},
    host : 'process.env.dpg-chaf6qik728r882qjim0-a',
    port : 5432,
    user : 'process.env.facerecdb_tqq5_user',
    password : 'process.env.tCOBl72sORTIzAy2CPa9woA2DFyhASTW',
    database : 'process.env.facerecdb_tqq5'
  }
});


const app = express();

app.use(cors())
app.use(express.json()); 

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db)} )

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)} )

app.listen(5432, ()=> {
  console.log('app is running on port 5432');
})
