const createDOMHandler = () => {
    return {
        renderBoard(grid) {
            const p1Board = document.createElement("span");
            p1Board.id = "player1Board";
            p1Board.classList.add("game-board");

            grid.forEach((cell) => {
                const gridCell = document.createElement("span");
                gridCell.classList.add("grid-cell");
                gridCell.textContent = cell;

                p1Board.appendChild(gridCell);
            });

            document.querySelector("body").appendChild(p1Board);
        },
    };
};

export { createDOMHandler };
