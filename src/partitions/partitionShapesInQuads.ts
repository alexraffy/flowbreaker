import {ShapeTypeRect, TPartitionQuadLeaf} from "./TPartitionQuadLeaf";
import {hitTestRect, kRectTest} from "./hitTestRect";


const MIN_X = 0;
const MIN_Y = 1;
const MAX_X = 2;
const MAX_Y = 3;


function extendLeafRange(range: [number, number, number, number], point: [number, number]) {

    const x = point[0];
    const y = point[1];


    if (x < range[MIN_X]) {
        range[MIN_X] = x;
    }
    if (y < range[MIN_Y]) {
        range[MIN_Y] = y;
    }
    if (x > range[MAX_X]) {
        range[MAX_X] = x;
    }
    if (y > range[MAX_Y]) {
        range[MAX_Y] = y;
    }
    return range;
}

export function partitionShapesInQuads<T>(input: T[], getShape: (t: T, i: number) => ShapeTypeRect[], PART_SIZE: number = 20) {
    let counter = -1;
    let world: TPartitionQuadLeaf<ShapeTypeRect> = {
        id: ++counter,
        range: [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER],
        contains: [],
        leaves: []
    };
    for (let i = 0; i < input.length; i ++) {
        let shapes = getShape(input[i], i);
        world.contains.push(...shapes);
        shapes.forEach( (s) => {
            world.range = extendLeafRange(world.range, [s.bb[MIN_X], s.bb[MIN_Y]]);
            world.range = extendLeafRange(world.range, [s.bb[MAX_X], s.bb[MIN_Y]]);
            world.range = extendLeafRange(world.range, [s.bb[MAX_X], s.bb[MAX_Y]]);
            world.range = extendLeafRange(world.range, [s.bb[MIN_X], s.bb[MAX_Y]]);

        })

    }
    let part = function (leaf: TPartitionQuadLeaf<ShapeTypeRect>, parentLeaf: TPartitionQuadLeaf<ShapeTypeRect>) {
        if (leaf.contains.length > PART_SIZE) {
            let minX = leaf.range[MIN_X];
            let minY = leaf.range[MIN_Y];
            let maxX = leaf.range[MAX_X];
            let maxY = leaf.range[MAX_Y];
            let w = ((maxX - minX) / 2.0);
            let h = ((maxY - minY) / 2.0);
            let lt: TPartitionQuadLeaf<ShapeTypeRect> = {
                id: ++counter,
                range: [minX, minY, minX + w, minY + h],
                contains: [],
                leaves: []
            };
            let rt: TPartitionQuadLeaf<ShapeTypeRect> = {
                id: ++counter,
                range: [minX + w, minY, maxX, minY + h],
                contains: [],
                leaves: []
            };
            let lb: TPartitionQuadLeaf<ShapeTypeRect> = {
                id: ++counter,
                range: [minX, minY + h, minX + w, maxY],
                contains: [],
                leaves: []
            };
            let rb: TPartitionQuadLeaf<ShapeTypeRect> = {
                id: ++counter,
                range: [minX + w, minY + h, maxX, maxY],
                contains: [],
                leaves: []
            };
            let containsRange: [number, number, number, number] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]
            for (let i = leaf.contains.length - 1; i >= 0; i --) {
                let pt = leaf.contains[i];
                let hit_leftTop = hitTestRect(pt.bb, lt.range);
                let hit_rightTop = hitTestRect(pt.bb, rt.range);
                let hit_leftBottom = hitTestRect(pt.bb, lb.range);
                let hit_rightBottom = hitTestRect(pt.bb, rb.range);

                let remove: boolean = false;

                if (hit_leftTop === kRectTest.inside) {
                    lt.contains.push(pt);
                    remove = true;
                } else  if (hit_rightTop === kRectTest.inside) {
                    rt.contains.push(pt);
                    remove = true;
                } else if (hit_leftBottom === kRectTest.inside) {
                    lb.contains.push(pt);
                    remove = true;
                } else if (hit_rightBottom === kRectTest.inside) {
                    rb.contains.push(pt);
                    remove = true;
                }
                if (remove === true) {
                    leaf.contains.splice(i, 1);
                } else {
                    containsRange = extendLeafRange(containsRange, [pt.bb[MIN_X], pt.bb[MIN_Y]]);
                    containsRange = extendLeafRange(containsRange, [pt.bb[MAX_X], pt.bb[MIN_Y]]);
                    containsRange = extendLeafRange(containsRange, [pt.bb[MAX_X], pt.bb[MAX_Y]]);
                    containsRange = extendLeafRange(containsRange, [pt.bb[MIN_X], pt.bb[MAX_Y]]);
                }
            }
            if (lt.contains.length > 0) {
                leaf.leaves.push(lt);
                part(lt, leaf);
            }
            if (rt.contains.length > 0) {
                leaf.leaves.push(rt);
                part(rt, leaf);
            }
            if (lb.contains.length > 0) {
                leaf.leaves.push(lb);
                part(lb, leaf);
            }
            if (rb.contains.length > 0) {
                leaf.leaves.push(rb);
                part(rb, leaf);
            }
            if (leaf.contains.length > PART_SIZE) {
                let newLeaf: TPartitionQuadLeaf<ShapeTypeRect> = {
                    id: ++counter,
                    range: containsRange,
                    contains: [...leaf.contains],
                    leaves: []
                }
                leaf.contains = [];
                leaf.leaves.push(newLeaf);
                part(newLeaf, leaf);
            }
        }
    }
    part(world, undefined);
    return world;

}