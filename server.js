const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

const blogPostsRouter = require("./blogPostsRouter");

app.use(morgan("common"));

app.use("/blog-posts", blogPostsRouter);

let server;

function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise(function(resolve, reject) {
    server = app
      .listen(port, function(){
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", function(err) {
        reject(err);
      });
  });
}

function closeServer(){
  return new Promise((resolve, reject) => {
    console.log("Closing Server");
    server.close(function(err){
      if(err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
