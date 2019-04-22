var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    title: String,
    autoRemove: {type:Boolean, default:false},
    show: {type:Boolean, default:true},
    eventList: Array,
});


module.exports = mongoose.model("Event", eventSchema);