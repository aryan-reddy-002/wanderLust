const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync =require("../views/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");


router.get("/signup",userController.signup);


router.post("/signIn", wrapAsync(userController.signin));



router.route("/login")
.get(userController.login)
.post(saveRedirectUrl,
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
  userController.savelogin
 );




// router.get("/login",userController.login);


// router.post("/login", passport.authenticate('local',
//      { failureRedirect: '/login' , 
//         failureFlash : true })
//         ,async(req,res)=>{
//     req.flash("success","Welcome Back Again");
//     res.redirect("/listings");

// });


router.get("/logout",userController.logout);

module.exports =router;
