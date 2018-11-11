const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  tutee:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: String,
    default: "pending"
  },
  approved: {
    type: Boolean,
    default: false
  },
  confirmTutor: {
    type: Boolean,
    default: false
  },
  confirmTutee:{
    type: Boolean,
    default: false
  },
  course:{
    type: Schema.Types.ObjectId,
    ref: "courses"
  },
  feedback:{
    type: Number,
    default: -1
  }
});
mongoose.model('appointments', AppointmentSchema);