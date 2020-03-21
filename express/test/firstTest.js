const randomstring = require('randomstring');
var assert = require('assert');
let chai = require("chai");
let chaiHTTP = require("chai-http");
let app = require("../app");
let should = chai.should();

const { expect } = chai;
chai.use(chaiHTTP);

const fuzzUsername = randomstring.generate(20);
const fuzzPassword = randomstring.generate(32);
const fuzzVerificationCode = randomstring.generate(6);


describe("========= Login Testing =========", () => {
    it("Valid login", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": process.env.testUserUsername,
                    "password": process.env.testUserPassword
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    expect(res.body.body).to.equals("Logged in successfully");
                    done();
                });
        }).timeout(1800),
        it("Invalid params", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "yaboi365"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
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
        }).timeout(2500),
        it("Invalid ysername", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": fuzzUsername,
                    "password": "You shouldn't be reading this"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Username not found");
                    done();
                });
        }).timeout(2500),
        it("Fuzzing password", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "mcChicken",
                    "password": `${fuzzPassword}`
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Email or password invalid");
                    done();
                });
        }).timeout(1800),
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
        }).timeout(1800),
        it("Injection", done => {
            chai
                .request(app)
                .post("/users/login")
                .send({
                    "user_name": "mcChicken",
                    "password": "db.collection.drop()",
                    "_id": "db.collection.drop()"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Email or password invalid");
                    done();
                });
        }).timeout(1800),
        it("Invalid params", done => {
            chai
                .request(app)
                .post("/users/login")
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid parameters");
                    done();
                });
        }).timeout(1800),
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
                    "fromUrl": "\'console.log(`injection`)"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/users/forgotPassword")
                .send({
                    "newPassword": "anycans4444555",
                    "fromUrl": "`'`''`'`'`'`'`'`''`'`'<<<<<<<<<<<<<<<<<<<<",
                    "_id": "eeeee"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        }),
        it("Fuzzing username", done => {
            chai
                .request(app)
                .post("/users/forgotPassword")
                .send({
                    "user_name": fuzzUsername
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Check your email for reset link");
                    done();
                });
        }).timeout(1800)
});
describe("=========== Register Testing ===========", () => {
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
                    "password": "aldiBetterThanLidl",
                    "email": "email@mail.com"
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
                    "password": "'console.log(`injection`)<",
                    "email": "yes@mail.com"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Username cannot contain those characters");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/users/register")
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid POST parameters");
                    done();
                });
        }),
        it("Valid registration", done => {
            chai
                .request(app)
                .post("/users/register")
                .send({
                    "user_name": `${fuzzUsername}`,
                    "password": "verySecurePass8()())())",
                    "email": `${fuzzUsername}@gmail.com`
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        }).timeout(4700),
        it("Invalid existing registration", done => {
            chai
                .request(app)
                .post("/users/register")
                .send({
                    "user_name": `${fuzzUsername}`,
                    "email": `${fuzzUsername}@gmail.com`
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    done();
                });
        }).timeout(4700)
});


describe("========== Password Reset ==========", () => {
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
        it("Password injection", done => {
            chai
                .request(app)
                .post("/users/resetPassword")
                .send({
                    "newPassword": "\";console.log(`yuppa`)",
                    "fromUrl": "https://youtube.com"
                })
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
                    "newPassword": "<helloworld",
                    "fromUrl": "http://localhost:8673/resetPassword"
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
                    "newPassword": "jellyfisherman"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                })
        }),
        it("Invalid params", done => {
            chai
                .request(app)
                .post("/users/resetPassword")
                .send({
                    "newPassword": null,
                    "fromUrl": ""
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                })
        }),
        it(`Fuzzing`, done => {
            chai
                .request(app)
                .post("/users/resetPassword")
                .send({
                    "newPassword": `${fuzzPassword}`,
                    "fromUrl": `${fuzzPassword}`
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                });
        }).timeout(2300)
});

describe("========== Verify Account ========== ", () => {
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
                    "user_name": "nothingInteresting"
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
                    "activationCode": "db.collection.drop()"
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
                    "activationCode": "db.collection.deleteMany"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                })
        }),
        it("Fuzzing", done => {
            chai
                .request(app)
                .post("/users/verifyAccount")
                .send({
                    "activationCode": `${fuzzVerificationCode}`
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                })
        }),
        it("Invalid params", done => {
            chai
                .request(app)
                .post("/users/verifyAccount")
                .send({
                    "activationCode": null,
                    "password": null,
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid input");
                    done();
                })
        })
});

describe("============= Various APIS ==============", () => {
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
        //     it("Invalid params", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "betType": "nothing"
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.body).to.equals("Invalid input");
        //                 done();
        //             });
        //     })
        // it("Invalid params", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "betType": "article",
        //                 "sitename": "BBC",
        //                 "directory": "world",
        //                 "month": "12",
        //                 "year": "2020",
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.status).to.equals("error");
        //                 done();
        //             });
        //     }),
        //     it("Injection", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "betType": "article",
        //                 "sitename": "BBC",
        //                 "directory": "\"console.log(`test`)",
        //                 "month": "2",
        //                 "year": "2020",
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.status).to.equals("error");
        //                 done();
        //             });
        //     }),
        //     it("Invalid Amount", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "sitename": "BBC",
        //                 "directory": "world",
        //                 "month": "2",
        //                 "year": "2020",
        //                 "searchTerm": "Trump"
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.status).to.equals("error");
        //                 done();
        //             });
        //     }).timeout(1400),
        //     it("Invalid search", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "betType": "article",
        //                 "sitename": "CNN",
        //                 "directory": "all",
        //                 "month": "1",
        //                 "year": "2020",
        //                 "searchTerm": "putin"
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.status).to.equals("error");
        //                 done();
        //             });
        //     }).timeout(1400),
        //     it("Invalid search", done => {
        //         chai
        //             .request(app)
        //             .post("/createArticleBet")
        //             .send({
        //                 "sitename": "BBC",
        //                 "directory": "world",
        //                 "month": "2",
        //                 "year": "2020",
        //                 "searchTerm": "Trump",
        //                 "uesr_name": "nobodiesUsernameForSure",
        //                 "betAmount": "1000000000"
        //             })
        //             .end((err, res) => {
        //                 expect(res).to.have.status(400);
        //                 expect(res.body.status).to.equals("error");
        //                 done();
        //             });
        //     }).timeout(1400),
        it("Get valid profiler", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .send({
                    "username": "IamCathal"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('No username given');
                    done();
                });
        }),
        it("Get invalid profiler", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .send({
                    "username": null
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('No username given');
                    done();
                });
        }),
        it("Get invalid profiler", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .send({
                    "username": "`,`,`,`,`,/''/'/'/'/'/'drop all the tables yeah?"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('Invalid username');
                    done();
                });
        }),
        it("Get valid profiler", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .send({
                    "username": "testUser"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        }),
        it("Fuzzing", done => {
            chai
                .request(app)
                .post("/users/getProfilePicture")
                .send({
                    "username": fuzzPassword
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('Invalid username');
                    done();
                });
        })
});

describe("============= Image Upload =============", () => {
    it("No Image", done => {
            chai
                .request(app)
                .post("/tasks/uploadImage")
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.body).to.equals('Invalid image');
                    expect(res.body.status).to.equals("error");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/tasks/uploadImage")
                .send({
                    "file": "nothing"
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.body).to.equals('Invalid image');
                    expect(res.body.status).to.equals("error");
                    done();
                });
        })
})

describe("============= Betting =============", () => {
    it("Invalid cut percentages", done => {
            chai
                .request(app)
                .post("/bets/makeBet")
                .send({
                    "type": "multi",
                    "title": "a test title",
                    "deadline": 1584621007,
                    "username": "testUser",
                    "firstPlaceCut": 0.9,
                    "secondPlaceCut": 0.3,
                    "thirdPlaceCut": 0.15
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('Payout percentages don\'t add up to 100%');
                    expect(res.body.status).to.equals("error");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/bets/makeBet")
                .send({
                    "firstPlaceCut": "yellow",
                    "secondPlaceCut": 0.3,
                    "thirdPlaceCut": "green"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals('Invalid input');
                    expect(res.body.status).to.equals("error");
                    done();
                });
        }),
        it("Fuzzing", done => {
            chai
                .request(app)
                .post("/bets/decideBet")
                .send({
                    "betID": fuzzUsername,
                    "result": fuzzUsername
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals("Error checking betID");
                    expect(res.body.status).to.equals("error");
                    done();
                });
        }),
        it("Invalid secret", done => {
            chai
                .request(app)
                .post("/bets/bigButtonBet")
                .send({
                    "secret": fuzzPassword,
                    "action": "start"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.body).to.equals("You are not authorised to do this");
                    expect(res.body.status).to.equals("error");
                    done();
                });
        })
})


describe("============= Analytics APIs =============", () => {
    it("Invalid username", done => {
        chai
            .request(app)
            .post("/analytics/getBettingHistory")
            .send({
                "username": fuzzUsername,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.body).to.equals('No bets found');
                expect(res.body.status).to.equals("success");
                done();
            });
    });
    it("Valid search", done => {
            chai
                .request(app)
                .post("/analytics/getBettingHistory")
                .send({
                    "username": "IamCathal",
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/analytics/getBettingHistory")
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals('error');
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/analytics/getCreatedBettingHistory")
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid username", done => {
            chai
                .request(app)
                .post("/analytics/getCreatedBettingHistory")
                .send({
                    "username": "thisUsernameCanNeverBeTakenBecauseItsTooLong",
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid username", done => {
            chai
                .request(app)
                .post("/analytics/getCreatedBettingHistory")
                .send({
                    "password": fuzzPassword,
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Valid search", done => {
            chai
                .request(app)
                .post("/analytics/getCreatedBettingHistory")
                .send({
                    "username": "Req",
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        }),
        it("Valid search", done => {
            chai
                .request(app)
                .post("/analytics/getCreatedBettingHistory")
                .send({
                    "username": "bakePancakes",
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        }),
        it("Invalid search", done => {
            chai
                .request(app)
                .post("/analytics/getWinLoss")
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Fuzzing", done => {
            chai
                .request(app)
                .post("/analytics/getWinLoss")
                .send({
                    "username": fuzzUsername
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    expect(res.body.body.wins).to.equals(0);
                    expect(res.body.body.losses).to.equals(0);
                    done();
                });
        }),
        it("Fuzzing", done => {
            chai
                .request(app)
                .post("/analytics/getPeopleReached")
                .send({
                    "username": "Req"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        }),
        it("Invalid Search", done => {
            chai
                .request(app)
                .post("/analytics/getPeopleReached")
                .send({
                    "_id": "Req"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid Search", done => {
            chai
                .request(app)
                .post("/analytics/getBreakdownOfBetTypes")
                .send({
                    "_id": "Req"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/analytics/getBreakdownOfBetTypes")

            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("error");
                expect(res.body.body).to.equals("Invalid username");
                done();
            });
        }),
        it("Invalid username", done => {
            chai
                .request(app)
                .post("/analytics/getBreakdownOfBetTypes")
                .send({
                    "username": "notAnExistingUsernameBecauseThisIsTooLong"
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("Invalid username");
                    done();
                });
        }),
        it("Invalid username", done => {
            chai
                .request(app)
                .post("/analytics/getBreakdownOfBetTypes")
                .send({
                    "username": fuzzUsername
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        }),
        it("Valid search", done => {
            chai
                .request(app)
                .post("/analytics/getBreakdownOfBetTypes")
                .send({
                    "username": "IamCathal"
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.status).to.equals("success");
                    done();
                });
        })
});

describe("============= Various APIS ==============", () => {
    it("Invalid payment", done => {
            chai
                .request(app)
                .post("/payments/checkout")
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("You are not authorized to do this");

                    done();
                });
        }),
        it("Invalid input", done => {
            chai
                .request(app)
                .post("/payments/checkout")
                .send({
                    "product": "theWorld",
                    "token":777777777777
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.status).to.equals("error");
                    expect(res.body.body).to.equals("You are not authorized to do this");

                    done();
                });
        })

});