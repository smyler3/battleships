import { createGameboard } from "../gameboard";

let board = null;

beforeEach(() => {
    board = createGameboard();
});

describe("Addding_ships_to_gameboard", () => {
    test("Create_a_gameboard", () => {
        expect(board).toHaveProperty("placeShip");
        expect(typeof board.placeShip).toBe("function");

        expect(board).toHaveProperty("receiveAttack");
        expect(typeof board.receiveAttack).toBe("function");

        expect(board).toHaveProperty("isFleetSunk");
        expect(typeof board.isFleetSunk).toBe("function");
    });

    test("Add_a_ship_to_board (1)", () => {
        expect(
            board.placeShip([
                [0, 0],
                [0, 4],
            ]),
        ).toBe(true);
    });

    test("Add_a_ship_to_board (2)", () => {
        expect(
            board.placeShip([
                [3, 3],
                [5, 3],
            ]),
        ).toBe(true);
    });

    test("Can't_add_invalid_length_ship", () => {
        expect(() =>
            board.placeShip([
                [0, 0],
                [6, 0],
            ]),
        ).toThrow("Invalid ship length");
    });

    test("Can't_add_ship_off_board (1)", () => {
        expect(() =>
            board.placeShip([
                [-1, 3],
                [2, 3],
            ]),
        ).toThrow("Invalid coordinates");
    });

    test("Can't_add_ship_off_board (2)", () => {
        expect(() =>
            board.placeShip([
                [10, 3],
                [8, 3],
            ]),
        ).toThrow("Invalid coordinates");
    });

    test("Can't_add_ship_diagonally", () => {
        expect(() =>
            board.placeShip([
                [1, 1],
                [3, 4],
            ]),
        ).toThrow("Invalid coordinates");
    });

    test("Can't_add_two_ships_at_same_place", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true);

        expect(() =>
            board.placeShip([
                [0, 0],
                [0, 4],
            ]),
        ).toThrow("Invalid coordinates");
    });

    test("Can't_add_over_max_allowed_ships_to_board", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true);

        expect(
            board.placeShip([
                [0, 1],
                [3, 1],
            ]),
        ).toBe(true);

        expect(
            board.placeShip([
                [0, 2],
                [2, 2],
            ]),
        ).toBe(true);

        expect(
            board.placeShip([
                [0, 3],
                [2, 3],
            ]),
        ).toBe(true);

        expect(
            board.placeShip([
                [0, 4],
                [1, 4],
            ]),
        ).toBe(true);

        expect(() =>
            board.placeShip([
                [0, 5],
                [2, 5],
            ]),
        ).toThrow("Ship capacity reached");
    });

    test("Can't_add_more_ships_of_a_length_than_allowed", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true);

        expect(() =>
            board.placeShip([
                [0, 1],
                [4, 1],
            ]),
        ).toThrow("Invalid ship length");

        expect(
            board.placeShip([
                [0, 2],
                [2, 2],
            ]),
        ).toBe(true);

        expect(
            board.placeShip([
                [0, 3],
                [2, 3],
            ]),
        ).toBe(true);

        expect(() =>
            board.placeShip([
                [0, 4],
                [2, 4],
            ]),
        ).toThrow("Invalid ship length");
    });
});

describe("Attacking_spaces_on_the_board", () => {
    test("Attack_a_ship_tile", () => {
        board.placeShip([
            [0, 0],
            [1, 0],
        ]);

        expect(board.receiveAttack([0, 0])).toBe(true);

        expect(board.receiveAttack([1, 0])).toBe(true);
    });

    test("Attack_a_water_tile", () => {
        board.placeShip([
            [0, 0],
            [1, 0],
        ]);

        expect(board.receiveAttack([0, 1])).toBe(false);

        expect(board.receiveAttack([1, 1])).toBe(false);

        expect(board.receiveAttack([2, 0])).toBe(false);
    });

    test("Can't_attack_a_water_tile_twice", () => {
        expect(board.receiveAttack([0, 1])).toBe(false);

        expect(() => board.receiveAttack([0, 1])).toThrow(
            "Already attacked this square",
        );
    });

    test("Can't_attack_a_ship_tile_twice", () => {
        board.placeShip([
            [0, 0],
            [1, 0],
        ]);

        expect(board.receiveAttack([0, 0])).toBe(true);

        expect(() => board.receiveAttack([0, 0])).toThrow(
            "Already attacked this square",
        );
    });

    test("Can't_attack_out_of_board", () => {
        expect(() => board.receiveAttack([-1, 0])).toThrow(
            "Invalid coordinates",
        );
    });
});
