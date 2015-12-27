
var chai = require('chai');
var expect = chai.expect;
var gameUtils = require('./game');
var boardUtils = require('./board');

describe('Test Game', function() {
    beforeEach(function() {
        this.size = 5;
        this.game = gameUtils.createGame(this.size);
        this.asArray = boardUtils.treeToArray(this.game);
    });

    describe('Create random Game', function() {
        it('creates a board of size 2^{size}', function() {
            expect(this.asArray.length).to.equal(Math.pow(2,this.size));
            expect(this.asArray[0].length).to.equal(Math.pow(2,this.size));
        });

        it('randomises a game with live cells', function() {
            var liveCells = 0;
            this.asArray.forEach(row => {
                row.forEach(cell => liveCells += cell);
                expect(liveCells).to.be.above(0);
            });
        });
    });
});
