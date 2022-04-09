import {IFlow} from "./IFlow";
import {newBreaker} from "../CircuitBreaker/newBreaker";
import {IFlowStep} from "./IFlowStep";
import {breakerSuccess} from "../CircuitBreaker/breakerSuccess";
import {kBreakerState} from "../CircuitBreaker/kBreakerState";
import {flowNext} from "./flowNext";


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


export function newFlow(name: string, steps: IFlowStep[], statusUpdate: (flowId: number, breakerStatus: kBreakerState, status: string) => void, done: () => void): number {
    let newId = ++Flows.instance.lastFlowId;
    let f: IFlow = {
        id: newId,
        name: name,
        currentStepIndex: 0,
        breakerId: -1,
        attemptId: -1,
        steps: steps,
    };
    Flows.instance.flows.push(f);

    f.breakerId = newBreaker({
        closeThreshold: 1,
        openThreshold: 2,
        openTimeout: 15000,
        closeTimeout: 100
        },
        (breakerId, attemptId) => {
            return flowNext(f.id, undefined);
        },
        (breakerId, attemptId) => {
            queueMicrotask( () => { done(); });
        }, (breakerId, status) => {
            queueMicrotask( () => { statusUpdate(f.id, status, "BreakerStatus"); } );
        });

    return newId;
}



/*
    newFlow("downloadPreferences",
     [{
        name: "paths"
        required: true,
        run: (flowId: number) => { SkeletWebSocket.instance.send(WSRPaths, {}); }
        callback: (flowId: number, ret: any) => { let flow = findFlow(flowId); return flow.currentStepIndex + 1; }
    },
    {
        name: "fonts",
        required: true,
        run: (flowId: number) => { SkeletWebSocket.instance.send(WSRFonts, {}); }
        callback: (flowId: number, ret: any) => { let flow = findFlow(flowId); return flow.currentStepIndex + 1; }
    });

 */