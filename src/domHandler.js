import { PLAYER_1_BOARD_ID, PLAYER_2_BOARD_ID } from "./constants";

const createDOMHandler = () => {
    let player1Board = null;
    let player2Board = null;

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
                gridCell.textContent = cell;

                board.appendChild(gridCell);
            });
        });

        document.querySelector(".board-display").prepend(board);
    }

    return {
        // Create and render display of both players boards
        renderInitialBoard(player1Grid, player2Grid) {
            createGridDisplay(player1Grid, PLAYER_1_BOARD_ID);
            createGridDisplay(player2Grid, PLAYER_2_BOARD_ID);

            player1Board = document.querySelector(`#${PLAYER_1_BOARD_ID}`);
            player2Board = document.querySelector(`#${PLAYER_2_BOARD_ID}`);

            // Position player 1's board facing screen
            player1Board.classList.add("focused-board");
            player2Board.classList.add("unfocused-board");
        },
    };
};

export { createDOMHandler };
