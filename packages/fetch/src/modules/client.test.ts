import { beforeEach, describe, expect, test } from "@jest/globals";
import { MinFetch, MinFetchQuery } from "./client";
import fetchMock from "jest-fetch-mock";
import { MinFetchResponse } from "./response";
import { MinFetchRequestOptions } from "./request";

const BASE_URL = `http://localhost:3000`;

beforeEach(() => {
    fetchMock.resetMocks();

    fetchMock.mockIf((req) => req.url.startsWith("http://localhost:3000"), async (req) => {
        let status = 200;
        if (req.url.endsWith("/200")) {
            status = 200;
        } else if (req.url.endsWith("/404")) {
            status = 404;
        } else if (req.url.endsWith("/500")) {
            status = 500;
        }

        return {
            status: status,
            body: JSON.stringify({ "foo": "bar" })
        };
    });
});

describe("MinFetch", () => {

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

    describe("Fetchers", () => {
        describe('fetch', () => {
            test('Should create a new MinFetchQuery instance with the correct options', async () => {
                // Arrange
                const expectedMethod = 'POST';
                const expectedUrl = `${BASE_URL}/200`;
                const expectedOptions = {
                    headers: {
                        'Authorization': 'Bearer token',
                    },
                };
                const sut = new MinFetch();

                // Act
                const actualQuery = sut.fetch(expectedMethod, expectedUrl, expectedOptions);
                const actualOptions = actualQuery.getOptions();

                // Assert
                expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                expect(actualOptions.method).toBe(expectedMethod);
                expect(actualOptions.headers).toEqual(expectedOptions.headers);
                expect(actualOptions.url).toBe(expectedUrl);
            });

            describe('HTTP methods', () => {

                test('GET Should create a new MinFetchQuery instance with GET method', async () => {
                    // Arrange
                    const expectedMethod = 'GET';
                    const expectedUrl = `${BASE_URL}/200`;
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.GET('/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                });

                test('POST Should create a new MinFetchQuery instance with POST method', async () => {
                    // Arrange
                    const expectedMethod = 'POST';
                    const expectedUrl = `${BASE_URL}/200`;
                    const expectedBody = { data: 'example' };
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.POST(expectedBody, '/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                    expect(actualOptions.body).toEqual(expectedBody);
                });

                test('PUT Should create a new MinFetchQuery instance with PUT method', async () => {
                    // Arrange
                    const expectedMethod = 'PUT';
                    const expectedUrl = `${BASE_URL}/200`;
                    const expectedBody = { data: 'example' };
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.PUT(expectedBody, '/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                    expect(actualOptions.body).toEqual(expectedBody);
                });

                test('PATCH Should create a new MinFetchQuery instance with PATCH method', async () => {
                    // Arrange
                    const expectedMethod = 'PATCH';
                    const expectedUrl = `${BASE_URL}/200`;
                    const expectedBody = { data: 'example' };
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.PATCH(expectedBody, '/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                    expect(actualOptions.body).toEqual(expectedBody);
                });

                test('DELETE Should create a new MinFetchQuery instance with DELETE method', async () => {
                    // Arrange
                    const expectedMethod = 'DELETE';
                    const expectedUrl = `${BASE_URL}/200`;
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.DELETE('/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                });

                test('HEAD Should create a new MinFetchQuery instance with HEAD method', async () => {
                    // Arrange
                    const expectedMethod = 'HEAD';
                    const expectedUrl = `${BASE_URL}/200`;
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.HEAD('/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                });

                test('OPTIONS Should create a new MinFetchQuery instance with OPTIONS method', async () => {
                    // Arrange
                    const expectedMethod = 'OPTIONS';
                    const expectedUrl = `${BASE_URL}/200`;
                    const sut = new MinFetch({ baseUrl: BASE_URL });

                    // Act
                    const actualQuery = sut.OPTIONS('/200');
                    const actualOptions = actualQuery.getOptions();

                    // Assert
                    expect(actualQuery).toBeInstanceOf(MinFetchQuery);
                    expect(await actualQuery).toBeInstanceOf(MinFetchResponse);
                    expect(actualOptions.method).toBe(expectedMethod);
                    expect(actualOptions.url).toBe(expectedUrl);
                });
            });
        });
    });
});

describe("MinFetchQuery", () => {
    
});