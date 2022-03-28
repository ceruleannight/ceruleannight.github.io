var GameAi = (function () {
    function GameAi(boardStr, anchorIdx, currentColorIdx, maxColorIdx, rand, oScanner) {
        this.boardStr = boardStr;
        this.anchorIdx = anchorIdx;
        this.currentColorIdx = currentColorIdx;
        this.ownerId = GameSettings.CompOwnerId;
        this.maxColorIdx = maxColorIdx;
        this.rand = rand;
        this.oScanner = oScanner;
    }
    GameAi.prototype.ChooseColor = function (aiKey) {
        switch (aiKey) {
            case "*PROTOTYPE*": return this.CurrentPrototype();
            case "BASIC": return this.BasicChallengeAi();
            case "RAN-DUMB": return this.RanDumbAi();
        }
        return -1;
    };
    GameAi.prototype.CurrentPrototype = function () {
        var board = this.InitBoard();
        var compCellList = this.oScanner.GetCompCellList();
        compCellList.SetCellStats(board);
        var reachPriority = this.GetSmallestReachRatio(compCellList);
        var selColorIdx = 0;
        var maxGain = 0;
        var b = this.InitBoard();
        var f = new FloodFiller(b, this.ownerId);
        for (var i = 0; i <= this.maxColorIdx; i++) {
            if (i == this.currentColorIdx) {
                continue;
            }
            f.Fill(this.anchorIdx, i);
            f.prevCellList.SetCellStats(b);
            f.newCellList.SetCellStats(b);
            f.CalculateDirectionalGainStats();
            f.RestorePrevState();
            var gain = 0;
            switch (reachPriority) {
                case "N":
                    gain = f.NGain;
                    break;
                case "E":
                    gain = f.EGain;
                    break;
                case "S":
                    gain = f.SGain;
                    break;
                case "W":
                    gain = f.WGain;
                    break;
            }
            if (gain > maxGain) {
                selColorIdx = i;
                maxGain = gain;
            }
        }
        if (maxGain == 0 || selColorIdx == this.currentColorIdx) {
            return this.BasicChallengeAi();
        }
        return selColorIdx;
    };
    GameAi.prototype.GetSmallestReachRatio = function (cellList) {
        var ns = "N";
        var nsRatio = cellList.nReachRatio;
        if (cellList.sReachRatio < cellList.nReachRatio) {
            ns = "S";
            nsRatio = cellList.sReachRatio;
        }
        var ew = "W";
        var ewRatio = cellList.wReachRatio;
        if (cellList.eReachRatio < cellList.wReachRatio) {
            ew = "E";
            ewRatio = cellList.eReachRatio;
        }
        if (nsRatio < ewRatio) {
            return ns;
        }
        return ew;
    };
    GameAi.prototype.BasicChallengeAi = function () {
        var selColorIdx = 0;
        var maxGain = 0;
        var b = this.InitBoard();
        var f = new FloodFiller(b, this.ownerId);
        for (var i = 0; i <= this.maxColorIdx; i++) {
            if (i == this.currentColorIdx) {
                continue;
            }
            f.Fill(this.anchorIdx, i);
            var newCount = f.newCellList.cellList.length;
            f.RestorePrevState();
            if (newCount > maxGain) {
                selColorIdx = i;
                maxGain = newCount;
            }
        }
        if (selColorIdx == this.currentColorIdx) {
            return this.ChooseRandomColor();
        }
        return selColorIdx;
    };
    GameAi.prototype.RanDumbAi = function () {
        return this.ChooseRandomColor();
    };
    GameAi.prototype.InitBoard = function () {
        var board = new GameBoard(0, 0, 0);
        board.Unpack(this.boardStr);
        return board;
    };
    GameAi.prototype.ChooseRandomColor = function () {
        while (true) {
            var colorIdx = this.rand.NextInt(0, this.maxColorIdx);
            if (colorIdx == this.currentColorIdx) {
                continue;
            }
            return colorIdx;
        }
    };
    return GameAi;
}());
//# sourceMappingURL=GameAI.js.map