var CellList = (function () {
    function CellList(ownerId) {
        this.cellList = [];
        this.bordersPlayer = false;
        this.bordersComp = false;
        this.nMost = -1;
        this.eMost = -1;
        this.sMost = -1;
        this.wMost = -1;
        this.nReachRatio = 0;
        this.eReachRatio = 0;
        this.sReachRatio = 0;
        this.wReachRatio = 0;
        this.ownerId = ownerId;
    }
    CellList.prototype.AddCell = function (cell) {
        this.cellList.push(cell);
    };
    CellList.prototype.CheckPlayerAndCompBordering = function (board) {
        this.bordersPlayer = this.CheckOwnerBordering(GameSettings.PlayerOwnerId, board);
        this.bordersComp = this.CheckOwnerBordering(GameSettings.CompOwnerId, board);
    };
    CellList.prototype.CheckOwnerBordering = function (ownerId, board) {
        var list = this.cellList;
        for (var i = 0; i < list.length; i++) {
            var cell = list[i];
            if (this.CheckCell(cell, board, ownerId, 0, -1)) {
                return true;
            }
            if (this.CheckCell(cell, board, ownerId, 0, 1)) {
                return true;
            }
            if (this.CheckCell(cell, board, ownerId, -1, 0)) {
                return true;
            }
            if (this.CheckCell(cell, board, ownerId, 1, 0)) {
                return true;
            }
        }
        return false;
    };
    CellList.prototype.CheckCell = function (cell, board, ownerId, xOffset, yOffset) {
        var otherCell = board.GetCellAt(cell.cellX + xOffset, cell.cellY + yOffset);
        if (!otherCell) {
            return false;
        }
        return otherCell.ownerId == ownerId;
    };
    CellList.prototype.SetCellStats = function (board) {
        var list = this.cellList;
        if (list.length == 0) {
            return;
        }
        var cell = list[0];
        var nReach = board.height - cell.cellY;
        var eReach = cell.cellX + 1;
        var sReach = cell.cellY + 1;
        var wReach = board.width - cell.cellX;
        this.nMost = nReach;
        this.eMost = eReach;
        this.sMost = sReach;
        this.wMost = wReach;
        for (var i = 0; i < list.length; i++) {
            cell = list[i];
            nReach = board.height - cell.cellY;
            eReach = cell.cellX + 1;
            sReach = cell.cellY + 1;
            wReach = board.width - cell.cellX;
            if (nReach > this.nMost) {
                this.nMost = nReach;
            }
            if (eReach > this.eMost) {
                this.eMost = eReach;
            }
            if (sReach > this.sMost) {
                this.sMost = sReach;
            }
            if (wReach > this.wMost) {
                this.wMost = wReach;
            }
        }
        this.nReachRatio = this.nMost / board.height;
        this.eReachRatio = this.eMost / board.width;
        this.sReachRatio = this.sMost / board.height;
        this.wReachRatio = this.wMost / board.width;
    };
    return CellList;
}());
//# sourceMappingURL=CellList.js.map