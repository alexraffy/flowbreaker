




export class QueueLimiter {

    private m_arrayEvents: (()=>void)[];

    private m_interval: number;
    private m_rateLimitPerInterval: number;

    private m_rateInterval: number;

    private m_spread: boolean;
    private m_lastMessageTimestamp: number;
    private m_lastIntervalStartTimestamp: number;

    private m_currentRate: number;
    private m_dropRate: number;
    private m_counter: number;

    statsRate: number[];
    statsDropRate: number[];

    private m_lock: boolean = false;

    constructor(interval: number, rateLimitPerInterval: number, spread: boolean) {
        this.m_arrayEvents = [];

        this.m_interval = interval;
        this.m_rateLimitPerInterval = rateLimitPerInterval;

        this.m_spread = spread;
        this.m_lastMessageTimestamp = Date.now();
        this.m_lastIntervalStartTimestamp = Date.now();

        this.m_rateInterval = (interval / this.m_rateLimitPerInterval);


        this.m_currentRate = 0;
        this.m_dropRate = 0;
        this.statsRate = [];
        this.statsDropRate = [];
    }


    queue(func: () => void) {
        this.m_arrayEvents.push(func);
        if (this.m_lock === false) {
            this.dequeue();
        }
    }

    private resetInterval() {
        this.m_currentRate = 0;
        this.m_dropRate = 0;
        this.m_lastIntervalStartTimestamp = Date.now();
    }

    private dequeue() {
        this.m_lock = true;
        let send = false;
        let now = Date.now();

        if (this.m_spread === false) {
            let nextInterval = this.m_lastIntervalStartTimestamp + this.m_interval;
            if (now > nextInterval) {
                this.resetInterval();
                send = true;
            } else {
                if (this.m_currentRate < this.m_rateLimitPerInterval) {
                    send = true;
                }
            }
        } else {

            if (this.m_lastMessageTimestamp + this.m_rateInterval < now) {
                send = true;
            }

        }


        let msg = this.m_arrayEvents.shift();
        if (send === true) {
            if (msg !== undefined) {
                try {
                    this.m_currentRate++;
                    msg();
                    this.m_lastMessageTimestamp = now;
                } catch (ee) {
                    console.log(ee.message);
                    console.dir(ee.stack);
                }
            }
        } else {
            this.m_dropRate++;
        }

        this.m_lock = false;
        if (this.m_arrayEvents.length > 0) {
            this.dequeue();
        }
    }


}

