var OffsetManager = (function () {
    function OffsetManager() {
    }
    return OffsetManager;
}());
var OffsetIndexer = (function () {
    function OffsetIndexer(tierIdx, idx) {
        var edgeElementCount = tierIdx * 2;
        var elementCount = edgeElementCount * 4;
        if (elementCount == 0) {
            elementCount = 1;
        }
        idx = idx - Math.floor(idx / elementCount) * elementCount;
        var side = Math.floor(idx / edgeElementCount);
        var idxOnSide = idx - side * edgeElementCount;
        var x = 0;
        var y = 0;
        switch (side) {
            case 0:
                y = 0;
                x = idxOnSide;
                break;
            case 1:
                y = idxOnSide;
                x = edgeElementCount;
                break;
            case 2:
                y = edgeElementCount;
                x = edgeElementCount - idxOnSide;
                break;
            case 3:
                y = edgeElementCount - idxOnSide;
                x = 0;
                break;
        }
        x -= tierIdx;
        y -= tierIdx;
        this.X = x;
        this.Y = y;
    }
    return OffsetIndexer;
}());
var OffsetTier = (function () {
    function OffsetTier(tierIdx) {
        this.edgeElementCount = tierIdx * 2;
        this.elementCount = this.edgeElementCount * 4;
        if (this.elementCount == 0) {
            this.elementCount = 1;
        }
    }
    return OffsetTier;
}());
//# sourceMappingURL=OffsetManager.js.map