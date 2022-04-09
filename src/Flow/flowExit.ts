import {Flows} from "./newFlow";
import {IFlow} from "./IFlow";


export function flowExit(flowId: string | number | undefined) {
    if (Flows.instance.flows.length === 0) { return; }
    // find the flow
    let flowIndex: number = undefined;
    if (typeof flowId === "string") {
        flowIndex = Flows.instance.flows.findIndex((f) => { return f.name === flowId;});
    } else if (typeof flowId === "number") {
        flowIndex = flowId;
    } else {
        flowIndex = Flows.instance.flows.length -1;
    }
    if (flowIndex !== undefined) {
        Flows.instance.flows.splice(flowIndex, 1);
    }

}