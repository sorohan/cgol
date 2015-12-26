
var gameUtils = require('./game');
var boardUtils = require('./board');

describe('Test Game', function() {
    beforeEach(function() {
        this.game = gameUtils.createGame(2);
    });

    it('Makes a new game', function() {
    });

    describe('Random Game', function() {
        it('Randomises a game', function(done) {
            console.log(boardUtils.renderTree(this.game));
            this.timeout(1000 * 10);

            setInterval(function() {
                this.game = boardUtils.expandNode(this.game);
                this.game = boardUtils.stepNode(this.game);
                console.log('===========');
                console.log(boardUtils.renderTree(this.game));
            }.bind(this), 1000);
        });
    });
});
