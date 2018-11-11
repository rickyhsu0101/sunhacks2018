const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
  subject: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  tutors: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    availability: {
      type: Schema.Types.ObjectId,
      ref: "availabilities"
    }
  }],
  pending: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    availability: {
      type: Schema.Types.ObjectId,
      ref: "availabilities"
    }
  }]
});

mongoose.model('courses', CourseSchema);