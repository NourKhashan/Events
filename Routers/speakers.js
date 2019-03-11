let express=require("express"),
    mongoose=require("mongoose"),
    bcrypt = require("bcrypt"),
    path = require("path"),
    SALT = 10,
    multer  = require('multer'),
    upload = multer({ dest: './publics/images/' }),
    fs = require("fs");

    require("./../Models/speakerModel");
    require("./../Models/eventModel");

let speakerRouter=express.Router();
 
let speakerSchema=mongoose.model("speakers");
let eventSchema=mongoose.model("events");


speakerRouter.get("/home",(request,response)=>{
    console.log("Speakers Home")
    

    eventSchema.find()
                .populate({path:"mainSpeaker otherSpeakers"})
                .then((result)=>{
                    console.log(result.mainSpeaker)

                    if(request.session.userName == "eman"){
                        response.render("admin/index",{events:result});
                        
                    }else{
                    response.render("speakers/index",{events:result});

                    }
                })
                .catch((error)=>{
                    console.log(error.message)
                });


});//home get


speakerRouter.get("/speaker/:id",(request,resposne)=>{
    console.log("Get Speaker");
    speakerSchema.findOne({_id: request.params.id},(error,result)=>{
        // resposne.render("speakers/speakersList",{speakers:result});
        console.log(result)
        resposne.send(result);
    }
    );

});//list get

speakerRouter.get("/list",(request,resposne)=>{
    console.log("List");
    speakerSchema.find({},(error,result)=>{
        console.log(result)
        if(!error && request.session.userName == "eman")
            resposne.render("speakers/speakersList",{speakers:result});
        else{
            response.sendStatus(404)
        }

    });

});//list get


speakerRouter.get("/listEvents",(request,resposne)=>{

    let userNameBody = new RegExp(request.session.userName,"i");
    speakerSchema.findOne({userName:userNameBody}, (error, result)=>{
        console.log("result: ", result)

        eventSchema.find({mainSpeaker: result._id}, (err, res)=>{
        console.log("res: ",res)
                resposne.render("speakers/eventSpeaker",{events:res});

            }
        )
    })
    //resposne.render("speakers/eventSpeaker");

    // speakerSchema.find({},(error,result)=>{
    //     if(!error)
    //     resposne.render("speakers/speakersList",{speakers:result});

    // });


});//list get


speakerRouter.get("/add",(request,resposne)=>{
    if( request.session.userName == "eman"){
         resposne.render("speakers/addspeaker")

    }


});//add get
speakerRouter.post("/add",upload.single("image"),(request,reposne)=>{
console.log("file: ", request.file);

fs.rename(request.file.path, path.join(request.file.destination, request.file.originalname), (err)=>{
    console.log("File Renamed")
});
console.log("file: ", request.file);
bcrypt.hash(request.body.password, SALT, function (err,   hash) {

    //1- create object from schema

    let speaker=new speakerSchema({
       // _id:request.body.id,
        name:request.body.name,
        age:request.body.age,
        image: request.file.originalname,
        userName: request.body.userName,
        password: hash
    
    });
 

    //2- saveing
    speaker.save((error)=>{
        console.log("Enter Save")
        if(!error)
        {
            console.log("Addede to DB")
            reposne.redirect("/speakers/list");
        }
        else
        {
            console.log(error.message);
        }

    });
})
});//add post


speakerRouter.get("/edit/:id?",(request,reposne)=>{

   
    if(request.params.id == undefined){//Edit My Profile
        speakerSchema.findOne({userName: request.session.userName},(err,res)=>{
            speakerSchema.findOne({_id:res._id },(error,result)=>{
            
                reposne.render("speakers/editspeaker",{speaker:result})
            })
        });
    }else{
        speakerSchema.findOne({_id:request.params.id },(error,result)=>{
        
            reposne.render("speakers/editspeaker",{speaker:result})
    })
}
    
 
    
});//edit get
speakerRouter.post("/edit/:id?",upload.single("image"),(request,reposne)=>{
    fs.rename(request.file.path, path.join(request.file.destination, request.file.originalname), (err)=>{
        console.log("File Renamed")
    });
    speakerSchema.updateOne({_id:request.params.id},{
        $set:{
            name:request.body.name,
            age:request.body.age,
            image: request.file.originalname,
        }
    },(error)=>{
        if(!error)
        {
            if(request.session.userName == "eman"){
            reposne.redirect("/speakers/list");
                
            }else{
                  reposne.redirect("/speakers/listEvents");

            }
        }
        else
        {
            console.log(error.message);
        }
    });

});//edit post

speakerRouter.get("/delete/:id",(request,reposne)=>{
    eventSchema.updateOne({mainSpeaker: request.params.id}, {$set:{
        mainSpeaker: 0
    }}, {multi:true}, (error, res) =>{
        if(!error){

            eventSchema.updateOne({otherSpeakers: {$in: [request.params.id]}}, {$pull:{
                otherSpeakers: {$in: [request.params.id]}
            }}, {multi:true}, (error, res) =>{
                if(!error){
                    speakerSchema.remove({_id:request.params.id},(error)=>{
                        if(!error)
                        {
                            reposne.redirect("/speakers/list");
                        }
                    })
                }});// OtherSpeakers

            
        }else{
            console.log(error.message);
        }
    });



});//delte



speakerRouter.get("/rejectEvent/:id",(request,response)=>{
console.log("Id: ",request.params.id)
    // eventSchema.findOne({_id: request.params.id}, (error, res) =>{
    //     console.log(res)
    //     if(!error){
    //     console.log("Redirect Reject")

    //         //response.redirect("/speakers/listEvents")
    //     }else{
    //         console.log(error.message);
    //     }
    // });
    eventSchema.updateOne({_id: request.params.id}, {$set:{
        mainSpeaker: 0
    }}, (error, res) =>{
        console.log(res)
        if(!error){
        console.log("Redirect Reject")

            response.redirect("/speakers/listEvents")
        }else{
            console.log(error.message);
        }
    });
    
    });//Reject
    
    

module.exports=speakerRouter