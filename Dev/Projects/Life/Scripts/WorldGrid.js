var WorldGrid = (function () {
    function WorldGrid(cellSize, maxWorldSize) {
        this.cellSize = 0;
        this.cellsH = 0;
        this.cellsV = 0;
        this.entityArray = [];
        if (cellSize < 1) {
            cellSize = 1;
        }
        if (cellSize > maxWorldSize) {
            cellSize = maxWorldSize;
        }
        this.cellSize = cellSize;
        this.cellsH = Math.floor(maxWorldSize / cellSize);
        this.cellsV = Math.floor(maxWorldSize / cellSize);
        this.cellCount = this.cellsH * this.cellsV;
    }
    WorldGrid.prototype.GetCoords = function (idx) {
        var y = Math.floor(idx / this.cellsH);
        var x = idx - y * this.cellsH;
        return { "x": x, "y": y };
    };
    WorldGrid.prototype.GetIdx = function (x, y) {
        if (x < 0 || y < 0 || x >= this.cellsH || y >= this.cellsV) {
            return -1;
        }
        return this.cellsH * y + x;
    };
    WorldGrid.prototype.GridPixelToCellPos = function (x_grid, y_grid) {
        var x = Math.floor(x_grid / this.cellSize);
        var y = Math.floor(y_grid / this.cellSize);
        return { "x": x, "y": y };
    };
    WorldGrid.prototype.Render = function () {
        var gridArr = [];
        var entitiesArr = [];
        var cs = this.cellSize;
        var idx = 0;
        for (var y = 0; y < this.cellsV; y++) {
            for (var x = 0; x < this.cellsH; x++) {
                gridArr.push(RenderCell("cell-" + idx, x * cs, y * cs, cs - 1, cs - 1, "", "cell"));
                entitiesArr.push(RenderCell("ent-" + idx, 0, 0, 0, 0, "", ""));
                idx++;
            }
        }
        document.getElementById("gridDiv").innerHTML = gridArr.concat(entitiesArr).join("");
    };
    WorldGrid.prototype.InitArray = function () {
        var cellCount = this.cellsH * this.cellsV;
        for (var i = 0; i < cellCount; i++) {
            var div = document.getElementById("ent-" + i);
            if (!div) {
                break;
            }
            this.entityArray.push(div);
        }
    };
    return WorldGrid;
}());
function RenderCell(id, x, y, w, h, content, cssClass) {
    var classTxt = cssClass != "" ? " class=\"" + cssClass + "\"" : "";
    var html = "<div id=\"" + id + "\"" + classTxt +
        " style=\"position:absolute; left:" + x + "px; top:" + y + "px; width:" + w + "px; height:" + h + "px; cursor:default;\"" +
        "";
    html += ">" + content + "</div>";
    return html;
}
function RenderImg(id, x, y, w, h, src) {
    return "<img id=\"" + id + "\" src=\"" + src + "\"" +
        " style=\"position:absolute; left:" + x + "px; top:" + y + "px; width:" + w + "px; height:" + h + "px; display:none;\"" +
        " />";
}
function PaintCell(x_gridPixel, y_gridPixel) {
}
//# sourceMappingURL=WorldGrid.js.map