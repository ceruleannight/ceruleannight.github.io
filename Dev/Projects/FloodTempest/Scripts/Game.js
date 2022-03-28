var g_game = null;
var g_gameSets = null;
var g_debug = null;
var g_statTxt = "";
var g_panelMode = "";
function PageInit() {
    g_gameSets = new GameSettings();
    g_gameSets.RecallValues();
    ShowGameSetupOptions();
}
function InitGame(startNowRandom) {
    g_debug = new Debug(true);
    RenderMainLayout();
    g_gameSets.RecallValues();
    if (startNowRandom) {
        var r = new RandomGen();
        g_gameSets.gameKey = "" + r.NextInt(1, 999999999);
    }
    g_game = new Game(true, g_gameSets.gameKey);
    g_game.aiKey = g_gameSets.compAiKey;
    g_game.Init();
    SizeAndPosLayout(g_game.grid.gridWidth_pix);
    g_game.SetScores();
}
function Cc(evt, idx) {
}
function BtnClicked(evt, colorIdx) {
    g_game.PlayerTurn(colorIdx);
}
function KeyDown(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27 && g_panelMode != "GAME-SETUP") {
        ClosePanel();
        return false;
    }
    return true;
}
var Game = (function () {
    function Game(showGridLines, gameSeedKey) {
        this.colorArray = [];
        this.aiKey = "*PROTOTYPE*";
        this.gameOver = false;
        this.gameSeedKey = gameSeedKey;
        var horz = 50;
        var vert = 38;
        var cellSize = 18;
        var playerAnchorIdx = horz * (vert - 1);
        var compAnchorIdx = horz - 1;
        this.player = new Player(playerAnchorIdx, GameSettings.PlayerOwnerId);
        this.comp = new Player(compAnchorIdx, GameSettings.CompOwnerId);
        this.rand = new RandomGen();
        this.rand.SetSeedFromKeyStr(gameSeedKey);
        this.InitColors();
        this.board = new GameBoard(horz, vert, this.colorArray.length);
        this.board.InitCellColors(this.rand);
        this.showGridLines = showGridLines;
        this.grid = new GameGrid(horz, vert, cellSize);
        this.grid.Render();
    }
    Game.prototype.Init = function () {
        this.board.SetAnchorColor(this.player.anchorIdx);
        this.board.SetAnchorColor(this.comp.anchorIdx);
        var cell = this.board.GetCellAtBoardIdx(this.player.anchorIdx);
        this.player.anchorCell = cell;
        cell.SetOwner(this.player.ownerId);
        this.player.lastPlayColorIdx = cell.colorIdx;
        cell = this.board.GetCellAtBoardIdx(this.comp.anchorIdx);
        this.comp.anchorCell = cell;
        cell.SetOwner(this.comp.ownerId);
        this.comp.lastPlayColorIdx = cell.colorIdx;
        this.grid.SizeAndPositionCells();
        this.ApplyColorToGridCells();
        RenderColorButtons(this.colorArray);
        SetDisallowImg(this.player.anchorCell.colorIdx);
    };
    Game.prototype.InitColors = function () {
        this.colorArray = [];
        this.colorArray.push("00E600");
        this.colorArray.push("FFFA69");
        this.colorArray.push("35F8FF");
        this.colorArray.push("0125FF");
        this.colorArray.push("9E35FF");
        this.colorArray.push("FE5858");
    };
    Game.prototype.ApplyColorToGridCells = function () {
        var pColKey = g_gameSets.playerColorOptionKey;
        var cColKey = g_gameSets.compColorOptionKey;
        var showSymbols = g_gameSets.useOwnerCellSymbols;
        var cellCount = this.board.cellArray.length;
        for (var i = 0; i < cellCount; i++) {
            var cell = this.board.GetCellAtBoardIdx(i);
            var color = this.colorArray[cell.colorIdx];
            if (cell.ownerId == this.player.ownerId) {
                if (pColKey != "FLOOD") {
                    color = pColKey;
                }
            }
            if (cell.ownerId == this.comp.ownerId) {
                if (cColKey != "FLOOD") {
                    color = cColKey;
                }
            }
            this.grid.SetCellColor(i, color);
            this.grid.SetCellSymbol(i, cell.ownerId, showSymbols);
        }
    };
    Game.prototype.PlayerTurn = function (colorIdx) {
        if (this.gameOver) {
            return;
        }
        if (colorIdx == this.player.lastPlayColorIdx) {
            return;
        }
        g_statTxt = "";
        var rgb = this.colorArray[colorIdx];
        this.Flood(this.player.anchorIdx, colorIdx, this.player.ownerId);
        this.player.lastPlayColorIdx = colorIdx;
        SetDisallowImg(this.player.anchorCell.colorIdx);
        this.ComputerTurn();
        this.ApplyColorToGridCells();
        this.SetScores();
        this.CheckForGameEnd();
    };
    Game.prototype.ComputerTurn = function () {
        var boardStr = this.board.Pack();
        var anchorIdx = this.comp.anchorIdx;
        var currentColorIdx = this.comp.anchorCell.colorIdx;
        var ownerId = this.comp.ownerId;
        var maxColorIdx = this.colorArray.length - 1;
        var b = this.board;
        var analysisBoard = new GameBoard(b.width, b.height, b.colorCount);
        analysisBoard.Unpack(boardStr);
        var oScanner = new OwnershipScanner(analysisBoard);
        oScanner.FillSweep();
        var ai = new GameAi(boardStr, anchorIdx, currentColorIdx, maxColorIdx, this.rand, oScanner);
        var colorIdx = ai.ChooseColor(this.aiKey);
        if (colorIdx < 0) {
            alert("Problem: AI choice error.");
            return;
        }
        g_statTxt += "AI chose: " + colorIdx + "<br />";
        this.Flood(this.comp.anchorIdx, colorIdx, this.comp.ownerId);
        this.comp.lastPlayColorIdx = colorIdx;
    };
    Game.prototype.Flood = function (cellIdx, colorIdx, ownerId) {
        var filler = new FloodFiller(this.board, ownerId);
        filler.Fill(cellIdx, colorIdx);
    };
    Game.prototype.SetScores = function () {
        this.player.cellStats = this.board.GetOwnerStats(this.player.ownerId);
        SetPlayerStats("playerStatsDiv", "Player", this.player.cellStats);
        this.comp.cellStats = this.board.GetOwnerStats(this.comp.ownerId);
        SetPlayerStats("compStatsDiv", "Computer", this.comp.cellStats);
    };
    Game.prototype.CheckForGameEnd = function () {
        if (this.board.AreAllCellsOwned()) {
            SetGameOver(this.board.cellArray.length, this.player.cellStats.owned);
            this.gameOver = true;
        }
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map