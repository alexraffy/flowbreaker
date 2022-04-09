



export function objectInsertionSort<Type>(data: Type[], compareValue: (a: Type, b: Type) => number) {
    let j = 0;
    let element_next: Type;
    let n = data.length;
    for (let i = 1; i < n; i ++) {
        j = i - 1;
        element_next = data[i];
        while (j >= 0 && compareValue(data[j],element_next) === 1) {
            data[j+1] = data[j];
            j = j -1;
            data[j+1] = element_next;
        }

    }
    return data;


}