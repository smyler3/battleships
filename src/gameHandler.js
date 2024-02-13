import { createComputerPlayer } from "./computerPlayer";
import { createDOMHandler } from "./domHandler";
import { createGameboard } from "./gameboard";
import { createHumanPlayer } from "./humanPlayer";

const createGameHandler = () => {
    /* istanbul ignore next */
    const domHandler = createDOMHandler();

    const player1 = createHumanPlayer();
    const player1Board = createGameboard();

    const player2 = createComputerPlayer();
    const player2Board = createGameboard();

    // Place ships player 1
    player1Board.placeShip([
        [0, 0],
        [4, 0],
    ]);
    player1Board.placeShip([
        [0, 1],
        [3, 1],
    ]);
    player1Board.placeShip([
        [0, 2],
        [2, 2],
    ]);
    player1Board.placeShip([
        [0, 3],
        [2, 3],
    ]);
    player1Board.placeShip([
        [0, 4],
        [1, 4],
    ]);

    // Place ships player 2
    player2Board.placeShip([
        [9, 9],
        [5, 9],
    ]);
    player2Board.placeShip([
        [9, 8],
        [6, 8],
    ]);
    player2Board.placeShip([
        [9, 7],
        [7, 7],
    ]);
    player2Board.placeShip([
        [9, 6],
        [7, 6],
    ]);
    player2Board.placeShip([
        [9, 5],
        [8, 5],
    ]);

    domHandler.renderInitialBoard(
        player1Board.getGrid(),
        player2Board.getGrid(),
    );

    return {
        player1,
        player2,
        player1Board,
        player2Board,
    };
};

export { createGameHandler };
