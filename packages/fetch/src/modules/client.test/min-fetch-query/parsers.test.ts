import { describe, expect, test } from "@jest/globals";
import { HandlerRegister } from "../../register";
import {  MinFetchQuery } from "../../client";

describe("status", () => {
    test("Should merge the passed in options with the already set options", () => {
        // Arrange
        const register = new HandlerRegister();
        const sut = new MinFetchQuery({
            register,
            requestOptions: {
                headers: {},
                method: "GET",
                url: ""
            },
            response: Promise.resolve(new Response(""))
        });

        const statusCode = 404;
        const expectedFn = () => null;

        // Act
        sut.status(statusCode, expectedFn);
        const actualFn = register.parsers.get(statusCode);

        // Assert 
        expect(actualFn).toBe(expectedFn);
    });
});
