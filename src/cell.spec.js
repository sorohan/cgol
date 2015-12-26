
var chai = require('chai');
var expect = chai.expect;
var cellUtils = require('./cell');

describe('A Cell', function() {

    describe('Cell Value', function() {
        it('gives the 1/0 value of a cell', function() {
            var cell = 0b101010101;
            expect(cellUtils.cellValue(cell)).to.equal(1);
            cell = 0b111010101;
            expect(cellUtils.cellValue(cell)).to.equal(1);
            cell = 0b101010000;
            expect(cellUtils.cellValue(cell)).to.equal(1);
            cell = 0b111100111;
            expect(cellUtils.cellValue(cell)).to.equal(0);
            cell = 0b111111111;
            expect(cellUtils.cellValue(cell)).to.equal(1);
            cell = 0b000000000;
            expect(cellUtils.cellValue(cell)).to.equal(0);
        });
    });

    describe('Is Live Check', function() {
        it('when cell is dead: returns false', function() {
            var cell = 0b10000110;
            expect(cellUtils.isLive(cell)).to.be.false;
        });

        it('when cell is alive: returns true', function() {
            var cell = 0b10010110;
            expect(cellUtils.isLive(cell)).to.be.true;
        });
    });

    describe('Neighbour Count', function() {
        it('counts all live cells', function() {
            var cell = 0b101010101;
            expect(cellUtils.liveCount(cell)).to.equal(5);
            cell = 0b111010101;
            expect(cellUtils.liveCount(cell)).to.equal(6);
            cell = 0b101010000;
            expect(cellUtils.liveCount(cell)).to.equal(3);
            cell = 0b111110111;
            expect(cellUtils.liveCount(cell)).to.equal(8);
            cell = 0b111111111;
            expect(cellUtils.liveCount(cell)).to.equal(9);
            cell = 0b000000000;
            expect(cellUtils.liveCount(cell)).to.equal(0);
        });

        it('counts only neighbouring live cells', function() {
            var cell = 0b101010101;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(4);
            cell = 0b111010101;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(5);
            cell = 0b101010000;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(2);
            cell = 0b111110111;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(7);
            cell = 0b111100111;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(7);
            cell = 0b111111111;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(8);
            cell = 0b000000000;
            expect(cellUtils.neighbourLiveCount(cell)).to.equal(0);
        });
    });

    describe('Cell Step', function() {
        describe('Given a live cell', function() {
            it('when fewer than two live neighbours: cell dies', function() {
                var cell = 0b00010100;
                expect(cellUtils.cellStep(cell)).to.equal(0b00000100);
            });

            it('when more than three live neighbours: cell dies', function() {
                var cell = 0b00011111;
                expect(cellUtils.cellStep(cell)).to.equal(0b00001111);
            });

            it('when two or three live neighbours: cell lives on', function() {
                var cell = 0b00010111;
                expect(cellUtils.cellStep(cell)).to.equal(0b00010111);
            });
        });

        describe('Given a dead cell', function() {
            it('when exactly three live neighbours: becomes a live cell', function() {
                var cell = 0b111000000;
                expect(cellUtils.cellStep(cell)).to.equal(0b111010000);
            });

            it('when more than three neighbour: stays dead', function() {
                var cell = 0b111000001;
                expect(cellUtils.cellStep(cell)).to.equal(0b111000001);
            });

            it('when less than three neighbours: stays dead', function() {
                var cell = 0b011000000;
                expect(cellUtils.cellStep(cell)).to.equal(0b011000000);
            });
        });
    });
});
