var Entity = (function () {
    //************************************************
    function Entity(idx, cellX, cellY, worldSets) {
        this.exists = false;
        this.alive = false;
        this.age = 0;
        this.queuedChild = false;
        this.influence = false;
        this.yearsDead = 0;
        this.color = "FF0000";
        this.idx = idx;
        this.cellX = cellX;
        this.cellY = cellY;
        this.worldSets = worldSets;
        this.div = document.getElementById("ent-" + idx);
        this.boneImg = document.getElementById("bone-" + idx);
    }
    //************************************************
    Entity.prototype.SetVisibility = function (show) {
        this.div.style.display = show ? "block" : "none";
    };
    //************************************************
    Entity.prototype.Spawn = function (color) {
        this.exists = true;
        this.alive = true;
        this.age = 0;
        this.color = color;
        this.queuedChild = false;
        this.SetDeadLook(false);
        this.SetVisibility(true);
        this.div.style.backgroundColor = "#" + this.color;
    };
    //************************************************
    Entity.prototype.BeInfluenced = function (otherEntity, rand) {
        this.color = PolarizeColor(this.color, otherEntity.color, rand.Next() * .1);
    };
    //************************************************
    Entity.prototype.Paint = function (color) {
        this.color = color;
    };
    //************************************************
    Entity.prototype.SetDeadLook = function (on) {
        //this.div.innerHTML=on?"<img src=\"images/Crossbones_9x9.gif\" style=\"margin:0px; padding:0px;\" />":"";
        this.boneImg.style.display = on ? "block" : "none";
    };
    //************************************************
    // Time passes
    Entity.prototype.Update = function (rand) {
        this.div.style.backgroundColor = "#" + this.color;
        // Bones growing old
        if (!this.alive) {
            this.yearsDead++;
            if (this.yearsDead > 3) {
                this.exists = false;
                this.SetVisibility(false);
                this.SetDeadLook(false);
            }
            return;
        }
        // Spawning children
        //if(this.age>5)
        //{
        if (rand.Chance(this.worldSets.birthChance)) {
            this.queuedChild = true;
        }
        if (this.worldSets.influenceRate > 0 && rand.Chance(this.worldSets.influenceChance)) {
            this.influence = true;
        }
        //}
        // Dying
        var deathChance = 0;
        if (this.age > 5) {
            deathChance = this.worldSets.deathChanceYouth;
        }
        if (this.age > 70) {
            deathChance = this.worldSets.deathChance;
        }
        //deathChance=0; // Remove later <<<<<<<<<<<<<<<<<<<<<<<<
        if (rand.Chance(deathChance)) {
            this.alive = false;
            this.yearsDead = 0;
            this.SetDeadLook(true);
            this.SetVisibility(false);
        }
        //if(this.age>)
        this.age++;
    };
    return Entity;
}());
//# sourceMappingURL=Entity.js.map