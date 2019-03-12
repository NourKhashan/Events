let express=require("express"),
bcrypt = require("bcrypt"),
SALT = 10,
path = require("path"),
mongoose=require("mongoose"),
multer  = require('multer'),
upload = multer({ dest: './publics/images/' }),
fs = require("fs");

// body_parser=require("body-parser");
let authRouter=express.Router();


require("./../Models/speakerModel");

let speakerSchema=mongoose.model("speakers");

authRouter.get("/login/:id?/:age?",(request,response)=>{
    // response.send("Login get");
    //1- query string /login?name=eman&age=20
    console.log(request.query);
    //2- routing parameters
    console.log(request.params);

    // response.sendFile(path.join(__dirname,"..","views","auth","login.html"))
        
        response.render("auth/login", {messageError: request.flash("loginError")});
})

authRouter.post("/login"/*,body_parser.urlencoded()*/,(request,response)=>{

    //3 request body http
    console.log(request.body);
   
    // if(request.body.userName=="eman"&&request.body.userPassword==123)
    // {
    //     // Add Password and username to session
    //     request.session.userName = request.body.userName;
    //     request.session.userPassword = request.body.userPassword;
    //     let count = 1;
    //     console.log("Count: ", request.cookies.counter)
    //     console.log("Count: ", count)
    //     if(request.cookies.counter == undefined){
    //         count = 1;
    //         request.cookies.counter = 1;
    //     }
            
    //     else
    //         count = parseInt( request.cookies.counter) + 1;
    //     response.cookie("counter", count);
    //    console.log("hhh", request.cookies.counter);
        
    //      response.redirect(`/admin/profile?name=${request.body.userName}&counter=${count}`);
    // }
    // else
    // {
    //     request.flash("loginError", "UserName Or Password Isnt correct");

    //     response.redirect("/login")
    // }
    // response.send("POSt login")

    // bcrypt.compare(req.body.password, user.password, function (err, result) {
    //     if (result == true) {
           
        
    let userNameBody = new RegExp(request.body.userName,"i");

    speakerSchema.findOne({userName: userNameBody}, (error, result)=>{
         if(result != null)
    {

        bcrypt.compare(request.body.userPassword, result.password,  (err, reslt) =>{
            if (reslt == true) {
                // Add Password and username to session
                request.session.userName = result.userName;
                // request.session.userPassword = request.body.userPassword;
                request.session.userPassword = result.password;
                console.log("Login: ", result)

                
                response.redirect(`/speakers/listEvents?name=${request.body.userName}`);
    }else{
        request.flash("loginError", "UserName Or Password Isnt correct");

        response.redirect("/login")
    }
})
    }else  if(request.body.userName=="eman"&&request.body.userPassword==123)
    {
        // Add Password and username to session
        request.session.userName = request.body.userName;
        request.session.userPassword = request.body.userPassword;
        //let count = 1;
        let count;
        console.log("Count: ", request.cookies.counter)
        if(request.cookies.counter == undefined){
            count = 1;
            request.cookies.counter = 1;
        }
            
        else
            count = parseInt( request.cookies.counter) + 1;

        
         response.redirect(`/speakers/list?name=${request.body.userName}&counter=${count}`);
    }
    else
    {
        request.flash("loginError", "UserName Or Password Isnt correct");

        response.redirect("/login")
    }
        
    })
});


authRouter.get("/register",(request,resposne)=>{
    resposne.render("auth/register",{messageError: request.flash("registerError")})

});//add get


authRouter.post("/register",upload.single("image"),(request,reposne)=>{
    let userNameBody = new RegExp(request.body.userName,"i");
    console.log("Register: ", request.body)

    let originalname = "";
    if(request.file != undefined){
        fs.rename(request.file.path, path.join(request.file.destination, request.file.originalname), (err)=>{
            console.log("File Renamed")
        });
        originalname = request.file.originalname;
    }
    speakerSchema.findOne({userName: userNameBody}, (error, result)=>{
        if(result == null){
            bcrypt.hash(request.body.password, SALT, function (err,   hash) {
                //1- create object from schema
                let speaker=new speakerSchema({
                    _id:request.body.id,
                    name:request.body.name,
                    age:request.body.age,
                    image: originalname,

                    userName: request.body.userName,
                    password: hash,
                    
                
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

        }else{
            request.flash("registerError", "UserName already EXISTS");

            reposne.redirect("/register")
        }
    })//find
    

});//add post

// authRouter.get("/register",(request,response)=>{
//     //response.send("regietr get")
//     // response.sendFile(path.join(__dirname, "..", "views", "auth", "register.html"));
//     response.render("auth/register")
// });




// authRouter.post("/register",(request,response)=>{
//    // response.send("Register Post")
//     console.log( request.body);
//     response.redirect("/login")
    
// })



authRouter.get("/logout",(request,response)=>{
     console.log("logout get")
    request.session.destroy(()=>{
        response.redirect("/login")
    });

})


module.exports=authRouter;