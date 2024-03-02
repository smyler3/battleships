import { BOARD_WIDTH, TILES } from "./constants";
import { createShip } from "./ship";

const createGameboard = () => {
    const MAX_SHIPS = 5;

    const allowedLengths = [
        { number: 2, remaining: 1 },
        { number: 3, remaining: 2 },
        { number: 4, remaining: 1 },
        { number: 5, remaining: 1 },
    ];

    const grid = Array.from({ length: BOARD_WIDTH }, () => {
        return Array.from({ length: BOARD_WIDTH }).fill(TILES.WATER);
    });

    const placedShips = [];

    // Checks whether a given pair of coordinates is valid for placing a ship
    function isValidCoords(startx, starty, endx, endy) {
        // Ship placed off the board
        if (
            [startx, starty, endx, endy].some(
                (coord) => coord < 0 || coord >= BOARD_WIDTH,
            )
        ) {
            return false;
        }

        // Ship placed diagonally
        if (startx !== endx && starty !== endy) {
            return false;
        }

        // Check for ships already in the grid
        for (let x = startx; x <= endx; x += 1) {
            for (let y = starty; y <= endy; y += 1) {
                // Ship already placed there
                if (grid[x][y] !== TILES.WATER) {
                    return false;
                }
            }
        }

        return true;
    }

    return {
        // Place a ship on the game board based on start and end coordinates
        placeShip([[startx, starty], [endx, endy]]) {
            // Max ships already placed
            if (placedShips.length >= MAX_SHIPS) {
                throw new Error("Ship capacity reached");
            }

            // Invalid coordinates
            if (!isValidCoords(startx, starty, endx, endy)) {
                throw new Error("Invalid coordinates");
            }

            const shipLength =
                1 + Math.max(Math.abs(startx - endx), Math.abs(starty - endy));

            // Check ship length validity
            const obj = allowedLengths.find((obj) => obj.number === shipLength);

            if (obj === undefined || obj.remaining <= 0) {
                throw new Error("Invalid ship length");
            }

            try {
                // Create ship
                const newShip = createShip(shipLength);
                placedShips.push(newShip);

                // Add ship references to the grid
                const [minX, maxX] = [
                    Math.min(startx, endx),
                    Math.max(startx, endx),
                ];
                const [minY, maxY] = [
                    Math.min(starty, endy),
                    Math.max(starty, endy),
                ];

                for (let x = minX; x <= maxX; x += 1) {
                    for (let y = minY; y <= maxY; y += 1) {
                        grid[x][y] = placedShips.length - 1;
                    }
                }

                obj.remaining -= 1;

                return true;
            } catch (error) {
                return error;
            }
        },

        receiveAttack([x, y]) {
            if ([x, y].some((coord) => coord < 0 || coord >= BOARD_WIDTH)) {
                throw new Error("Invalid coordinates");
            }

            const square = grid[x][y];

            // Duplicate attack
            if (square === TILES.MISS || square === TILES.HIT) {
                throw new Error("Already attacked this square");
            }

            // Miss
            if (square === TILES.WATER) {
                grid[x][y] = TILES.MISS;

                return false;
            }

            // Hit
            placedShips[square].hit();
            grid[x][y] = TILES.HIT;

            return true;
        },

        isFleetSunk() {
            return placedShips.every((ship) => ship.isSunk());
        },

        getGrid() {
            return grid;
        },

        getAllowedLengths() {
            return allowedLengths;
        },
    };
};

export { createGameboard };
