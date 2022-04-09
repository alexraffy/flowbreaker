


export interface TPartitionBinary<T> {
    range: [number, number];
    contains: T[];
    leaves: TPartitionBinary<T>[]

}