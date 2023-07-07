export const removeUndefinedValues = (record: Record<string, string | undefined>): Record<string, string> => {
    const newRecord: Record<string, string> = {};
    for (const key in record) {
        const value = record[key];
        if (value === undefined) continue;
        newRecord[key] = value;
    }
    return newRecord;
};