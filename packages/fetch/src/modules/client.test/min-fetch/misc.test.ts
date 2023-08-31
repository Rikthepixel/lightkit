import { describe, expect, test } from "@jest/globals";
import { MinFetch } from "../../client";

describe("copy", () => {
    test("Should make a copy of the url and request options", () => {
        // Arrange
        const reference = new MinFetch();

        // Act
        const sut = reference.copy();

        // Assert 
        expect(sut.getOptions()).not.toBe(reference.getOptions());
        expect(sut.getHeaders()).not.toBe(reference.getHeaders());
        expect(sut.getUrl()).toBe(reference.getUrl());
    });
});

describe("toString", () => {
    test("Should match \"[object MinFetch]\"", () => {
        // Arrange
        const sut = new MinFetch();

        // Act
        const actualString = sut.toString();

        // Assert 
        expect(actualString).toBe("[object MinFetch]");
    });
});