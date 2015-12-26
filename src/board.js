
var _ = require('lodash');
var cellUtils = require('./cell');
var cellValue = cellUtils.cellValue;
var cellStep = cellUtils.cellStep;

var stepNode = function(node) {
    var nw, ne, se, sw, level;

    /*
    var boardArrLoaf = [
        [ 0, 1, 0, 0 ],
        [ 1, 0, 1, 0 ],
        [ 1, 0, 0, 1 ],
        [ 0, 1, 1, 0 ]
    ];

    var boardArrLoaf = [
        [ nw.nw, nw.ne, ne.nw, ne.ne ],
        [ nw.sw, nw.se, ne.sw, ne.se ],
        [ sw.nw, sw.ne, se.nw, se.ne ],
        [ sw.sw, sw.se, se.sw, se.se ]
    ];
    */

    if (node.level == 2) {
        // Level 2 == (4 x 4), so step returns a (2 x 2) node, at level 1.
        var nwCell = parseInt('' + node.nw.nw + node.nw.ne + node.ne.nw + 
                                   node.nw.sw + node.nw.se + node.ne.sw +
                                   node.sw.nw + node.sw.ne + node.se.nw,
                              2);

        var neCell = parseInt('' + node.nw.ne + node.ne.nw + node.ne.ne +
                                   node.nw.se + node.ne.sw + node.ne.se +
                                   node.sw.ne + node.se.nw + node.se.ne,
                              2);

        var seCell = parseInt('' + node.nw.se + node.ne.sw + node.ne.se +
                                   node.sw.ne + node.se.nw + node.se.ne +
                                   node.sw.se + node.se.sw + node.se.se,
                              2);

        var swCell = parseInt('' + node.nw.sw + node.nw.se + node.ne.sw +
                                   node.sw.nw + node.sw.ne + node.se.nw +
                                   node.sw.sw + node.sw.se + node.se.sw,
                              2);

        return {
            level: 1,
            nw: cellValue(cellStep(nwCell)),
            ne: cellValue(cellStep(neCell)),
            se: cellValue(cellStep(seCell)),
            sw: cellValue(cellStep(swCell))
        };
    }
    else {
        var subnodes = centeredSubnodes(node);
        return {
            nw: stepNode({ nw:subnodes.tl, ne:subnodes.tc,
                           se:subnodes.cc, sw:subnodes.cl, level: 2 }),
            ne: stepNode({ nw:subnodes.tc, ne:subnodes.tr,
                           se:subnodes.cr, sw:subnodes.cc, level: 2 }),
            se: stepNode({ nw:subnodes.cc, ne:subnodes.cr,
                           se:subnodes.br, sw:subnodes.bc, level: 2 }),
            sw: stepNode({ nw:subnodes.cl, ne:subnodes.cc,
                           se:subnodes.bc, sw:subnodes.bl, level: 2 }),
            level: 2
        };
    }
};

var renderTree = function(board) {
    return renderArray(treeToArray(board));
};

/*
    var boardArrLoaf = [
        [ 0, 1, | 0, 0 ],
        [ 1, 0, | 1, 0 ],
        ---------------
        [ 1, 0, | 0, 1 ],
        [ 0, 1, | 1, 0 ]
    ];
*/

var arrayToTree = function(arr, level) {
    if (!arr) {
        return arr;
    }

    if (typeof arr.length === 'undefined') {
        return arr;
    }
    
    if (arr.length === 1) {
        return arr[0][0];
    }

    // Slice vertically.
    var north = arr.slice(0, Math.ceil(arr.length/2));
    var south = arr.slice(Math.ceil(arr.length/2));

    // Slice horizontally.
    var nw = north.map(line => line.slice(0, Math.ceil(line.length/2)));
    var ne = north.map(line => line.slice(Math.ceil(line.length/2)));
    var sw = south.map(line => line.slice(0, Math.ceil(line.length/2)));
    var se = south.map(line => line.slice(Math.ceil(line.length/2)));

    // Recurse.
    nw = arrayToTree(nw);
    ne = arrayToTree(ne);
    se = arrayToTree(se);
    sw = arrayToTree(sw);

    // Level is 1 higher than leaf.
    level = (nw.level) ? nw.level + 1 : 1;

    return { nw, ne, se, sw, level };
};

var treeToArray = function(tree) {
    if (tree.level == 1) {
        return [ [ tree.nw, tree.ne ], [ tree.sw, tree.se ] ];
    }
    else {
        var nw = treeToArray(tree.nw);
        var ne = treeToArray(tree.ne);
        var se = treeToArray(tree.se);
        var sw = treeToArray(tree.sw);

        // Merge arrays.
        var arr = [ ];
        nw.forEach(function(nwLine, index) {
            arr.push(nwLine.concat(ne[index]));
        });
        sw.forEach(function(swLine, index) {
            arr.push(swLine.concat(se[index]));
        });

        return arr;
    }
};

/*
var boardTreeObjLoaf = {
    nw: { nw:0, ne:1, se:0, sw:1, level: 1 },
    ne: { nw:0, ne:0, se:0, sw:1, level: 1 },
    se: { nw:0, ne:1, se:1, sw:0, level: 1 },
    sw: { nw:1, ne:0, se:0, sw:1, level: 1 },
    level: 2
};
*/

var renderArray = function(board) {
    return board.map(function(line) {
        return line.map(point => point ? ' x ' : ' _ ').join('')
    }).join('\n');
};

/*
var boardArrLoafBig = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
//          --result--   
    [ 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 1, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 1, 0, 0 ],
    [ 0, 0, 0, 1, 1, 0, 0, 0 ],
//          ----------
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ]
];
*/

var centeredSubnodes = function(board) {
    if (board.level <= 2) {
        throw new Error('Can only center nodes that are >2 deep');
    }

    return {
        tl: centeredSubnode(board.nw),
        tc: conteredHorizontalSubnode(board.nw, board.ne),
        tr: centeredSubnode(board.ne),
        cl: centeredVerticalSubnode(board.nw, board.sw),
        cc: centeredSubSubnode(board),
        cr: centeredVerticalSubnode(board.ne, board.se),
        bl: centeredSubnode(board.sw),
        bc: conteredHorizontalSubnode(board.sw, board.se),
        br: centeredSubnode(board.se)
    };
};

var centeredSubnode = function(node) {
    return {
        nw: node.nw.se,
        ne: node.ne.sw,
        se: node.se.nw,
        sw: node.sw.ne,
        level: node.level - 1
    };
};

var centeredSubSubnode = function(node) {
    return {
        nw: node.nw.se.se,
        ne: node.ne.sw.sw,
        se: node.se.nw.nw,
        sw: node.sw.ne.ne,
        level: node.level - 2
    };
};

var conteredHorizontalSubnode = function(west, east) {
    return {
        nw: west.ne.se,
        ne: east.nw.sw,
        se: east.sw.nw,
        sw: west.se.ne,
        level: west.level - 1
    };
};

var centeredVerticalSubnode = function(north, south) {
    return {
        nw: north.sw.se,
        ne: north.se.sw,
        se: south.ne.nw,
        sw: south.nw.ne,
        level: north.level - 1
    };
};

var newBorder = function(level) {
    if (level < 1) {
        throw new Error('Can\'t make a border less than 2 level');
    }
    else if (level == 1) {
        return { nw: 0, ne: 0, se: 0, sw: 0, level: level };
    }
    else {
        return {
            nw: newBorder(level-1),
            ne: newBorder(level-1),
            se: newBorder(level-1),
            sw: newBorder(level-1),
            level: level
        };
    }
};


//               _ _ _ _ _ _ _ _
// x x x x       _ _ _ _ _ _ _ _
// x x x x  -->  _ _ x x x x _ _
// x x x x       _ _ x x x x _ _
// x x x x       _ _ x x x x _ _
//               _ _ _ _ _ _ _ _
//               _ _ _ _ _ _ _ _
var expandNode = function(node) {
    var border = newBorder(node.level - 1);

    return {
        nw: {
            nw: border,
            ne: border,
            se: node.nw,
            sw: border,
            level: node.level
        },
        ne: {
            nw: border,
            ne: border,
            se: border,
            sw: node.ne,
            level: node.level
        },
        se: {
            nw: node.se,
            ne: border,
            se: border,
            sw: border,
            level: node.level
        },
        sw: {
            nw: border,
            ne: node.sw,
            se: border,
            sw: border,
            level: node.level
        },
        level: node.level + 1
    };
};

module.exports = {
    stepNode,
    renderTree,
    renderArray,
    treeToArray,
    arrayToTree,
    centeredSubnodes,
    expandNode
};
