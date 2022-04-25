import {Flows} from "./newFlow";
import {IFlow} from "./IFlow";
import {IFlowStep} from "./IFlowStep";
import {breakerSuccess} from "../CircuitBreaker/breakerSuccess";
import {breakerFailure} from "../CircuitBreaker/breakerFailure";


export function flowCallback(flowId: string | number | undefined, success: boolean, status: string, payload: any = undefined) {

    if (Flows.instance.flows.length === 0) { return; }
    // find the flow
    let flow: IFlow = undefined;
    if (flowId !== undefined) {
        flow = Flows.instance.flows.find ((f) => {
            if (typeof flowId === "string") {
                return f.name === flowId;
            } else if (typeof flowId === "number") {
                return f.id === flowId;
            }
        });
    }
    if (flowId === undefined || flow === undefined) {
        flow = Flows.instance.flows[Flows.instance.flows.length - 1];
    }
    if (flow === undefined) {
        return;
    }
    if (payload !== undefined) {
        flow.payload = payload;
    }
    // find the step
    let step: IFlowStep = undefined;
    let stepId = flow.currentStepIndex;
    step = flow.steps[stepId];

    if (success === true) {
        if (step.callback !== undefined) {
            flow.currentStepIndex = step.callback(stepId, flow.breakerId, flow.attemptId);
        } else {
            flow.currentStepIndex++;
        }
        flow.attemptId = 0;
        let done = flow.currentStepIndex >= flow.steps.length;
        return breakerSuccess(flow.breakerId, flow.attemptId, done);
    } else {
        flow.attemptId++;
        return breakerFailure(flow.breakerId, flow.attemptId);
    }
}