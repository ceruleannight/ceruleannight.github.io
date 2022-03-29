var Debug = (function () {
    function Debug(activateItCounter) {
        this.IterationCounterActive = false;
        this.IterationCount = 0;
        this.IterationCounterActive = activateItCounter;
    }
    Debug.prototype.IncIteration = function () {
        if (!this.IterationCounterActive) {
            return;
        }
        this.IterationCount++;
    };
    return Debug;
}());
//# sourceMappingURL=Debug.js.map