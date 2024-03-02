import { BOARD_WIDTH } from "./constants";

const createPlayer = (isComputer) => {
    // Fill an array with all possible attacks on the board
    const possibleAttacks = [];

    const orientations = {
        HORIZONTAL: 0,
        VERTICAL: 1,
    };

    for (let x = 0; x < BOARD_WIDTH; x += 1) {
        for (let y = 0; y < BOARD_WIDTH; y += 1) {
            possibleAttacks.push([x, y]);
        }
    }

    return {
        isComputer,

        provideShipCoordinates(allowedLengths) {
            // Determine start co-ordinates
            const startX = Math.floor(Math.random() * BOARD_WIDTH);
            const startY = Math.floor(Math.random() * BOARD_WIDTH);
            // Determine orientation
            const orientation =
                Math.random() < 0.5
                    ? orientations.HORIZONTAL
                    : orientations.VERTICAL;
            // Determine length
            let shipLength = null;

            for (const length of allowedLengths) {
                if (length.remaining > 0) {
                    shipLength = length.number - 1;
                    break;
                }
            }

            // Place ship horizontally
            if (orientation === orientations.HORIZONTAL) {
                // Place according to board width limitations
                if (startX - shipLength < 0) {
                    return [
                        [startX, startY],
                        [startX + shipLength, startY],
                    ];
                } else if (startX + shipLength >= BOARD_WIDTH) {
                    return [
                        [startX, startY],
                        [startX - shipLength, startY],
                    ];
                }
                // Place randomly left or right
                else {
                    if (Math.random() < 0.5) {
                        return [
                            [startX, startY],
                            [startX + shipLength, startY],
                        ];
                    } else {
                        return [
                            [startX, startY],
                            [startX - shipLength, startY],
                        ];
                    }
                }
            }
            // Place ship vertically
            else {
                // Place according to board width limitations
                if (startY - shipLength < 0) {
                    return [
                        [startX, startY],
                        [startX, startY + shipLength],
                    ];
                } else if (startY + shipLength >= BOARD_WIDTH) {
                    return [
                        [startX, startY],
                        [startX, startY - shipLength],
                    ];
                }
                // Place randomly up or down
                else {
                    if (Math.random() < 0.5) {
                        return [
                            [startX, startY],
                            [startX, startY + shipLength],
                        ];
                    } else {
                        return [
                            [startX, startY],
                            [startX, startY - shipLength],
                        ];
                    }
                }
            }
        },

        provideAttackCoordinates() {
            // Pick a random attack
            const attackNumber = Math.floor(
                Math.random() * possibleAttacks.length,
            );

            // Remove attack from all possible attacks and return it
            const attack = possibleAttacks.splice(attackNumber, 1)[0];

            return attack;
        },
    };
};

export { createPlayer };
