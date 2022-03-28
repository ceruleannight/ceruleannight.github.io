var GameGrid = (function () {
    function GameGrid(horzCells, vertCells, cellSize) {
        this.cellSize = 0;
        this.cellsH = 0;
        this.cellsV = 0;
        this.cellSize = cellSize;
        this.cellsH = horzCells;
        this.cellsV = vertCells;
        this.cellCount = this.cellsH * this.cellsV;
        this.gridWidth_pix = horzCells * cellSize;
        this.maxX = horzCells - 1;
        this.maxY = vertCells - 1;
    }
    GameGrid.prototype.GetCoords = function (idx) {
        var y = Math.floor(idx / this.cellsH);
        var x = idx - y * this.cellsH;
        return { "x": x, "y": y };
    };
    GameGrid.prototype.Render = function () {
        var gridArr = [];
        var entitiesArr = [];
        var symArr = [];
        var cs = this.cellSize;
        var imgOffset = 5;
        var idx = 0;
        for (var y = 0; y < this.cellsV; y++) {
            for (var x = 0; x < this.cellsH; x++) {
                entitiesArr.push(RenderCell("ent-" + idx, 0, 0, 0, 0, "Cc(event," + idx + ")", "", "obj"));
                symArr.push(RenderImg("sym-" + idx, x * cs + imgOffset, y * cs + imgOffset, cs, cs, ""));
                idx++;
            }
        }
        document.getElementById("gridDiv").innerHTML = gridArr.concat(entitiesArr, symArr).join("");
    };
    GameGrid.prototype.SizeAndPositionCells = function () {
        var showGridLines = true;
        var posAdj = this.cellSize;
        var size = this.cellSize - (showGridLines ? 1 : 0);
        for (var i = 0; i < this.cellCount; i++) {
            var div = document.getElementById("ent-" + i);
            if (!div) {
                continue;
            }
            var coords = this.GetCoords(i);
            div.style.left = "" + (coords.x * posAdj + 1) + "px";
            div.style.top = "" + (coords.y * posAdj + 1) + "px";
            div.style.width = "" + size + "px";
            div.style.height = "" + size + "px";
        }
    };
    GameGrid.prototype.SetCellColor = function (cellIdx, color) {
        var div = document.getElementById("ent-" + cellIdx);
        if (!div) {
            return;
        }
        div.style.backgroundColor = "#" + color;
    };
    GameGrid.prototype.SetCellSymbol = function (cellIdx, ownerId, showSymbol) {
        var img = document.getElementById("sym-" + cellIdx);
        if (!img) {
            return;
        }
        var src = "";
        if (showSymbol) {
            if (ownerId == GameSettings.PlayerOwnerId) {
                src = "_imgs/CircleSymbol.gif";
            }
            if (ownerId == GameSettings.CompOwnerId) {
                src = "_imgs/XSymbol.gif";
            }
        }
        img.src = src;
        img.style.display = "block";
    };
    return GameGrid;
}());
//# sourceMappingURL=GameGrid.js.map