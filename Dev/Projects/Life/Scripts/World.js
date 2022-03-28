var g_world = null;
var World = (function () {
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
    World.prototype.GetEntityAt = function (x, y) {
        var idx = this.grid.GetIdx(x, y);
        if (idx < 0 || idx > (this.entityArray.length - 1)) {
            return null;
        }
        return this.entityArray[idx];
    };
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
        this.SpawnRandomEntities();
    };
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
    World.prototype.SpawnEntity = function (x, y) {
        this.GetEntityAt(x, y).Spawn("000000");
    };
    World.prototype.SpawnRandomEntities = function () {
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            if (this.rand.Chance(.7)) {
                continue;
            }
            var entity = this.entityArray[i];
            entity.Spawn("000000");
        }
    };
    World.prototype.Update = function () {
        this.updating = true;
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var entity = this.entityArray[i];
            var neighbors = this.CountNeighbors(entity);
            if (entity.alive) {
                if (neighbors < 2 || neighbors > 3) {
                    entity.nextAlive = false;
                }
                else if (neighbors == 2 || neighbors == 3) {
                    entity.nextAlive = true;
                }
            }
            else if (neighbors == 3) {
                entity.nextAlive = true;
            }
            entity.Update(this.rand);
        }
        this.worldAge++;
    };
    World.prototype.Render = function () {
        var cellCount = this.grid.cellCount;
        for (var i = 0; i < cellCount; i++) {
            var entity = this.entityArray[i];
            entity.Render();
        }
        this.updating = false;
    };
    World.prototype.CountNeighbors = function (entity) {
        var count = 0;
        for (var i = 0; i < 8; i++) {
            var offset = new OffsetIndexer(1, i);
            var cell = this.GetEntityAt(entity.cellX + offset.X, entity.cellY + offset.Y);
            if (!cell) {
                continue;
            }
            if (cell.alive) {
                count++;
            }
        }
        return count;
    };
    return World;
}());
//# sourceMappingURL=World.js.map