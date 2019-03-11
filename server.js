function FirstMW(request,response,next)
{
    console.log(request.url,request.method);
    next();
    // response.send("Hello from server");
}

let express =require("express"),
    morgan=require("morgan"),
    path=require("path"),
    authRouter=require("./Routers/auth"),
    adminRouter=require("./Routers/admin"),
    speakerRouter = require("./Routers/speakers"),
    eventRouter = require("./Routers/events"),
    express_session = require("express-session"),
    connect_flash = require("connect-flash"),
    cookie_parser = require("cookie-parser"),
    mongoose = require("mongoose"),
    body_parser=require("body-parser"),
    multer  = require('multer'),
    upload = multer({ dest: './publics/images/' });


//1- create server
let server=express();
mongoose.connect("mongodb://localhost:27017/Events")
        .then(()=> console.log("DB Connected"))
        .catch(()=> console.log("DB Not Connected"))
    require("./Models/eventModel");
    let eventSchema=mongoose.model("events");

//3- MW
// server.use(FirstMW);
server.use(morgan("tiny"));
server.use(connect_flash());
server.use(cookie_parser());
// server.use(upload);
server.use((request,response,next)=>{

    let mintues=(new Date()).getMinutes();
    console.log(mintues);
    if(true)//mintues>20)
    {
        console.log("OK");
        next();
    }
    else{
        console.log("NOT OK");
        next(new Error("try agian later......."));

    }

});


// server.use((request,response,next)=>{

//     response.send("HOME page")
// })

// Setting For EJS
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname,"publics")));
server.use(express.static(path.join(__dirname,"node_modules")));
server.use(body_parser.urlencoded());// Parse Data from Post Request
server.use(express_session({// Use Session
    secret: 'encryptKeyId'
}

))
// server.use(body_parser.josn());
//Routing
server.use(/\//,(request,response)=>{

    // response.send("You are in home page")
    // response.sendFile(path.join(__dirname,"views","index.html"));
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

})
server.use(authRouter);// Autho
server.use((request, response, next)=>{// Check if has Session or not
    if(request.session.userName && request.session.userPassword ){// If I have sessionContinue
        response.locals.userName = request.session.userName;// Add userName
        if(request.session.userName == "eman"){
            response.locals.role = "Admin";
        }else{
            response.locals.role = "Admin";

        }
        next();
    }else{// there is no session then redirect to login again
        request.flash("loginError", "There is No Sesseion");
        response.redirect("/login")
    }
});



server.use("/speakers", speakerRouter);

server.use("/admin",adminRouter);
server.use("/events", eventRouter);
    

    


server.use((error,request,response,next)=>{
    response.send(error.message)
});

//2- listen on port number
let port=process.port||8080
server.listen(port,()=>{
    console.log("I am Listening ............")
});