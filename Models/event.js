let mongoose = require("mongoose");
const schema = mongoose.Schema;

eventSchema = new schema({
    _id: Number,
    title: {type: String, required: true},
    eventDate:{type: Date, default: Date.now},
    mainSpeaker:Number,
    otherSpeaker:[Nnumber]
});