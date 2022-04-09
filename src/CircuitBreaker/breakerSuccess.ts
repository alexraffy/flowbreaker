import {kBreakerState} from "./kBreakerState";
import {IBreaker} from "./IBreaker";
import {_breakerAttempt} from "./breakerAttempt";
import {breakerRemove} from "./breakerRemove";
import {Breakers} from "./newBreaker";


export function breakerSuccess(breakerId: number, attemptId: number, done: boolean) {
    let b = Breakers.instance.breakers.find((b) => { return b.id === breakerId;});
    if (b === undefined) { return;}
    let pendingAttemptIdx = b.attempts.pending.findIndex((a) => { return a.id === attemptId});
    if (pendingAttemptIdx > -1) {
        let pa = b.attempts.pending[pendingAttemptIdx];
        b.attempts.success.push({
            id: pa.id,
            kind: pa.kind,
            timestamp: new Date().toISOString()
        });
        b.attempts.pending.splice(pendingAttemptIdx, 1);
    }
    let previousState = b.state;
    if (b.state === kBreakerState.opened) {
        b.state = kBreakerState.halfOpened;
    }
    if (b.state === kBreakerState.halfOpened && b.attempts.success.length === b.config.closeThreshold) {
        b.state = kBreakerState.closed;
    }
    if (done === true) {
        b.circuitEvents(b.id, b.state);
        b.done(b.id, attemptId);
        breakerRemove(breakerId);
    } else {
        let nextTry = b.config.closeTimeout;
        if (previousState !== b.state) {
            b.circuitEvents(b.id, b.state);
        }
        setTimeout(
            () => {
                _breakerAttempt(breakerId, attemptId+1);
            }, nextTry
        );
    }
}
