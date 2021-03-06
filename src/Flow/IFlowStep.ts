


export interface IFlowStep {
    name: string,
    run: (flowId: number, breakerId: number, attemptId: number, payload?: any) => void;
    callback?: (flowId: number, breakId: number, attemptId: number) => number;
}