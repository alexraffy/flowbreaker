import {IBreakerConfig} from "./IBreakerConfig";
import {kBreakerState} from "./kBreakerState";
import {IBreaker} from "./IBreaker";
import {_breakerAttempt} from "./breakerAttempt";


export class Breakers {
    static instance: Breakers;
    breakers: IBreaker[];
    lastBreakerId: number;
    constructor() {
        Breakers.instance = this;
        this.breakers = [];
        this.lastBreakerId = -1;
    }
}

var breakers = new Breakers();

export function newBreaker(config: IBreakerConfig = { closeThreshold: 5, openThreshold: 2, openTimeout: 5000, closeTimeout: 500},
                           exec: (breakerId: number, attemptId: number) => void,
                           done: (breakerId: number, attemptId: number) => void,
                           circuitEvents: (breakerId: number, status: kBreakerState) => void) {
    let id = Breakers.instance.lastBreakerId++;
    let b: IBreaker = {
        id: id,
        config: config,
        state: kBreakerState.closed,
        exec: exec,
        done: done,
        circuitEvents: circuitEvents,
        created: new Date().toISOString(),
        lastAttempt: "",
        attempts: {
            success: [],
            pending: [],
            failures: []
        }
    }

    Breakers.instance.breakers.push(b);
    _breakerAttempt(id, 0);

    return id;
}