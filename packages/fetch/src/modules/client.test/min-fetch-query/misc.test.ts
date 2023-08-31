import { describe, expect, test } from "@jest/globals";
import { MinFetchQuery } from "../../client";
import { HandlerRegister } from "../../register";


describe("copy", () => {
    test("Should make a copy of the url, request options", () => {
        // Arrange
        const reference = new MinFetchQuery({
            register: new HandlerRegister(),
            requestOptions: {
                headers: {},
                method: "GET",
                url: "http://example.com"
            },
            response: Promise.resolve(new Response(""))
        });

        // Act
        const sut = reference.copy();

        // Assert 
        expect(sut.getOptions()).not.toBe(reference.getOptions());
        expect(sut.getOptions().url).toBe(reference.getOptions().url);
        expect(sut.getHeaders()).not.toBe(reference.getHeaders());
    });
});


describe("toString", () => {
    test("Should match \"[object MinFetchQuery]\"", () => {
        // Arrange
        const sut = new MinFetchQuery({
            register: new HandlerRegister(),
            requestOptions: {
                headers: {},
                method: "GET",
                url: "http://example.com"
            },
            response: Promise.resolve(new Response(""))
        });

        // Act
        const actualString = sut.toString();

        // Assert 
        expect(actualString).toBe("[object MinFetchQuery]");
    });
});


describe("species", () => {
    test("Should return the Promise class", () => {
        // Arrange
        const expectedSpecies = Promise;

        // Act
        const actualSpecies = MinFetchQuery[Symbol.species];

        // Assert 
        expect(actualSpecies).toBe(expectedSpecies);
    });
});