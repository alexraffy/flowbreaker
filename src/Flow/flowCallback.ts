import {Flows} from "./newFlow";
import {IFlow} from "./IFlow";
import {IFlowStep} from "./IFlowStep";
import {breakerSuccess} from "../CircuitBreaker/breakerSuccess";
import {breakerFailure} from "../CircuitBreaker/breakerFailure";


export function flowCallback(flowId: string | number | undefined, success: boolean, status: string) {

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
        let done = flow.currentStepIndex >= flow.steps.length;
        return breakerSuccess(flow.breakerId, flow.attemptId, done);
    } else {
        return breakerFailure(flow.breakerId, flow.attemptId);
    }
}