import { createGameHandler } from "../gameHandler";

describe("Game_handler_setup", () => {
    test("Create_game_handler", () => {
        const handler = createGameHandler();

        expect(handler).toHaveProperty("player1");
        expect(handler).toHaveProperty("player2");
        expect(handler).toHaveProperty("player1Board");
        expect(handler).toHaveProperty("player2Board");
    });
});
