
var boardUtils = require('./board');

var createGame = function(n) {
    n = n || 2;
    return boardUtils.arrayToTree(randomArray(n));
};

var randomArray = function(n) {
    var size = Math.pow(2, n);

    var board = [
    ];

    for (var i=0; i<size; i++) {
        board.push(randomLine(size));
    }

    return board;
};

var randomLine = function(size) {
    var line = [];

    for (var i=0; i<size; i++) {
        line.push(Math.round(Math.random()));
    }

    return line;
};

module.exports = {
    createGame
};
