import { BOARD_WIDTH } from "../constants";
import { createGameboard } from "../gameboard";
import { createPlayer } from "../player";

let player = null;

describe("human_player_testing", () => {
    test("human_player_created", () => {
        player = createPlayer(false);
        expect(player.isComputer).toBe(false);
    });
});

describe("computer_player_testing", () => {
    beforeEach(() => {
        player = createPlayer(true);
    });

    test("computer_player_created", () => {
        expect(player.isComputer).toBe(true);
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

    test("Computer_provides_ship_coordinates", () => {
        const board = createGameboard();
        const shipCoordinates = player.provideShipCoordinates(
            board.getAllowedLengths(),
        );

        // Received coordinate array
        expect(shipCoordinates).toEqual(expect.any(Array));

        // Start coordinates valid
        const startCoords = shipCoordinates[0];
        expect(startCoords).toEqual(expect.any(Array));
        expect(startCoords[0]).toEqual(expect.any(Number));
        expect(startCoords[0] >= 0 && startCoords[0] < BOARD_WIDTH).toEqual(
            true,
        );
        expect(startCoords[1]).toEqual(expect.any(Number));
        expect(startCoords[1] >= 0 && startCoords[1] < BOARD_WIDTH).toEqual(
            true,
        );

        // End coordinates valid
        const endCoords = shipCoordinates[1];
        expect(endCoords).toEqual(expect.any(Array));
        expect(endCoords[0]).toEqual(expect.any(Number));
        expect(endCoords[0] >= 0 && endCoords[0] < BOARD_WIDTH).toEqual(true);
        expect(endCoords[1]).toEqual(expect.any(Number));
        expect(endCoords[1] >= 0 && endCoords[1] < BOARD_WIDTH).toEqual(true);
    });
});
