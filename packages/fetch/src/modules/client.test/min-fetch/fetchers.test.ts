import { beforeEach, describe, expect, test } from "@jest/globals";
import { MinFetch, MinFetchQuery } from "../../client";
import fetchMock from "jest-fetch-mock";
import { MinFetchResponse } from "../../response";

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