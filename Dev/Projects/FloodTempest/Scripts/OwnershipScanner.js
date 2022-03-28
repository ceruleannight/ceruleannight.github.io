var OwnershipScanner = (function () {
    function OwnershipScanner(board) {
        this.cellSetList = [];
        this.board = board;
    }
    OwnershipScanner.prototype.FillSweep = function () {
        this.cellSetList.push(new CellList(GameSettings.PlayerOwnerId));
        this.cellSetList.push(new CellList(GameSettings.CompOwnerId));
        var ownerId = GameSettings.CheckOwnersStartId;
        var arr = this.board.cellArray;
        for (var i = 0; i < arr.length; i++) {
            var cell = arr[i];
            if (cell.ownerId != GameSettings.UnownedId) {
                continue;
            }
            this.FillSet(cell, ownerId, GameSettings.UnownedId);
            this.cellSetList.push(new CellList(ownerId));
            ownerId++;
        }
        this.LoadCellLists();
        this.RunBorderingChecks();
    };
    OwnershipScanner.prototype.FillSet = function (seedCell, ownerToFillWithId, ownerToFillOnId) {
        var curQueueIdx = 0;
        var queue = [];
        queue.push(seedCell);
        while (true) {
            if (curQueueIdx == queue.length) {
                break;
            }
            var cell = queue[curQueueIdx];
            curQueueIdx++;
            if (cell.ownerId != ownerToFillOnId) {
                continue;
            }
            if (cell.ownerId == ownerToFillWithId) {
                continue;
            }
            cell.SetOwner(ownerToFillWithId);
            this.Enqueue(queue, cell, 0, -1);
            this.Enqueue(queue, cell, 0, 1);
            this.Enqueue(queue, cell, -1, 0);
            this.Enqueue(queue, cell, 1, 0);
        }
    };
    OwnershipScanner.prototype.Enqueue = function (queue, aCell, xOffset, yOffset) {
        var otherCell = this.board.GetCellAt(aCell.cellX + xOffset, aCell.cellY + yOffset);
        if (!otherCell) {
            return;
        }
        queue.push(otherCell);
    };
    OwnershipScanner.prototype.LoadCellLists = function () {
        var arr = this.board.cellArray;
        for (var i = 0; i < arr.length; i++) {
            var cell = arr[i];
            if (cell.ownerId < 0) {
                alert("Problem: some cells were not checked in FillSweep");
                return;
            }
            var setList = this.cellSetList[cell.ownerId];
            if (!setList) {
                alert("Problem: a CellList was not set.");
                return;
            }
            setList.AddCell(cell);
        }
    };
    OwnershipScanner.prototype.RunBorderingChecks = function () {
        for (var i = 0; i < this.cellSetList.length; i++) {
            var list = this.cellSetList[i];
            list.CheckPlayerAndCompBordering(this.board);
        }
    };
    OwnershipScanner.prototype.GetCompCellList = function () {
        return this.GetCellList(GameSettings.CompOwnerId);
    };
    OwnershipScanner.prototype.GetCellList = function (idx) {
        if (idx < 0 || idx >= this.cellSetList.length) {
            return null;
        }
        return this.cellSetList[idx];
    };
    OwnershipScanner.prototype.TestCheck = function () {
        for (var i = 0; i < this.cellSetList.length; i++) {
            var list = this.cellSetList[i];
            if (list.ownerId < 2) {
                continue;
            }
            if (list.bordersPlayer && list.bordersComp) {
                return;
            }
        }
        alert("I think you are walled off from the computer.");
    };
    return OwnershipScanner;
}());
//# sourceMappingURL=OwnershipScanner.js.map