import { describe, expect, test } from "@jest/globals";
import { castFetchOptions } from "./request";
import { CONTENT_TYPE_HEADER, MULTIPART_CONTENT_TYPE } from "../constants/headers";

describe("castFetchOptions", () => {

    test("Should remove the \"multipart/form-data\" Content-Type header", () => {
        // Arrange
        const initialHeaders = {
            [CONTENT_TYPE_HEADER]: MULTIPART_CONTENT_TYPE
        };

        // Act
        const actualOptions = castFetchOptions({
            method: "GET",
            url: "http://example.com",
            headers: initialHeaders
        });

        // Assert
        expect(actualOptions.headers).toEqual({});
    });

    test("Should cast objects to a Json string if the Content-Type is application/json", () => {
        // Arrange
        const initialBody = {
            "foo": "bar"
        };
        const expectedBody = JSON.stringify(initialBody);

        // Act
        const actualOptions = castFetchOptions({
            method: "GET",
            url: "http://example.com",
            headers: { [CONTENT_TYPE_HEADER]: "application/json" },
            body: initialBody
        });

        // Assert
        expect(actualOptions.body).toBe(expectedBody);
    });

    test("Should not cast `ArrayBufferView` to Json string", () => {
        // Arrange
        const buffer = new ArrayBuffer(8);
        const initialBody = {
            "buffer": buffer,
            "byteLength": buffer.byteLength,
            "byteOffset": 0
        };
        const notExpectedBody = JSON.stringify(initialBody);

        // Act
        const actualOptions = castFetchOptions({
            method: "GET",
            url: "http://example.com",
            headers: { [CONTENT_TYPE_HEADER]: "application/json" },
            body: initialBody
        });

        // Assert
        expect(actualOptions.body).not.toEqual(notExpectedBody);
    });

});