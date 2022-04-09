import {ShapeTypeRect, TPartitionQuadLeaf} from "./TPartitionQuadLeaf";
import {hitTestPointInRect} from "./hitTestPointInRect";


export function searchRectsInPartition(leaf: TPartitionQuadLeaf<ShapeTypeRect>, x: number, y: number): number[] {
    let ret: number[] = [];
    function dig(l: TPartitionQuadLeaf<ShapeTypeRect>) {
        if (hitTestPointInRect([x, y], l.range)) {
            if (l.contains.length > 0) {
                for (let i = 0; i < l.contains.length; i ++) {
                    let p = l.contains[i] as ShapeTypeRect;
                    if (hitTestPointInRect([x, y], p.bb)) {
                        ret.push(p.i);
                    }
                }
            }
            for (let i = 0; i < l.leaves.length; i ++) {
                dig(l.leaves[i]);
            }
        }
    }
    dig(leaf);
    return ret;
}
