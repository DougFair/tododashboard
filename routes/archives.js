var express = require("express");
var router = express.Router();
var List = require("../models/List.js");
var Archive = require("../models/Archive.js");
var moment = require("moment");
var bodyParser = require("body-parser");
var middleware = require("../middleware");



router.post("/archiveList/:id", middleware.isLoggedIn, function (req,res){

var archiveDetailsArray = [];
var title;
var dateCreated
var originalID;
var dateArchived = req.body.dateArchived;
List.findById(req.params.id, function(err, list){
    if (err){
        console.log("Error");
    } else {
    
    title = list.title;
    originalID = list._id;
    dateCreated = moment(list.dateCreated).format("DD/MM/YYYY")
    
    list.list.forEach(function(detail){
        var archiveDetailsObj = {};
        archiveDetailsObj.item = detail.item;
        archiveDetailsObj.itemCreated = detail.itemCreated;
       
        archiveDetailsObj.dueDate = detail.dueDate;
       
        archiveDetailsObj.completed = detail.dateCompleted;
        archiveDetailsArray.push(archiveDetailsObj)
        });


            Archive.create({title: title, originalID:originalID, dateCreated: dateCreated, dateArchived:dateArchived, items: archiveDetailsArray}, function (err, archiveItem){
                if (err) {
                    console.log("error")
                } else {
                    res.render("confirm", {success: "List archived!", archiveItem:archiveItem, originalID:originalID});
                }
            });
        }
    });
});

router.get("/archiveList", middleware.isLoggedIn, function(req,res){
    Archive.find({}, function(err, archivedLists){
        if (err){
            console.log("Error");
        } else {
            res.render("archiveList", {archivedLists:archivedLists});
        }
    });
});


router.get("/archiveView/:id", middleware.isLoggedIn, function(req,res){
    Archive.findById(req.params.id, function(err, archivedList){
        if (err){
            console.log("Error");
        } else {
            res.render("archiveView", {archivedList:archivedList});
        }
    });
});

router.delete("/archiveListDelete/:id", middleware.isLoggedIn, function(req,res){
    Archive.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log("Error");
        } else {
            req.flash("success", "Archived list deleted!.");
            res.redirect("/archiveList");
        }
    });
});

module.exports = router;