


export function objectInterpolationSearch<Type>(data: Type[], x: number, valueOf: (entry: Type)=> number): Type | undefined {
    let idx0 = 0;
    let idxn = data.length - 1;
    while (idx0 <= idxn && x >= valueOf(data[idx0]) && x <= valueOf(data[idxn])) {
        console.log("idx0: ", idx0);
        let mid = idx0 + Math.floor((idxn - idx0) / (valueOf(data[idxn]) - valueOf(data[idx0])) * (x - valueOf(data[idx0])));
        if (valueOf(data[mid]) === x) {
            return data[mid];
        }
        if (valueOf(data[mid]) < x) {
            idx0 = mid + 1;
        } else {
            idx0 = mid - 1;
        }
    }
    return undefined;
}