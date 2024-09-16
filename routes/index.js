var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index');
});

//sql connection
var mysql = require('mysql');
connection=mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"root",
  database:"blog"
})
connection.connect(function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("database is connected successfully")
  }
})
//INSERT
router.post("/posts",function(req,res,next){
   const {title,content,author_id}=req.body;
   var inquery="insert into posts(title,content,author_id) values(?,?,?)";
   connection.query(inquery,[title,content,author_id],function(err,data,result){
       if(err){
        console.log(err);
       }
       else{
        res.status(201).json({ title, content,author_id });
        console.log(title,content,author_id)
       }
   })
})

//read posts
router.get("/read",function(req,res,next){
  selectquery="select * from posts";
  connection.query(selectquery,function(err,data,rows){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json(rows);
      console.log(rows)
  
    }
  })
})

//update a post
router.put("/posts/:id",function(req,res,next){
    const {id}=req.params;
    const{title,content}=req.body;
    updatequery="update posts set title=? ,content=? where id=?";
    connection.query(updatequery,[title,content,id],function(err,data,rows){
      if(err){
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'An error occurred while updating the post' });
      }
      else{
        res.status(200).json({id,title,content});
      }
    })

})

//delete a post
router.delete("/posts/:id",function(req,res,next){
    const {id}=req.params;
    deletequery="delete from posts where id=?";
    connection.query(deletequery,[id],function(err,res){
      if(err){
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'An error occurred while deleting the post' });
      }
      else{
        res.status(200).end();
        console.log("deleted successfully");
      }
    })
})
//craete a command

router.post("/posts/:postId/comments", (req, res, next) => {
   const { postId } = req.params;
   const { content } = req.body;
   const query = "INSERT INTO comments (post_id, content) VALUES (?, ?)";
   connection.query(query, [postId, content], (err, result) => {
       if (err) return next(err);
       res.status(201).json({ id: result.insertId, postId, content });
   });
});
//read comment for a post

router.get("/posts/:postId/comments", (req, res, next) => {
   const { postId } = req.params;
   connection.query("SELECT * FROM comments WHERE post_id = ?", [postId], (err, rows) => {
       if (err) return next(err);
       res.status(200).json(rows);
   });
});

//update

router.put("/comments/:id", (req, res, next) => {
   const { id } = req.params;
   const { content } = req.body;
   const query = "UPDATE comments SET content = ? WHERE id = ?";
   connection.query(query, [content, id], (err, result) => {
       if (err) return next(err);
       if (result.affectedRows === 0) return res.status(404).json({ message: "Comment not found" });
       res.status(200).json({ id, content });
   });
});

//delete

router.delete("/comments/:id", (req, res, next) => {
   const { id } = req.params;
   connection.query("DELETE FROM comments WHERE id = ?", [id], (err, result) => {
       if (err) return next(err);
       if (result.affectedRows === 0) return res.status(404).json({ message: "Comment not found" });
       res.status(204).end();
   });
});

module.exports = router;
