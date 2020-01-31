var assert = require('assert');
let chai = require("chai");
let chaiHTTP = require("chai-http");
let app = require("../app");
let should = chai.should();

const { expect } = chai;
chai.use(chaiHTTP);

describe("Login Testing", () => {
        it("Invalid params", done => {
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
        it("Invalid password", done => {
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
        }).timeout(4000),
        it("Invalid username", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "anInvalidUsernameTooLong",
                    "password": "aBadpassword"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Username not found");
                    done();
                });
        }).timeout(4000),
        it("Injection", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "mcChicken",
                    "password": "db.collection.drop()",
                    "_id":"db.collection.drop()"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Email or password invalid");
                    done();
                });
        }).timeout(4000),
        it("Invalid params", done => {
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
        it("Invalid Url", done => {
            chai
                .request(app)
                .post("/users/forgotPassword")
                .send({
                    "newPassword": "anycans4444555",
                    "fromUrl":"\'console.log(`injection`)"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        })
        // it("Password injection", done => {
        //     chai
        //         .request(app)
        //         .post("/users/resetPassword")
        //         .send({
        //             "newPassword": "\";console.log(`yuppa`)",
        //             "fromUrl":"https://youtube.com"
        //         })
        //         .end((err, res) => {
        //             expect(res).to.have.status(401);
        //             expect(res.body.status).to.equals("error");
        //             expect(res.body.body).to.equals("Invalid input");
        //             done();
        //         });
        // }),
});

describe("Register Testing", () => { 
    it("Invalid params", done => {
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
    it("Injection", done => {
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
    it("Invalid username", done => {
        chai
            .request(app)
            .post("/users/register")
            .send({
                "user_name": "yaboi365xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "password":"aldiBetterThanLidl",
                "email":"email@mail.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Username must be between 1 and 32 characters long");
                done();
            });
    }),
    it("Username injection", done => {
        chai
            .request(app)
            .post("/users/register")
            .send({
                "user_name": "\";console.log(`yuppa`)",
                "password":"'console.log(`injection`)<",
                "email":"yes@mail.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Username cannot contain those characters");
                done();
            });
    }),
    it("Password injection", done => {
        chai
            .request(app)
            .post("/users/register")
            .send({
                "user_name": "bobTheBuilder",
                "password":"'console.log(`injection`)<",
                "email":"yes@mail.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Password must be more than 8 characters in length");
                done();
            });
    })
});


describe("Password Reset", () => {
    it("Invalid Url", done => {
        chai
            .request(app)
            .post("/users/resetPassword")
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid input");
                done();
            });
    }),
    it("Injection", done => {
        chai
            .request(app)
            .post("/users/resetPassword")
            .send({
                "newPassword":`"console.log('Injection')`,
                "fromUrl":"http://localhost:8673/resetPassword"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid input");
                done();
            });
    }),
    it("Invalid params", done => {
        chai
            .request(app)
            .post("/users/resetPassword")
            .send({
                "newPassword":"jellyfisherman",
                "fromUrl":"youtube.com"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("User does not exist");
                done();
            })
        })
});

describe("Verify Account", () => {
    it("Invalid params", done => {
        chai
            .request(app)
            .post("/users/verifyAccount")
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid input");
                done();
            });
    }),
    it("Invalid params", done => {
        chai
            .request(app)
            .post("/users/verifyAccount")
            .send({
                "user_name":"nothingInteresting"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid input");
                done();
            })
    }),
    it("Code injection", done => {
        chai
            .request(app)
            .post("/users/verifyAccount")
            .send({
                "activationCode":"db.collection.drop()"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid input");
                done();
            })
    }),
    it("Code injection", done => {
    chai
        .request(app)
        .post("/users/verifyAccount")
        .send({
            "activationCode":"db.collection.deleteMany"
        })
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.status).to.equals("error");
            expect(res.body.body).to.equals("Invalid input");
            done();
        })
    })
});

describe("Various APIS", () => {
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
    }),
    it("Invalid params", done => {
        chai
            .request(app)
            .post("/createArticleBet")
            .send({
                "betType":"nothing"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body.body).to.equals("Invalid param");
                done();
            });
    }),
    it("Invalid params", done => {
        chai
            .request(app)
            .post("/createArticleBet")
            .send({
                "betType":"article",
                "sitename":"BBC",
                "directory":"world",
                "month":"12",
                "year":"2020",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("error");
                done();
            });
    }),
    it("Injection", done => {
        chai
            .request(app)
            .post("/createArticleBet")
            .send({
                "betType":"article",
                "sitename":"BBC",
                "directory":"\"console.log(`test`)",
                "month":"12",
                "year":"2020",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("error");
                done();
            });
    }),
    it("Valid search", done => {
        chai
            .request(app)
            .post("/createArticleBet")
            .send({
                "betType":"article",
                "sitename":"BBC",
                "directory":"world",
                "month":"1",
                "year":"2020",
                "searchTerm":"Trump"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("information");
                done();
            });
    }).timeout(4000),
    it("Valid search", done => {
        chai
            .request(app)
            .post("/createArticleBet")
            .send({
                "betType":"article",
                "sitename":"CNN",
                "directory":"all",
                "month":"1",
                "year":"2020",
                "searchTerm":"putin"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("information");
                done();
            });
    }).timeout(4000)
});