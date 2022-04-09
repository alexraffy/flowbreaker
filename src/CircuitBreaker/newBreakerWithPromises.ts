import {kBreakerState} from "./kBreakerState";
import {newBreaker} from "./newBreaker";
import {IBreakerConfig} from "./IBreakerConfig";
import {breakerSuccess} from "./breakerSuccess";
import {breakerFailure} from "./breakerFailure";


export function newBreakerWithPromises(promises: (() => Promise<boolean>)[], allDone: () => void, circuitEvent: (state: kBreakerState) => void, config: IBreakerConfig = {
    closeTimeout: 10,
    openTimeout: 15000,
    openThreshold: 3,
    closeThreshold: 2
}): number {
    let breaker = newBreaker(
        config,
        (breakerId, attemptId) => {
            let p = promises.shift();
            p().then(
                (value: boolean) => {
                    if (value === true) {
                        let allDone = promises.length === 0;
                        breakerSuccess(breakerId, attemptId, allDone);
                    } else {
                        promises.unshift(p);
                        breakerFailure(breakerId, attemptId);
                    }
                }
            ).catch( (e) => {
                promises.unshift(p);
                breakerFailure(breakerId, attemptId);
            })
        },
        (breakerId, attemptId) => {
            allDone();
        },
        (breakerId, status) => {
            circuitEvent(status);
        }
    );
    return breaker;
}