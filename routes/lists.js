var express = require("express");
var router = express.Router();
var List = require("../models/List.js");
var moment = require("moment");
var request = require("request");
var Event = require("../models/Event.js");
var middleware = require("../middleware");


router.get("/main", middleware.isLoggedIn, function(req,res){
  var currentTemp = "";
request("http://api.openweathermap.org/data/2.5/find?q=Melbourne,AU&units=metric&APPID=e3d3333e0b4823cd824879c9cb37b938", function(error, response,body){
    if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        currentTemp = data.list[0]["main"]["temp"];
     
    Event.find({}, function(err, events){
            if (err) {
                console.log("Error");
            } else {
                var today = moment.tz('Australia/Sydney');  
                events.forEach(function(array){
                if (array.autoRemove){
                array.eventList.forEach(function(event){
                var eventDueToday = moment(event.eventDueDate);     
                var daysToEventDue = eventDueToday.diff(today, 'days');
                  console.log("daysdue" + daysToEventDue);
                    if (daysToEventDue < 0){
                 Event.findByIdAndUpdate(array._id,{$pull:{eventList: {event:event.event}}}, function(err, list){
                if (err){
                console.log("Error1");
                 } 
                            });
                        }
                    });
                 }
            });
        }
    });
     
    List.find({}, function(err, lists){
        if (err) {
            console.log("Error");
        } else {
        Event.find({}, function(err, events){
            if (err) {
                console.log("Error");
            } else {
                res.render("view", {lists:lists, events:events, temp:currentTemp});   
                        }
                    });
                }
            });
        }
    });
});


router.post("/createTaskList", middleware.isLoggedIn, function(req,res){
    List.create({title:req.body.title}, function(err){
        if(err){
            console.log("Error");
        } else {
            req.flash("success", "New task list created!");
            res.redirect("/main");
        }
    });
});


router.put("/addItem/:id",middleware.isLoggedIn, function(req,res){
    List.findByIdAndUpdate(req.params.id,{$push:{list: {$each:[{item:req.body.item,
                                                                completed:req.body.completed,
                                                                removed:req.body.removed,
                                                                dueDate:req.body.dueDate,
                                                                itemCreated:req.body.itemCreated}
     ]}}}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Task added to list!");
        res.redirect("/main");
        }
    });
});


router.put("/itemCompleted",middleware.isLoggedIn,function(req,res){
    List.findOneAndUpdate({'list.itemCreated': req.body.itemCreated},{$set: { 'list.$.completed': req.body.completed, 'list.$.dateCompleted':req.body.dateCompleted }}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Task status updated!");
        res.redirect("/main");
        }
    });
});


router.put("/listDisplay/:id",middleware.isLoggedIn, function(req,res){
    List.findByIdAndUpdate(req.params.id, {show: req.body.show}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "List display status changed!");
        res.redirect("/main");
        }
    });
});


router.put("/itemRemoved/:id",middleware.isLoggedIn, function(req,res){
    List.findOneAndUpdate({'list.itemCreated': req.body.itemCreated},{$set: { 'list.$.removed': req.body.removed, 'list.$.completed': req.body.completed, }}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Task has been removed!");
        res.redirect("/main");
        }
    });
});

router.delete("/deleteList/:id", middleware.isLoggedIn, function(req, res){
    List.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log("Error");
        } else {
        req.flash("success", "List has been deleted!");
        res.redirect("/main");
        }
    });
});

router.post("/itemEditForm/:id", middleware.isLoggedIn, function(req,res){
    List.findOne({'list.itemCreated' : req.body.itemCreated}, function (err, itemToEdit){
        if (err) {
            console.log("Error");
        } else {
            itemToEdit.list.forEach(function(listItem){
                if (listItem.itemCreated == req.body.itemCreated){
                    var dueDate = listItem.dueDate;
                    var item = listItem.item;
                    res.render("editForm", {item:item, dueDate:dueDate, itemCreated:req.body.itemCreated});
                }
            });
        }
    });
});


router.put("/itemEdit/:id",middleware.isLoggedIn, function(req,res){
    List.findOneAndUpdate({'list.itemCreated': req.body.itemCreated},{$set: { 'list.$.dueDate': req.body.dueDate, 'list.$.item': req.body.item, }}, function(err, list){
    if (err){
        console.log("Error1");
    } else {
        req.flash("success", "Task has been updated!");
        res.redirect("/main");
        }
    });
});



module.exports = router;

