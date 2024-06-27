/*
    NOTE: THIS IS TEMPORARY CODE. IT WILL BE REPLACED WITH A DATABASE IN THE FUTURE.

    * This file is responsible for handling the database operations.
    * It contains the classes for the database and the entities.
    * The entities are the Timer, RunDetails, and Toro classes.
    * The Database class is responsible for storing the timers, toros, and run details.
    * It also contains the methods to add, get, and update the timers, toros, and run details.
*/


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

    updateDetails(db: Database): void {
        let toro = db.getToroById(this.toroId);
        console.log(toro)
        if (!toro) {
            console.error("Toro not found");
            return;
        }
        if (toro.isFinished) {
            console.log("Toro is finished");
            return;
        }
        if (this.type == 0) {
            console.log(`Incrementing finished pomodoros for ${toro?.id}`);
            toro.finishedPomodoros++;
            if (toro.finishedPomodoros === toro.numberOfPomodoros) {
                toro.isFinished = true;
            }
            db.setToro(toro);
            if (toro.isFinished) {
                console.log("Toro has finished");
                this.remainingTime = -1;
                return;
            }
        }
        let currrentType = this.type;
        if (currrentType === 0) {
            console.log("Moving to break");
            if (toro.finishedPomodoros % 4 === 0 && toro.finishedPomodoros !== 0) {
                console.log("Long break.");
                this.type = 2;
            } else {
                console.log("Short break.");
                this.type = 1;
            }
            this.next = 0;
        } else {
            console.log("Moving to pomodoro.");
            if (toro.finishedPomodoros % 4 === 0 && toro.finishedPomodoros !== 0) {
                this.next = 2;
            } else {
                this.next = 1;
            }
            this.type = 0;
        }
        this.remainingTime = db.getTimerById(this.type)?.length || 25 * 60;
        this.intervalId = null;
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
        new Timer(0, 'Pomodoro', 25 * 60),
        new Timer(1, 'Short Break', 5 * 60),
        new Timer(2, 'Long Break', 15 * 60)
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

    setToro(toro: Toro): void {
        const index = this.toros.findIndex(t => t.id === toro.id);
        if (index !== -1) {
            console.log('Toro updated')
            this.toros[index] = toro;
        }
    }
}

export { Database, Toro, RunDetails }