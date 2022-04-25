import {IFlow} from "./IFlow";
import {newBreaker} from "../CircuitBreaker/newBreaker";
import {IFlowStep} from "./IFlowStep";
import {breakerSuccess} from "../CircuitBreaker/breakerSuccess";
import {kBreakerState} from "../CircuitBreaker/kBreakerState";
import {flowNext} from "./flowNext";
import {IBreakerConfig} from "../CircuitBreaker/IBreakerConfig";
import {flowExit} from "./flowExit";


export class Flows {
    static instance: Flows;
    flows: IFlow[];
    constructor() {
        Flows.instance = this;
        this.flows = [];

    }
    lastFlowId: number = -1;
}

var flows = new Flows();


export function newFlow(name: string,
                        steps: IFlowStep[],
                        statusUpdate: (flowId: number, breakerStatus: kBreakerState, status: string) => void,
                        done: (payload?: any) => void,
                        breakerConfig: IBreakerConfig = {
                            closeThreshold: 1,
                            openThreshold: 2,
                            openTimeout: 100,
                            closeTimeout: 10,
                            openMultiplier: 7.6
                        }): number {
    let newId = ++Flows.instance.lastFlowId;
    let f: IFlow = {
        id: newId,
        name: name,
        currentStepIndex: 0,
        breakerId: 0,
        attemptId: 0,
        steps: steps,
    };
    Flows.instance.flows.push(f);

    f.breakerId = newBreaker(breakerConfig,
        (breakerId, attemptId) => {
            return flowNext(f.id, undefined);
        },
        (breakerId, attemptId) => {
            queueMicrotask( () => { flowExit(f.id); done(f.payload); });
        }, (breakerId, status) => {
            queueMicrotask( () => { statusUpdate(f.id, status, "BreakerStatus"); } );
        });

    return newId;
}

