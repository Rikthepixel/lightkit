import { HttpStatusCode, MinFetchResponse } from "../modules/response";
import { MaybePromise } from "./utils";

export type JsonValue = unknown
export type JsonTransformer<TTransformed, TStatusCode extends HttpStatusCode = HttpStatusCode> = (json: JsonValue, response: MinFetchResponse<TStatusCode>) => MaybePromise<TTransformed>;