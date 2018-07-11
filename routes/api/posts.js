const express  = require('express');
// create router.
const router = express.Router();

// res.json outputs a json, this will be picked up by our frontend
// to work on later. another function we used was res.send in server.js
// the bracket with msg: is an object

// @route  GET api/posts/test
// @desc   Tests post route
// @access public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// export the router so server.js can pick it up
module.exports = router;
