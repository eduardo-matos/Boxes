import { expect } from 'chai';
import Boxes, { Player } from '../src/boxes';


describe('Basics', () => {
    it('Starts a board with size N', () => {
        const expectations = {
            2: 12,
            3: 24,
            4: 40,
            5: 60,
            10: 220
        };

        Object.keys(expectations).forEach(k => {
            const boardSize = parseInt(k);
            const expectedPlays = expectations[k];

            let game = new Boxes(boardSize);
            expect(game.getBoard()).to.eql(Array(expectedPlays));
        })

    });

    it('Starts with blue player', () => {
        let game = new Boxes(2);
        game.play(1);

        let expected = Array(12);
        expected[1] = Player.BLUE;

        expect(game.getBoard()).to.eql(expected);
    });

    it('Alternates players', () => {
        let game = new Boxes(6);

        game.play(5);
        game.play(11);
        game.play(2);
        game.play(21);

        let expected = Array(84);
        expected[5] = Player.BLUE;
        expected[11] = Player.RED;
        expected[2] = Player.BLUE;
        expected[21] = Player.RED;

        expect(game.getBoard()).to.eql(expected);
    });

    it('Doesnt change position already played', () => {
        let game = new Boxes(2);
        game.play(0);
        game.play(0);

        let expected = Array(12);
        expected[0] = Player.BLUE;

        expect(game.getBoard()).to.eql(expected);
    });

    it('Doesnt alternate player if position has been played', () => {
        let game = new Boxes(2);
        game.play(0);
        game.play(0);
        game.play(1);

        let expected = Array(12);
        expected[0] = Player.BLUE;
        expected[1] = Player.RED;

        expect(game.getBoard()).to.eql(expected);
    });

    it('Does nothing if plays on nonexistent position', () => {
        let game = new Boxes(2);
        game.play(99);

        expect(game.getBoard()).to.eql(Array(12));
    });

    it('Tells when the game is finished', () => {
        let game = new Boxes(2);

        for(let i = 0, len = game.getBoard().length; i < len; i++) {
            game.play(i);
            const isLastMove = i === len - 1;
            expect(game.isFinished()).to.equal(isLastMove);
        }
    });

    it('Scores once for single close', () => {
        let game = new Boxes(2);

        game.play(0);
        game.play(2);
        game.play(3);
        game.play(5);
        expect(game.getScore()).to.eql({[Player.BLUE]: 0, [Player.RED]: 1});

        game.play(1);
        game.play(4);
        game.play(6);
        expect(game.getScore()).to.eql({[Player.BLUE]: 1, [Player.RED]: 1});
    });

    it('Scores twice for double close', () => {
        let game = new Boxes(2);

        game.play(0);
        game.play(2);
        game.play(3);
        game.play(7);
        game.play(8);
        game.play(10);
        expect(game.getScore()).to.eql({[Player.BLUE]: 0, [Player.RED]: 0});

        game.play(5);
        expect(game.getScore()).to.eql({[Player.BLUE]: 2, [Player.RED]: 0});
    });

    it('Gets scored positions', () => {
        let game = new Boxes(2);

        game.play(0);
        game.play(2);
        game.play(3);
        game.play(7);
        game.play(8);
        game.play(10);
        game.play(5);
        expect(game.getScoredPositions()).to.eql({
            [Player.BLUE]: [[0, 2, 3, 5], [5, 7, 8, 10]],
            [Player.RED]: []
        });
    });
});
