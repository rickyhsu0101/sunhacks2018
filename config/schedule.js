var schedule = require("node-schedule");
const mongoose = require("mongoose");
const Appointment = mongoose.model("appointments");
var moment = require("moment");
var j = schedule.scheduleJob('45 * * * *', function () {
  moment().
  console.log('The answer to life, the universe, and everything!');
});