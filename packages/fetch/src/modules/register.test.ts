import { describe, expect, test } from "@jest/globals";
import { HandlerRegister } from "./register";

describe("HandlerRegister", () => {

    test("Copy HandlerRegistry copies the internal maps/arrays", () => {
        // Arrange
        const register = new HandlerRegister();
        
        // Act
        const sut = register.copy();

        // Assert
        expect(sut.globalParser).toBe(register.globalParser);
        expect(sut.parsers).not.toBe(register.parsers);
    });

});
