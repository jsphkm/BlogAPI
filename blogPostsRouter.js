const express = require('express');
const router = express.Router();

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
  'Catcher in the Rye',
  'A story about a boy using literay realism',
  'J.D. Salinger'
)

BlogPosts.create(
  'Stuart Little',
  'A story about a mouse using literay realism',
  'E.B. White'
)

router.get("/", (req, res) => {
  res.json(BlogPosts.get());
})

router.post("/", (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.put("/:id", (req, res) => {
  const requiredFields = ["id", "title", "content", "author", "publishDate"];
  for (let i=0; i < requiredFields.length; i++){
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post with id ${req.params.id}`);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

router.delete("/:id", (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Delete blog post with id ${req.params.id}`);
  res.status(204).end();
});

module.exports = router;
