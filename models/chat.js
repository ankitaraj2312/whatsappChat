const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    msz: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);
