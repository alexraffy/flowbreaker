



export function objectBubbleSort<Type>(data: Type[], compare: (a: Type, b: Type) => number) {
    let done_sorting = true;
    let n = data.length;
    if (n <= 1) { return data; }

    do {
        let idx = 0;
        done_sorting = true;
        for (idx = 0; idx <= n - 2; idx++) {
            let compareValue = compare(data[idx], data[idx + 1]);
            if (compareValue === 1) {
                let swap = data[idx];
                data[idx] = data[idx + 1];
                data[idx + 1] = swap;
                done_sorting = false;
            }
        }
        n--;
    } while (done_sorting === false);
    return data;
}