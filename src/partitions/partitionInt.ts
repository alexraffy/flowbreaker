import {TPartitionBinary} from "./TPartitionBinary";
/*
enum TableColumnType {
    uint8,
    uint16,
    uint32,
    uint64,
    int,
    int8,
    int16,
    int32,
    int64,
    varchar,
    boolean
}

function extendLeafRange(range: [number, number], entry: number) {

    if (entry < range[0]) {
        range[0] = entry;
    }

    if (entry > range[1]) {
        range[1] = entry;
    }

    return range;
}



export function partitionIntDEPREC<T>(source: T[], selector: (t: T) => number, PART_SIZE: number = 20, type: TableColumnType = TableColumnType.int32, columnLength: number = 1): { sizeRequired: number, partition: TPartitionBinary<T>} {
    let ret: TPartitionBinary<T> = {
        range: [Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER],
        contains: [],
        leaves: []
    };
    let sizeRequired = 0;


    let valueSize = 0;
    switch (type) {
        case TableColumnType.int:
            valueSize += 4;
            break;
        case TableColumnType.int8:
        case TableColumnType.uint8:
            valueSize += 1;
            break;
        case TableColumnType.int16:
        case TableColumnType.uint16:
            valueSize += 2;
            break;
        case TableColumnType.int32:
        case TableColumnType.uint32:
            valueSize += 4;
            break;
        case TableColumnType.int64:
        case TableColumnType.uint64:
            valueSize += 8;
            break;
        case TableColumnType.boolean:
            valueSize += 1;
            break;
        case TableColumnType.varchar:
            valueSize += 1 * columnLength;
            break;

    }





    // copy all source
    for (let i = 0; i < source.length; i++) {
        ret.contains.push(source[i]);
        ret.range = extendLeafRange(ret.range, selector(source[i]));
    }
    let part = function (leaf: TPartitionBinary<T>, parentLeaf: TPartitionBinary<T>) {
        if (leaf.contains.length > PART_SIZE) {
            let inTheMiddle = leaf.range[0] + (leaf.range[1] - leaf.range[0]) / 2;
            let a: TPartitionBinary<T> = {
                range: [leaf.range[0], inTheMiddle],
                contains: [],
                leaves: []
            };
            let b: TPartitionBinary<T> = {
                range: [inTheMiddle + 1, leaf.range[1]],
                contains: [],
                leaves: []
            };
            leaf.leaves.push(a);
            leaf.leaves.push(b);
            for (let x = 0; x < leaf.contains.length; x++ ) {
                let val = selector(leaf.contains[x]);
                if (val >= a.range[0] && (val <= a.range[1])) {
                    a.contains.push(leaf.contains[x]);
                } else {
                    b.contains.push(leaf.contains[x]);
                }
            }
            leaf.contains = [];
            part(a, leaf);
            part(b, leaf);
        }

        // upper band
        // a offset
        // b offset
        // number of leaves
        // tableId, blockId, offset, value
        sizeRequired += 4 + 4 + 4 + 4;
        let leafSize = (4 + 4 + 4 + valueSize) * leaf.contains.length;
        sizeRequired += leafSize;


    }

    part(ret, undefined);

    return { sizeRequired: sizeRequired, partition: ret};
}*/