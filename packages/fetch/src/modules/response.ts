import { MinFetchRequestOptions } from "./request";
import { JsonValue } from "../types/json";
import { MaybePromise } from "../types/utils";

export type InformationalHttpStatusCode = 100 | 101 | 102 | 103;
export type SuccessHttpStatusCode = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
export type RedirectionHttpStatusCode = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
export type ClientErrorHttpStatusCode = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451;
export type ServerErrorHttpStatusCode = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

/**
 *  A union type containing all of the official HTTP status codes listed in the web MDN
 * 
 *  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 *  **Note**: this is a non exhaustive list
 */
export type HttpStatusCode = InformationalHttpStatusCode | SuccessHttpStatusCode | RedirectionHttpStatusCode | ClientErrorHttpStatusCode | ServerErrorHttpStatusCode;

export type ResponseParser<TResult, TStatusCode extends HttpStatusCode = HttpStatusCode> = (response: MinFetchResponse<TStatusCode>) => MaybePromise<TResult>;

export class MinFetchResponse<TStatusCode extends HttpStatusCode> {
    code: TStatusCode;
    statusText: string;
    headers: Headers;
    response: Response;
    request: MinFetchRequestOptions;
    url: string;
    redirected: boolean;
    type: ResponseType;

    constructor(response: Response, request: MinFetchRequestOptions) {
        this.request = request;

        this.code = response.status as TStatusCode;
        this.response = response;
        this.url = response.url;
        this.redirected = response.redirected;
        this.type = response.type;
        this.headers = response.headers;
        this.statusText = response.statusText;
    }

    /**
     * @throws {SyntaxError} Thrown when the JSON is invalid and it cannot be parsed
     * 
     * https://developer.mozilla.org/docs/Web/API/Request/json
     * 
     * note: always calls the response.clone method
     */
    async json() {
        return this.response.clone().json() as JsonValue;
    }

    /**
     * https://developer.mozilla.org/docs/Web/API/Request/formData
     * 
     * note: always calls the response.clone method
     */
    async formData() {
        return this.response.clone().formData();
    }

    /**
     * https://developer.mozilla.org/docs/Web/API/Request/blob
     * 
     * note: always calls the response.clone method
     */
    async blob() {
        return this.response.clone().blob();
    }

    /**
     * https://developer.mozilla.org/docs/Web/API/Request/text
     * 
     * note: always calls the response.clone method
     */
    async text() {
        return this.response.clone().text();
    }

    /**
     * https://developer.mozilla.org/docs/Web/API/Request/arrayBuffer
     * 
     * note: always calls the response.clone method
     */
    async arrayBuffer() {
        return this.response.clone().arrayBuffer();
    }
}