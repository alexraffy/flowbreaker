


export function numberSelectionSort(array: number[]): number[] {
    let ret: number[] = [];
    let min: number = Infinity;
    let prevMin: number = undefined;

    while (ret.length < array.length) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] < min && (array[i]>prevMin || prevMin===undefined)) {
                min = array[i];
            }
        }
        ret.push(min);
        prevMin = min;
        min = Infinity;
    }
    return ret;
}


export function objectSelectionSort<Ref>(dataArray: Ref[], select: (value: Ref, minimum?: Ref, prevMinimum?: Ref) => boolean): Ref[] {
    let ret: Ref[] = [];
    let min: Ref = undefined;
    let prevMin: Ref = undefined;
    while (ret.length < dataArray.length) {
        for (let i = 0; i < dataArray.length; i++) {
            if (min === undefined && prevMin === undefined) {
                min = dataArray[i];
            } else {
                if (min === undefined) {
                    if (prevMin === undefined) {
                        min = dataArray[i];
                        continue;
                    }
                }
                if (select(dataArray[i], min, prevMin) && prevMin !== dataArray[i]) {
                    min = dataArray[i];
                }
            }

        }
        if (min === undefined) {
            break;
        }

        ret.push(min);
        prevMin = min;
        min = undefined;

    }
    return ret;
}


