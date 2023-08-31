import { describe, expect, test } from "@jest/globals";
import { MinFetch } from "../../client";
import { MinFetchRequestOptions } from "../../request";

describe("Settings methods", () => {
    describe('auth', () => {
        test('Should set the Authorization header with the given value', () => {
            // Arrange
            const sut = new MinFetch();
            const expectedValue = 'Bearer token';

            // Act
            sut.auth(expectedValue);
            const actualValue = sut.getHeaders()['Authorization'];

            // Assert
            expect(actualValue).toBe(expectedValue);
        });
    });

    describe('accepts', () => {
        test('Should set the Accept header with the given value', () => {
            // Arrange
            const sut = new MinFetch();
            const expectedValue = 'application/json';

            // Act
            sut.accepts(expectedValue);
            const actualValue = sut.getHeaders()['Accept'];

            // Assert
            expect(actualValue).toBe(expectedValue);
        });
    });

    describe("abort", () => {
        test("Should set the abort signal to the given value", () => {
            // Arrange
            const sut = new MinFetch();
            const expectedSignal = (new AbortController()).signal;

            // Act
            sut.abort(expectedSignal);
            const actualSignal = sut.getOptions().signal;

            // Assert 
            expect(actualSignal).toBe(expectedSignal);
        });
    });

    describe('content', () => {
        test('Should set the Content-Type header with the given value', () => {
            // Arrange
            const sut = new MinFetch();
            const expectedValue = 'application/json';

            // Act
            sut.content(expectedValue);
            const actualValue = sut.getHeaders()['Content-Type'];

            // Assert
            expect(actualValue).toBe(expectedValue);
        });
    });

    describe("applyOptions", () => {
        test("Should merge the passed in options with the already set options", () => {
            // Arrange
            const initialOptions: MinFetchRequestOptions = {
                mode: "cors",
                cache: "default",
                headers: {
                    "X-KEPT": "Kept",
                    "X-OVERRIDE": "Not overriden"
                }
            };

            const optionsToApply: MinFetchRequestOptions = {
                cache: "no-cache",
                headers: {
                    "X-OVERRIDE": "Overriden"
                }
            };

            const expectedOptions: MinFetchRequestOptions = {
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "X-KEPT": "Kept",
                    "X-OVERRIDE": "Overriden"
                }
            };

            const sut = new MinFetch({ requestOptions: initialOptions });

            // Act
            sut.applyOptions(optionsToApply);
            const actualOptions = sut.getOptions();

            // Assert 
            expect(actualOptions).toEqual(expectedOptions);
        });
    });

    describe("applyHeaders", () => {
        test("Should merge the passed in headers with the already set headers", () => {
            // Arrange
            const initialHeaders: Record<string, string | undefined> = {
                "X-KEPT": "Kept",
                "X-OVERRIDE": "Not overriden"
            };

            const headersToApply: Record<string, string | undefined> = {
                "X-OVERRIDE": "Overriden"
            };

            const expectedHeaders: Record<string, string | undefined> = {
                "X-KEPT": "Kept",
                "X-OVERRIDE": "Overriden"
            };

            const sut = new MinFetch({ requestOptions: { headers: initialHeaders } });

            // Act
            sut.applyHeaders(headersToApply);
            const actualHeaders = sut.getHeaders();

            // Assert 
            expect(actualHeaders).toEqual(expectedHeaders);
        });
    });

    describe("url", () => {
        test("Should append the given url to the internal url", () => {
            // Arrange
            const baseUrl = "http://localhost:3000";
            const path = "/foo";
            const expectedUrl = baseUrl + path;

            const sut = new MinFetch({ baseUrl });

            // Act
            const actualUrl = sut.url(path).getUrl();

            // Assert
            expect(actualUrl).toBe(expectedUrl);
        });

        test("Should override the internal url with the ", () => {
            // Arrange
            const initialUrl = "http://localhost:3000/foo";
            const expectedUrl = "http://example.com/foo";

            const sut = new MinFetch({ baseUrl: initialUrl });

            // Act
            const actualUrl = sut.url(expectedUrl, true).getUrl();

            // Assert
            expect(actualUrl).not.toBe(initialUrl);
            expect(actualUrl).toBe(expectedUrl);
        });
    });
});