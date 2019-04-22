var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    title: String,
    show: {type:Boolean, default:true},
    dateCreated: {type:Date, default: Date.now},
    list: Array,
});


module.exports = mongoose.model("List", listSchema);