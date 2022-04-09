import {TPartitionQuadLeaf} from "./TPartitionQuadLeaf";


export function partitionInfo<Shape>(leaf: TPartitionQuadLeaf<Shape>) {
    let totalLeaves = 0;
    let totalLeavesWithZeroPoints = 0;
    let totalLeavesWithPoints = 0;
    let totalPoints = 0;
    function recur(l: TPartitionQuadLeaf<Shape>) {
        totalLeaves++;
        if (l.contains.length > 0) {
            totalLeavesWithPoints++;
            totalPoints += l.contains.length;
        } else {
            totalLeavesWithZeroPoints++;
        }
        for (let i = 0; i < l.leaves.length; i++) {
            recur(l.leaves[i]);
        }
    }
    recur(leaf);
    console.log("Total Leaves: " + totalLeaves);
    console.log("Total Leaves with 0 Points: " + totalLeavesWithZeroPoints);
    console.log("Total Leaves with Points: " + totalLeavesWithPoints);
    console.log("Total Points: " + totalPoints);

    const typeSizes = {
        "undefined": () => 0,
        "boolean": () => 4,
        "number": () => 8,
        "string": item => 2 * item.length,
        "object": item => !item ? 0 : Object
            .keys(item)
            .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
    };

    const sizeOf = value => typeSizes[typeof value](value);

    console.log("Rough size of partition ", sizeOf(leaf), "Bytes");


}
