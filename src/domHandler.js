import { PLAYER_1_BOARD_ID, PLAYER_2_BOARD_ID, TILES } from "./constants";

const createDOMHandler = () => {
    let boardDisplay = null;
    let player1Board = null;
    let player2Board = null;
    let activeBoard = null;

    const selectCellEvent = (gridCell, resolve) => {
        const attackCoordinates = [
            gridCell.getAttribute("data-x"),
            gridCell.getAttribute("data-y"),
        ];

        console.log(`[${attackCoordinates[0]}, ${attackCoordinates[1]}]`);

        resolve(attackCoordinates);

        deactivateCurrentBoard();
    };

    // Create a grid to store information about a player's board
    function createGridDisplay(grid, id) {
        const board = document.createElement("span");
        board.id = id;
        board.classList.add("game-board");

        // Create grid cells with cell information stored and displayed
        grid.forEach((row, x) => {
            row.forEach((cell, y) => {
                const gridCell = document.createElement("span");
                gridCell.classList.add("grid-cell");
                gridCell.setAttribute("data-x", x);
                gridCell.setAttribute("data-y", y);
                gridCell.setAttribute("data-player-id", id);
                gridCell.textContent = cell;

                board.appendChild(gridCell);
            });
        });

        boardDisplay.prepend(board);
    }

    // Remove ability to attack cells on opponent's board
    function deactivateCurrentBoard() {
        // Clone the parent node to remove all event listeners
        const clonedBoard = activeBoard.cloneNode(true);
        boardDisplay.replaceChild(clonedBoard, activeBoard);

        // Update references
        if (activeBoard === player1Board) {
            player1Board = clonedBoard;
        } else {
            player2Board = clonedBoard;
        }
        activeBoard = clonedBoard;
    }

    return {
        // Create and render display of both players boards
        renderInitialBoard(player1Grid, player2Grid) {
            boardDisplay = document.querySelector(".board-display");

            createGridDisplay(player1Grid, PLAYER_1_BOARD_ID);
            createGridDisplay(player2Grid, PLAYER_2_BOARD_ID);

            player1Board = document.querySelector(`#${PLAYER_1_BOARD_ID}`);
            player2Board = document.querySelector(`#${PLAYER_2_BOARD_ID}`);
            activeBoard = player2Board;

            // Position player 1's board facing screen
            player1Board.classList.add("focused-board");
            player2Board.classList.add("unfocused-board");
        },

        // Flip the rendered board display
        flipBoards() {
            // Flip player 1 board cells
            player1Board.classList.toggle("focused-board");
            player1Board.classList.toggle("unfocused-board");

            // Flip player 2 board cells
            player2Board.classList.toggle("focused-board");
            player2Board.classList.toggle("unfocused-board");

            // Change which board is active
            activeBoard =
                activeBoard === player1Board ? player2Board : player1Board;

            // Switch board positions
            boardDisplay.prepend(boardDisplay.lastChild);
        },

        // Make all attackable cells on opponent's board selectable for attacks
        async activateCurrentBoard() {
            return new Promise((resolve) => {
                Array.from(activeBoard.childNodes).forEach((cell) => {
                    if (
                        // Tile hasn't already been attacked
                        ![TILES.HIT, TILES.MISS].some(
                            (tileType) => tileType === cell.textContent,
                        )
                    ) {
                        // Make selectable by click
                        cell.addEventListener("click", () =>
                            selectCellEvent(cell, resolve),
                        );
                    }
                });
            });
        },
    };
};

export { createDOMHandler };
