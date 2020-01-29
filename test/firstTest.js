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

describe("Index API", () => {
    it("welcomes user to the api", done => {
        chai
            .request(app)
            .get("/testing")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("success");
                expect(res.body.message).to.equals("Welcome To Testing API");
                done();
            });
    });
});