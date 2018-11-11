const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },

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
    appt: {
      type: Schema.Types.ObjectId,
      ref: "appointments"
    },
    role: {
      type: String,
      required: true
    }
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
  },
  grade: {
    type: Number,
    default: 9
  }
});

mongoose.model('users', UserSchema);