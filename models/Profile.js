const mongoose  = require('mongoose');
const Schema = mongoose.Schema;


// Create schema here
const ProfileSchema = new Schema({
  user: {
    //associate the user by its id
    type: Schema.Types.ObjectId,
    //reference the collection it refers to -> hence users
    ref: 'users'
  },
  // devconnector.com/handle
  handle: {
    type: String,
    required: true,
    max: 40
  },
  // where works
  company: {
    type: String
  },
  website: {
    type: String
  },
  //boston,cali
  location: {
    type: String
  },
  //developer, jr. developer, student
  status: {
    type: String,
    required: true
  },
  // html, java, javacript, reactjs -> this would be an array
  // user will input it that way and we would convert it into a comma seperated
  // array
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  // multiple experiences possible
  // array of objects.

  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
      youtube: {
        type: String
      },
      twitter: {
        type: String
      },
      facebook: {
        type: String
      },
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      },
  },
  date: {
    type: Date,
    default: Date.now
  }
});



module.exports = Profile = mongoose.model('profile', ProfileSchema);
