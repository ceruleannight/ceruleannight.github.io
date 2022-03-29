var GameBoardCell = (function () {
    function GameBoardCell(boardIdx, colorIdx, cellX, cellY) {
        this.colorIdx = 0;
        this.prevColorIdx = 0;
        this.ownerId = GameSettings.UnownedId;
        this.boardIdx = boardIdx;
        this.colorIdx = colorIdx;
        this.cellX = cellX;
        this.cellY = cellY;
    }
    GameBoardCell.prototype.SetColor = function (colorIdx) {
        this.prevColorIdx = this.colorIdx;
        this.colorIdx = colorIdx;
    };
    GameBoardCell.prototype.SetState = function (colorIdx, ownerId) {
        this.prevColorIdx = this.colorIdx;
        this.colorIdx = colorIdx;
        this.ownerId = ownerId;
    };
    GameBoardCell.prototype.SetOwner = function (ownerId) {
        this.ownerId = ownerId;
    };
    GameBoardCell.prototype.IsOwned = function () { return this.ownerId > -1; };
    return GameBoardCell;
}());
//# sourceMappingURL=GameBoardCell.js.map