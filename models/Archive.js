var mongoose = require("mongoose");

var archiveSchema = new mongoose.Schema({
    title: String,
    items: Array,
    originalID: String,
    dateCreated: String,
    dateArchived: String,
});


module.exports = mongoose.model("Archive", archiveSchema);