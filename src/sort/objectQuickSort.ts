import {ComparisonResult} from "../search/ComparisonResult";
import {objectHoarePartition} from "../partitions/objectHoarePartition";
import {objectLomutoPartition} from "../partitions/objectLomutoPartition";



export function objectQuickSort<Type>(data: Type[], compare: (a: Type, b: Type) => ComparisonResult, low: number = 0, high: number = data.length - 1, partition: "hoare" | "lomuto" = "lomuto"): Type[] {
    if (data.length < 2) {
        return data;
    }

    if (low < high) {
        const pivot = (partition === "hoare") ? objectHoarePartition(data, low, high, compare) : objectLomutoPartition(data, low, high, compare);
        objectQuickSort(data, compare, low, pivot -1, partition);
        objectQuickSort(data, compare, pivot + 1, high, partition);
    }


    return data;

}