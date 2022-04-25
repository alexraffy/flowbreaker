import {Flows} from "./newFlow";
import {IFlow} from "./IFlow";
import {IFlowStep} from "./IFlowStep";
import {breakerSuccess} from "../CircuitBreaker/breakerSuccess";


export function flowNext(identifier: string | number | undefined, stepId: string | number | undefined) {
    if (Flows.instance.flows.length === 0) { return; }
    // find the flow
    let flow: IFlow = undefined;
    if (identifier !== undefined) {
        flow = Flows.instance.flows.find ((f) => {
            if (typeof identifier === "string") {
                return f.name === identifier;
            } else if (typeof identifier === "number") {
                return f.id === identifier;
            }
        });
    }
    if (identifier === undefined || flow === undefined) {
        flow = Flows.instance.flows[Flows.instance.flows.length - 1];
    }
    if (flow === undefined) {
        return;
    }
    // find the step
    let step: IFlowStep = undefined;
    if (stepId === undefined) {
        stepId = flow.currentStepIndex;
    }

    if (stepId !== undefined) {
        if (typeof stepId === "string") {
            step = flow.steps.find((s) => {
                return s.name === stepId;
            })
        }
        if (typeof stepId === "number") {
            if (stepId > flow.steps.length - 1) {
                return breakerSuccess(flow.breakerId, flow.attemptId, true);
            }
            step = flow.steps[stepId];
        }
    }

    step.run(flow.id, flow.breakerId, flow.attemptId, flow.payload);


}