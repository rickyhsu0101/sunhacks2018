const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");
const nodemailer = require("nodemailer");
const sendgridTransport= require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_user: 'rickyhsu0101',
    api_key: 'rickyhsu0101!'
  }
}));
const Appointment = mongoose.model("appointments");
const Course = mongoose.model("courses");
const User = mongoose.model("users");
router.post("/schedule/:courseId/:tutorId", passport.authenticate("jwt", {session: false}), (req, res)=>{
  Course.findById(req.params.courseId)
    .then(course=>{
      if(!course){
        return res.status(404).json({
          msg: "no course with the id",
          success: false
        })
      }
      const foundElement = course.tutors.find(tutor=>{

        return tutor.student.toString() == req.params.tutorId;
      });
      if(!foundElement){
        return res.status(404).json({
          msg: "no tutor with id in course",
          success: false
        })
      }
      const appointmentObj = {
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
        location: req.body.location,
        tutor: req.params.tutorId,
        tutee: req.user.id,
        course: course.id
      }
      new Appointment(appointmentObj)
        .save()
          .then(appt=>{
            User.findById(req.params.tutorId)
              .then(user=>{
                console.log(appt._id);
                console.log(user.email);
                transporter.sendMail({
                  to: user.email,
                  from: '"Duragon Tale"<duragontale@gmail.com>',
                  subject: "Tutoring Requested",
                  text: "hello",
                  html: `<h1 style = "text-align: center;">Tutoring Requested for ${course.subject} ${course.number}</h1><h2 style = "text-align: center;">Your service has been requested for the following time</h2><h4>Date: ${appt.date} Duration: ${appt.duration}</h4><h5 style = "text-align: center;"><a href = "http://peer2peertutoring.com/appointment/approve/${user.id}/${appt.id}">Approve</a></h5>`
                }, function(err, info){
                  console.log(err);
                  console.log(info);
                  return res.json({
                    success: true
                  })
                });
                
              })
        })
    })
});
module.exports = router;