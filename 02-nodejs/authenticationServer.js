/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
// write your logic here , DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

app.use(bodyParser.json());

const USERS = [];

app.post('/signup', (req, res) => {
  const {email, password, firstName, lastName} = req.body;
  if (!email || !password || !firstName || !lastName)
  {
    res.status(409).send("Provide email, password, firstName and lastName.");
    return;
  }

  const existedUser = USERS.find(user => user.email === email);

  if (existedUser)
  {
    res.send(400).send("User with this email already exists.");
    return;
  }

  const userId = uuidv4();
  USERS.push({userId, email, password, firstName, lastName});
  res.status(201).send("Signup successful");

})

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  if (!email || !password)
  {
    res.status(409).send("Provide username and password.");
    return;   
  }

  const existedUser = USERS.find(user => user.email === email);
  if (!existedUser)
  {
    res.status(401).send("User does not exist.");
    return;
  }

  if (existedUser.password !== password)
  {
    res.send(401).send("Invalid password");
    return;
  }

  const authenticationToken = generateAccessToken(existedUser);
  res.status(200).json({...existedUser, authenticationToken});

})

function generateAccessToken(user)
{
  const SECRET_KEY = "e2d91824f2d5aeab74246267c8b0616a4d9ca5c9f7d3b27132815555b0ecec39"
  return jwt.sign(user,SECRET_KEY);
}

app.get('/data', (req, res) => {
  const email = req.headers.email;
  const password = req.headers.password;

  if (!email || !password)
  {
    res.status(401).send("Unauthorized");
    return;
  }

  const existedUser = USERS.find(user => user.email === email);

  if (!existedUser)
  {
    res.status(401).send("Unauthorized");
    return;
  }
 
  if(existedUser.password !== password)
  {
    res.status(401).send(Unauthorized);
    return;
  }

  res.status(200).json({users:USERS});

})

app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

// app.listen(PORT, () => {
//   console.log(`App is listening on port ${PORT}`);
// })

module.exports = app;
