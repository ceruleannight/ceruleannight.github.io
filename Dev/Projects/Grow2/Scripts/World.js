var g_world = null;
var World = (function () {
    //************************************************
    function World(showGridLines) {
        this.entityArray = [];
        this.worldAge = -1;
        this.ready = false;
        this.settings = new WorldSettings();
        this.grid = new WorldGrid(this.settings.cellSize, this.settings.maxWorldEdgeSide);
        this.grid.Render();
        this.grid.InitArray();
        this.rand = new RandomGen();
        if (!this.settings.genRandomKey) {
            this.rand.SetSeedFromKeyStr(this.settings.worldInitKey);
        }
        this.showGridLines = showGridLines;
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var coords = this.grid.GetCoords(i);
            this.entityArray.push(new Entity(i, coords.x, coords.y, this.settings));
        }
        this.ready = true;
    }
    //************************************************
    World.prototype.GetEntityAt = function (x, y) {
        var idx = this.grid.GetIdx(x, y);
        if (idx < 0 || idx > (this.entityArray.length - 1)) {
            return null;
        }
        return this.entityArray[idx];
    };
    //************************************************
    World.prototype.InitEntities = function () {
        var posAdj = this.grid.cellSize;
        var size = this.grid.cellSize - (this.showGridLines ? 1 : 0);
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var entity = this.entityArray[i];
            var div = entity.div;
            div.style.left = "" + (entity.cellX * posAdj + 1) + "px";
            div.style.top = "" + (entity.cellY * posAdj + 1) + "px";
            div.style.width = "" + size + "px";
            div.style.height = "" + size + "px";
        }
        var colorArray = GetColorArray();
        for (var i = 0; i < colorArray.length; i++) {
            this.RandomSpawn(colorArray[i]);
        }
        //this.RandomSpawn("FF0000");
        //this.RandomSpawn("0000FF");
        //this.RandomSpawn("FFFF00");
        //this.RandomSpawn("00FF00");
        //this.RandomSpawn("FFFFFF");
        //this.RandomSpawn("000000");
    };
    //************************************************
    World.prototype.SetGridLines = function () {
        this.showGridLines = document.getElementById("showGridlinesCb")["checked"];
        var size = this.grid.cellSize - (this.showGridLines ? 1 : 0);
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var entity = this.entityArray[i];
            var div = entity.div;
            div.style.width = "" + size + "px";
            div.style.height = "" + size + "px";
        }
    };
    //************************************************
    World.prototype.RandomSpawn = function (color) {
        var x = this.rand.NextInt(0, this.grid.cellsH - 1);
        var y = this.rand.NextInt(0, this.grid.cellsV - 1);
        this.GetEntityAt(x, y).Spawn(color);
    };
    //************************************************
    World.prototype.Update = function () {
        this.updating = true;
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var entity = this.entityArray[i];
            if (!entity.exists) {
                continue;
            }
            //entity.SetPosSize(0,0);
            entity.Update(this.rand);
            if (!entity.alive) {
                continue;
            }
            if (entity.queuedChild) {
                this.SpawnNewChild(entity);
                entity.queuedChild = false;
            }
            if (this.settings.influenceRate > 0 && entity.influence) {
                this.InfluenceOthers(entity);
                entity.influence = false;
            }
        }
        this.worldAge++;
        this.updating = false;
    };
    //************************************************
    World.prototype.SpawnNewChild = function (entity) {
        var scanDir = this.rand.Chance(.5) ? 1 : -1;
        //let tierIdx:number=this.rand.Chance(.3)?2:1;
        var tierIdx = this.rand.NextInt(1, 3);
        var tier = new OffsetTier(tierIdx);
        var startIdx = this.rand.NextInt(0, tier.elementCount - 1);
        for (var i = 0; i < tier.elementCount; i++) {
            var offset = new OffsetIndexer(tierIdx, startIdx + i * scanDir);
            var cell = this.GetEntityAt(entity.cellX + offset.X, entity.cellY + offset.Y);
            if (!cell || cell.exists) {
                continue;
            }
            cell.Spawn(entity.color);
            break;
        }
    };
    //************************************************
    World.prototype.InfluenceOthers = function (entity) {
        var scanDir = this.rand.Chance(.5) ? 1 : -1;
        var tierIdx = 1;
        var tier = new OffsetTier(tierIdx);
        var startIdx = this.rand.NextInt(0, tier.elementCount - 1);
        for (var i = 0; i < tier.elementCount; i++) {
            var offset = new OffsetIndexer(tierIdx, startIdx + i * scanDir);
            var cell = this.GetEntityAt(entity.cellX + offset.X, entity.cellY + offset.Y);
            if (!cell || !cell.exists || !cell.alive) {
                continue;
            }
            cell.BeInfluenced(entity, this.rand);
            break;
        }
    };
    //************************************************
    World.prototype.SpawnOrInfluenceCell = function (x, y, color) {
        var entity = this.GetEntityAt(x, y);
        if (!entity) {
            return;
        }
        if (entity.exists && entity.alive) {
            //entity.BeInfluenced(entity
            entity.Paint(color);
        }
        else {
            entity.Spawn(color);
        }
    };
    return World;
}());
//# sourceMappingURL=World.js.map