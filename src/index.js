import { createGameHandler } from "./gameHandler";
import "./style.css";

async function main() {
    const battleShips = createGameHandler();
    battleShips.setupGame();
    await battleShips.setupShips();
    battleShips.playGame();
}

main();
