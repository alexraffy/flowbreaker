import {ComparisonResult} from "../search/ComparisonResult";


export function objectLomutoPartition<Type>(data: Type[], low: number, high: number, compare: (a: Type, b: Type) => ComparisonResult) {
    let pivot = high;
    let i = low - 1;
    let j = 0;
    for (j = low; j < high -1; j++) {
        let compareResult = compare(data[j], data[pivot]);
        if (compareResult <= 0) {
            i++;
            let swap = data[i];
            data[i] = data[j];
            data[j] = swap;
        }
    }
    let swap = data[i + 1];
    data[i + 1] = data[high];
    data[high] = swap;
    return i + 1;
}