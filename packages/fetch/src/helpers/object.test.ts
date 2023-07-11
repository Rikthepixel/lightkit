import { describe, expect, test } from "@jest/globals";
import { removeUndefinedValues } from './object';

describe("removeUndefinedValues", () => {
    test("Should remove undefined values from an object", () => {
        // Arrange
        const initialRecord = {
            "shouldBeDefined": "foo",
            "shouldBeRemoved": undefined,
        } satisfies Record<string, string | undefined>;

        // Act 
        const sutRecord = removeUndefinedValues(initialRecord);

        // Assert
        expect(sutRecord).toBeDefined();
        expect(sutRecord).not.toMatchObject(initialRecord);
        expect("shouldBeRemoved" in sutRecord).toBeFalsy();
        expect("shouldBeDefined" in sutRecord).toBeTruthy();
    });
});