var Entity = (function () {
    function Entity(idx, cellX, cellY, worldSets) {
        this.alive = false;
        this.nextAlive = false;
        this.age = 0;
        this.color = "000000";
        this.idx = idx;
        this.cellX = cellX;
        this.cellY = cellY;
        this.worldSets = worldSets;
        this.div = document.getElementById("ent-" + idx);
    }
    Entity.prototype.SetVisibility = function (show) {
        this.div.style.display = show ? "block" : "none";
        this.div.style.backgroundColor = "#" + this.color;
    };
    Entity.prototype.Spawn = function (color) {
        this.alive = true;
        this.age = 0;
        this.color = color;
        this.SetVisibility(true);
        this.div.style.backgroundColor = "#" + this.color;
    };
    Entity.prototype.BeInfluenced = function (otherEntity, rand) {
        this.color = PolarizeColor(this.color, otherEntity.color, rand.Next() * .1);
    };
    Entity.prototype.Paint = function (color) {
        this.color = color;
    };
    Entity.prototype.Update = function (rand) {
        this.age++;
    };
    Entity.prototype.Render = function () {
        this.alive = this.nextAlive;
        this.SetVisibility(this.alive);
    };
    return Entity;
}());
//# sourceMappingURL=Entity.js.map