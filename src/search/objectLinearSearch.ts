


export function objectLinearSearch<Type>(data: Type[], selector: (value: Type) => boolean): Type | undefined {
    let n = data.length;
    for (let i = 0; i < n; i++) {
        if (selector(data[i]) === true) {
            return data[i];
        }
    }
    return undefined;
}