import { BOARD_WIDTH } from "../constants";
import { createComputerPlayer } from "../computerPlayer";

describe("Computer_can_provide_an_attack_coordinate", () => {
    let player = null;

    beforeEach(() => {
        player = createComputerPlayer();
    });

    test("Computer_provides_attack", () => {
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

    test("Computer_provides_unique_attacks", () => {
        const previousAttacks = new Set();

        // Checks for duplicate attack calls
        for (let i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i += 1) {
            const attackCoords = player.provideAttackCoordinates();

            // Convert to string format to allow comparison
            const attackStringFormat = JSON.stringify(attackCoords);

            expect(previousAttacks.has(attackStringFormat)).toBe(false);

            previousAttacks.add(attackStringFormat);
        }
    });
});
