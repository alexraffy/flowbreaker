import {ShapeTypePoint, TPartitionQuadLeaf} from "./TPartitionQuadLeaf";
import {hitTestPointInRect} from "./hitTestPointInRect";


export function partitionPointsInQuads<T>(input: T[], points: (t: T)=> {x: number, y: number}[], PART_SIZE: number = 20): TPartitionQuadLeaf<ShapeTypePoint> {
    let counter = -1;
    let world: TPartitionQuadLeaf<ShapeTypePoint> = {
        id: ++counter,
        range: [-4800, -4800, 4800, 4800],
        contains: [],
        leaves: []
    };
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = -Number.MAX_SAFE_INTEGER;
    let maxY = -Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < input.length; i ++) {
        let pts = points(input[i]);
        pts.forEach( (pt) => {
            if (pt.x < minX) {
                minX = pt.x;
            }
            if (pt.y < minY) {
                minY = pt.y;
            }
            if (pt.x > maxX) {
                maxX = pt.x;
            }
            if (pt.y > maxY) {
                maxY = pt.y;
            }
            world.contains.push({x: pt.x, y: pt.y, i: i});
        });
    }
    world.range = [minX, minY, maxX, maxY];


    function part(leaf: TPartitionQuadLeaf<ShapeTypePoint>, parent: TPartitionQuadLeaf<ShapeTypePoint>) {
        if (leaf.contains.length > PART_SIZE) {
            let minX = leaf.range[0];
            let minY = leaf.range[1];
            let maxX = leaf.range[2];
            let maxY = leaf.range[3];
            let w = ((maxX - minX) / 2.0);
            let h = ((maxY - minY) / 2.0);
            let lt: TPartitionQuadLeaf<ShapeTypePoint> = {
                id: ++counter,
                range: [minX, minY, minX + w, minY + h],
                contains: [],
                leaves: []
            };
            let rt: TPartitionQuadLeaf<ShapeTypePoint> = {
                id: ++counter,
                range: [minX + w, minY, maxX, minY + h],
                contains: [],
                leaves: []
            };
            let lb: TPartitionQuadLeaf<ShapeTypePoint> = {
                id: ++counter,
                range: [minX, minY + h, minX + w, maxY],
                contains: [],
                leaves: []
            };
            let rb: TPartitionQuadLeaf<ShapeTypePoint> = {
                id: ++counter,
                range: [minX + w, minY + h, maxX, maxY],
                contains: [],
                leaves: []
            };
            for (let i = 0; i < leaf.contains.length; i ++) {
                let pt = leaf.contains[i];
                let p: [number, number] = [pt.x, pt.y];
                if (hitTestPointInRect(p, lt.range)) {
                    lt.contains.push(pt);
                } else if (hitTestPointInRect(p, rt.range)) {
                    rt.contains.push(pt);
                } else if (hitTestPointInRect(p, lb.range)) {
                    lb.contains.push(pt);
                } else if (hitTestPointInRect(p, rb.range)) {
                    rb.contains.push(pt);
                } else {
                    console.warn("Error partitionning.");
                }
            }
            leaf.contains = [];
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

        }
    }
    part(world, undefined);
    return world;
}