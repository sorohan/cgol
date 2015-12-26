
// stable board.
var boardArrLoaf = [
    [ 0, 1, 0, 0 ],
    [ 1, 0, 1, 0 ],
    [ 1, 0, 0, 1 ],
    [ 0, 1, 1, 0 ]
];

// size: 2^3
// result: 2^2
// subnodes: 2^1 
var boardArrLoafBig = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ]
];

// blinking board
var boardArrBlink1 = [
    [ 0, 0, 1, 0 ],
    [ 0, 0, 1, 0 ],
    [ 0, 0, 1, 0 ],
    [ 0, 0, 0, 0 ]
];

var boardArrBlink2 = [
    [ 0, 0, 0, 0 ],
    [ 0, 1, 1, 1 ],
    [ 0, 0, 0, 0 ],
    [ 0, 0, 0, 0 ]
];

var boardArrBlink1Big = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ]
];

// nw ne
// sw se

var boardTreeLoaf = {
    nw: { nw:0, ne:1, se:0, sw:1, level: 1 },
    ne: { nw:0, ne:0, se:0, sw:1, level: 1 },
    se: { nw:0, ne:1, se:0, sw:1, level: 1 },
    sw: { nw:1, ne:0, se:1, sw:0, level: 1 },
    level: 2
};

var boardTreeLoafBig = { nw:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 1, se: 0, sw: 1, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  ne:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 1, level: 1 },
     level: 2 },
  se:
   { nw: { nw: 0, ne: 1, se: 0, sw: 1, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  sw:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 1, ne: 0, se: 1, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  level: 3
};

var boardTreeLoafBigCenteredNodes = {
    tl: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
    tc: { nw: 0, ne: 0, se: 0, sw: 1, level: 1 },
    tr: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
    cl: { nw: 0, ne: 1, se: 1, sw: 0, level: 1 },
    cc: { nw: 0, ne: 1, se: 0, sw: 0, level: 1 },
    cr: { nw: 0, ne: 0, se: 0, sw: 1, level: 1 },
    bl: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
    bc: { nw: 1, ne: 1, se: 0, sw: 0, level: 1 },
    br: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 }
};

var boardTreeBlink1 = {
    nw: { nw:0, ne:0, se:0, sw:0, level: 1 },
    ne: { nw:1, ne:0, se:0, sw:1, level: 1 },
    se: { nw:1, ne:0, se:0, sw:0, level: 1 },
    sw: { nw:0, ne:0, se:0, sw:0, level: 1 },
    level: 2
};

var boardTreeBlink2 = {
    nw: { nw:0, ne:0, se:1, sw:0, level: 1 },
    ne: { nw:0, ne:0, se:1, sw:1, level: 1 },
    se: { nw:0, ne:0, se:0, sw:0, level: 1 },
    sw: { nw:0, ne:0, se:0, sw:0, level: 1 },
    level: 2
};

var boardTreeBlink1Big = { nw:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  ne:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 1, ne: 0, se: 0, sw: 1, level: 1 },
     level: 2 },
  se:
   { nw: { nw: 1, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  sw:
   { nw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     ne: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     se: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     sw: { nw: 0, ne: 0, se: 0, sw: 0, level: 1 },
     level: 2 },
  level: 3
};

// var boardTreeBitsLoaf = 0b0100101010010110;

module.exports = {
    boardArrLoaf,
    boardArrLoafBig,
    boardArrBlink1,
    boardArrBlink1Big,
    boardArrBlink2,
    boardTreeLoaf,
    boardTreeLoafBig,
    boardTreeLoafBigCenteredNodes,
    boardTreeBlink1,
    boardTreeBlink1Big,
    boardTreeBlink2
};
