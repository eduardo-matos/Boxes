"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = exports.Player = {
    BLUE: 1,
    RED: 2
};

var Boxes = function () {
    /**
     * @param {number} boardSize
     */
    function Boxes(boardSize) {
        var _score, _scoredPositions;

        _classCallCheck(this, Boxes);

        this.boardSize = boardSize;
        this.board = new Array(2 * (this.boardSize * this.boardSize + this.boardSize));
        this.currentPlayer = Player.BLUE;
        this.score = (_score = {}, _defineProperty(_score, Player.BLUE, 0), _defineProperty(_score, Player.RED, 0), _score);
        this.scoredPositions = (_scoredPositions = {}, _defineProperty(_scoredPositions, Player.BLUE, []), _defineProperty(_scoredPositions, Player.RED, []), _scoredPositions);

        this.scoresPerPosition = this._calculateScoreForEachPosition();
    }

    /**
     * Returns game board.
     * If player has played for a given position, it'll have his value.
     *
     * Each position for a board with size 3
     *┌─00─┬─01─┬─02─┐
     *03   04   05   06
     *├─07─┼─08─┼─09─┤
     *10   11   12   13
     *├─14─┼─15─┼─16─┤
     *17   18   19   20
     *└─21─┴─22─┴─23─┘
     *
     * @returns {Array}
     */


    _createClass(Boxes, [{
        key: "getBoard",
        value: function getBoard() {
            return this.board;
        }

        /**
         * Make a move for current player in the given position.
         * @param {number} position
         */

    }, {
        key: "play",
        value: function play(position) {
            if (this.board[position] !== undefined) {
                return;
            }

            if (position >= this.board.length) {
                return;
            }

            this.board[position] = this.currentPlayer;
            this.computeScore(position, this.currentPlayer);
            this.currentPlayer = this.currentPlayer === Player.BLUE ? Player.RED : Player.BLUE;
        }

        /**
         * Compute score for the given player IF score can be made.
         * @param {number} position
         * @param {number} player
         */

    }, {
        key: "computeScore",
        value: function computeScore(position, player) {
            var _this = this;

            this.scoresPerPosition[position].forEach(function (positions) {
                var hasScored = !positions.filter(function (val) {
                    return _this.board[val] === undefined;
                }).length;
                if (hasScored) {
                    var scoredPositions = positions.slice();
                    scoredPositions.push(position);
                    scoredPositions = scoredPositions.sort(function (a, b) {
                        return a - b;
                    });

                    _this.score[player] += 1;
                    _this.scoredPositions[player].push(scoredPositions);
                }
            });
        }

        /**
         * Retuns score for all players.
         * @returns {Object}
         */

    }, {
        key: "getScore",
        value: function getScore() {
            return this.score;
        }

        /**
         * Retuns score positions for all players.
         * @returns {Object}
         */

    }, {
        key: "getScoredPositions",
        value: function getScoredPositions() {
            return this.scoredPositions;
        }

        /**
         * Tells if game is finished (there is no move left).
         * @returns {boolean}
         */

    }, {
        key: "isFinished",
        value: function isFinished() {
            return this.board.filter(function (v) {
                return v;
            }).length === this.board.length;
        }

        /**
         * For each position, calculates all positions needed to be played in order to score.
         */

    }, {
        key: "_calculateScoreForEachPosition",
        value: function _calculateScoreForEachPosition() {
            var scorePositions = this._calculateScorePositions();
            var scoresPerPosition = {};

            scorePositions.forEach(function (positions) {
                positions.forEach(function (position) {
                    if (!(position in scoresPerPosition)) {
                        scoresPerPosition[position] = [];
                    }

                    var matchingPositions = positions.slice();
                    matchingPositions.splice(matchingPositions.indexOf(position), 1);
                    scoresPerPosition[position].push(matchingPositions);
                });
            });

            return scoresPerPosition;
        }

        /**
         * Calculates all possible foursome to score.
         */

    }, {
        key: "_calculateScorePositions",
        value: function _calculateScorePositions() {
            var _this2 = this;

            var topPositions = this._calculateTopPositions();
            var scorePositions = [];

            topPositions.forEach(function (position) {
                scorePositions.push([position, position + _this2.boardSize, position + _this2.boardSize + 1, position + 2 * _this2.boardSize + 1]);
            });

            return scorePositions;
        }

        /**
         * Calculate all top positions.
         * For a borad with size 3, the top positions are 0, 1, 2, 7, 8, 9, 10, 14, 15 and 16
         */

    }, {
        key: "_calculateTopPositions",
        value: function _calculateTopPositions() {
            var topPositions = [];
            for (var i = 0; i < this.boardSize; i++) {
                for (var j = 0; j < this.boardSize; j++) {
                    topPositions.push(j + i * (2 * this.boardSize + 1));
                }
            }

            return topPositions;
        }
    }]);

    return Boxes;
}();

exports.default = Boxes;