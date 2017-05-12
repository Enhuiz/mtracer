export class ExecTimer {
    startTime: Date;
    constructor() {
        this.startTime = new Date();
    }

    read() {
        return "Duration: " + this.getDeltaTime() + " ms"
    }
    
    getDeltaTime() {
        return new Date().getTime() - this.startTime.getTime();
    }
}