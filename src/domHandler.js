import { PLAYER_1_BOARD_ID, PLAYER_2_BOARD_ID, TILES } from "./constants";

const createDOMHandler = () => {
    let boardDisplay = null;
    let player1Board = null;
    let player2Board = null;

    const selectCellEvent = (e) => {
        const gridCell = e.target;

        console.log(
            `[${gridCell.getAttribute("data-x")}, ${gridCell.getAttribute("data-y")}]`,
        );
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

    function makeBoardClickable(board) {
        Array.from(board.childNodes).forEach((cell) => {
            if (
                // Tile hasn't already been attacked
                ![TILES.HIT, TILES.MISS].some(
                    (tileType) => tileType === cell.textContent,
                )
            ) {
                // Make selectable by click
                cell.addEventListener("click", selectCellEvent);
            }
        });
    }

    function makeBoardUnclickable(board) {
        Array.from(board.childNodes).forEach((cell) => {
            // Remove selection by clicking
            cell.removeEventListener("click", selectCellEvent);
        });
    }

    return {
        // Create and render display of both players boards
        renderInitialBoard(player1Grid, player2Grid) {
            boardDisplay = document.querySelector(".board-display");

            createGridDisplay(player1Grid, PLAYER_1_BOARD_ID);
            createGridDisplay(player2Grid, PLAYER_2_BOARD_ID);

            player1Board = document.querySelector(`#${PLAYER_1_BOARD_ID}`);
            player2Board = document.querySelector(`#${PLAYER_2_BOARD_ID}`);

            // Position player 1's board facing screen
            player1Board.classList.add("focused-board");
            player2Board.classList.add("unfocused-board");

            makeBoardClickable(player2Board);
        },

        // Flip the rendered board display
        flipBoards() {
            // Flip player 1 board cells
            player1Board.classList.toggle("focused-board");
            player1Board.classList.toggle("unfocused-board");

            // Flip player 2 board cells
            player2Board.classList.toggle("focused-board");
            player2Board.classList.toggle("unfocused-board");

            // Switch board positions
            boardDisplay.prepend(boardDisplay.lastChild);

            // Make defender board clickable for providing attacks
            if (boardDisplay.firstChild === player1Board) {
                makeBoardClickable(player1Board);
                makeBoardUnclickable(player2Board);
            } else {
                makeBoardClickable(player2Board);
                makeBoardUnclickable(player1Board);
            }
        },
    };
};

export { createDOMHandler };
