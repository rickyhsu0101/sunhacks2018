//dummy data creation
const router = require("express").Router();
const mongoose = require("mongoose");
const Course = mongoose.model("courses");
router.post("/createCourse", (req, res)=>{
  const courseBody = {
    subject: "CSE",
    number: 205
  };
  new Course(courseBody).save()
    .then(()=>{
      return res.json({});
    })
})
module.exports = router;