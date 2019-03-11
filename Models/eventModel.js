let mongoose=require("mongoose");
let autoIncrement=require('mongoose-sequence')(mongoose)
let eventSchema=new mongoose.Schema({
    _id:Number,
    title:String,
    eventDate:{
        type: Date, 
        default: Date.now},
    
    mainSpeaker:{
        type:Number,
        ref:"speakers"
    },
    otherSpeakers:[{
        type:Number,
        ref:"speakers"
    }]

});
eventSchema.plugin(autoIncrement, {inc_field: '_id'});
mongoose.model("events",eventSchema);