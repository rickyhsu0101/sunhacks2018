const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AvailabilitySchema = new Schema({
  student:{
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  days: [{
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  }]
});
mongoose.model('availabilities', AvailabilitySchema);