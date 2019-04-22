var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");



router.get("/", function(req, res) {
    res.render("login");
});

router.get("/register", function(req,res){
    res.render("register");
});

router.get("/preRegister", function(req,res){
    res.render("preRegisterPassword");
});

var preregisterPword = process.env.PREREGISTERPWORD;
router.post("/preRegister", function(req,res){
  var preRegPW = req.body.preRegPW;
  if (preRegPW === preregisterPword){
    req.flash("success", "You can now enter your registration details");
    res.redirect("/register");
  } else {
    req.flash("error", "The password did not match the one provided by your team captain. Try again.");
    res.redirect("/preRegister");
  }
});


router.post("/register", function(req,res){
    var newUser= new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err,user){
    req.flash("success", "Thanks for registering " + user.username);
        if (err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
            res.redirect("/main");
        });
    });
});

router.post("/", passport.authenticate("local",{
    successRedirect: "/main",
    failureRedirect: "/",
    successFlash: "Welcome back!",
    failureFlash: true,
    }), function(req,res){
});
   
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully logged-out");
    res.redirect("/");
});

module.exports = router;