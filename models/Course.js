const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  tutors: [{
    type: Schema.Types.ObjectId,
    ref: "users"
  }]
});

mongoose.model('courses', CourseSchema);