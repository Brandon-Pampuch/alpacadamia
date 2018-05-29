const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser");
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user")




//mongoose.connect('mongodb://localhost/alpacadamia');
mongoose.connect('mongodb://pabloshampoo:whatthea1@ds219000.mlab.com:19000/alpacadamia');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "pablo shampoo",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/lessons", function(req, res){
    res.render("lessons");
});

app.get("/research",isLoggedIn, function(req, res){
    
    res.render("research", {currentUser: req.user});
});

app.get("/specialarea",isLoggedIn, function(req, res){
    res.render("specialarea");
});
app.get("/debates",isLoggedIn, function(req, res){
    res.render("debates");
});
app.get("/history",isLoggedIn, function(req, res){
    res.render("history");
});

app.get("/quiz",isLoggedIn, function(req, res){
    res.render("quiz");
});


//Auth Routes

//show register form
app.get("/register", function(req, res){
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        console.log(err);
        return res.render("register")
    }
    passport.authenticate("local")(req, res, function(){
        res.redirect("/research");
    });

    });
});
//show login form
app.get("/login", function(req, res){
    res.render("login");
})

//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/research",
        failureRedirect: "/login"

    }), function(req, res){
});

//logout route

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login");
}



app.listen(process.env.PORT || 5000)