#flowbreaker
Circuit Breaker and Flow library for Javascript/Typescript.

###Circuit Breaker Usage

Create a new circuit breaker with:
```
export function newBreaker(config: IBreakerConfig,
                           exec: (breakerId: number, attemptId: number) => void,
                           done: (breakerId: number, attemptId: number) => void,
                           circuitEvents: (breakerId: number, status: kBreakerState) => void);
```
config should be of type:
```
export interface IBreakerConfig {
    closeThreshold: number;
    openThreshold: number;
    openTimeout: number;
    closeTimeout: number;
    openMultiplier?: number;
}
```
The circuit is closed when it is running at full speed, opened when it has failed {openThreshold} times.
After recovering from a failure, the circuit is half-opened and will return to full speed after success-ing {closeThreshold} times.

closeTimeout is the amount of milliseconds between each successful  run.

openTimeout is the amount of milliseconds between each failed runs.

openMultiplier if specified multiply openTimeout by the number of failures and the specified decimal value.

<br><br>

```
exec: (breakerId: number, attemptId: number) => void
```

The second parameter exec is the function to call on the circuit breaker.
It must call at some point breakerSuccess or breakerFailure.
```
export function breakerSuccess(breakerId: number, attemptId: number, done: boolean);
export function breakerFailure(breakerId: number, attemptId: number);
```
If breakerSuccess is called with done === true, the breaker is terminated and the done function specified in newBreaker will be called.

<br><br>

```
done: (breakerId: number, attemptId: number) => void
```
The third parameter done is the function called before the breaker is terminated.

<br><br>

```
circuitEvents: (breakerId: number, status: kBreakerState) => void)
```
The fourth parameter circuitEvents is called when the circuit breaker status changes.
status is an enum with the possible values:
```
export enum kBreakerState {
    opened,
    halfOpened,
    closed
}
```

<br><br>

Breaker example:

```

const options = {
    closeThreshold: 5, openThreshold: 2, openTimeout: 5000, closeTimeout: 500
};

let fExec = (breakerId: number, attemptId: number ) => {
    // attempt something
    if (true) {
        breakerSuccess(breakerId, attemptId, true);
    } else {
        breakerFailure(breakerId, attemptId);
    }
}
let fDone = (breakerId: number, attemptId: number) => {
    console.log("done.");
}
let fStatus = (breakerId: number, status: kBreakerState) => {
    switch (status) {
        case kBreakerState.opened:
            console.log("breaker opened");
            break;
        case kBreakerState.closed:
            console.log("breaker closed");
            break;
    }
}

let breakerId = newBreaker(
    options,
    fExec,
    fDone,
    fStatus
);
```

###Flow

A circuit breaker with different branches.

Flow example:

```
newFlow("flowTest", [
            {
                name: "step1",
                run: (flowId: number, breakerId: number, attemptId: number) =>  {
                    // attempt something
                    if (true) {
                        flowCallback(flowId, true, "ok", {some:"data"});
                    } else {
                        flowCallback(flowId, false, "Failed");
                    }
                }
            },
            {
                name: "step2",
                run: (flowId: number, breakerId: number, attemptId: number, payload: any) =>  {
                   
                    // second step to our flow
                    if (payload.some === "data") {
                        payload.more = "data";
                        flowCallback(flowId, true, "ok", payload);
                    }
                }
            }

        ],
        (flowId, breakerStatus, status) => {
            // the circuit breaker status has changed 
        },
        (payload: any) => {
            // flow done
            console.dir(payload);
        });

```