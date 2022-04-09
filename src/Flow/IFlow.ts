import {IFlowStep} from "./IFlowStep";


export interface IFlow {
    id: number;
    name: string;
    breakerId: number;
    attemptId: number;
    currentStepIndex: number;
    steps: IFlowStep[];
}