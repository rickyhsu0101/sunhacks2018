const router = require("express").Router();
const mongoose = require("mongoose");
const moment = require("moment");
const cloudinary = require('cloudinary');
const passport = require('passport');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
router.post("/profile/upload", passport.authenticate('jwt',{session: false}), (req, res)=>{
    upload(req, res, err => {
      if (err) {
        console.log(err);
        return res.status(400).json({errors: err});
      } 
      console.log(req.file);
      cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => { 
          if(error){
            return res.status(400).json({errors: error})
          }
          //result.url -> imageUrl
          
        }).end(req.file.buffer);
      });
});
module.exports = router;