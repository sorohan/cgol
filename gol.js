
CGOL = function()
{
    this.blocks = {};
};

CGOL.prototype = {
    /**
     * The blocks are 4x4 (16 bits) in size, and identified by the x:y position on the board.
     */
    blocks : null,
    blockWidth : 4,
    blockHeight : 4,
    nextStep : 0,

    reset : function()
    {
        this.blocks = {};
    },
    
    /**
     * Return the block key for given cells at x,y
     */
    getBlockKey : function(x, y)
    {
        return Math.floor(x/this.blockWidth)+':'+Math.floor(y/this.blockHeight);
    },

    /**
     * Return the block that contains the given cells at x,y.
     */
    getBlock : function(x,y)
    {
        // Normalise x,y to block's key.
        var blockKey = this.getBlockKey(x, y);
        if (undefined===this.blocks[blockKey]) {
            // Not yet set up, so create it.
            this.blocks[blockKey] = new CGOL.Block(
                this.blockWidth,
                this.blockHeight
            );
            // Set up neighbour relationship.
            this.setBlockNeighbours(blockKey, this.blocks[blockKey]);
        }
        return this.blocks[blockKey];
    },

    /**
     * Set the relationship between neighbouring blocks.
     */
    setBlockNeighbours : function(blockKey, block)
    {
        var blockXY, x, y, i, j, neighbourX, neighbourY;
        // Get the x,y of the block as ints.
        blockXY = blockKey.split(':');
        x = parseInt(blockXY[0], 10);
        y = parseInt(blockXY[1], 10);
        for (i=x-1; i<=x+1; i++) {
            for (j=y-1; j<=y+1; j++) {
                // Neighbours are identified by their +/- 0/1 offset from the given block.
                neighbourX = i-x;
                neighbourY = j-y;
                if (neighbourX!=0 || neighbourY!=0) {
                    // 0,0 is no neighbour (it's $block), so skip that.
                    neighbourBlockKey = i + ':' + j;
                    // If the neighbour exists.
                    if ('undefined' !== typeof this.blocks[neighbourBlockKey]) {
                        // Set up the neighbourly relationship between blocks.
                        this.blocks[blockKey].setNeighbour(neighbourX, neighbourY, this.blocks[neighbourBlockKey]);
                        // Set as reciprical neighbour.
                        this.blocks[neighbourBlockKey].setNeighbour(-1*(neighbourX), -1*(neighbourY), this.blocks[blockKey]);
                    }
                    else {
                        // Set the empty neighbour.
                        this.blocks[blockKey].setNeighbour(i-x, j-y, null);
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
        var k;
        // Step each block.
        for (var k in this.blocks) {
            newBlocks = this.blocks[k].step();
            this.addNewBlocks(k, newBlocks);
        }
        this.nextStep++;
    },

    addNewBlocks : function(relativeBlockKey, newBlocks)
    {
        var newBlocks, i, blockXY, blockX, blockY, neighbourXY, neighbourX, neighbourY, newBlockKey;
        blockXY = relativeBlockKey.split(':');
        blockX = parseInt(blockXY[0], 10);
        blockY = parseInt(blockXY[1], 10);

        if (newBlocks) {
            // The step generated some new blocks, so add them to the board.
            for(i in newBlocks) {
                if (newBlocks.hasOwnProperty(i)) {
                    neighbourXY = i.split(':');
                    neighbourX = blockX + parseInt(neighbourXY[0], 10);
                    neighbourY = blockY + parseInt(neighbourXY[1], 10);
                    newBlockKey = neighbourX + ':' + neighbourY;
                    this.blocks[newBlockKey] = newBlocks[i];
                    // Set up relationships with board.
                    this.setBlockNeighbours(newBlockKey, this.blocks[newBlockKey]);
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
        this.getBlock(x, y).setCell(x, y, val);
    },

    /**
     * Switch on the neighbours of x & y.
     */
    highlightNeighbours : function(x, y)
    {
        var newBlocks = this.getBlock(x, y).highlightNeighbours([x, y]);
        this.addNewBlocks(this.getBlockKey(x,y), newBlocks);
    }
};

CGOL.Block = function(width, height) {
    this.width  = width;
    this.height = height;
    this.cells = 0;
    this.neighbours = {};
    this.history = [];
};

CGOL.Block.prototype = {
    width : null,
    height : null,
    cells : null,
    neighbours : null,
    nextStep : 0, // next step to compute.
    history : null,

    /**
     * Step through this block, step is the Nth step through the GOL.
     */
    step : function()
    {
        var i,
            size = (this.width * this.height),
            cell;

        // Loop & step.
        for (i=0; i<size; i++) {
            this.stepCell(i); // step cell at index i.
        }

        // Progress.
        this.nextStep++;
    },

    /**
     * Get the nth bit of this cell, and it's 8 neighbouring cells at step.
     */
    getCell : function(n, step)
    {
        return [this.getCellValue(n, step)].splice(1, 0, this.getCellNeighboursSum(n, step));
    },

    /**
     * Get the nth bit of this cell.
     */
    getCellValue : function(n, step)
    {
        if ('undefined' === typeof step) {
            step = this.nextStep;
        }
        n = this.normaliseBitPos(n);
        return this.getBitValue(
            this.getCellsString(step), n);
    },

    highlightNeighbours : function(n)
    {
        n = this.normaliseBitPos(n);

        var neighbours = 0,
            i,j,mod,bitPos,
            xN,
            yN,
            neighbourDir,
            neighbour,
            newNeighbours={},
            modBlock;
        for (y=-1; y<=1; y++) {
            for (x=-1; x<=1; x++) {
                // Skip me.
                if (x===0 && y===0) {
                    continue;
                }

                modBlock = this.getNeighbourBlock(n, [x,y]);

                if (modBlock.block!==this) {
                    // Will need to save this neighbour.
                    newNeighbours[modBlock.neighbourKey] = modBlock.block;
                }

                mod = this.getBitShift(modBlock.block, modBlock.neighbourKey.split(':'), [x,y]);

                // Do the mod.
                bitPos = (n+mod)%(this.width*this.height);
                if (bitPos < 0) {
                    bitPos += (this.width*this.height);
                }
                modBlock.block.setCell(bitPos, 1);
            }
        }

        return newNeighbours;
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
                // No neighbour, make a new one.
                neighbour = new CGOL.Block(
                    this.width,
                    this.height
                );
                neighbour.setNeighbour(x, y, this);
                // Save neighbour.
                this.setNeighbour(xN, yN, neighbour);
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
                // Get neighbour direction.
                neighbourDir = this.getNeighbourDirection(n, [x,y]);
                xN = neighbourDir[0];
                yN = neighbourDir[1];

                if (xN != 0 || yN != 0) {
                    // Has neighbour.
                    neighbour = this.getNeighbour(xN, yN);
                    if (neighbour) {
                        mod = ((-1*x) + y) * this.width + x
                        bitPos = (n+mod)%(this.width*this.height);
                        if (bitPos < 0) {
                            bitPos += (this.width*this.height);
                        }
                        neighbours += neighbour.getCellValue(bitPos, step);
                    }
                }
                else {
                    // Easy - all neighbours are on this block.
                    mod = (this.width*y)+(x);
                    bitPos = n+mod;
                    neighbours += this.getCellValue(bitPos, step);
                }
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
        var cells = (('undefined'===typeof step) || step===this.nextStep) ? this.cells : this.history[step];
        if ('undefined' === typeof cells) {
            // Not current step, and not in history.
            throw 'cells at step not found';
        }
        return this.padBinary(cells.toString(2));
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

    /**
     * Step the given cell with it's neighbours (implement GOL rules here).
     *
     * Cell is an array of it's value (0,1) and it's neighbours values (length==9).
     */
    stepCell : function(cell)
    {
        // console.log(cell);
    },

    setCell : function(n, val)
    {
        n = this.normaliseBitPos(n);

        var cells = this.getCellsString(this.nextStep);
        cells = cells.substring(0, n) + val + cells.substring(n+1);
        this.cells = parseInt(cells, 2);

        // Store the change in history.
        this.history[this.nextStep] = this.cells;
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
    }
};

CGOL.View = {
    /**
     * Return a dom for the board.
     */
    render : function(board)
    {
        var y,x,block,
            boardDom = document.createElement('div'),
            cellWidth=15,
            cellHeight=15,
            blockWidth=(cellWidth*board.blockWidth),
            blockHeight=(cellHeight*board.blockHeight),
            leftPos,
            topPos
            ;
        for (y=0; y<5; y++) {
            for (x=0; x<5; x++) {
                blockDom = this.renderBlock(board.getBlock(x*board.blockWidth,
                                                           y*board.blockHeight));
                leftPos = x*blockWidth;
                topPos = y*blockHeight;

                blockDom.style.position = 'absolute';
                blockDom.style.left = leftPos + 'px';
                blockDom.style.top = topPos + 'px';
                blockDom.style.width = (blockWidth-2) + 'px';
                blockDom.style.height = (blockHeight-2) + 'px';
                blockDom.style.border = '1px solid blue';

                boardDom.appendChild(blockDom);
            }
        }
        return boardDom;
    },

    /**
     * Return a dom for the block.
     */
    renderBlock : function(block)
    {
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
    }
};
