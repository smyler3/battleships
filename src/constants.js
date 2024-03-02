const BOARD_WIDTH = 10;
const PLAYER_1_BOARD_ID = "player1Board";
const PLAYER_2_BOARD_ID = "player2Board";
const MAX_SHIPS = 5;

const TILES = {
    WATER: "W",
    MISS: "O",
    HIT: "X",
};

const TILE_CLASSES = {
    WATER: "water-cell",
    MISS: "miss-cell",
    HIT: "hit-cell",
    SHIP: "ship-cell",
};

export {
    BOARD_WIDTH,
    PLAYER_1_BOARD_ID,
    PLAYER_2_BOARD_ID,
    MAX_SHIPS,
    TILES,
    TILE_CLASSES,
};
