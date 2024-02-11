import { BOARD_WIDTH } from "../constants";
import { createHumanPlayer } from "../humanPlayer";

describe("Player_can_provide_an_attack_coordinate", () => {
    let player = null;

    beforeEach(() => {
        player = createHumanPlayer();

        jest.spyOn(player, "provideAttackCoordinates").mockImplementation(
            () => {
                return [0, 0];
            },
        );
    });

    test("Player_provides_attack", () => {
        const attackCoords = player.provideAttackCoordinates();

        // Received a coord array
        expect(attackCoords).toEqual(expect.any(Array));
        expect(attackCoords).toHaveLength(2);
        expect(attackCoords[0]).toEqual(expect.any(Number));
        expect(attackCoords[1]).toEqual(expect.any(Number));

        // First coord valid
        expect(attackCoords[0]).toBeGreaterThanOrEqual(0);
        expect(attackCoords[0] % 1).toBe(0);
        expect(attackCoords[0]).toBeLessThan(BOARD_WIDTH);

        // Second coord valid
        expect(attackCoords[1]).toBeGreaterThanOrEqual(0);
        expect(attackCoords[1] % 1).toBe(0);
        expect(attackCoords[1]).toBeLessThan(BOARD_WIDTH);
    });
});
