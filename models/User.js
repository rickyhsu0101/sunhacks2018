const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "regular"
  },
  major:{
    type: String,
    default: 'none'
  },
  education: {
    type: String,
    default: "highschool"
  },
  appointments: [{
    type: Schema.Types.ObjectId,
    ref: "appointments"
  }],
  courses: [{
    type: Schema.Types.ObjectId,
    ref: "courses"
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  school: {
    type: String,
    default: "Hamilton High School"
  }
});

mongoose.model('users', UserSchema);