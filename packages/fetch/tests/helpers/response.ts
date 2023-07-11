import { jest } from "@jest/globals";

/** Mocks the needed functions on the response */
const mockResponse = (response: Response & { _formData?: FormData; }) => {
    response.formData = async () => new FormData();
    jest.spyOn(response, "formData").mockImplementation((async function (this: Response & { _formData?: FormData; }) {
        const data = new FormData();
        if (!this._formData) {
            throw new SyntaxError("Invalid form-data");
        }

        for (const [key, value] of this._formData.entries()) {
            data.append(key, value);
        }

        return data;
    }).bind(response));

    const bindedClone = response.clone.bind(response);
    jest.spyOn(response, "clone").mockImplementation((() => {
        const clone = bindedClone() as Response & { _formData?: FormData; };
        clone._formData = response._formData;
        return mockResponse(clone);
    }).bind(response));

    return response;
};

export const makeResponse = (body?: BodyInit | null | undefined, init?: ResponseInit | undefined) => {
    const response = new Response(body, init) as Response & { _formData?: FormData; };
    response._formData = body instanceof FormData ? body : undefined;
    return mockResponse(response);
}

