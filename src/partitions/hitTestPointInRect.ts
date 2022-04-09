



export function hitTestPointInRect(point: [number, number], rect: [number, number, number, number]): boolean {
    if ( point[0] >= rect[0] &&
        point[0] <= rect[2] &&
        point[1] >= rect[1] &&
        point[1] <= rect[3]) {
        return true;
    }
    return false;
}