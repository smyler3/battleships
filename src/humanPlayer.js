import { createPlayer } from "./player";

const createHumanPlayer = () => {
    const humanPlayer = createPlayer();
    humanPlayer.provideAttackCoordinates = function () {};

    return humanPlayer;
};

export { createHumanPlayer };
