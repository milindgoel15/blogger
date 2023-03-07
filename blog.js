const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

// let posts = [];

let API_URL = "mongodb://localhost:27017/blogsDB";
mongoose.connect(API_URL);
const blogsSchema = new mongoose.Schema({
   title: String,
   content: String,
})
const Post = mongoose.model('Post', blogsSchema);


app.get('/', (req, res) => {
   Post.find({}, (err, result) => {
      if (!err) {
         res.render('index', { blogs: result });
      } else {
         console.log(err);
      }
   })
})

app.get('/about', (req, res) => {
   res.render('about');
})
app.get('/contact', (req, res) => {
   res.render('contact');
})
app.get('/compose', (req, res) => {
   res.render('compose');
})

app.get('/posts/:postID', (req, res) => {
   let currentPostID = req.params.postID.trim();

   Post.findOne({ _id: currentPostID }, (err, result) => {
      if (!err) {
         if (!result) {
            res.redirect('/posts/' + currentPostID);
         } else {
            res.render('posts', { title: result.title, content: result.content })
         }
      } else {
         console.log(err);
      }
   })
})

app.post('/', (req, res) => {
   let title = req.body.postTitle;
   let content = req.body.postContent;

   Post.findOne({ title: title }, (err, result) => {
      if (!err) {
         if (!result) {
            const post = new Post({
               title: title,
               content: content
            });
            post.save(err => {
               if (!err) {
                  res.redirect('/');
               }
            })
         }
      } else {
         console.log(err);
      }
   })
})


app.listen(5000, () => {
   console.log("listening on port 5000");
})