import {IBreaker} from "./IBreaker";
import {Breakers} from "./newBreaker";



export function breakerRemove(breakerId: number) {
    let bIdx = Breakers.instance.breakers.findIndex((b) => { return b.id === breakerId;});
    if (bIdx > -1) {
        Breakers.instance.breakers.splice(bIdx, 1);
    }
}