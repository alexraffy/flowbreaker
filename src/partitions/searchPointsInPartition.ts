import {ShapeTypePoint, ShapeTypeRect, TPartitionQuadLeaf} from "./TPartitionQuadLeaf";
import {hitTestPointInRect} from "./hitTestPointInRect";


export function searchPointsInPartition(leaf: TPartitionQuadLeaf<ShapeTypePoint>, x: number, y: number): number {
    function dig(l: TPartitionQuadLeaf<ShapeTypePoint>) {
        if (hitTestPointInRect([x, y], l.range)) {
            if (l.contains.length > 0) {
                for (let i = 0; i < l.contains.length; i ++) {
                    let p = l.contains[i] as ShapeTypePoint;
                    if (hitTestPointInRect([x, y], [p.x, p.y, p.x, p.y])) {
                        return p.i;
                    }
                }
            }
            for (let i = 0; i < l.leaves.length; i ++) {
                let idx = dig(l.leaves[i]);
                if (idx > 0) {
                    return idx;
                }
            }
        }
        return -1;
    }
    return dig(leaf);
}
