const express = require('express');

const mongoose = require('mongoose');

const users  = require('./routes/api/users');
const profile  = require('./routes/api/profile');
const posts  = require('./routes/api/posts');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

// COnnect to mongodb
mongoose
    .connect(db)
    .then(() => console.log('mongodb connected'))
    .catch(err => console.log(err));

// route to '/' and then callback
app.get('/', (req, res) => res.send('Hello world whatsup'));

// use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// when deploy on heroku then process.env.PORT else locally 5000
const port = process.env.PORT || 5000;

// listen on this port, which should start our server
app.listen(port, () => console.log(`Server running on port ${port}`));
