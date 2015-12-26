
// Each cell is an number from 0 to 256 which represents itself (at the center) and all it's
// neighbours in it's binary representation.

var FLAG_BR = 1;   // 000000001
var FLAG_BC = 2;   // 000000010
var FLAG_BL = 4;   // 000000100
var FLAG_CR = 8;   // 000001000
var FLAG_CC = 16;  // 000010000
var FLAG_CL = 32;  // 000100000
var FLAG_TR = 64;  // 001000000
var FLAG_TC = 128; // 010000000
var FLAG_TL = 256; // 100000000

//
// Eg: 110101010
//         ^
//         |
//   this is the cell
//
// So first we check if it's alive or dead
// by AND-ing it with FLAG_CC
//
// 000010000
//     ^
//     |
// And see if the number changes (only 1 & 1 won't change).
//
// 1 & 1 == 1
// 1 & 0 == 0
// 0 & 1 == 0
// 0 & 0 == 0
//
var cellStep = function(cell) {
    return (isLive(cell)) ? cellLiveStep(cell) : cellDeadStep(cell);
};

var cellLiveStep = function(cell) {
    var neighbours = neighbourLiveCount(cell);

    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    if (neighbours < 2) {
        return kill(cell);
    }
    // Any live cell with more than three live neighbours dies, as if by over-population.
    else if (neighbours > 3) {
        return kill(cell);
    }
    
    // Any live cell with two or three live neighbours lives on to the next generation.
    return cell;
};

var cellDeadStep = function(cell) {
    var neighbours = neighbourLiveCount(cell);
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    return (neighbours === 3) ? necromance(cell) : cell;
}

var kill = function(cell) {
    return (cell & 0b111101111);
};

var necromance = function(cell) {
    return (cell | FLAG_CC);
};

var neighbourLiveCount = function(cell) {
    return liveCount(kill(cell));
};

var liveCount = function(cell) {
    // see:
    // http://stackoverflow.com/questions/14555607/explanation-required-number-of-bits-set-in-a-number
    var c;
    cell = cell - ((cell >> 1) & 0x55555555); // reuse input as temporary
    cell = (cell & 0x33333333) + ((cell >> 2) & 0x33333333); // temp
    c = ((cell + (cell >> 4) & 0xF0F0F0F) * 0x1010101) >> 24; // count
    return c;
};

var isLive = function(cell) {
    return FLAG_CC === (cell & FLAG_CC);
};

var cellValue = function(cell) {
    return isLive(cell) ? 0b1 : 0b0;
};

module.exports = {
    cellStep,
    isLive,
    liveCount,
    neighbourLiveCount,
    cellValue
};


//
// 100|000|000|000
// 011|000|000|000
// 010|000|000|000
// ---------------
// 000|000|000|000
// 000|000|000|000
// 000|000|000|000
// ---------------
// 000|000|000|000
// 000|000|000|000
// 000|000|000|000
