var GameBoard = (function () {
    function GameBoard(width, height, colorCount) {
        this.cellArray = [];
        this.width = width;
        this.height = height;
        this.cellArray = [];
        this.colorCount = colorCount;
        this.maxColorIdx = colorCount - 1;
        this.boardMaxX = width - 1;
        this.boardMaxY = height - 1;
    }
    GameBoard.prototype.InitCellColors = function (rand) {
        this.cellArray = [];
        var cellCount = this.width * this.height;
        for (var i = 0; i < cellCount; i++) {
            var colorIdx = rand.NextInt(0, this.maxColorIdx);
            var coords = this.GetBoardCoords(i);
            this.cellArray.push(new GameBoardCell(i, colorIdx, coords.x, coords.y));
        }
    };
    GameBoard.prototype.GetBoardCoords = function (idx) {
        var y = Math.floor(idx / this.width);
        var x = idx - y * this.width;
        return { "x": x, "y": y };
    };
    GameBoard.prototype.GetBoardIdx = function (x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return -1;
        }
        return this.width * y + x;
    };
    GameBoard.prototype.GetCellAt = function (x, y) {
        var idx = this.GetBoardIdx(x, y);
        if (idx < 0 || idx > (this.cellArray.length - 1)) {
            return null;
        }
        return this.cellArray[idx];
    };
    GameBoard.prototype.GetCellAtBoardIdx = function (boardIdx) {
        if (boardIdx < 0 || boardIdx > (this.cellArray.length - 1)) {
            return null;
        }
        return this.cellArray[boardIdx];
    };
    GameBoard.prototype.SetAnchorColor = function (cellIdx) {
        var cell = this.GetCellAtBoardIdx(cellIdx);
        if (!cell) {
            return;
        }
        for (var i = 0; i <= this.maxColorIdx; i++) {
            if (!this.ColorExistsAdjacent(cell.cellX, cell.cellY, i)) {
                cell.SetColor(i);
                break;
            }
        }
    };
    GameBoard.prototype.ColorExistsAdjacent = function (x, y, colorIdx) {
        var cell = this.GetCellAt(x, y - 1);
        if (cell && cell.colorIdx == colorIdx) {
            return true;
        }
        cell = this.GetCellAt(x + 1, y);
        if (cell && cell.colorIdx == colorIdx) {
            return true;
        }
        cell = this.GetCellAt(x, y + 1);
        if (cell && cell.colorIdx == colorIdx) {
            return true;
        }
        cell = this.GetCellAt(x - 1, y);
        if (cell && cell.colorIdx == colorIdx) {
            return true;
        }
        return false;
    };
    GameBoard.prototype.GetOwnerStats = function (ownerId) {
        var cellsTotal = this.cellArray.length;
        var owned = 0;
        for (var i = 0; i < cellsTotal; i++) {
            var cell = this.cellArray[i];
            if (cell.ownerId == ownerId) {
                owned++;
            }
        }
        var percent = owned / cellsTotal;
        percent = Math.floor(percent * 100);
        var obj = { "owned": owned, "cellsTotal": cellsTotal, "percent": percent };
        return obj;
    };
    GameBoard.prototype.AreAllCellsOwned = function () {
        var cellsTotal = this.cellArray.length;
        for (var i = 0; i < cellsTotal; i++) {
            var cell = this.cellArray[i];
            if (cell.ownerId < 0) {
                return false;
            }
        }
        return true;
    };
    GameBoard.prototype.Pack = function () {
        var out = [];
        out.push("{" +
            "\"width\":" + this.width + "," +
            "\"height\":" + this.height + "," +
            "\"colors\":" + this.colorCount + "," +
            "\"cells\":" +
            "[");
        var cellsTotal = this.cellArray.length;
        for (var i = 0; i < cellsTotal; i++) {
            var cell = this.cellArray[i];
            var objStr = "";
            if (i > 0) {
                objStr += ",";
            }
            objStr += "{\"c\":" + cell.colorIdx + ",\"o\":" + cell.ownerId + "}";
            out.push(objStr);
        }
        out.push("]}");
        return out.join("");
    };
    GameBoard.prototype.Unpack = function (boardStr) {
        var obj = JSON.parse(boardStr);
        this.width = obj.width;
        this.height = obj.height;
        this.boardMaxX = this.width - 1;
        this.boardMaxY = this.height - 1;
        this.colorCount = obj.colors;
        this.maxColorIdx = this.colorCount - 1;
        this.cellArray = [];
        var cellCount = this.width * this.height;
        for (var i = 0; i < cellCount; i++) {
            if (i >= obj.cells.length) {
                alert("Index overrun in Unpack!!");
                return;
            }
            var cellData = obj.cells[i];
            var colorIdx = cellData.c;
            var ownerId = cellData.o;
            var coords = this.GetBoardCoords(i);
            var cell = new GameBoardCell(i, colorIdx, coords.x, coords.y);
            cell.SetOwner(ownerId);
            this.cellArray.push(cell);
        }
    };
    return GameBoard;
}());
//# sourceMappingURL=GameBoard.js.map