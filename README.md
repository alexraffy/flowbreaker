# flowbreaker
Circuit Breaker and Flow

Exemple usage:

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
            console.log("breaker open");
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
