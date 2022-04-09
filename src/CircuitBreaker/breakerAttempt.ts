import {IBreaker} from "./IBreaker";
import {breakerFailure} from "./breakerFailure";
import {Breakers} from "./newBreaker";



export function _breakerAttempt(breakerId: number, attemptId: number) {
    let b = Breakers.instance.breakers.find((b) => { return b.id === breakerId;});
    if (b === undefined) { return;}
    //try {
        b.lastAttempt = new Date().toISOString();
        b.attempts.pending.push(
            {
                id: attemptId,
                kind: breakerId.toString(),
                timestamp: b.lastAttempt
            }
        );
        b.exec(b.id, attemptId);
    //} catch (error) {
//        breakerFailure(b.id, attemptId);
//    }

}