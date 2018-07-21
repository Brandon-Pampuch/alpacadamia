const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser");
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user")




//mongoose.connect('mongodb://localhost/alpacadamia'); Oauth database
mongoose.connect('mongodb://pabloshampoo:whatthea1@ds219000.mlab.com:19000/alpacadamia');

//blog update database
// mongoose.connect("mongodb://localhost/alpacadamia_blog");
var conn = mongoose.createConnection('mongodb://pabloshampoo:whatthea1@ds147451.mlab.com:47451/alpacadamia_blog');
// var conn = mongoose.createConnection('mongodb://localhost/alpacadamia_blog');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "pablo shampoo",
    resave: false,
    saveUninitialized: false
}));


//PASSPORT CONFIGURATION

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// var blogSchema = new mongoose.Schema({
//     title: String,
//     image: String,
//     body: String,
//     created:{type: Date, default: Date.now}
// });

// var Blog = mongoose.model("Blog", blogSchema);

var Blog = conn.model('Blog', new mongoose.Schema({
     title : String, 
     image : String,
     body: String,
     created:{type: Date, default: Date.now}
     }
  ));

  

// test item
// Blog.create({
//     title: "testblog",
//     image: "https://unsplash.com/photos/F7JUUpOejr8",
//     body: "justsometestdata"
    
// })

// RESTFUL ROUTES
//index
app.get("/blogs",function(req,res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log("error")
        }else{
            res.render("blog", {blogs: blogs});
        }
    });
})
//new
app.get("/blogs/new", function(req,res){
    res.render("new")
});
//create
app.post("/blogs",function(req,res){
    //create new blog
    Blog.create(req.body.blog, function(err, newblog){
        if(err){
            res.render("new")
        }else{
    //redirect to index
            res.redirect("/blogs")
        }

    });
});
//show

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs")
        }else{
            res.render("show",{blog:foundBlog})
        }
    });
})



// OLD APP ROUTES

app.get("/about", function(req, res){
    res.render("about");
});

app.get("/contact",isLoggedIn, function(req, res){
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

app.get("/science",isLoggedIn, function(req, res){
    res.render("science");
})

app.get("/socialstudies", isLoggedIn, function(req, res){
    res.render("socialstudies")
})








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
app.get("/", function(req, res){
    res.render("login");
})

//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/research",
        failureRedirect: "/"

    }), function(req, res){
});

//logout route

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/");
}


app.listen(process.env.PORT || 5000, () => console.log("server is spining"))