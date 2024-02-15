import { BOARD_WIDTH } from "./constants";

const createPlayer = (isComputer) => {
    // Fill an array with all possible attacks on the board
    const possibleAttacks = [];

    for (let x = 0; x < BOARD_WIDTH; x += 1) {
        for (let y = 0; y < BOARD_WIDTH; y += 1) {
            possibleAttacks.push([x, y]);
        }
    }

    return {
        isComputer,

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
