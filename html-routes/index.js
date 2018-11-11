const router = require("express").Router();
const passport = require("passport");
const mongoose = require("mongoose");
const Appointment = mongoose.model("appointments");
const User = mongoose.model("users");
const Course = mongoose.model("courses");
router.get("/", (req, res)=>{
  let obj = {
    page: "home",
    user: null
  };
  res.render("index", obj);
});
router.get("/login", (req, res)=>{
  let obj = {
    page: "login",
    user: null
  };
  res.render("index", obj);
})
router.get("/register", (req, res) => {
  let obj = {
    page: "register",
    user: null
  };
  res.render("index", obj);
})
router.get("/dashboard", (req, res) => {
  let obj = {
    page: "dashboard",
    user: null
  };
  res.render("index", obj);
});
router.get("/search", (req, res)=>{
  let obj = {
    page: "search",
    user: null
  }
  res.render("index", obj);
});
router.get("/course/:id", (req, res)=>{
  let obj = {
    page: "course",
    user: null
  }
   Course.findById(req.params.id)
     .populate(["tutors.student", "tutors.availability", "pending.student", "pending.availability", "teachers"])
     .then(course=>{
       obj.course = course;
       return res.render("index",obj);
     })
});
router.get("/dashboard/teacher", (req, res)=>{
  let obj={
    page: "teacher",
    user: null
  }
  return res.render("index", obj);
})
router.get("/appointment/approve/:userId/:id", (req, res)=>{
  Appointment.findById(req.params.id)
    .then(appt=>{
      User.findByIdAndUpdate(req.params.userId, {$push: {appointments: {appt: req.params.id, role: "tutor"}}})
        .then(()=>{
          User.findByIdAndUpdate(appt.tutee, {
                $push: {
                  appointments: {
                    appt: req.params.id,
                    role: "tutee"
                  }
                }
              })
              .then(()=>{
                Appointment.findByIdAndUpdate(appt.id, {status: "upcoming", approved: true})
                .then(()=>{
                  res.send("<h1>Appointment is approved</h1>");
                })
              })
          
        })
    })
})
module.exports = router;