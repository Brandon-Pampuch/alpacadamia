const express = require("express");
const app = express();

app.use(express.static("public"));

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

app.get("/research", function(req, res){
    res.render("research");
});

app.get("/specialarea", function(req, res){
    res.render("specialarea");
});


app.listen(process.env.PORT || 5000)