import {ComparisonResult} from "../search/ComparisonResult";


export function objectHoarePartition<Type>(data: Type[], low: number, high: number, compare: (a: Type, b: Type) => ComparisonResult) {
    let pivot = Math.floor( (low + high) / 2 );
    while (low <= high) {
        while (compare(data[low], data[pivot]) === ComparisonResult.GreaterThan) {
            low++;
        }
        while (data[high] && compare(data[high], data[pivot]) === ComparisonResult.LowerThan) {
            high--;
        }
        if (low <= high) {
            let swap = data[low];
            data[low] = data[high];
            data[high] = swap;
            low++;
            high--;
        }
    }
    return low;
}