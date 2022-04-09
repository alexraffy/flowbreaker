


export function objectShellSort<Type>(data: Type[], compare: (a: Type, b: Type)=> number) {
    let n = data.length;
    let interval = 0;
    while (interval < n / 3) {
        interval = interval * 3 + 1;
    }
    while (interval > 0) {
        for (let outer = interval; outer < n; outer ++) {
            let valueToInsert = data[outer];
            let inner = outer;
            while (inner > interval -1 && compare(data[inner - interval], valueToInsert) >= 0) {
                data[inner] = data[inner - interval]
                inner = inner - interval
            }
            data[inner] = valueToInsert
        }
        interval = (interval - 1) /3;
    }
    return data;
}