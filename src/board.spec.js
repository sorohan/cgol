
var chai = require('chai');
var expect = chai.expect;
var boardUtils = require('./board');
var mock = require('./mocks');

describe('Utils', function() {
    describe('Conversions', function() {
        describe('Given a 4 x 4 board', function() {
            it('converts a tree to an array', function() {
                var arr = boardUtils.treeToArray(mock.boardTreeLoaf);
                expect(arr).to.deep.equal(mock.boardArrLoaf);

                arr = boardUtils.treeToArray(mock.boardTreeBlink1);
                expect(arr).to.deep.equal(mock.boardArrBlink1);

                arr = boardUtils.treeToArray(mock.boardTreeBlink2);
                expect(arr).to.deep.equal(mock.boardArrBlink2);
            });

            it('converts an array to a tree', function() {
                var tree = boardUtils.arrayToTree(mock.boardArrLoaf);
                expect(tree).to.deep.equal(mock.boardTreeLoaf);
            });
        });

        describe('Given a 8 x 8 board', function() {
            it('converts a tree to an array', function() {
                var arr = boardUtils.treeToArray(mock.boardTreeLoafBig);
                expect(arr).to.deep.equal(mock.boardArrLoafBig);
            });

            it('converts an array to a tree', function() {
                var tree = boardUtils.arrayToTree(mock.boardArrLoafBig);
                expect(tree).to.deep.equal(mock.boardTreeLoafBig);
            });
        });
    });

    describe('Splitting', function() {
        describe('Given a 8 x 8 board', function() {
            it('splits it into 9: 2 x 2 nodes', function() {
                var subnodes = boardUtils.centeredSubnodes(mock.boardTreeLoafBig);
                expect(subnodes).to.deep.equal(mock.boardTreeLoafBigCenteredNodes);
            });

            it('converts an array to a tree', function() {
                var tree = boardUtils.arrayToTree(mock.boardArrLoafBig);
                expect(tree).to.deep.equal(mock.boardTreeLoafBig);
            });
        });
        
    });
});

describe('A Game Board', function() {
    describe('Given a 4 x 4 board', function() {
        it('Steps a loaf node forward', function() {
            var result = boardUtils.stepNode(mock.boardTreeLoaf);
            expect(result).to.deep.equal({nw: 0, ne: 1, se:0, sw:0, level: 1});
        });

        it('Steps a blinking node forward', function() {
            var result = boardUtils.stepNode(mock.boardTreeBlink1);
            expect(result).to.deep.equal({nw: 0, ne: 1, se:1, sw:0, level: 1});

            result = boardUtils.stepNode(mock.boardTreeBlink2);
            expect(result).to.deep.equal({nw: 1, ne: 1, se:0, sw:0, level: 1});
        });
    });

    describe('Given a 8 x 8 board', function() {
        it('Steps a loaf node forward', function() {
            var result = boardUtils.stepNode(mock.boardTreeLoafBig);
            expect(result).to.deep.equal(mock.boardTreeLoaf);
        });

        xit('Steps a blinking node forward', function() {
            var result = boardUtils.stepNode(mock.boardTreeBlink1);
            expect(result).to.deep.equal({nw: 0, ne: 1, se:1, sw:0, level: 1});

            result = boardUtils.stepNode(mock.boardTreeBlink2);
            expect(result).to.deep.equal({nw: 1, ne: 1, se:0, sw:0, level: 1});
        });
    });
});

