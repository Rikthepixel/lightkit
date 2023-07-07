import { ACCEPT_HEADER, AUTHORIZATION_HEADER, CONTENT_TYPE_HEADER } from "../constants/headers";
import { NoJsonTransformerError } from "../errors";
import { HandlerRegister, HandlerRegisterAny, HandlerRegisterDefault, SetGlobalParsed, SetParsedCode } from "./register";
import { MinFetchRequestOptions, HttpMethod, HttpMethodCallOmittedProps, MinPreparedFetchRequestOptions, RequestBody, castFetchOptions, prepareFetchOptions, AcceptHeaderValue, ContentTypeHeaderValue } from "./request";
import { MinFetchResponse, HttpStatusCode, ResponseParser } from "./response";
import { JsonTransformer, JsonValue } from "../types/json";
import { MaybePromise, SetRequired } from "../types/utils";

/**
 * Options for constructing a new MinFetch client instance
 *
 * @export
 * @interface MinFetchOptions
 * @template TRegister
 */
export interface MinFetchOptions<TRegister extends HandlerRegisterAny = HandlerRegisterDefault> {
    /**
     * The initial base url that the client will sent its requests to
     */
    baseUrl?: string;
    /**
     * HandlerRegister object containing the parsers that will be applied
     */
    register?: TRegister;
}

/**
 * MinFetch class used to construct a fetching client
 * @export
 * @class MinFetch
 * @template TRegister
 */
export class MinFetch<TRegister extends HandlerRegisterAny = HandlerRegisterDefault> {
    /**
     * HandlerRegister object containing the parsers that will be applied
     * @private
     */
    private _register: TRegister;

    /**
     * The url that the request will be sent to.
     * @private
     */
    private _request_url: string;

    /**
     * MinFetchRequestOptions that will later be transformed to the browser native fetch options
     * @private
     */
    private _request_options: MinFetchRequestOptions & SetRequired<MinFetchRequestOptions, "headers"> = {
        headers: {}
    };

    /**
     * Creates an instance of MinFetch.
     * @constructor
     */
    constructor(options: MinFetchOptions<TRegister> = {}) {
        const { baseUrl, register: flow } = Object.assign({
            baseUrl: "",
            register: new HandlerRegister
        } as Required<MinFetchOptions>, options);

        this._request_url = baseUrl;
        this._register = flow;
    }

    /**
     * Adds a AbortSignal to the request options to possibly cancel
     * 
     * @param signal An AbortSignal or AbortController to cancel the request
     * @returns this
     */
    abort(signal?: AbortSignal | AbortController) {
        this._request_options.signal = signal instanceof AbortController ? signal.signal : signal;
        return this;
    }

    /** 
     * Sets the `Authorization` header
     * 
     * @returns this
     */
    auth(value?: string) {
        this._request_options.headers[AUTHORIZATION_HEADER] = value;
        return this;
    }

    /** 
     * Sets the `Accept` header
     * 
     * @param value The format of data the client expects. E.g. "application/json"
     * @returns this
     */
    accepts(value?: AcceptHeaderValue) {
        this._request_options.headers[ACCEPT_HEADER] = value;
        return this;
    }

    /** 
     * Sets the `Content-Type` header
     * 
     * @param value The format of data the client will send to the server. E.g. "application/json"
     * @returns this
     * 
     * **Note:** in the browser fetch function to send `multipart/form-data` you have to *not* set it. 
     * Internally MinFetch automatically removes it for you in case you do have it set.
     */
    content(value?: ContentTypeHeaderValue) {
        this._request_options.headers[CONTENT_TYPE_HEADER] = value;
        return this;
    }

    /**
     * 
     *
     * @template TStatusCode
     * @template TResult
     * @param code
     * @param catcher
     * @returns this
     */
    status<TStatusCode extends HttpStatusCode, TResult>(code: TStatusCode, catcher: ResponseParser<TResult, TStatusCode>): MinFetch<SetParsedCode<TRegister, TStatusCode, TResult>> {
        this._register.parsers.set(code, catcher as ResponseParser<TResult, HttpStatusCode>);
        return this as MinFetch<SetParsedCode<TRegister, TStatusCode, TResult>>;
    }

    /**
     * 
     * @param url The url/path you want to add to the current url
     * @param override wether to override the current url or to keep it
     * @returns A copy of the current Fetch instance with the new url
     */
    url(url: string, override?: boolean) {
        const copy = this.copy();

        override
            ? copy._request_url = url
            : copy._request_url += url;

        return copy;
    }

    /**
     * Makes a copy of the MinFetch instance
     * 
     * @constructs MinFetch 
     */
    copy() {
        return new MinFetch({
            baseUrl: this._request_url,
            register: this._register.copy()
        });
    }/**
     * Description placeholder
     * @date 7/6/2023 - 6:01:38 PM
     */
    ;

    /**
     * Send a request using the provided http method to the server.
     * 
     * All other Fetch functions use this under the hood.
     *
     * @category Fetcher
     * 
     * @constructs MinFetchQuery
     */
    fetch(method: HttpMethod, url?: string | URL, options: Omit<MinFetchRequestOptions, "method"> = {}): MinFetchQuery<TRegister> {
        const computedUrl = url instanceof URL ? url : `${this._request_url}${url ?? ""}`;
        const preparedOptions = prepareFetchOptions({
            url: computedUrl,
            method
        }, options, this._request_options);

        return new MinFetchQuery<TRegister>({
            response: fetch(computedUrl, castFetchOptions(preparedOptions)),
            requestOptions: preparedOptions,
            register: this._register.copy() as TRegister
        });
    }

    /**
     * Send a request using the `GET` http method
     *
     * @category Fetcher
     * 
     * @category Fetcher
     * 
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    GET(url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("GET", url, options);
    }

    /**
     * Send a request using the `POST` http method with the given body
     *
     * @category Fetcher
     * 
     * @param body The body to send to the server
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    POST(body?: RequestBody, url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("POST", url, { ...options, body });
    }

    /**
     * Send a request using the `PUT` http method with the given body
     *
     * @category Fetcher
     * 
     * @param body The body to send to the server
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    PUT(body?: RequestBody, url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("PUT", url, { ...options, body });
    }

    /**
     * Send a request using the `PATCH` http method with the given body
     *
     * @category Fetcher
     * 
     * @param body The body to send to the server
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    PATCH(body?: RequestBody, url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("PATCH", url, { ...options, body });
    }

    /**
     * Send a request using the `DELETE` http method
     *
     * @category Fetcher
     * 
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    DELETE(url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("DELETE", url, options);
    }

    /**
     * Send a request using the `HEAD` http method
     *
     * @category Fetcher
     * 
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    HEAD(url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("HEAD", url, options);
    }

    /**
     * Send a request using the `OPTIONS` http method
     *
     * @category Fetcher
     * 
     * @param url The endpoint/url that the request should be sent to
     * @param options Fetch options to give to the fetch client
     * @returns A new MinFetchQuery instance
     */
    OPTIONS(url?: string | URL, options: Omit<MinFetchRequestOptions, HttpMethodCallOmittedProps> = {}) {
        return this.fetch("OPTIONS", url, options);
    }
}

/**
 * Options for constructing a new MinFetchQuery instance
 * 
 * @exports
 * @interface MinFetchQueryConstructorOptions
 * @template TRegister
 */
export interface MinFetchQueryOptions<TRegister extends HandlerRegisterAny = HandlerRegisterDefault> {
    /** HandlerRegister object containing the parsers that will be applied */
    register: TRegister,
    /** The actual request object given by fetch */
    response: Promise<Response>;
    /** The request options used by MinFetch to send the request */
    requestOptions: MinPreparedFetchRequestOptions;
}

/**
 * A wrapper for the browser native fetch response
 *
 * @export
 * @class MinFetchQuery
 * @template TRegister
 * @implements {PromiseLike<TRegister["_output"]>}
 */
export class MinFetchQuery<TRegister extends HandlerRegisterAny = HandlerRegisterDefault> implements PromiseLike<TRegister["_output"]> {
    /**
     * HandlerRegister object containing the parsers that will be applied
     * @private
     */
    private _register: TRegister;

    /**
     * The actual request object given by fetch
     * @private
     */
    private _response: Promise<Response>;
    /**
     * The request options used by MinFetch to send the request
     * @private
     */
    private _request_options: MinPreparedFetchRequestOptions;

    /**
     * Creates an instance of MinFetchQuery.
     * 
     * @constructor
     * @param options
     */
    constructor(options: MinFetchQueryOptions<TRegister>) {
        this._register = options.register;
        this._response = options.response;
        this._request_options = options.requestOptions;
    }

    get [Symbol.toStringTag]() {
        return "FetchQueryPromise";
    }

    get [Symbol.species]() {
        return Promise;
    }

    /**
     * Straps the fetch response object into a FetchResponse type and adds the catchers to the response
     */
    private async response(): Promise<TRegister["_output"]> {
        return this._response
            .then(async (_response) => {
                const response = new MinFetchResponse(_response, this._request_options);
                const parser = this._register.parsers.get(response.code) ?? this._register.globalParser;
                return (parser ? await parser(response) : response) as TRegister["_output"];
            });
    }

    /**
     * Makes a copy of the MinFetchQuery instance
     * 
     * @constructs MinFetchQuery 
     */
    copy() {
        return new MinFetchQuery({
            requestOptions: this._request_options,
            response: this._response,
            register: this._register.copy()
        });
    };

    /**
     * Parses the response as Json and gives it to a transformer function to tranform it to the desired shape
     * 
     * Overrides the current transformer/parser for the given statuscode. If no status code is given it overrides the global transformer
     * 
     * @param statusCodeOrTransformer 
     * @param transformer 
     * 
     * @throws {NoJsonTransformerError} Thrown when there is no valid JSON transformer defined 
     * @throws {SyntaxError} Thrown when the JSON is invalid and it cannot be parsed
     */
    json<TTransformed extends unknown = JsonValue>(): MinFetchQuery<SetGlobalParsed<TRegister, TTransformed>>;
    json<TTransformed extends unknown = any>(transformer: JsonTransformer<TTransformed>): MinFetchQuery<SetGlobalParsed<TRegister, TTransformed>>;
    json<TTransformed extends unknown = any, TStatusCode extends HttpStatusCode = HttpStatusCode>(statusCode: TStatusCode, transformer: JsonTransformer<TTransformed, TStatusCode>): MinFetchQuery<SetParsedCode<TRegister, TStatusCode, TTransformed>>;
    json<TTransformed extends unknown = any>(statusCodeOrTransformer?: JsonTransformer<TTransformed> | HttpStatusCode | never, transformer?: JsonTransformer<TTransformed> | never): MinFetchQuery<TRegister> {
        if (!statusCodeOrTransformer) {
            this._register.globalParser = async (response) => await response.json();
            return this;
        }

        if (typeof statusCodeOrTransformer === "function") {
            this._register.globalParser = async (response) => {
                return await statusCodeOrTransformer(await response.json(), response);
            };

            return this;
        }

        if (typeof statusCodeOrTransformer !== "number" || !transformer) {
            throw new NoJsonTransformerError("No JSON transformer was defined");
        }

        this._register.parsers.set(statusCodeOrTransformer, async (response) => transformer(await response.json(), response));
        return this;
    }

    /**
     * Gets the raw response and gives it the the catcher function
     * 
     * Overrides the current transformer/parser for the given statuscode.
     */
    status<TStatusCode extends HttpStatusCode, TResult>(code: TStatusCode, catcher: ResponseParser<TResult, TStatusCode>): MinFetchQuery<SetParsedCode<TRegister, TStatusCode, TResult>> {
        this._register.parsers.set(code, catcher as ResponseParser<TResult, HttpStatusCode>);
        return this as MinFetchQuery<SetParsedCode<TRegister, TStatusCode, TResult>>;
    }

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onFulfilled The callback to execute when the Promise is resolved.
     * @param onRejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    async then<TFulfilledResult = TRegister["_output"], TRejectedResult = never>(
        onFulfilled?: ((value: TRegister["_output"]) => MaybePromise<TFulfilledResult>) | undefined | null,
        onRejected?: ((reason: unknown) => MaybePromise<TRejectedResult>) | undefined | null
    ): Promise<TFulfilledResult | TRejectedResult> {
        return this.response().then(onFulfilled, onRejected);
    }

    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onRejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    async catch<TResult>(
        onRejected: ((reason: unknown) => MaybePromise<TResult>) | undefined | null
    ): Promise<TRegister["_output"] | TResult> {
        return this.response().catch(onRejected) as Promise<TRegister["_output"] | TResult>;
    }
}