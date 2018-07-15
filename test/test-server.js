const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;
chai.use(chaiHttp);

describe("Blog Posts", function(){
  before(function(){
    return runServer();
  });
  after(function(){
    return closeServer();
  });

  it("should list blog-posts on GET", function(){
    return chai
      .request(app)
      .get("/blog-posts")
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ["id", "title", "content", "author", "publishDate"];
        res.body.forEach(function(item){
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        })
      })
  });

  it("should add a blog-post on POST", function(){
    const newItem = {title: "Moby Dick", content: "The whale and stuff", author: "Herman Melville", publishDate: "10/18/1851"};
    return chai
      .request(app)
      .post("/blog-posts")
      .send(newItem)
      .then(function(res){
        console.log(res.body);
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "title", "content", "author", "publishDate");
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        );
      })
  });

  // 1. initialize some update data (we won't have an 'id' yet)
  // 2. make a GET request so we can get an item to update
  // 3. add the 'id' to 'updateData'
  // 4. make a PUT request with 'updateData'
  // 5. Inspect the response object to ensure
  it("should update blog-post on PUT", function(){
    const updateData = {
      title: "Charlotte\'s Web",
      content: "A Girl and a Spider, Pig, and other Farm Animals",
      author: "E.B. White",
      publishDate: "10151952"
    }
    return chai
      .request(app)
      .get("/blog-posts")
      .then(function(res){
        console.log(res.body);
        updateData.id = res.body[0].id;
      })
  });
  it("should delete a blog-post on DELETE", function(){

  });
})
