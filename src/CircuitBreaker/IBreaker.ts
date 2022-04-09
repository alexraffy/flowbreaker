import {IBreakerConfig} from "./IBreakerConfig";
import {kBreakerState} from "./kBreakerState";


export interface IBreaker {
    id: number;
    config: IBreakerConfig;
    state: kBreakerState;
    exec: (breakerId: number, attemptId: number) => void;
    done: (breakerId: number, attemptId: number)  => void;
    circuitEvents: (breakerId: number, status: kBreakerState) => void;
    created: string;
    lastAttempt: string;
    attempts: {
        success: {id: number, kind: string, timestamp: string}[],
        failures: {id: number, kind: string, timestamp: string}[]
        pending: {id: number, kind: string, timestamp: string}[]
    }
}





