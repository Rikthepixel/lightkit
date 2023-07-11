import { describe, expect, test } from "@jest/globals";
import { MinFetchResponse } from "./response";
import { makeResponse } from "../../tests/helpers/response";
import { compareArrayBuffer, compareBlob } from "../../tests/helpers/buffer";

describe("MinFetchResponse", () => {

    describe("json", () => {
        test("Should parse correct json without throwing", async () => {
            //  Arrange
            const expectedBody = { "foo": "bar" };
            const sut = new MinFetchResponse(makeResponse(JSON.stringify(expectedBody)), {});

            //  Act
            const actualBody = await sut.json();

            //  Assert
            expect(actualBody).toEqual(expectedBody);
        });
    });

    describe("formData", () => {
        test("Should give back the correct formData", async () => {
            //  Arrange
            const expectedBody = new FormData();
            expectedBody.set("foo", "bar");
            expectedBody.set("baz", "1");
            expectedBody.append("baz", "2");

            const sut = new MinFetchResponse(makeResponse(expectedBody), {});

            //  Act
            const actualBody = await sut.formData();

            //  Assert
            expect(Array.from(actualBody)).toEqual(Array.from(expectedBody));
        });
    });

    describe("text", () => {
        test("Should give back the correct text", async () => {
            //  Arrange
            const expectedBody = "foo";
            const sut = new MinFetchResponse(makeResponse(expectedBody), {});

            //  Act
            const actualBody = await sut.text();

            //  Assert
            expect(actualBody).toBe(expectedBody);
        });
    });

    describe("blob", () => {
        test("Should give back the correct text", async () => {
            //  Arrange
            const expectedBody = new Blob([Buffer.from("foo")]);
            const sut = new MinFetchResponse(makeResponse(expectedBody), {});

            //  Act
            const actualBody = await sut.blob();

            //  Assert
            expect(compareBlob(actualBody, expectedBody)).toBeTruthy();
        });
    });

    describe("arrayBuffer", () => {
        test("Should give back the correct text", async () => {
            //  Arrange
            const expectedBody = new TextEncoder().encode("foo").buffer;
            const sut = new MinFetchResponse(makeResponse(expectedBody), {});

            //  Act
            const actualBody = await sut.arrayBuffer();

            //  Assert
            expect(compareArrayBuffer(actualBody, expectedBody)).toBeTruthy();
        });
    });
});