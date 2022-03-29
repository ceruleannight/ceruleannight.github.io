var WorldSettings = (function () {
    function WorldSettings() {
        this.maxWorldEdgeSide = 600;
        this.colorArray = [];
        this.runSpeed = 0;
        this.cellSize = parseInt(document.getElementById("cellSizeRange")["value"], 10);
        this.genRandomKey = document.getElementById("createRandomWorldCb")["checked"];
        this.worldInitKey = document.getElementById("worldKeyTb")["value"];
        this.SetBirthRate(5);
        this.SetDeathRate(2);
        this.SetInfluenceRate(0);
    }
    WorldSettings.prototype.SetWorldSpeed = function (val) {
        this.runSpeed = val;
        var delay = 0;
        switch (val) {
            case 1:
                delay = 200;
                break;
            case 2:
                delay = 90;
                break;
            case 3:
                delay = 30;
                break;
            case 4:
                delay = 10;
                break;
            case 5:
                delay = 1;
                break;
        }
        this.clockDelayMs = delay;
    };
    WorldSettings.prototype.SetBirthRate = function (val) {
        this.birthRate = val;
        this.birthChance = .3 * (val / 10);
    };
    WorldSettings.prototype.SetDeathRate = function (val) {
        this.deathRate = val;
        this.deathChance = .3 * (val / 10);
        this.deathChanceYouth = this.deathChance / 2;
    };
    WorldSettings.prototype.SetInfluenceRate = function (val) {
        this.influenceRate = val;
        this.influenceChance = .9 * (val / 10);
    };
    return WorldSettings;
}());
//# sourceMappingURL=WorldSettings.js.map