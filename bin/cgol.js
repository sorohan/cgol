#!/usr/bin/env node

var gameUtils = require('../src/game');
var boardUtils = require('../src/board');

var intervalSpeed = 100;
var size = 5; // board size = Math.pow(2,${size})

this.game = gameUtils.createGame(size);
var result = this.game;
var steps = 0;

console.log('\033[2J');
console.log(boardUtils.renderTree(result));

setInterval(function() {
    // step
    result = boardUtils.expandNode(result);
    result = boardUtils.stepNode(result);
    console.log('\033[2J');
    console.log(boardUtils.renderTree(result));

    // stats
    steps ++;
    speed = getSpeed(steps);
    console.log(' ============== ');
    console.log(` generation: ${steps}`);
    console.log(` speed: ${speed}  (generations / second)`);
    console.log(` interval speed: ${intervalSpeed}`);
    console.log(' ');
}.bind(this), intervalSpeed);

var start = new Date();
var getSpeed = function(steps) {
    var stepped = steps % 100;

    if (stepped === 0) {
        start = new Date();
        return;
    }

    var time = new Date().getTime() - start.getTime();
    var timeSeconds = time / 1000;

    return stepped / timeSeconds;
};
