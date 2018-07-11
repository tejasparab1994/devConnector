const express = require('express');

// including mongoose into our app
const mongoose = require('mongoose');
// to access the request.body we need bodyParser
const bodyParser = require('body-parser');
//bringing in passport after generating the token using jwt
const passport = require('passport');


//bringing in the files from routes/api which are all the different pages we
// would be having in our app
const users  = require('./routes/api/users');
const profile  = require('./routes/api/profile');
const posts  = require('./routes/api/posts');

const app = express();

// Body parser middleware to access request.body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config
// getting in the keys.js file inside config folder and then mongoURI variable there.
const db = require('./config/keys').mongoURI;

// Connect to mongodb now with the value in const db
mongoose.connect(db)
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
// pass in passport through that second bracket.
require('./config/passport.js')(passport);

// use routes that we brought in, for the route mentioned....we would be using
// the contents of that js file
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// when deploy on heroku then process.env.PORT else locally 5000
const port = process.env.PORT || 5000;

// listen on this port, which should start our server
app.listen(port, () => console.log(`Server running on port ${port}`));
