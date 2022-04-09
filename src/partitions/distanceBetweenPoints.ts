

export function distanceBetweenPoints(a: [number, number], b: [number, number]): number {
    return Math.sqrt( (a[0]-b[0])**2 + (a[1]-b[1])**2);
}

export function distanceBetweenPointsSimplified(a: [number, number], b: [number, number]): number {
    return (a[0]-b[0])**2 + (a[1]-b[1])**2;
}