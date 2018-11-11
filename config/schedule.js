var schedule = require("node-schedule");
const mongoose = require("mongoose");
const Appointment = mongoose.model("appointments");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_user: 'rickyhsu0101',
    api_key: 'rickyhsu0101!'
  }
}));/*
var moment = require("moment");
var j = schedule.scheduleJob('*//*5 * * * *', function () {
  console.log("yo");
  const milli = moment().startOf("hour").add(1, "hour").diff(moment().startOf("day"), "milliseconds");
  Appointment.find({date: moment().startOf("day").format("MM-DD-YYYY"), time: parseInt(milli)})
    .populate("tutor")
    .populate("tutee")
    .then(appts=>{
      appts.forEach(el=>{
        transporter.sendMail({
          to: el.tutee.email,
          from: '"Duragon Tale"<duragontale@gmail.com>',
          subject: "Reminder: Appointment in 15 min",
          text: "You are scheduled for an appointment set between you and another member",
          html: `<h1 style = "text-align: center;">You are scheduled for an appointment starting in 15 min</h1><h2 style = "text-align: center;">`
        });
        transporter.sendMail({
          to: el.tutor.email,
          from: '"Duragon Tale"<duragontale@gmail.com>',
          subject: "Reminder: Appointment in 15 min",
          text: "You are scheduled for an appointment set between you and another member",
          html: `<h1 style = "text-align: center;">You are scheduled for an appointment starting in 15 min</h1><h2 style = "text-align: center;">`
        });
      });
    })
  console.log('The answer to life, the universe, and everything!');
});
*/