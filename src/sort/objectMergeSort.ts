


export function objectMergeSort<Type>(data: Type[], compare: (a: Type, b: Type)=> number) {
    let level = 0;
    let ret: number[] = [];

    let mergeArrays = function (c: Type[], d: Type[]): Type[] {
        let b: Type[] = [];
        let i = 0;
        let j = 0;
        let n = c.length + d.length;
        for (let k = 0; k < n; k ++) {
            if (j === d.length || (i < c.length && compare(c[i], d[j]) === -1) ) {
                b[k] = c[i];
                i++;
            } else {
                b[k] = d[j];
                j++;
            }
        }
        return b;
    }


    let fn = function(array: Type[], compare: (a: Type, b: Type)=> number ) {
        level ++;
        let n = array.length;
        let half = Math.floor(array.length / 2);
        if (n === 0) { level --; return array;}
        if (n === 1) { level --; return array;}
        if (n === 2) {
            if (compare(array[0], array[1]) === -1) {
                level--;
                return array;
            } else {
                level--;
                return [array[1], array[0]];
            }

        }
        let part1: Type[] = [];
        let part2: Type[] = [];
        for (let i = 0; i < n; i++) {
            if (i < half) {
                part1.push(array[i]);
            } else {
                part2.push(array[i]);
            }
        }
        let ret1 = fn(part1, compare);
        let ret2 = fn(part2, compare);
        let m = mergeArrays(ret1, ret2);
        level --;
        //console.log(`objectMergeSort Level ${level}: array: ${array} parts: ${part1}/${part2} rets: ${ret1}/${ret2} merged: ${m}`);
        return m;
    }
    return fn(data, compare);
}