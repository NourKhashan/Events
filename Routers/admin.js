let express=require("express"),
    path=require("path");

let adminRouter=express.Router();

adminRouter.get("/profile",(request,response)=>{

    // response.sendFile(path.join(__dirname,"..","views","admin","profile.html"));
    response.render("admin/profile", {name: request.query.name, counter: request.query.counter});


})



adminRouter.get("/home",(request,resposne)=>{
    console.log("Event List")
    

    eventSchema.find()
                .populate({path:"mainSpeaker otherSpeakers"})
                .then((result)=>{
                    console.log(result.mainSpeaker)

                    response.render("index",{events:result});
                })
                .catch((error)=>{
                    console.log(error.message)
                });


});//home get
module.exports=adminRouter;