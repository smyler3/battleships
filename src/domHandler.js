const createDOMHandler = () => {
    return {
        renderBoard(grid, id) {
            const board = document.createElement("span");
            board.id = id;
            board.classList.add("game-board");

            grid.forEach((row) => {
                row.forEach((cell) => {
                    const gridCell = document.createElement("span");
                    gridCell.classList.add("grid-cell");
                    gridCell.textContent = cell;

                    board.appendChild(gridCell);
                });
            });

            document.querySelector("body").appendChild(board);
        },
    };
};

export { createDOMHandler };
