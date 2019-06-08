var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
methodOverride = require('method-override');
//APP CONFIG
mongoose.connect("mongodb://localhost/restfulblogapp",{ useNewUrlParser: true });
app.set('view engine','ejs');

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



// MONGOOSE CONFIG
var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created: {type: Date,default: Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);

// RESTFUL ROUTES
//HOME
app.get('/',function(req,res){
  res.send("HomePage")
})

// INDEX ROUTE
app.get('/blogs',function(req,res){
  Blog.find({},function(err,blogs){
    if (err) {
      console.log(err);
    }else {
      res.render("index",{blogs:blogs});
    }
  })
})

//NEW ROUTE - Displays form for Create
app.get('/blogs/new',function(req,res){
  res.render('new')
})

//CREATE ROUTE - Create a new blog and update DB
app.post('/blogs',function(req,res){
  Blog.create(req.body.blog,function(err,newBlog){
    if (err) {
      console.log(err);
      res.render('new')
    }else {
      console.log("Damn");
      res.redirect("/blogs")
    }
  })
})

//SHOW ROUTE - show info of one specific ROUTE

app.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id,function(err,foundblog){
    if (err) {
      res.redirect("/blogs")
    }else {
      res.render('show',{blog:foundblog})
    }
  })
})

//EDIT ROUTE - lets edit a specific blogs

app.get('/blogs/:id/edit',function(req,res){
  Blog.findById(req.params.id,function(err,foundblog){
    if (err) {
      res.redirect("/blogs")
    }else {
      res.render('edit',{blog:foundblog})
    }
  })
})

//UPDATE ROUTE

app.put('/blogs/:id',function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
    if (err) {
      res.redirect('/blogs')
    }else {
      res.redirect('/blogs/'+req.params.id)
    }
  })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
 Blog.findByIdAndRemove(req.params.id,function(err){
   if (err) {
     res.redirect("/blogs")
   }else {
     res.redirect("/blogs")
   }
 })
})

//PORT INFORMATION
app.listen(3000,function(){
  console.log('Blog App Started');
});
