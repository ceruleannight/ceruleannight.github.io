var FloodFiller = (function () {
    function FloodFiller(board, ownerId) {
        this.extraQueue = [];
        this.NGain = 0;
        this.EGain = 0;
        this.SGain = 0;
        this.WGain = 0;
        this.board = board;
        this.ownerId = ownerId;
    }
    FloodFiller.prototype.Fill = function (cellIdx, colorIdx) {
        this.PopulatePreCellList();
        var startCell = this.board.cellArray[cellIdx];
        if (startCell.colorIdx == colorIdx) {
            return;
        }
        var queue = [];
        queue.push(startCell);
        var colorToFillOnIdx = startCell.colorIdx;
        this.FillCore(queue, colorIdx, colorToFillOnIdx);
        this.extraQueue = this.PrepExtrasQueue(colorIdx);
        this.FillExtra(this.extraQueue, colorIdx, colorIdx);
    };
    FloodFiller.prototype.FillCore = function (queue, colorToFillWithIdx, colorToFillOnIdx) {
        var curQueueIdx = 0;
        while (true) {
            if (curQueueIdx == queue.length) {
                break;
            }
            var cell = queue[curQueueIdx];
            curQueueIdx++;
            if (cell.colorIdx != colorToFillOnIdx) {
                continue;
            }
            if (cell.IsOwned() && cell.ownerId != this.ownerId) {
                continue;
            }
            cell.SetState(colorToFillWithIdx, this.ownerId);
            this.Enqueue(queue, cell, 0, -1);
            this.Enqueue(queue, cell, 0, 1);
            this.Enqueue(queue, cell, -1, 0);
            this.Enqueue(queue, cell, 1, 0);
        }
    };
    FloodFiller.prototype.PrepExtrasQueue = function (colorToFillOnIdx) {
        var queue = [];
        var cellCount = this.board.cellArray.length;
        for (var i = 0; i < cellCount; i++) {
            var cell = this.board.GetCellAtBoardIdx(i);
            if (cell.ownerId != this.ownerId) {
                continue;
            }
            this.EnqueueExtra(queue, cell, 0, -1, colorToFillOnIdx);
            this.EnqueueExtra(queue, cell, 0, 1, colorToFillOnIdx);
            this.EnqueueExtra(queue, cell, -1, 0, colorToFillOnIdx);
            this.EnqueueExtra(queue, cell, 1, 0, colorToFillOnIdx);
        }
        return queue;
    };
    FloodFiller.prototype.EnqueueExtra = function (queue, aCell, xOffset, yOffset, colorToFillOnIdx) {
        var otherCell = this.board.GetCellAt(aCell.cellX + xOffset, aCell.cellY + yOffset);
        if (!otherCell || otherCell.IsOwned()) {
            return;
        }
        if (otherCell.colorIdx != colorToFillOnIdx) {
            return;
        }
        queue.push(otherCell);
    };
    FloodFiller.prototype.Enqueue = function (queue, aCell, xOffset, yOffset) {
        var otherCell = this.board.GetCellAt(aCell.cellX + xOffset, aCell.cellY + yOffset);
        if (!otherCell) {
            return;
        }
        queue.push(otherCell);
    };
    FloodFiller.prototype.FillExtra = function (queue, colorToFillWithIdx, colorToFillOnIdx) {
        this.newCellList = new CellList(this.ownerId);
        var curQueueIdx = 0;
        while (true) {
            if (curQueueIdx == queue.length) {
                break;
            }
            var cell = queue[curQueueIdx];
            curQueueIdx++;
            if (cell.colorIdx != colorToFillOnIdx) {
                continue;
            }
            if (cell.IsOwned()) {
                continue;
            }
            cell.SetState(colorToFillWithIdx, this.ownerId);
            this.newCellList.AddCell(cell);
            this.Enqueue(queue, cell, 0, -1);
            this.Enqueue(queue, cell, 0, 1);
            this.Enqueue(queue, cell, -1, 0);
            this.Enqueue(queue, cell, 1, 0);
        }
    };
    FloodFiller.prototype.RestorePrevState = function () {
        var list = this.prevCellList.cellList;
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            c.colorIdx = c.prevColorIdx;
        }
        list = this.newCellList.cellList;
        for (var i = 0; i < list.length; i++) {
            var c = list[i];
            c.colorIdx = c.prevColorIdx;
            c.ownerId = GameSettings.UnownedId;
        }
    };
    FloodFiller.prototype.PopulatePreCellList = function () {
        this.prevCellList = new CellList(this.ownerId);
        var cellCount = this.board.cellArray.length;
        for (var i = 0; i < cellCount; i++) {
            var cell = this.board.GetCellAtBoardIdx(i);
            if (cell.ownerId != this.ownerId) {
                continue;
            }
            this.prevCellList.AddCell(cell);
        }
    };
    FloodFiller.prototype.CalculateDirectionalGainStats = function () {
        if (this.newCellList.cellList.length == 0) {
            return;
        }
        this.NGain = ClipValue(this.newCellList.nMost - this.prevCellList.nMost, 0, 1000);
        this.EGain = ClipValue(this.newCellList.eMost - this.prevCellList.eMost, 0, 1000);
        this.SGain = ClipValue(this.newCellList.sMost - this.prevCellList.sMost, 0, 1000);
        this.WGain = ClipValue(this.newCellList.wMost - this.prevCellList.wMost, 0, 1000);
    };
    return FloodFiller;
}());
//# sourceMappingURL=FloodFiller.js.map