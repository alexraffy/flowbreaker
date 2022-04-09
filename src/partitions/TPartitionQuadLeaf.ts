
export interface ShapeTypePoint {
    x: number;
    y: number;
    i: number;
}

export interface ShapeTypeRect {
    bb: [number, number, number, number];
    i: number;
}


export type TPartitionQuadLeaf<ShapeType> = {
    id: number;
    range: [number, number, number, number];
    contains: ShapeType[];
    leaves: TPartitionQuadLeaf<ShapeType>[];
}