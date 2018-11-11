const router = require("express").Router();
const async = require("async");
const mongoose = require("mongoose");
const Course = mongoose.model('courses');
const User = mongoose.model('users');
const Availability = mongoose.model('availabilities');
const passport = require("passport");
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
  Course.findOne({teachers: {$in: [req.user.id]}})
    .then(course=>{
      if(!course){
        return res.status(404).json({
          success: false,
          msg: "teacher not found"
        })
      }
      if(course.id.toString() != req.params.courseId){
        return res.status(404).json({
          success: false,
          msg: "teacher not found"
        })
      }
      Course.findOne({pending: {$elemMatch: {student: req.params.studentId}}})
        .then(course=>{
          if(!course){
            return res.status(404).json({
              success: false,
              msg: "student not found"
            })
          }
          if (course.id.toString() != req.params.courseId) {
            return res.status(404).json({
              success: false,
              msg: "teacher not found"
            })
          }
          const asyncFunctions = [
            (callback)=>{
              const pendingObj = course.pending.find(elem=>{
                return (elem.student.toString()==req.params.studentId);
              })
              Course.findByIdAndUpdate(
                course.id, 
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
            return res.json({
              success: true
            })
          });
        })
    });
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