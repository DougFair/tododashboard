var express = require("express");
var router = express.Router();
var Event = require("../models/Event.js");
var moment = require("moment");
var request = require("request");
var middleware = require("../middleware");

router.post("/createEventList", middleware.isLoggedIn, function(req,res){
    Event.create({title:req.body.title}, function(err){
        if(err){
            console.log("Error");
        } else {
            req.flash("success", "New event list created!");
            res.redirect("/main");
        }
    });
});

router.put("/addEventItem/:id",middleware.isLoggedIn,function(req,res){
    if (!req.body.eventDueDate || !req.body.event){
        req.flash("error", "You must enter a date and/or event names event lists!");
        res.redirect("/main");
    } else {
    
    Event.findByIdAndUpdate(req.params.id,{$push:{eventList: {$each:[{event:req.body.event,
                                                                eventDueDate:req.body.eventDueDate,
                                                                eventCreated:req.body.eventCreated}
     ]}}}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Event added to list!");
        res.redirect("/main");
            }
        });
    };
});

router.put("/removeEventItem/:id",middleware.isLoggedIn, function(req,res){
    Event.findByIdAndUpdate(req.params.id,{$pull:{eventList: {eventCreated:req.body.eventCreated}}}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Event removed from list!");
        res.redirect("/main");
        }
    });
});


router.delete("/deleteEventList/:id", middleware.isLoggedIn, function(req, res){
    Event.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error");
        } else {
        req.flash("success", "Event list deleted!");
        res.redirect("/main");
        }
    });
});


router.post("/eventEditForm/:id", middleware.isLoggedIn, function(req,res){
    Event.findOne({'eventList.eventCreated' : req.body.eventCreated}, function (err, eventToEdit){
        if (err) {
            console.log("Error");
        } else {
            eventToEdit.eventList.forEach(function(eventItem){
                if (eventItem.eventCreated == req.body.eventCreated){
                    var eventDueDate = eventItem.eventDueDate;
                    var event = eventItem.event;
                    res.render("eventEditForm", {event:event, eventDueDate:eventDueDate, eventCreated:req.body.eventCreated});
                }
            });
        }
    });
});

router.put("/eventEdit/:id",middleware.isLoggedIn, function(req,res){
    Event.findOneAndUpdate({'eventList.eventCreated': req.body.eventCreated},{$set: { 'eventList.$.eventDueDate': req.body.eventDueDate, 'eventList.$.event': req.body.event, }}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Event has been updated!");
        res.redirect("/main");
        }
    });
});

router.put("/eventDisplay/:id",middleware.isLoggedIn, function(req,res){
    Event.findByIdAndUpdate(req.params.id, {show: req.body.show}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "List display status changed!");
        res.redirect("/main");
        }
    });
});

router.put("/eventExpireAutoRemove/:id",middleware.isLoggedIn, function(req,res){
     Event.findByIdAndUpdate(req.params.id, {autoRemove: req.body.autoremove}, function(err, events){
            if (err) {
                console.log("Error");
            } else {
        req.flash("success", "Event display status changed!");        
        res.redirect("/main");
            }
     });  
});










module.exports = router;