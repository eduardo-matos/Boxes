export const Player = {
    BLUE: 1,
    RED: 2,
};


export default class Boxes {
    /**
     * @param {number} boardSize
     */
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.board = new Array(2 * ((this.boardSize * this.boardSize) + this.boardSize));
        this.currentPlayer = Player.BLUE;
        this.score = { [Player.BLUE]: 0, [Player.RED]: 0 };
        this.scoredPositions = { [Player.BLUE]: [], [Player.RED]: [] };

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
    getBoard() {
        return this.board;
    }

    /**
     * Make a move for current player in the given position.
     * @param {number} position
     */
    play(position) {
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
    computeScore(position, player) {
        this.scoresPerPosition[position].forEach(positions => {
            const hasScored = !positions.filter(val => this.board[val] === undefined).length;
            if (hasScored) {
                let scoredPositions = positions.slice();
                scoredPositions.push(position);
                scoredPositions = scoredPositions.sort((a, b) => a - b);

                this.score[player] += 1;
                this.scoredPositions[player].push(scoredPositions);
            }
        });
    }

    /**
     * Retuns score for all players.
     * @returns {Object}
     */
    getScore() {
        return this.score;
    }

    /**
     * Retuns score positions for all players.
     * @returns {Object}
     */
    getScoredPositions() {
        return this.scoredPositions;
    }

    /**
     * Tells if game is finished (there is no move left).
     * @returns {boolean}
     */
    isFinished() {
        return this.board.filter(v => v).length === this.board.length;
    }

    /**
     * For each position, calculates all positions needed to be played in order to score.
     */
    _calculateScoreForEachPosition() {
        const scorePositions = this._calculateScorePositions();
        const scoresPerPosition = {};

        scorePositions.forEach(positions => {
            positions.forEach(position => {
                if (!(position in scoresPerPosition)) {
                    scoresPerPosition[position] = [];
                }

                const matchingPositions = positions.slice();
                matchingPositions.splice(matchingPositions.indexOf(position), 1);
                scoresPerPosition[position].push(matchingPositions);
            });
        });

        return scoresPerPosition;
    }

    /**
     * Calculates all possible foursome to score.
     */
    _calculateScorePositions() {
        const topPositions = this._calculateTopPositions();
        const scorePositions = [];

        topPositions.forEach(position => {
            scorePositions.push([
                position,
                position + this.boardSize,
                position + this.boardSize + 1,
                position + (2 * this.boardSize) + 1,
            ]);
        });

        return scorePositions;
    }

    /**
     * Calculate all top positions.
     * For a borad with size 3, the top positions are 0, 1, 2, 7, 8, 9, 10, 14, 15 and 16
     */
    _calculateTopPositions() {
        const topPositions = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                topPositions.push(j + (i * ((2 * this.boardSize) + 1)));
            }
        }

        return topPositions;
    }
}
