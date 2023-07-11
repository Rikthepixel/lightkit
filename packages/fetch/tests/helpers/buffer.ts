export const compareBlob = async (blobA: Blob, blobB: Blob) => {
    return compareArrayBuffer(await blobA.arrayBuffer(), await blobB.arrayBuffer());
};

export const compareArrayBuffer = (arrayA: ArrayBuffer, arrayB: ArrayBuffer) => {
    return Buffer.compare(Buffer.from(arrayA), Buffer.from(arrayB)) === 0;
};