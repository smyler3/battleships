import { createGameHandler } from "./gameHandler";
import "./style.css";

const battleShips = createGameHandler();
battleShips.setupGame();
battleShips.playGame();
