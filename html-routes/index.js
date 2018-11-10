const router = require("express").Router();
const passport = require("passport");
router.get("/", (req, res)=>{
  let obj = {
    page: "home",
    user: null
  };
  res.render("index", obj);
});
module.exports = router;