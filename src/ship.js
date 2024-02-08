const createShip = (shipLength) => {
    // Error checking
    if (typeof shipLength !== "number" || isNaN(shipLength) || shipLength < 1) {
        throw new Error("Invalid ship length");
    }

    const length = shipLength;
    let hits = 0;

    return {
        // Checks whether the ship has more hits than lives
        isSunk() {
            return hits >= length;
        },

        // Add damagae to the ship and check for sinking
        hit() {
            hits += 1;
        },
    };
};

export { createShip };
