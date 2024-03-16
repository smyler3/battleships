import {
    PLAYER_1_BOARD_ID,
    PLAYER_2_BOARD_ID,
    TILE_CLASSES,
} from "./constants";

const createDOMBoardHandler = () => {
    const SHIP_COLOURS = {
        2: "hsl(320, 60%, 85%)",
        3: "hsl(30, 60%, 85%)",
        4: "hsl(270, 60%, 75%)",
        5: "hsl(120, 60%, 85%)",
    };

    let boardDisplay = null;
    let player1Board = null;
    let player2Board = null;
    let activeBoard = null;

    // Event for selecting a cell on the board and returning it's coordinates
    const selectCellEvent = (gridCell, resolve) => {
        const cellCoordinates = [
            gridCell.getAttribute("data-x"),
            gridCell.getAttribute("data-y"),
        ];

        resolve(cellCoordinates);
        disableCellSelection();
    };

    // Event for selecting the start cell when placing a ship
    const selectShipStartEvent = (gridCell, resolve) => {
        gridCell.classList.add("ship-start");
        selectCellEvent(gridCell, resolve);
    };

    // Create a copy of a player's grid to display relevant game information to the player
    function createGridDisplay(grid, id) {
        const boardHolder = document.createElement("span");

        const title = document.createElement("h3");
        title.classList.add("board-title");
        if (id === PLAYER_1_BOARD_ID) {
            title.classList.add("player-board-title");
            title.textContent = "Your Ships";
        } else {
            title.classList.add("opponent-board-title");
            title.textContent = "Opponent Ships";
        }

        const board = document.createElement("div");
        board.id = id;
        board.classList.add("game-board");

        // Create grid cells with cell information stored and displayed
        grid.forEach((row, x) => {
            row.forEach((_, y) => {
                const gridCell = document.createElement("span");
                gridCell.classList.add("grid-cell");
                gridCell.classList.add(TILE_CLASSES.WATER);
                gridCell.setAttribute("data-x", x);
                gridCell.setAttribute("data-y", y);
                gridCell.setAttribute("data-player-id", id);

                board.appendChild(gridCell);
            });
        });

        boardHolder.appendChild(title);
        boardHolder.appendChild(board);
        boardDisplay.prepend(boardHolder);
    }

    // Remove ability to select any cells on the current active board
    function disableCellSelection() {
        // Clone the parent node to remove all event listeners
        const clonedBoard = activeBoard.parentElement.cloneNode(true);
        boardDisplay.replaceChild(clonedBoard, activeBoard.parentElement);

        // Update references
        if (activeBoard === player1Board) {
            player1Board = clonedBoard.childNodes[1];
        } else {
            player2Board = clonedBoard.childNodes[1];
        }
        activeBoard = clonedBoard.childNodes[1];

        activeBoard.childNodes.forEach((cell) => {
            cell.classList.remove("clickable");
            console.log("done");
        });
    }

    // Determines whether a given set of points are valid to have a ship placed between them
    function validEndPoint([startX, startY], [endX, endY], allowedLengths) {
        // Same co-ordinate
        if (startX === endX && startY === endY) {
            return false;
        }

        let length = null;
        let start = null;
        let end = null;

        if (startX === endX) {
            // Checking for any remaining ships of valid length to bridge these points
            length = allowedLengths.find(
                (obj) => obj.number === Math.abs(startY - endY) + 1,
            );

            // Checking for ships between the points
            start = Math.min(startY, endY);
            end = Math.max(startY, endY);

            for (let y = start; y < end + 1; y += 1) {
                const cell = document.querySelector(
                    `.grid-cell[data-x="${startX}"][data-y="${y}"]`,
                );

                // Ship between the points
                if (cell.classList.contains(TILE_CLASSES.SHIP)) {
                    return false;
                }
            }
        } else if (startY === endY) {
            // Checking for any remaining ships of valid length to bridge these points
            length = allowedLengths.find(
                (obj) => obj.number === Math.abs(startX - endX) + 1,
            );

            // Checking for ships between the points
            start = Math.min(startX, endX);
            end = Math.max(startX, endX);

            for (let x = start; x < end + 1; x += 1) {
                const cell = document.querySelector(
                    `.grid-cell[data-x="${x}"][data-y="${startY}"]`,
                );

                // Ship between the points
                if (cell.classList.contains(TILE_CLASSES.SHIP)) {
                    return false;
                }
            }
        }

        // Valid coordinates
        if (length && length.remaining > 0) {
            return true;
        }

        return false;
    }

    return {
        // Create and render display of both players boards
        renderInitialBoard(player1Grid, player2Grid) {
            boardDisplay = document.querySelector(".board-display");

            createGridDisplay(player2Grid, PLAYER_2_BOARD_ID);
            createGridDisplay(player1Grid, PLAYER_1_BOARD_ID);

            player1Board = document.querySelector(`#${PLAYER_1_BOARD_ID}`);
            player2Board = document.querySelector(`#${PLAYER_2_BOARD_ID}`);
            activeBoard = player2Board;
        },

        // Make all possible start positions for ships selectable
        async enableShipStartPositionSelection() {
            return new Promise((resolve) => {
                Array.from(activeBoard.childNodes).forEach((cell) => {
                    if (!cell.classList.contains(TILE_CLASSES.SHIP)) {
                        // Make selectable by click
                        cell.addEventListener("click", () =>
                            selectShipStartEvent(cell, resolve),
                        );
                        cell.classList.add("clickable");
                    }
                });
            });
        },

        // Make all possible end positions for ships selectable
        async enableShipEndPositionSelection(startPos, allowedLengths) {
            return new Promise((resolve) => {
                Array.from(activeBoard.childNodes).forEach((cell) => {
                    if (
                        !cell.classList.contains(TILE_CLASSES.SHIP) &&
                        validEndPoint(
                            startPos,
                            [
                                cell.getAttribute("data-x"),
                                cell.getAttribute("data-y"),
                            ],
                            allowedLengths,
                        )
                    ) {
                        // Make selectable by click
                        cell.addEventListener("click", () =>
                            selectCellEvent(cell, resolve),
                        );
                        cell.classList.add("clickable");
                    }
                });
            });
        },

        // Add a placed ship to the board
        placeShip([startX, startY], [endX, endY], hidden) {
            let start = null;
            let end = null;
            let colour = null;
            let playerID = hidden ? PLAYER_2_BOARD_ID : PLAYER_1_BOARD_ID;

            // Placing ship tiles along the y-axis
            if (startX === endX) {
                start = Math.min(startY, endY);
                end = Math.max(startY, endY);
                colour = SHIP_COLOURS[end - start + 1];

                for (let y = start; y < end + 1; y += 1) {
                    const cell = document.querySelector(
                        `.grid-cell[data-player-id="${playerID}"][data-x="${startX}"][data-y="${y}"]`,
                    );

                    if (!hidden) {
                        cell.classList.add(TILE_CLASSES.SHIP);
                        cell.classList.remove(TILE_CLASSES.WATER);
                        cell.style.backgroundColor = colour;
                    }
                }
            }
            // Placing ship tiles along the x-axis
            else {
                start = Math.min(startX, endX);
                end = Math.max(startX, endX);
                colour = SHIP_COLOURS[end - start + 1];

                for (let x = start; x < end + 1; x += 1) {
                    const cell = document.querySelector(
                        `.grid-cell[data-player-id="${playerID}"][data-x="${x}"][data-y="${startY}"]`,
                    );

                    if (!hidden) {
                        cell.classList.add(TILE_CLASSES.SHIP);
                        cell.classList.remove(TILE_CLASSES.WATER);
                        cell.style.backgroundColor = colour;
                    }
                }
            }
        },

        // Make all attackable cells on opponent's board selectable for attacks
        async enableAttackSelection() {
            return new Promise((resolve) => {
                Array.from(activeBoard.childNodes).forEach((cell) => {
                    if (
                        // Tile hasn't already been attacked
                        ![TILE_CLASSES.HIT, TILE_CLASSES.MISS].some(
                            (tileType) => cell.classList.contains(tileType),
                        )
                    ) {
                        // Make selectable by click
                        cell.addEventListener("click", () =>
                            selectCellEvent(cell, resolve),
                        );
                        cell.classList.add("clickable");
                    }
                });
            });
        },

        // Alter the board to reflect an attack
        receiveAttack([x, y], hit) {
            const attackedCell = document.querySelector(
                `.grid-cell[data-x="${x}"][data-y="${y}"][data-player-id="${activeBoard.id}"]`,
            );

            // Remove any earlier styling
            attackedCell.style.backgroundColor = "";

            attackedCell.classList.remove(TILE_CLASSES.WATER);
            attackedCell.classList.remove("clickable");
            attackedCell.classList.add(
                hit ? TILE_CLASSES.HIT : TILE_CLASSES.MISS,
            );
        },

        // Change which board is active
        switchActiveBoard() {
            activeBoard.parentElement.childNodes[0].classList.remove(
                "board-title-active",
            );
            activeBoard =
                activeBoard === player1Board ? player2Board : player1Board;
            activeBoard.parentElement.childNodes[0].classList.add(
                "board-title-active",
            );
        },
    };
};

export { createDOMBoardHandler };
