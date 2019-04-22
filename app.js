var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var moment = require("moment");
var timezone = require('moment-timezone');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var middleware = require("./middleware");
var flash = require("connect-flash");
var autoRemove;

//Required models
var User = require("./models/User.js");


// Required routes
var listRoutes = require("./routes/lists");
var archiveRoutes = require("./routes/archives");
var eventRoutes = require("./routes/events")
var authRoutes = require("./routes/auth");


mongoose.connect("mongodb://localhost/todo", {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Doug is a top bloke",
    resave: false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});

// Using routes
app.use(listRoutes);
app.use(archiveRoutes);
app.use(eventRoutes);
app.use(authRoutes);


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Local variable
app.locals.moment = moment;
app.locals.timezone = timezone;



app.listen(3000, function(){
    console.log("Server has started");
});
