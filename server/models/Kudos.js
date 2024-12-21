const mongoose = require("mongoose");

const KudosSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    badge: String,
    reason: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Kudos", KudosSchema);
