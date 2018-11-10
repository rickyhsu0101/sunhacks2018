const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
  date: {
    type: Date,
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
    default: "upcoming"
  },
  feedback:{
    type: Number,
    default: -1
  }
});
mongoose.model('appointments', AppointmentSchema);