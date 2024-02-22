import { createPlayer } from "./player";
import { createDOMHandler } from "./domHandler";
import { createGameboard } from "./gameboard";

const createGameHandler = () => {
    function switchActivePlayer() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function switchActiveBoard() {
        activeBoard =
            activeBoard === player1Board ? player2Board : player1Board;
    }

    let domHandler = null;

    let player1 = null;
    let player1Board = null;

    let player2 = null;
    let player2Board = null;

    let activePlayer = null;
    let activeBoard = null;

    return {
        setupGame() {
            domHandler = createDOMHandler();

            player1 = createPlayer(false);
            player1Board = createGameboard();

            player2 = createPlayer(true);
            player2Board = createGameboard();

            activePlayer = player1;
            activeBoard = player2Board;

            // Place ships player 1
            player1Board.placeShip([
                [3, 3],
                [7, 3],
            ]);
            player1Board.placeShip([
                [3, 4],
                [6, 4],
            ]);
            player1Board.placeShip([
                [3, 5],
                [5, 5],
            ]);
            player1Board.placeShip([
                [3, 6],
                [5, 6],
            ]);
            player1Board.placeShip([
                [3, 7],
                [4, 7],
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
        },

        // Main game loop
        async playGame() {
            let gameOver = false;

            while (!gameOver) {
                console.log("New turn");
                let validAttack = false;

                while (!validAttack) {
                    let attack = null;
                    let hit = null;

                    // Get computer player move
                    if (activePlayer.isComputer) {
                        // Pause to simulate computer thinking
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000),
                        );

                        // Ask computer for attack
                        attack = activePlayer.provideAttackCoordinates();
                    }

                    // Get human player move
                    else {
                        // Ask human player for attack
                        attack = await domHandler.activateCurrentBoard();
                    }

                    // Try that attack on opponent board
                    try {
                        hit = activeBoard.receiveAttack(attack);
                        domHandler.receiveAttack(attack, hit);
                        validAttack = true;
                    } catch {
                        // If attack is invalid, ask again
                    }
                }

                // Otherwise, register it and then await input from other player
                if (activeBoard.isFleetSunk()) {
                    // Game over
                    gameOver = true;
                    break;
                }

                // Switch player turns
                switchActivePlayer();
                switchActiveBoard();
                domHandler.flipBoards();
            }
        },
    };
};

export { createGameHandler };
