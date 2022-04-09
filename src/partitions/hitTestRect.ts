
export enum kRectTest {
    outside = 0,
    inside = 1,
    intersects = 2
}


const MIN_X = 0;
const MIN_Y = 1;
const MAX_X = 2;
const MAX_Y = 3;


export function hitTestRect(rect1: [number, number, number, number], rect2: [number, number, number, number]): kRectTest {

    if (
        rect1[MIN_X] >= rect2[MIN_X] &&
        rect1[MAX_X] <= rect2[MAX_X] &&
        rect1[MIN_Y] >= rect2[MIN_Y] &&
        rect1[MAX_Y] <= rect2[MAX_Y]
    ) {
        return kRectTest.inside;
    }

    if (!(rect2[MIN_X] > rect1[MAX_X] ||
        rect2[MAX_X] < rect1[MIN_X] ||
        rect2[MIN_Y] > rect1[MAX_Y] ||
        rect2[MAX_Y] < rect1[MIN_Y])) {
        return kRectTest.intersects;
    }

    return kRectTest.outside;

}