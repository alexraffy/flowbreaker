import {ComparisonResult} from "./ComparisonResult";


export function objectSortedBinarySearch<Type>(sortedData: Type[], value: any, compare: (entry: Type, value: any ) => ComparisonResult): Type {
    let length = sortedData.length;
    let n = Math.floor(length / 2);
    let i = n;
    while (i > 0 && i < length) {
        let compareResult = compare(sortedData[i], value);
        if ( compareResult === ComparisonResult.Equals) {
            return sortedData[i];
        }
        n = Math.ceil(n / 2);
        if ( compareResult === ComparisonResult.LowerThan ) {
            i = i + n;
        }

        if ( compareResult === ComparisonResult.GreaterThan ) {
            i = i - n;
        }
    }
    return undefined;
}