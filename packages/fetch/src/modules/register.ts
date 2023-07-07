import { HttpStatusCode, MinFetchResponse, ResponseParser } from "./response";

export class HandlerRegister<TTypeMap extends RegisterTypeMap<any, any> = RegisterTypeMap<any, any>> {
    readonly _self!: HandlerRegister<TTypeMap>;
    readonly _typeMap!: TTypeMap;
    readonly _output!: TTypeMap["parsed"][keyof TTypeMap["parsed"]] | TTypeMap["globalParsed"];

    public parsers = new Map<HttpStatusCode, ResponseParser<any, HttpStatusCode>>();
    public globalParser: ResponseParser<any, HttpStatusCode> | undefined;

    /**
     * Copies the MinFetchFlow instance
     * 
     * @returns A copy of the fetch flow instance
     */
    copy(): HandlerRegister<TTypeMap> {
        const flow = new HandlerRegister<TTypeMap>();
        flow.parsers = new Map(this.parsers);
        flow.globalParser = this.globalParser;
        return flow;
    }
}

export type HandlerRegisterAny = HandlerRegister<RegisterTypeMap<any, any>>;
export type HandlerRegisterDefault = HandlerRegister<RegisterTypeMap<{}, MinFetchResponse<HttpStatusCode>>>;

export type RegisterTypeMap<TParsed extends {} = {}, TGlobalParsed extends any = any> = {
    globalParsed: TGlobalParsed;
    parsed: TParsed;
};

export type GetParsedCode<
    TRegister extends HandlerRegister<RegisterTypeMap<{ [key in TStatusCode]: any }, any>>,
    TStatusCode extends HttpStatusCode
> = TRegister["_typeMap"]["parsed"][TStatusCode];

export type SetParsedCode<
    TRegister extends HandlerRegisterAny,
    TStatusCode extends HttpStatusCode,
    TResult extends unknown
> = HandlerRegister<RegisterTypeMap<{
    [TKey in (keyof TRegister["_typeMap"]["parsed"]) | TStatusCode]: TKey extends TStatusCode ? TResult : TRegister["_typeMap"]["parsed"][TKey]
}, TRegister["_typeMap"]["globalParsed"]>>["_self"];

export type GetGlobalParsed<TRegister extends HandlerRegisterAny> = TRegister["_typeMap"]["globalParsed"];
export type SetGlobalParsed<TRegister extends HandlerRegisterAny, TResult extends unknown> = HandlerRegister<RegisterTypeMap<TRegister["_typeMap"]["parsed"], TResult>>["_self"];

export type GeTRegisterOutput<TRegister extends HandlerRegisterAny> = TRegister["_output"];