const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, server } = require("../app");

chai.use(chaiHttp);
chai.should();

describe("People", () => {
  after(() => {
    server.close();
  });
  describe("post /api/v1/people", () => {
    it("should not create a people entry without a name", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ age: 10 })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.eql({ error: "Please enter a name." });
          done();
        });
    });
    it("should create a people entry with valid input", (done) => {
      chai
        .request(app)
        .post("/api/v1/people")
        .send({ name: "Tom", age: 15 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.contain({ message: "A person record was added." });
          this.lastIndex = res.body.index;
          done();
        });
    });
  });
  describe("add", () => {
    it("returns success response", () => {
      // works
      chai
        .request(app)
        .post("/add")
        .send({ a: 1, b: 2 })
        .end((_, res) => {
          res.should.have.status(200);
        });
      // works
    });
    it("add two numbers", () => {
      chai.request(app)
      .post('/add')
      .send({ a: 1, b: 3 })
      .end((_, res) => {
        res.body.sum.should.equal(4)
      })
    });
    it('can handle negative numbers', () => {
      chai.request(app)
      .post('/add')
      .send({ a: -1, b: 3 })
      .end((_, res) => {
        res.body.sum.should.equal(2)
      })
    })
    it('can add really gigantic numbers', () => {
      chai.request(app)
      .post('/add')
      .send({ a: 100000000000000000000000000000000, b: 3000000000000000000000000000000 })
      .end((_, res) => {
        res.body.sum.should.equal(103000000000000000000000000000000)
      })
    })
    it('can add letters', () => {
      chai.request(app)
      .post('/add')
      .send({ a: 'a', b: 'b' })
      .end((_, res) => {
        res.body.sum.should.equal('ab')
      })
    });
    it('can handle an array of numbers', () => {
      chai.request(app)
      .post('/add')
      .send({ a: [1, 2, 3], b: [2, 3, 4] })
      .end((_, res) => {
        res.body.sum.should.equal(15)
      })
    });
    it('returns 400 if it recieves boolean inputs', () => {
      chai.request(app)
      .post('/add')
      .send({a: true, b: false})
      .end((_, res) => {
        expect(res.status).to.equal(400);
      })
    });
    it('is resilient against not getting any data', () => {
      chai.request(app)
      .post('/add')
      .send({})
      .end((_, res) => {
        res.body.sum.should.equal(0)
      })
    })
  });
});
