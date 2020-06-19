//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGO_LOCAL;

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const blogPost = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Establish DB Connection
mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
);
//Create schema
const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title must be specified"],
    },
    body: String,
});
//Create model/collection
const Post = mongoose.model("Post", blogSchema);

app.get("/", function (req, rsp) {
    Post.find({}, function (err, postList) {
        if (err) {
            console.log("Failed to retrieve nay post");
        } else {
            rsp.render("home", {
                homeContent: homeStartingContent,
                blogPosts: postList
            });
        }
    });
});

app.get("/about", function (req, rsp) {
    rsp.render("about", {
        aboutContent: aboutContent,
    });
});

app.get("/contact", function (req, rsp) {
    rsp.render("contact", {
        contactContent: contactContent,
    });
});

app.get("/compose", function (req, rsp) {
    rsp.render("compose");
});

app.get("/posts/:id", function (req, rsp) {
    const queryTopic = req.params.id;
    Post.findById(queryTopic, function (err, post) {
        if (!err) {
            rsp.render("post", {
                title: post.title,
                content: post.body,
            });
        } else {
            console.log("Failure to retrieve post")
        }
    });
});

app.post("/compose", function (req, rsp) {
    const newPost = new Post({
        title: req.body.title,
        body: req.body.post
    });
    //blogPost.push(newPost);
    newPost.save(function (err) {
        if (!err) {
            rsp.redirect("/");
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started");
});

