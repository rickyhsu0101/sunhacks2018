const router = require("express").Router();
const async = require("async");
const mongoose = require("mongoose");
const Course = mongoose.model('courses');
const User = mongoose.model('users');
const Availability = mongoose.model('availabilities');
const passport = require("passport");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_user: 'rickyhsu0101',
    api_key: 'rickyhsu0101!'
  }
}));
router.post("/", passport.authenticate("jwt", {session: false}), (req, res)=>{
  let parameters = {};
  if(req.body.subject){
    parameters.subject = req.body.subject;
  }
  if(req.body.number){
    parameters.number = req.body.number;
  }
  Course.find(parameters)
    .then(courses=>{
      return res.json({
        courses,
        success: true
      })
    })
    .catch(err=>{
      return res.status(400).json({
        msg: "bad request"
      })
    })
});
router.post("/tutor/request/:courseId", passport.authenticate("jwt", {session: false}), (req, res)=>{
  //fix later
  //TODO
  //check if course exists
  //if exists check if user already pending
  Availability.deleteMany({student: req.user.id})
    .then(()=>{
      let availabilityDoc = {
        student: req.user.id,
        days: req.body.days
      };
      const availabilityInstance = new Availability(availabilityDoc);
      availabilityInstance.save()
        .then(availability=>{
          Course.findByIdAndUpdate(req.params.courseId, {$push: {pending: {student: req.user.id, availability}}}, {new: true})
            .then(course=>{
              return res.json({
                success: true,
                course
              });
            });
        })
    })
  
  
});
router.put("/tutor/approve/:courseId/:studentId", passport.authenticate("jwt", {session: false}), (req, res)=>{
  Course.find({teachers: {$in: [req.user.id]}})
    .then(courses=>{
      if(courses.length == 0){
        console.log("here");
        return res.status(404).json({
          success: false,
          msg: "teacher not found"
        })
      }

      const c = courses.find(el=>el.id.toString() == req.params.courseId);
      if(c == undefined){
         console.log("here 2");
        return res.status(404).json({
          success: false,
          msg: "teacher not found"
        })
      }
      Course.find({pending: {$elemMatch: {student: req.params.studentId}}})
        .then(courses=>{
          if(courses.length == 0){
             console.log("here3");
            return res.status(404).json({
              success: false,
              msg: "student not found"
            })
          }
          const c = courses.find(el => el.id.toString() == req.params.courseId);
          if (c == undefined) {
             console.log("here4");
            return res.status(404).json({
              success: false,
              msg: "teacher not found"
            })
          }
          const asyncFunctions = [
            (callback)=>{
              const pendingObj = c.pending.find(elem=>{
                return (elem.student.toString()==req.params.studentId);
              })
              Course.findByIdAndUpdate(
                req.params.courseId, 
                {
                  $pull: {
                    pending: {
                      student: req.params.studentId
                    }
                  },
                  $push: {
                    tutors: {
                      student: req.params.studentId,
                      availability: pendingObj.availability
                    }
                  }
                }, {new: true})
                .then(course=>{
                  callback(null, course)
                })
            },
            (callback)=>{
              User.findByIdAndUpdate(
                req.params.studentId, 
                {
                  $push: {
                    courses: req.params.courseId
                  }
                }, {new: true})
                .then(user=>{
                  callback(null, user);
                })
            }
          ];
          async.parallel(asyncFunctions, (err, results)=>{
            const email = results[1].email;
            const course = results[0].subject + " " + results[0].number;
            console.log("here");
            transporter.sendMail({
                to: email,
                from: '"Duragon Tale"<duragontale@gmail.com>',
                subject: "Tutoring Qualification",
                text: "You are qualified to tutor for Hamilton High School Peer Tutoring Club",
                html: `<h1 style = "text-align: center;">Tutoring Approved for ${course}</h1><h2 style = "text-align: center;">Your service has been requested for the following time</h2>`
              }, function (err, info) {
                return res.json({
                  success: true
                })
            });
          });
        })
    });
});
router.get("/teacher/all", passport.authenticate('jwt', {session: false}), (req, res)=>{
  Course.find({teachers: {$in: [req.user.id]}})
  .populate(["tutors.student", "tutors.availability", "pending.student", "pending.availability"])
  .then(courses=>{
    return res.json({
      success: true,
      courses
    });
  })
});
router.get("/:id", passport.authenticate("jwt", {session: false}), (req, res)=>{
  Course.findById(req.params.id)
    .populate(["tutors.student", "tutors.availability", "pending.student", "pending.availability", "teachers"])
    .then(course=>{
      if(!course){
        return res.status(404).json({
          msg: "Course not found"
        })
      }
      return res.json({
        success: true,
        course
      });
    });
});
module.exports= router;