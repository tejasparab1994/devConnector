const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create schema
const PostSchema = new Schema({
  user: {
    //associate the user by its id
    type: Schema.types.ObjectId,
    //reference the collection it refers to -> hence users
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  // dont need to enter name and gravatar obviously, populate ourselves
  // we could populate it through Users just like we did in Profile but then
  // we dont want to delete the posts if the user gets deleted, so instead
  // we will extract name and avatar through the current user details.
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.types.ObjectId,
        //reference the collection it refers to -> hence users
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      ser: {
        type: Schema.types.ObjectId,
        //reference the collection it refers to -> hence users
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = Post = mongoose.model('post', PostSchema);
