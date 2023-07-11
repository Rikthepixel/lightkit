import { CONTENT_TYPE_HEADER, MULTIPART_CONTENT_TYPE } from "../constants/headers";
import { removeUndefinedValues } from "../helpers/object";
import { SetRequired } from "../types/utils";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "TRACE" | "OPTIONS" | "HEAD" | "CONNECT";
export type RequestBody = ReadableStream | Blob | BufferSource | FormData | URLSearchParams | Record<string, any> | string;
export type HttpMethodCallOmittedProps = "body" | "method";

export interface MinFetchRequestOptions {
    /** A string to set request's method. */
    method?: HttpMethod;

    /** A RequestBody object or null to set request's body. */
    body?: RequestBody;

    /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
    headers?: Record<string, string | undefined>;

    /** An AbortSignal to set request's signal. */
    signal?: AbortSignal | null;

    /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
    integrity?: string;

    /** A boolean to set request's keepalive. */
    keepalive?: boolean;

    /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
    mode?: RequestMode;

    /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
    redirect?: RequestRedirect;

    /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
    referrer?: string;

    /** A referrer policy to set request's referrerPolicy. */
    referrerPolicy?: ReferrerPolicy;

    /** A string indicating how the request will interact with the browser's cache to set request's cache. */
    cache?: RequestCache;

    /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
    credentials?: RequestCredentials;
}

export interface MinPreparedFetchRequestOptions extends SetRequired<Omit<MinFetchRequestOptions, "headers">, "method"> {
    url: string | URL;
    headers: Record<string, string | undefined>;
}

//
// Mime types
//
export type MimeBaseType = "application" | "audio" | "font" | "image" | "text" | "video" | "multipart";

/** note: just lists the important ones */
export type MimeSubtypeMap = {
    "application": "octet-stream" | "json" | "zip" | "pdf" | "gzip";
    "audio": "wave" | "wav" | "webm" | "ogg" | "midi";
    "video": "ogg" | "mpeg" | "mp4" | "webm" | "mp2t";
    "font": "woff2" | "woff" | "tff";
    "image": "apng" | "avif" | "gif" | "jpeg" | "png" | "svg+xml" | "webp";
    "text": "plain" | "css" | "html" | "javascript" | "csv";
    "multipart": "form-data" | "byteranges";
};

type MimeBaseTypeWithSubtype = {
    [TBase in MimeBaseType]: `${TBase}/${MimeSubtypeMap[TBase]}`
};

/** note: should not be used as an exhaustive list of all the mime types */
export type MimeTypeValue = (string & {}) | "*/*" | `${MimeBaseType}/*` | MimeBaseTypeWithSubtype[keyof MimeBaseTypeWithSubtype];

//
// Header values
//
export type AcceptHeaderValue = MimeTypeValue;
export type ContentTypeHeaderValue = MimeTypeValue;

export const shouldBecomeJson = (body: RequestBody | undefined | null, contentType?: ContentTypeHeaderValue): body is Record<string, any> => {
    return (
        contentType === "application/json" &&
        !!body &&
        typeof body !== "string" &&
        !(body instanceof ReadableStream) &&
        !(body instanceof Blob) &&
        !(body instanceof ArrayBuffer) &&
        !(body instanceof FormData) &&
        !(body instanceof URLSearchParams) &&
        !("buffer" in body && "byteLength" in body && "byteOffset" in body)
    );
};

export const castFetchHeaders = (headers: Record<string, string | undefined>) => {
    if (headers[CONTENT_TYPE_HEADER] === MULTIPART_CONTENT_TYPE) {
        delete headers[CONTENT_TYPE_HEADER];
    }

    return removeUndefinedValues(headers);
};

export const prepareFetchOptions = (
    { url, method }: Required<Pick<MinPreparedFetchRequestOptions, "url" | "method">>,
    { headers, ...options }: MinFetchRequestOptions,
    { headers: storedHeaders, ...storedOptions }: SetRequired<MinFetchRequestOptions, "headers">
): MinPreparedFetchRequestOptions => {
    return {
        ...storedOptions,
        ...options,
        url: url,
        method: method,
        headers: headers ?? {}
    };
};

export const castFetchOptions = (options: MinPreparedFetchRequestOptions): RequestInit => {
    return {
        ...options,
        body: shouldBecomeJson(options.body, options.headers[CONTENT_TYPE_HEADER]) ? JSON.stringify(options.body as Record<string, any>) : options.body,
        headers: castFetchHeaders(options.headers)
    };
};
