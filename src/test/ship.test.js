import { createShip } from "../ship";

describe("Ship_creation", () => {
    test("Create_a_ship (1)", () => {
        const ship = createShip(1);

        expect(ship).toHaveProperty("hit");
        expect(typeof ship.hit).toBe("function");
        expect(ship).toHaveProperty("isSunk");
        expect(typeof ship.isSunk).toBe("function");
    });

    test("Create_a_ship (2)", () => {
        const ship = createShip(4);

        expect(ship).toHaveProperty("hit");
        expect(typeof ship.hit).toBe("function");
        expect(ship).toHaveProperty("isSunk");
        expect(typeof ship.isSunk).toBe("function");
    });

    test("Can't_create_zero_length_ship", () => {
        expect(() => createShip(0)).toThrow("Invalid ship length");
    });

    test("Can't_create_negative_length_ship", () => {
        expect(() => createShip(-1)).toThrow("Invalid ship length");
    });

    test("Can't_create_non-number_length_ship", () => {
        expect(() => createShip("12")).toThrow("Invalid ship length");
    });

    test("Can't_create_NaN_length_ship", () => {
        expect(() => createShip(NaN)).toThrow("Invalid ship length");
    });
});

describe("Ship_attacks", () => {
    test("Hit_can_sink_ship", () => {
        const ship = createShip(2);

        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
});
