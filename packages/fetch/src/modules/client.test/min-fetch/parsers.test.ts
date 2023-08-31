import { describe, expect, test } from "@jest/globals";
import { HandlerRegister } from "../../register";
import { MinFetch } from "../../client";

describe("status", () => {
    test("Should merge the passed in options with the already set options", () => {
        // Arrange
        const register = new HandlerRegister();
        const sut = new MinFetch({ register });
        const statusCode = 404;
        const expectedFn = () => null;

        // Act
        sut.status(statusCode, expectedFn);
        const actualFn = register.parsers.get(statusCode);

        // Assert 
        expect(actualFn).toBe(expectedFn);
    });
});
