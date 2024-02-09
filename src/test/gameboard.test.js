import { createGameboard } from "../gameboard";

describe("Gameboard Testing", () => {
    let board = null;

    beforeEach(() => {
        board = createGameboard();
    });

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

    test("Can't_add_ship_off_board (1)", () => {
        expect(
            board.placeShip([
                [-1, 3],
                [2, 3],
            ]),
        ).toBe(false);
    });

    test("Can't_add_ship_off_board (2)", () => {
        expect(
            board.placeShip([
                [10, 3],
                [8, 3],
            ]),
        ).toBe(false);
    });

    test("Can't_add_ship_diagonally", () => {
        expect(
            board.placeShip([
                [1, 1],
                [3, 4],
            ]),
        ).toBe(false);
    });

    test("Can't_add_two_ships_at_same_place", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true);
        expect(
            board.placeShip([
                [0, 0],
                [0, 4],
            ]),
        ).toBe(false);
    });

    test("Can't_add_over_max_allowed_ships_to_board", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true),
            expect(
                board.placeShip([
                    [0, 1],
                    [3, 1],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 2],
                    [2, 2],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 3],
                    [2, 3],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 4],
                    [1, 4],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 5],
                    [2, 5],
                ]),
            ).toBe(false);
    });

    test("Can't_add_more_ships_of_a_length_than_allowed", () => {
        expect(
            board.placeShip([
                [0, 0],
                [4, 0],
            ]),
        ).toBe(true),
            expect(
                board.placeShip([
                    [0, 1],
                    [4, 1],
                ]),
            ).toBe(false),
            expect(
                board.placeShip([
                    [0, 2],
                    [2, 2],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 3],
                    [2, 3],
                ]),
            ).toBe(true),
            expect(
                board.placeShip([
                    [0, 4],
                    [2, 4],
                ]),
            ).toBe(false);
    });
});
