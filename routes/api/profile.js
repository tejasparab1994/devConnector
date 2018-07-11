const express  = require('express');

//create a router
const router = express.Router();

// res.json outputs a json, this will be picked up by our frontend
// to work on later.another function we used was res.send in server.js
// the bracket with msg: is an object

// @route  GET api/profile/test
// @desc   Tests profile route
// @access public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// export the router so server.js can pick it up
module.exports = router;
