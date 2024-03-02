import { createPlayer } from "./player";
import { createDOMBoardHandler } from "./domBoardHandler";
import { createGameboard } from "./gameboard";
import { createDOMMessageHandler } from "./domMessageHandler";
import { MAX_SHIPS } from "./constants";

const createGameHandler = () => {
    function switchActivePlayer() {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    function switchActiveBoard() {
        activeBoard =
            activeBoard === player1Board ? player2Board : player1Board;
    }

    let boardHandler = null;
    let messageHandler = null;

    let player1 = null;
    let player1Board = null;

    let player2 = null;
    let player2Board = null;

    let activePlayer = null;
    let activeBoard = null;

    return {
        setupGame() {
            boardHandler = createDOMBoardHandler();
            messageHandler = createDOMMessageHandler();

            player1 = createPlayer(false);
            player1Board = createGameboard();

            player2 = createPlayer(true);
            player2Board = createGameboard();

            activePlayer = player1;
            activeBoard = player2Board;

            // Place ships player 1
            // player1Board.placeShip([
            //     [3, 3],
            //     [7, 3],
            // ]);
            // player1Board.placeShip([
            //     [3, 4],
            //     [6, 4],
            // ]);
            // player1Board.placeShip([
            //     [3, 5],
            //     [5, 5],
            // ]);
            // player1Board.placeShip([
            //     [3, 6],
            //     [5, 6],
            // ]);
            // player1Board.placeShip([
            //     [3, 7],
            //     [4, 7],
            // ]);

            // Place ships player 2
            // player2Board.placeShip([
            //     [9, 9],
            //     [5, 9],
            // ]);
            // player2Board.placeShip([
            //     [9, 8],
            //     [6, 8],
            // ]);
            // player2Board.placeShip([
            //     [9, 7],
            //     [7, 7],
            // ]);
            // player2Board.placeShip([
            //     [9, 6],
            //     [7, 6],
            // ]);
            // player2Board.placeShip([
            //     [9, 5],
            //     [8, 5],
            // ]);

            boardHandler.renderInitialBoard(
                player1Board.getGrid(),
                player2Board.getGrid(),
            );
        },

        // Fill the board with ships
        async setupShips() {
            let placed = 0;

            // Set up computer ships
            while (placed < MAX_SHIPS) {
                // Try placing a ship at computer generated coordinates
                try {
                    let [startPos, endPos] = player2.provideShipCoordinates(
                        player2Board.getAllowedLengths(),
                    );
                    player2Board.placeShip([startPos, endPos]);
                    boardHandler.placeShip(startPos, endPos, true);
                    placed += 1;
                    console.log([startPos, endPos]);
                } catch {
                    // If coordinates invalid, ask again
                }
            }

            boardHandler.flipBoards();
            placed = 0;

            // Set up player ships
            while (placed < MAX_SHIPS) {
                messageHandler.displayShipPlacePrompt(MAX_SHIPS - placed);

                // Wait for ship start and end positions
                let startPos =
                    await boardHandler.enableShipStartPositionSelection();
                let endPos = await boardHandler.enableShipEndPositionSelection(
                    startPos,
                    player1Board.getAllowedLengths(),
                );

                // Try placing a ship at those coordinates
                try {
                    player1Board.placeShip([startPos, endPos]);
                    boardHandler.placeShip(startPos, endPos);
                    placed += 1;
                } catch {
                    // If coordinates invalid, ask again
                }
            }
        },

        // Main game loop
        async playGame() {
            let gameOver = false;

            while (!gameOver) {
                messageHandler.displayCurrentTurn(!activePlayer.isComputer);
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
                        attack = await boardHandler.enableAttackSelection();
                    }

                    // Try that attack on opponent board
                    try {
                        hit = activeBoard.receiveAttack(attack);
                        boardHandler.receiveAttack(attack, hit);
                        validAttack = true;
                        messageHandler.displayAttackResult(hit);
                    } catch {
                        // If attack is invalid, ask again
                    }
                }

                // Otherwise, register it and then await input from other player
                if (activeBoard.isFleetSunk()) {
                    // Game over
                    gameOver = true;
                    messageHandler.displayWinner("Player 1");
                    break;
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Switch player turns
                switchActivePlayer();
                switchActiveBoard();
                boardHandler.switchActiveBoard();
                // boardHandler.flipBoards();
            }
        },
    };
};

export { createGameHandler };
