import {kBreakerState} from "./kBreakerState";
import {IBreaker} from "./IBreaker";
import {_breakerAttempt} from "./breakerAttempt";
import {Breakers} from "./newBreaker";


export function breakerFailure(breakerId: number, attemptId: number) {
    let b = Breakers.instance.breakers.find((b) => { return b.id === breakerId;});
    if (b === undefined) { return;}
    b.attempts.success = [];
    let pendingAttemptIdx = b.attempts.pending.findIndex((a) => { return a.id === attemptId});
    if (pendingAttemptIdx > -1) {
        let pa = b.attempts.pending[pendingAttemptIdx];
        b.attempts.failures.push({
            id: pa.id,
            kind: pa.kind,
            timestamp: new Date().toISOString()
        });
        b.attempts.pending.splice(pendingAttemptIdx, 1);
    }
    let nextTry = 0;
    let previousState = b.state;
    if (b.attempts.failures.length >= b.config.openThreshold) {
        b.state = kBreakerState.opened;
        nextTry = b.config.openTimeout;
        if (b.config.openMultiplier !== undefined) {
            nextTry = parseInt((b.config.openTimeout * b.config.openMultiplier * b.attempts.failures.length).toString());
        }
    } else {
        nextTry = b.config.closeTimeout;
    }

    if (previousState !== b.state) {
        b.circuitEvents(b.id, b.state);
    }

    setTimeout(
        () => {
            _breakerAttempt(breakerId, attemptId+1);
        }, nextTry
    );
}

