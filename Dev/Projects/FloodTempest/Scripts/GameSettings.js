var GameSettings = (function () {
    function GameSettings() {
        this.InitDefaults();
    }
    GameSettings.prototype.InitDefaults = function () {
        this.compAiKey = "BASIC";
        this.gameKey = "1";
        this.playerColorOptionKey = "FLOOD";
        this.compColorOptionKey = "000001";
        this.useOwnerCellSymbols = true;
    };
    GameSettings.prototype.StoreValues = function () {
        localStorage.setItem("FT-compAiKey", this.compAiKey);
        localStorage.setItem("FT-gameKey", this.gameKey);
        localStorage.setItem("FT-playerColorOptionKey", this.playerColorOptionKey);
        localStorage.setItem("FT-compColorOptionKey", this.compColorOptionKey);
        localStorage.setItem("FT-useOwnerCellSymbols", this.useOwnerCellSymbols ? "Y" : "N");
    };
    GameSettings.prototype.RecallValues = function () {
        this.compAiKey = this.LoadLocalStorageVal("FT-compAiKey", this.compAiKey);
        this.gameKey = this.LoadLocalStorageVal("FT-gameKey", this.gameKey);
        this.playerColorOptionKey = this.LoadLocalStorageVal("FT-playerColorOptionKey", this.playerColorOptionKey);
        this.compColorOptionKey = this.LoadLocalStorageVal("FT-compColorOptionKey", this.compColorOptionKey);
        this.useOwnerCellSymbols = this.LoadLocalStorageVal("FT-useOwnerCellSymbols", "Y") == "Y";
    };
    GameSettings.prototype.LoadLocalStorageVal = function (key, defaultVal) {
        var val = localStorage.getItem(key);
        if (!val) {
            return defaultVal;
        }
        return val;
    };
    GameSettings.UnownedId = -1;
    GameSettings.PlayerOwnerId = 0;
    GameSettings.CompOwnerId = 1;
    GameSettings.CheckOwnersStartId = 2;
    GameSettings.ColorOptions = [
        { key: "FLOOD", text: "Flood Color" },
        { key: "FFFFFF", text: "White" },
        { key: "808080", text: "Grey" },
        { key: "000001", text: "Black" }
    ];
    GameSettings.AiList = [
        { key: "RAN-DUMB", text: "Simple" },
        { key: "BASIC", text: "Basic Challenge" },
        { key: "*PROTOTYPE*", text: "Prototype" }
    ];
    return GameSettings;
}());
//# sourceMappingURL=GameSettings.js.map