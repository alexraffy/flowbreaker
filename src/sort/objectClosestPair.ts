import {objectSelectionSort} from "./objectSelectionSort";
import {objectMergeSort} from "./objectMergeSort";
import {distanceBetweenPointsSimplified} from "../partitions/distanceBetweenPoints";


export function objectClosestPair<T>(input: T[], fnGetPoint: (t: T) => [number, number], fnDistanceBetweenPoints: (a:[number, number], b:[number, number]) => number = distanceBetweenPointsSimplified): {value: number, a: T, b: T}[] {
    let distances: {value: number, a: T, b: T}[] = [];
    for (let i = 0; i < 999; i++) {
        for (let j = i + 1; j < 1000; j++) {
            distances.push(
                {
                    value: distanceBetweenPointsSimplified(fnGetPoint(input[i]), fnGetPoint(input[j])),
                    a: input[i],
                    b: input[j]
                }
            );
        }
    }
    let sorted = objectMergeSort(distances, (a,b) => {
        if (a.value > b.value) {
            return 1;
        } else if (a.value < b.value) {
            return -1;
        }
        return 0;
    });
    return sorted;
}