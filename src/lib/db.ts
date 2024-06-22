
class Timer {
    constructor(
        public id: number,
        public type: string,
        public length: number
    ) { }
}

class RunDetails {
    constructor(
        public toroId: number,
        public intervalId: number | null = null,
        public type: number,
        public remainingTime: number,
        public next: number | null
    ) { }

    isFinished(): boolean {
        return this.remainingTime === 0;
    }

    increment(): void {
        this.remainingTime++;
    }

    decrement(): void {
        this.remainingTime--;
    }

    setNext(): void {
        this.type = this.next ? this.next : 0 ;
        this.next = 0;
        this.remainingTime = 4;
        // if (timer?.type == 'pomodoro') {
        //     if ((runDetails.currentToro.finishedPomodoros + 1) % 4 === 0) {
        //         runDetails.currentToro.nextTimer = 2;
        //     } else {
        //         runDetails.currentToro.nextTimer = 1;
        //     }
        // } else if (timer?.type == 'shortBreak' || timer?.type == 'longBreak') {
        //     runDetails.currentToro.finishedPomodoros++;
        //     runDetails.currentToro.nextTimer = 0;
        // }
    }
}

class Toro {
    constructor(
        public id: number,
        public name: string,
        public numberOfPomodoros: number,
        public finishedPomodoros: number,
        public isActive: boolean,
        public isFinished: boolean
    ) { }
}

class Database {
    private runDetails: RunDetails | null = null;
    private toros: Toro[] = [];
    private timers: Timer[] = [
        new Timer(0, 'Work', 25),
        new Timer(1, 'Short Break', 5),
        new Timer(2, 'Long Break', 15)
    ];

    setRunDetails(currentTimer: RunDetails): void {
        this.runDetails = currentTimer;
    }

    addToro(toro: Toro): void {
        this.toros.push(toro);
    }

    getTimerById(id: number): Timer | undefined {
        return this.timers.find(timer => timer.id === id);
    }

    getToros(): Toro[] {
        return this.toros;
    }

    getToroById(id: number): Toro | undefined {
        return this.toros.find(toro => toro.id === id);
    }

    getRunDetails(): RunDetails | null {
        return this.runDetails;
    }

    getToroByCurrentTimer(): Toro | undefined {
        return this.runDetails ? this.getToroById(this.runDetails.toroId) : undefined;
    }

    setFinishedPomodoros(toroId: number, finishedPomodoros: number): void {
        const toro = this.getToroById(toroId);
        if (toro) {
            toro.finishedPomodoros = finishedPomodoros;
        }
        if (toro && toro.finishedPomodoros === toro.numberOfPomodoros) {
            toro.isFinished = true;
        }
    }
}

export { Database, Toro, RunDetails }