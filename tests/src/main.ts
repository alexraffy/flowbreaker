import * as assert from "assert";
import {breakerFailure, Breakers, breakerSuccess, flowCallback, kBreakerState, newBreaker, newFlow} from "flowbreaker";


let breakerOptions = {
    closeThreshold: 5,
    openThreshold: 2,
    openTimeout: 5000,
    closeTimeout: 500
};

let nAttempt = -1;
let circuitSwitchedToOpened = false;
let circuitSwitchedToHalfOpened = false;
let circuitSwitchedToClosed = false;

console.log("");
console.log("TEST1 CIRCUIT BREAKER")
let breakerId = newBreaker(breakerOptions,
    (breakerId, attemptId) => {
        nAttempt++;

        assert(nAttempt === attemptId, "attemptId should start at 0");
        if (attemptId < 10) {
            console.log(new Date().toISOString() +  "\t" + "attemptId " + attemptId + " SUCCESS");
            return breakerSuccess(breakerId, attemptId, false);
        }
        if (attemptId >= 10 && attemptId < 12) {
            console.log(new Date().toISOString() +  "\t" + "attemptId " + attemptId + " FAILURE");
            return breakerFailure(breakerId, attemptId);
        }
        if (attemptId >= 12) {
            console.log(new Date().toISOString() +  "\t" + "attemptId " + attemptId + " SUCCESS");
            return breakerSuccess(breakerId, attemptId, attemptId < 20 ? false : true);
        }
    },
    (breakerId: number, attemptId: number) => {
        console.log(new Date().toISOString() +  "\t" + "breaker is done.");
        next();
    },
    (breakerId: number, status: kBreakerState) => {
        switch (status) {
            case kBreakerState.closed: {
                console.log(new Date().toISOString() + "\t" + "circuit is closed.");
                circuitSwitchedToClosed = true;
            }
                break;
            case kBreakerState.halfOpened: {
                console.log(new Date().toISOString() + "\t" + "circuit is half-opened.");
                circuitSwitchedToHalfOpened = true;
            }
                break;
            case kBreakerState.opened: {
                console.log(new Date().toISOString() + "\t" + "circuit is opened.");
                circuitSwitchedToOpened = true;
            }
                break;
        }
    });



function next() {
    assert(Breakers.instance.lastBreakerId === breakerId, "lastBreakerId not updated.");
    assert(Breakers.instance.breakers.length === 0, "breaker was not deleted after use.");
    test2();
}


function test2() {
    console.log("");
    console.log("TEST2 CIRCUIT BREAKER TIMEOUT MULTIPLIER")
    let nAttempt = -1;
    let  breakerOptions = {
        closeThreshold: 5,
        openThreshold: 2,
        openTimeout: 100,
        closeTimeout: 10,
        openMultiplier: 6.5
    };
    breakerId = newBreaker(breakerOptions,
        (breakerId, attemptId) => {
            nAttempt++;

            assert(nAttempt === attemptId, "attemptId should start at 0");
            if (attemptId < 10) {
                console.log(new Date().toISOString() +  "\t" + "attemptId " + attemptId + " FAILURE");
                return breakerFailure(breakerId, attemptId);
            }
            console.log(new Date().toISOString() +  "\t" + "attemptId " + attemptId + " SUCCESS");
            breakerSuccess(breakerId, attemptId, true);
        },
        (breakerId: number, attemptId: number) => {
            test3()
        },
        (breakerId: number, status: kBreakerState) => {
            switch (status) {
                case kBreakerState.closed: {
                    console.log(new Date().toISOString() + "\t" + "circuit is closed.");
                    circuitSwitchedToClosed = true;
                }
                    break;
                case kBreakerState.halfOpened: {
                    console.log(new Date().toISOString() + "\t" + "circuit is half-opened.");
                    circuitSwitchedToHalfOpened = true;
                }
                    break;
                case kBreakerState.opened: {
                    console.log(new Date().toISOString() + "\t" + "circuit is opened.");
                    circuitSwitchedToOpened = true;
                }
                    break;
            }
        });
}


function test3() {
    console.log("");
    console.log("TEST3 FLOW TEST")
    newFlow("flowTest", [
            {
                name: "step1",
                run: (flowId: number, breakerId: number, attemptId: number) =>  {
                    console.log(new Date().toISOString() + "\t" + "step1 breakerId: " + breakerId + " attemptId: " + attemptId);
                    if (attemptId < 10) {
                        return flowCallback(flowId, false, "fail");
                    }
                    flowCallback(flowId, true, "ok");
                }
            },
            {
                name: "step2",
                run: (flowId: number, breakerId: number, attemptId: number) =>  {
                    console.log(new Date().toISOString() + "\t" + "step2 breakerId: " + breakerId + " attemptId: " + attemptId);
                    if (attemptId < 10) {
                        return flowCallback(flowId, false, "fail2");
                    }
                    flowCallback(flowId, true, "ok2");
                }
            }

        ],
        (flowId, breakerStatus, status) => {
            let sBreakerStatus = "";
            switch (breakerStatus) {
                case kBreakerState.closed:
                    sBreakerStatus = "closed";
                    break;
                case kBreakerState.halfOpened:
                    sBreakerStatus = "halfOpened";
                    break;
                case kBreakerState.opened:
                    sBreakerStatus = "opened";
                    break;
            }
            console.log("STATUS UPDATE breakerStatus: " + sBreakerStatus + " status: " + status)
        },
        () => {
            console.log("DONE.");
            process.exit(0);
        });
}