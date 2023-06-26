const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect( "mongodb://127.0.0.1:27017/wikiDB" , {useNewUrlParser: true});

const articleSchema = {
  title: "string",
  content: "string"
};

const Article = mongoose.model("Article", articleSchema);

//////////////////// Getting ALL Articles //////////////////////

app.route("/articles")

  .get(function(req,res){
    Article.find().then(function(foundArticles){
      res.send(foundArticles);
    }).catch(function(err){
      res.send(err);
    })
  })

.post(function(req,res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save().then(function(article){
      res.send("Successfully saved");
  }).catch(function(err){
    console.log(err);
  })

})

.delete(function(req,res){
  Article.deleteMany({}).then(function(){
    res.send("Successfully deleted all articles");
  }).catch(function(err){
    res.send(err);
  })
  
});



app.route("/articles/:articleTitle")

  .get(async (req,res)=>{
    try{
      const foundArticle = await Article.findOne({title: req.params.articleTitle});
      res.send(foundArticle);
    }
    catch(err){
      console.log("Article not found: "+ req.params.articleTitle);
      res.status(404).json({error: "Article not found-->: " + req.params.articleTitle})
    }

  })

  .patch((req,res) =>{
    Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    ).then( () =>{
      res.send("Successfully updated the article")
    }).catch(function(err){
      res.send("Error while Updating the Article " + req.params.articleTitle);
    })
  })

  .put((req, res) =>{
    Article.replaceOne(
      {title : req.params.articleTitle},
      {title : req.body.title , content : req.body.content},

    ).then( () => {
      res.send("Successfully updated the Article");
    }).
    catch(function(err){
      res.send("Error while updating the Article" + req.params.articleTitle);
    });
    
  })

  .delete((req,res) =>{
    const articleTitle = req.params.articleTitle;

    Article.deleteOne({title: articleTitle}).then(() =>{
      res.send("Successfully deleted the article");
    }).catch(function(err){
      res.send("Coudn't able to delete the article " + articleTitle);
    })
  });
  

  


app.listen(3000, function() {
  console.log("Server started on port 3000");
});