
/**
 * Game of Life controller.
 */
CGOL = function()
{
    this.blocks = {};
    this.transitionPatterns = {};
    this.transitionPatternKeys = [];
};

CGOL.prototype = {
    /**
     * The blocks are 4x4 (16 bits) in size, and identified by the x:y position on the board.
     */
    blocks : null,
    transitionPatterns : null,
    transitionPatternKeys : null,
    currentStep : 0,

    blockWidth : 1,
    blockHeight : 1,

    /**
     * Reset the board to it's starting state.
     */
    reset : function()
    {
        this.blocks = {};
        this.currentStep = 0;
    },
    
    /**
     * Return the block key for given cell at x,y.
     */
    getCellBlockKey : function(x, y)
    {
        return Math.floor(x/this.blockWidth)+':'+Math.floor(y/this.blockHeight);
    },

    /**
     * Return the block that contains the given cells at x,y.
     */
    getCellBlock : function(x,y)
    {
        // Normalise x,y to block's key.
        var blockKey = this.getCellBlockKey(x, y);

        if (undefined===this.blocks[blockKey]) {
            this.initBlock(blockKey);
        }
        return this.blocks[blockKey];
    },

    /**
     * Initialise the block at the given key.
     */
    initBlock : function(blockKey)
    {
        // Not yet set up, so create it.
        this.blocks[blockKey] = new CGOL.Block(
            this.blockWidth,
            this.blockHeight
        );
        this.blocks[blockKey].currentStep = (this.currentStep);
        // Set up neighbour relationship.
//        this.setBlockNeighbours(blockKey, this.blocks[blockKey]);
    },

    activateNeighbours : function(blockKey, block)
    {
        this.setBlockNeighbours(blockKey, block, true);
    },

    /**
     * Set the relationship between neighbouring blocks.
     */
    setBlockNeighbours : function(blockKey, block, activate)
    {
        var blockXY, x, y, i, j, neighbourX, neighbourY;
        // Get the x,y of the block as ints.
        blockXY = blockKey.split(':');
        x = parseInt(blockXY[0], 10);
        y = parseInt(blockXY[1], 10);

        // For each neighbour (loop 8 neighbours).
        for (i=x-1; i<=x+1; i++) {
            for (j=y-1; j<=y+1; j++) {
                // Neighbours are identified by their +/- 0/1 offset from the given block.
                if (i!=0 || j!=0) {
                    // Set neighbour's XY on the board, relative to this block.
                    neighbourX = i-x;
                    neighbourY = j-y;
                    neighbourBlockKey = i + ':' + j;
                    if (activate && 'undefined' === typeof this.blocks[neighbourBlockKey]) {
                        // Create a blank neighbour.
                        this.initBlock(neighbourBlockKey);
                    }
                    // If the neighbour exists.
                    if ('undefined' !== typeof this.blocks[neighbourBlockKey]) {
                        // Set up the neighbourly relationship between blocks.
                        block.setNeighbour(neighbourX, neighbourY, this.blocks[neighbourBlockKey]);
                        // Set as reciprical neighbour.
                        this.blocks[neighbourBlockKey].setNeighbour(-1*(neighbourX), -1*(neighbourY), block);
                    }
                    else {
                        // Set the empty neighbour.
                        block.setNeighbour(i-x, j-y, null);
                    }
                }
            }
        }
    },

    /**
     * Step the game 1 step.
     */
    step : function()
    {
        var k,cells,tmp;

        this.gc();

        // Progress.
        this.currentStep++;

        // Step each block.
        for (k in this.blocks) {
            // Get neighbours values for transition patterns.
            neighboursCells = this.blocks[k].getNeighboursCells(this.currentStep-1);

            // Check cache.
            cells = this.stepCache(this.blocks[k].cells, neighboursCells);

            tmp = this.blocks[k].cells;
            this.blocks[k].step(this.currentStep, cells);

            if (tmp==0 && this.blocks[k].cells > 0) {
                // block switched on, tell the neighbours
                this.activateNeighbours(k, this.blocks[k]);
            }

            // Store in cache.
            if (typeof cells !== 'undefined') {
                transitionKey = tmp + '-' + neighboursCells;
                this.transitionPatterns[transitionKey] = this.blocks[k].cells;
            }
        }
    },

    stepCache : function(cells, neighboursCells)
    {
        var transitionKey = cells + '-' + neighboursCells;
        if (undefined != this.transitionPatterns[transitionKey]) {
            return this.transitionPatterns[transitionKey];
        }
        return false;
    },

    /**
     * Add newly generated blocks.
     */
    addNewBlocks : function(blockKey, newBlocks)
    {
        var i, blockXY, blockX, blockY, neighbourXY, neighbourX, neighbourY, newBlockKey;
        
        // Get x/y of existing block.
        blockXY = blockKey.split(':');
        blockX = parseInt(blockXY[0], 10);
        blockY = parseInt(blockXY[1], 10);

        if (newBlocks) {
            // The step generated some new blocks, so add them to the board.
            for(i in newBlocks) {
                if (newBlocks.hasOwnProperty(i)) {
                    // Only add blocks that have live cells.
                    if (newBlocks[i].cells > 0) {
                        neighbourXY = i.split(':');
                        neighbourX = blockX + parseInt(neighbourXY[0], 10);
                        neighbourY = blockY + parseInt(neighbourXY[1], 10);
                        newBlockKey = neighbourX + ':' + neighbourY;
                        this.blocks[newBlockKey] = newBlocks[i];
                        // Set up relationships the rest of the board.
                        this.setBlockNeighbours(newBlockKey, this.blocks[newBlockKey]);
                    }
                }
            }
        }
    },

    /**
     * Switch on the cell & x,y.
     */
    switchOnCell : function(x,y)
    {
        this.setCell(x,y,1);
    },

    /**
     * Switch off the cell & x,y.
     */
    switchOffCell : function(x,y)
    {
        this.setCell(x,y,0);
    },

    /**
     * Set the cells at x,y to val
     */
    setCell : function(x, y, val)
    {
        var blockKey = this.getCellBlockKey(x, y),
            block = this.getCellBlock(x, y);
        block.setCell([x, y], val);
        if (1==val) {
            // Cell turned on, make sure the neighbours are awake.
            this.activateNeighbours(blockKey, block);
        }
    },

    /**
     * Switch on the neighbours of x & y (for testing purposes).
     */
    highlightNeighbours : function(x, y)
    {
        this.addNewBlocks(this.getCellBlockKey(x,y), 
                this.getCellBlock(x, y).highlightNeighbours([x, y]));
    },

    gc : function()
    {
        for (k in this.blocks) {
            if (this.blocks.hasOwnProperty(k)) {
                if (this.blocks[k].cells==0) {
                    hasNeighbourWithCell = false;
                    for (i in this.blocks[k].neighbours) {
                        if (this.blocks[k].neighbours.hasOwnProperty(i)) {
                            if (this.blocks[k].neighbours[i].cells != 0) {
                                hasNeighbourWithCell = true;
                                break;
                            }
                        }
                    }
                    if (!hasNeighbourWithCell) {
                        this.destroyBlock(k);
                    }
                }
            }
        }
    },

    destroyBlock : function(blockKey)
    {
        var block = this.blocks[blockKey],
            blockXY,
            x, y, i, j, 
            neighbourX, neighbourY, neighbourBlockKey, mykey;

        // delete from neighbours
        blockXY = blockKey.split(':');
        x = parseInt(blockXY[0], 10);
        y = parseInt(blockXY[1], 10);

        // For each neighbour (loop 8 neighbours).
        for (i=x-1; i<=x+1; i++) {
            for (j=y-1; j<=y+1; j++) {
                // Neighbours are identified by their +/- 0/1 offset from the given block.
                if (i!=0 || j!=0) {
                    neighbourX = i-x;
                    neighbourY = j-y;
                    neighbourBlockKey = i + ':' + j;
                    if (this.blocks[neighbourBlockKey]) {
                        mykey = (-1*neighbourX) + ':' + (-1*neighbourY);
                        delete this.blocks[neighbourBlockKey].neighbours[mykey];
                    }
                }
            }
        }
        delete this.blocks[blockKey];
    }
};

CGOL.Block = function(width, height) {
    this.width  = width;
    this.height = height;
    this.cells = 0;
    this.neighbours = {};
    this.history = {};
    this.historyStart = 0;
};

CGOL.Block.prototype = {
    width : null,
    height : null,
    cells : null,
    neighbours : null,
    currentStep : 0, // current step of the board.
    history : null,
    historyStart : 0,

    /**
     * Step through this block, step is the Nth step through the GOL.
     */
    step : function(stepTo, cells)
    {
        var i, size;

        // Store in history.
        this.history[this.currentStep] = this.cells;

        // Progress.
        this.currentStep++;

        if (typeof cells === 'undefined' || false === cells) {

            size = (this.width * this.height);

            // Loop & step.
            for (i=0; i<size; i++) {
                this.stepCell(i, this.currentStep);
            }

        }
        else {
            this.cells = cells;
        }

        this.gc();
    },


    getNeighboursCells : function(step)
    {
        var neighbourCells = '', neighbour;
        for (y=-1; y<=1; y++) {
            for (x=-1; x<=1; x++) {
                // Skip me.
                if (x===0 && y===0) {
                    continue;
                }
                neighbour = this.getNeighbour(x, y);
                neighbourCells += (neighbour) ? neighbour.getCellsValue(step) : 0;
                if (x !==1 || y!==1) {
                    neighbourCells += ',';
                }
            }
        }
        return neighbourCells;
    },

    /**
     * Step the given cell with it's neighbours (implement GOL rules here).
     */
    stepCell : function(n, stepTo)
    {
        var step = (stepTo-1),
            cellValue = this.getCellValue(n, step),
            cellNeighboursSum = this.getCellNeighboursSum(n, step);

        if (cellValue==1) {
            // Rule 1: Any live cell with fewer than two live neighbours dies, as if caused by under-population.
            if (cellNeighboursSum < 2) {
                this.setCell(n, 0);
            }
            // Rule 2: Any live cell with two or three live neighbours lives on to the next generation.
            // Rule 3: Any live cell with more than three live neighbours dies, as if by overcrowding.
            else if (cellNeighboursSum > 3) {
                this.setCell(n, 0);
            }
        }
        else {
            // Rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            if (3==cellNeighboursSum) {
                this.setCell(n, 1);
            }
        }
    },

    /**
     * Get the nth bit of this cell.
     */
    getCellValue : function(n, step)
    {
        if ('undefined' === typeof step) {
            step = this.currentStep;
        }
        n = this.normaliseBitPos(n);
        return this.getBitValue(
            this.getCellsString(step), n);
    },

    getBitShift : function(block, neighbourPos, shiftXY)
    {
        var xN = parseInt(neighbourPos[0],10),
            xY = parseInt(neighbourPos[1],10),
            x  = parseInt(shiftXY[0],10),
            y  = parseInt(shiftXY[1],10);
        if ((block===this) || (xN==0 && yN!=0 && (x!=0 || y!=0))) {
            mod = (this.width*y)+(x);
        }
        else {
            mod = ((-1*x) + y) * this.width + x
        }
        return mod;
    },

    getNeighbourBlock : function(n, shiftXY)
    {
        n = this.normaliseBitPos(n);

        var neighbourDir, xN, yN, neighbour;
        // Get neighbour direction.
        neighbourDir = this.getNeighbourDirection(n, shiftXY);
        xN = neighbourDir[0];
        yN = neighbourDir[1];

        // Check if it's neighbouring.
        if (xN != 0 || yN != 0) {
            // Has neighbour - get it.
            neighbour = this.getNeighbour(xN, yN);
            if (!neighbour) {
                return false;
            }
        }
        else {
            neighbour = this;
        }

        return { 
            neighbourKey : xN+':'+yN,
            block : neighbour,
        };
    },

    /**
     * Get the sum of neighbour values for the nth bit.
     */
    getCellNeighboursSum : function(n, step)
    {
        n = this.normaliseBitPos(n);

        var neighbours = 0,
            i,j,mod,bitPos,
            xN,
            yN,
            neighbourDir,
            neighbour;
        for (y=-1; y<=1; y++) {
            for (x=-1; x<=1; x++) {
                // Skip me.
                if (x===0 && y===0) {
                    continue;
                }

                modBlock = this.getNeighbourBlock(n, [x,y]);
                if (!modBlock) {
                    // Neighbour doesn't matter.
                    continue;
                }

                mod = this.getBitShift(modBlock.block, modBlock.neighbourKey.split(':'), [x,y]);

                // Do the mod.
                bitPos = (n+mod)%(this.width*this.height);
                if (bitPos < 0) {
                    bitPos += (this.width*this.height);
                }
                neighbours += modBlock.block.getCellValue(bitPos, step);
            }
        }
        return neighbours;
    },

    /*
     * Get the x,y direction of the neighbour to cell at index N, looking in the direction
     * of x,y given.
     */
    getNeighbourDirection : function(n, xy)
    {
        // Set x (left/right) neighbour key.
        var xN = yN = 0,
            x = xy[0],
            y = xy[1];
        if (x===-1 && n%this.width===0) {
            xN = -1; // left neighbours
        }
        else if (x===1 && (n%this.width===(this.width-1))) {
            xN = 1;
        }
        // Set y (top/bottom) neighbour key.
        if (y===-1 && n<this.width) {
            yN = -1; // top neighbours
        }
        else if (y===1 && (n >= (this.width*(this.height-1)))) {
            yN = 1;
        }

        return [ xN, yN ];
    },

    getNeighbour : function(x, y)
    {
        return this.neighbours[x+':'+y];
    },
        
    /**
     * Return the bit value for cells at n.
     */
    getBitValue : function(cells, n)
    {
        return parseInt(cells.charAt(n), 2);
    },

    /**
     * Get the cells as a string of 1s and 0s.
     */
    getCellsString : function(step)
    {
        var cells = this.getCellsValue(step);
        return this.padBinary(cells.toString(2));
    },

    getCellsValue : function(step)
    {
        var cells = (('undefined'===typeof step) || step===this.currentStep) ? this.cells : this.history[step];
        if ('undefined' === typeof cells) {
            // Not current step, and not in history.
            throw 'cells at step not found';
        }
        return cells;
    },

    /**
     * Take the binary and left pad to this.size
     */
    padBinary : function(binary)
    {
        var i,
            size = (this.width * this.height);
            binString = binary.toString();
            binLength = binString.length;
            toPad = (size-binLength);

        for (i=0; i<toPad; i++) {
            binString = '0' + binString;
        }
        return binString;
    },


    setCell : function(n, val)
    {
        n = this.normaliseBitPos(n);

        var cells = this.getCellsString(this.currentStep);
        cells = cells.substring(0, n) + val + cells.substring(n+1);
        this.cells = parseInt(cells, 2);

    },

    normaliseBitPos : function(n)
    {
        // Normalise n from [x,y].
        if (isNaN(n)) {
            // Normalise x & y relative to width/height.
            n[0] = n[0] % this.width;
            n[1] = n[1] % this.height;

            // assume n is an array, convert to bit index.
            n = (this.width * n[1]) + n[0];
        }
        return n;
    },
    
    setNeighbour : function(x,y,neighbour)
    {
        this.neighbours[x+':'+y] = neighbour;
    },

    hasChanged : function()
    {
        return ('undefined' == typeof this.history[(this.currentStep-1)]) || 
                (this.cells != this.history[(this.currentStep-1)]);
    },

    gc : function()
    {
        var historyLength, i;
        historyLength = this.currentStep - this.historyStart;
        if (historyLength > 20) {
            for (i=0; i<10; i++) {
                delete this.history[i];
            }
            this.historyStart = i;
        }
    }
};

CGOL.View = {
    /**
     * Return a dom for the board.
     */
    render : function(board)
    {
        var xy,x,y,block,
            boardDom = document.createElement('div'),
            cellWidth=15,
            cellHeight=15,
            blockWidth=(cellWidth*board.blockWidth),
            blockHeight=(cellHeight*board.blockHeight),
            leftPos,
            topPos
            ;
        // Init board cache.
        if (!board.domCache) {
            board.domCache = { cached : [] };
        }
        for (var k in board.blocks) {
            if (board.blocks.hasOwnProperty(k)) {
                blockDom = this.renderBlock(board, board.blocks[k]);

                xy = k.split(':');
                x = parseInt(xy[0], 10);
                y = parseInt(xy[1], 10);
                leftPos = x*blockWidth;
                topPos = y*blockHeight;

                blockDom.style.position = 'absolute';
                blockDom.style.left = leftPos + 'px';
                blockDom.style.top = topPos + 'px';
                blockDom.style.width = (blockWidth) + 'px';
                blockDom.style.height = (blockHeight) + 'px';
//                blockDom.style.border = '1px solid blue';

                boardDom.appendChild(blockDom);
            }
        }
        return boardDom;
    },

    /**
     * Return a dom for the block.
     */
    renderBlock : function(board, block)
    {
        // Check if has changed.
        if (block.dom && !block.hasChanged()) {
            // Re-use dom from last step.
            return block.dom;
        }

        // Check render cache.
        if ('undefined' !== typeof board.domCache[block.cells]) {
            // Cached dom.
            block.dom = board.domCache[block.cells].cloneNode(true);
            return block.dom;
        }

        var blockDom = document.createElement('div'),
            x,y,
            cellWidth = Math.round(100/block.width),
            cellHeight = Math.round(100/block.height) 
            ;
        for (y=0; y<block.height; y++) {
            for (x=0; x<block.width; x++) {
                leftPos = (0===x) ? 0 : Math.round(x/block.width*100);
                topPos = (0===y) ? 0 : Math.round(y/block.height*100);
                cellDom = this.renderCell(block.getCellValue([x,y]));
                cellDom.innerHTML = (block.width * y) + x;

                cellDom.style.position = 'absolute';
                cellDom.style.left = leftPos + '%';
                cellDom.style.top = topPos + '%';
                cellDom.style.width = cellWidth + '%';
                cellDom.style.height = cellHeight + '%';

                blockDom.appendChild(cellDom);
            }
        }

        // Cache render.
        this.gc(board);
        block.dom = blockDom;
        board.domCache[block.cells] = blockDom.cloneNode(true);
        board.domCache.cached.push(block.cells);

        return blockDom;
    },

    /**
     * Return a dom for the cell.
     */
    renderCell : function(cell)
    {
        var cellDom = document.createElement('div');
        if (1==cell) {
            cellDom.style.backgroundColor = 'red';
        }
        cellDom.innerHTML = '&nbsp;';
        return cellDom;
    },

    gc : function(board)
    {
        var killFrom, killNum, kill, i;
//        console.log(board.domCache.cached.length);
        if (board.domCache.cached.length > 100) {
            killFrom = Math.round(board.domCache.cached.length/2);
            killNum  = board.domCache.cached.length-killFrom;
            kill = board.domCache.cached.splice(killFrom, killNum);
            for (i=0; i<kill.length; i++) {
                if (board.domCache.cached[i] != 0) {
//                    console.log('gc: ' + board.domCache.cached[i]);
                    delete board.domCache[board.domCache.cached[i]];
                }
            }
        }
    }
};
