let express=require("express"),
    mongoose=require("mongoose");

    require("./../Models/speakerModel");
    require("./../Models/eventModel");

let eventRouter=express.Router();

    let speakerSchema=mongoose.model("speakers");
    let eventSchema=mongoose.model("events");

eventRouter.get("/list",(request,response)=>{
console.log("Event List")
    eventSchema.find({})
                .populate({path:"mainSpeaker otherSpeakers"})
                .then((result)=>{
                    console.log(result.mainSpeaker)

                    response.render("events/eventslist",{events:result});
                })
                .catch((error)=>{
                    console.log(error.message)
                });
  
});
eventRouter.get("/add",(request,response)=>{

    speakerSchema.find({},(error,result)=>{

        response.render("events/addevent",{speakers:result});

    });
   

});//add get
eventRouter.post("/add",(request,response)=>{

    console.log(request.body)
        let event=new eventSchema({
            // _id:request.body.id,
            title:request.body.title,
            eventDate:request.body.date,
            mainSpeaker:request.body.mainSpeaker,
            otherSpeakers:request.body.otherSpeakers
        });
        event.save((error)=>{
            if(!error)
            {
                response.redirect("/events/list");
            }
            else
            {
                console.log(error.message)
            }
        });


});//add post
eventRouter.get("/edit/:id",(request,response)=>{
    console.log("Edit events");
    console.log(request.params.id);
    let speakersList=[];
    speakerSchema.find({},(error, result)=>{
        if(!error){
            speakersList = result;
            console.log("==============================================")
            console.log(result)
        }
    })
    eventSchema.findOne({_id:request.params.id},(error,result)=>{
        console.log("Result: ", result);
       if(!error){
        console.log("Success");

        response.render("events/editEvent",{event:result, speakers: speakersList})

       }else{
           console.log(error.message);
       }
    })
})
eventRouter.post("/edit/:id",(request,response)=>{
    if(request.body.otherSpeakers == null){
        request.body.otherSpeakers=[];
    }
    eventSchema.updateOne({_id:request.params.id},{
        $set:{
            title:request.body.title,
            eventDate:request.body.date,

            mainSpeaker:request.body.mainSpeaker,
           
                otherSpeakers:request.body.otherSpeakers
        }
    },(error)=>{
        if(!error)
        {
            response.redirect("/events/list");
        }
        else
        {
            console.log(error.message);
        }
    });
})

eventRouter.get("/delete/:id",(request,response)=>{
    eventSchema.remove({_id:request.params.id},(error)=>{
        if(!error)
        {
            response.redirect("/events/list");
        }
    })
})

module.exports=eventRouter;