var assert = require('assert');
let chai = require("chai");
let chaiHTTP = require("chai-http");
let app = require("../app");
let should = chai.should();

const { expect } = chai;
chai.use(chaiHTTP);

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe("API testing", () => {
    it("Register (normal)", done => {
            chai
                .request(app)
                .post("/users/register")
                .send({
                    "user_name": "yaboi365"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid POST parameters");
                    done();
                });
        }),
        it("Register (invalid params)", done => {
            chai
                .request(app)
                .post("/users/register")
                .send({
                    "user_name": "yaboi3%%%65",
                    "password": "aWeakP<script>alert()password",
                    "email": "billGates@microsoft.com"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Username cannot contain those characters");
                    done();
                });
        }),
        it("Login (normal)", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "yaboi365"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid parameters");
                    done();
                });
        }),
        it("Login (invalid)", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "mcChicken",
                    "password": "You shouldn't be reading this"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Email or password invalid");
                    done();
                });
        }),
        it("Forgot Password", done => {
            chai
                .request(app)
                .post("/users/forgotPassword")
                .send({
                    "invalidJSON": "any cans"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        }),
        it("Reset Password", done => {
            chai
                .request(app)
                .post("/users/resetPassword")
                .send({
                    "<script>alert(1)": "<script>alert(1)<script>"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        }),
        it("Profile (not logged in)", done => {
            chai
                .request(app)
                .get("/users/profile")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        }),
        it("getTime", done => {
            chai
                .request(app)
                .get("/getTime")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    res.body.should.have.property("currentTime");
                    done();
                });
        })
})