import { createGameHandler } from "../gameHandler";

let handler = null;

beforeEach(() => {
    // Generate handler
    handler = createGameHandler();
});

describe("Game_handler_setup", () => {
    test("Create_game_handler", () => {
        expect(handler).toHaveProperty("setupGame");
        expect(typeof handler.setupGame).toBe("function");

        expect(handler).toHaveProperty("setupShips");
        expect(typeof handler.setupShips).toBe("function");

        expect(handler).toHaveProperty("playGame");
        expect(typeof handler.playGame).toBe("function");
    });
});
