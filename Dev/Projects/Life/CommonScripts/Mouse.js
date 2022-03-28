var MousePos = (function () {
    function MousePos(evt) {
        this.X = 0;
        this.Y = 0;
        if (evt.pageX) {
            this.X = evt.pageX;
            this.Y = evt.pageY;
        }
        else if (evt.clientX) {
            this.X = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            this.Y = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
    }
    return MousePos;
}());
//# sourceMappingURL=Mouse.js.map