let mongoose=require("mongoose"),  
 autoIncrement = require('mongoose-auto-increment'),
connection = mongoose.createConnection("mongodb://localhost:27017/Events");

autoIncrement.initialize(connection);;;


let speakerSchema=new mongoose.Schema({
    _id:Number,
    name:String,
    image: String,
    age:{
        type:Number,
        min:20,
        max:50
    },
    userName:{
        type: String,
         required: true
         },
    password:{
        type: String,
        required: true
    }
});




speakerSchema.plugin(autoIncrement.plugin, {
    model: 'events',
    field: '_id',
    startAt: 8,
    incrementBy: 1
});


//mapping
mongoose.model("speakers",speakerSchema);