function RenderMainLayout() {
    var html = "";
    html += "<div id=\"mainDiv\">";
    html += "<div id=\"gameHdrDiv\">";
    html += "<div id=\"playerStatsDiv\" class=\"scoreDiv\">Player:</div>";
    html += "<div id=\"gameTitleDiv\">";
    html += "<img src=\"_imgs/LogoSmall_onWhite.png\" style=\"align-self:center;\" />";
    html += "</div>";
    html += "<div id=\"compStatsDiv\" class=\"scoreDiv\">Computer:</div>";
    html += "</div>";
    html += "<div id=\"gridHostDiv\">";
    html += "<div id=\"gridDiv\"></div>";
    html += "</div>";
    html += "<div id=\"ctrlPanelDiv\">";
    html += "<div id=\"ctrlButtonsDiv\"></div>";
    html += "</div>";
    html += "</div>";
    document.getElementById("mainContainerDiv").innerHTML = html;
}
function SizeAndPosLayout(gridWidth_pix) {
    document.getElementById("gridDiv").style.width = "" + gridWidth_pix + "px";
}
function SetPlayerStats(divId, name, stats) {
    var html = stats.percent + "% (" + stats.owned + "/" + stats.cellsTotal + ")";
    document.getElementById(divId).innerHTML = name + ": " + html;
}
function RenderColorButtons(colorArray) {
    var html = "";
    for (var i = 0; i < colorArray.length; i++) {
        var col = colorArray[i];
        var disImg = "<img id=\"disImg_" + i + "\" src=\"_imgs/Disallow.gif\" style=\"width:40px; height:40px; align-self:center;\" />";
        html += RenderBtn("", 50, 50, "BtnClicked(event," + i + ")", disImg, "ctrlPanelBtn", col);
    }
    html += "<div style=\"width:40px; height:40px;\"></div>";
    var gearImg = "<img src=\"_imgs/Gear.gif\" style=\"width:38px; height:35px; align-self:center;\" />";
    html += RenderBtn("", 50, 50, "SetGameOptionsPanel()", gearImg, "ctrlPanelBtn", "FFFFFF");
    var menuImg = "<img src=\"_imgs/MenuIcon38x35.gif\" style=\"width:38px; height:35px; align-self:center;\" />";
    html += RenderBtn("", 50, 50, "SetGameMenuPanel()", menuImg, "ctrlPanelBtn", "FFFFFF");
    document.getElementById("ctrlButtonsDiv").innerHTML = html;
}
function RenderBtn(id, w, h, onclick, content, cssClass, bgColor) {
    var classTxt = cssClass != "" ? " class=\"" + cssClass + "\"" : "";
    var html = "<div id=\"" + id + "\"" + classTxt +
        " style=\"width:" + w + "px; height:" + h + "px; background-color:#" + bgColor + ";\"" +
        " onclick=\"" + onclick + "\"" +
        "";
    html += ">" + content + "</div>";
    return html;
}
function RenderDiv(id, x, y, w, h, onclick, content, cssClass) {
    var classTxt = cssClass != "" ? " class=\"" + cssClass + "\"" : "";
    var html = "<div id=\"" + id + "\"" + classTxt +
        " style=\"position:absolute; left:" + x + "px; top:" + y + "px; width:" + w + "px; height:" + h + "px; cursor:default;\"" +
        " onclick=\"" + onclick + "\"";
    html += ">" + content + "</div>";
    return html;
}
function RenderCell(id, x, y, w, h, onclick, content, cssClass) {
    var classTxt = cssClass != "" ? " class=\"" + cssClass + "\"" : "";
    var html = "<div id=\"" + id + "\"" + classTxt +
        " style=\"position:absolute; left:" + x + "px; top:" + y + "px; width:" + w + "px; height:" + h + "px; cursor:default;\"" +
        " onclick=\"" + onclick + "\"" +
        "";
    html += ">" + content + "</div>";
    return html;
}
function RenderImg(id, x, y, w, h, src) {
    return "<img id=\"" + id + "\" src=\"" + src + "\"" +
        " style=\"position:absolute; left:" + x + "px; top:" + y + "px; display:none;\"" +
        " />";
}
function SetDisallowImg(colorIdx) {
    for (var i = 0; i < 20; i++) {
        var img = document.getElementById("disImg_" + i);
        if (!img) {
            return;
        }
        if (i == colorIdx) {
            img.style.display = "block";
            continue;
        }
        img.style.display = "none";
    }
}
function ShowGameSetupOptions() {
    var html = "";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "<img src=\"_imgs/Logo_onWhite.png\" />";
    html += "</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\" style=\"font:normal 20px verdana;\">New Game</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div style=\"text-align:center;\">";
    html += "Game Key:";
    html += "<input id=\"gameKeyTb\" type=\"textbox\" value=\"\" style=\"width:120px;\" />";
    html += "&nbsp;";
    html += "<input type=\"button\" value=\"&lt Set Random\" onclick=\"SetRandomGameKey()\" />";
    html += "</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "Opponent: ";
    html += "<select id=\"rightPlayerDd\" style=\"display:block\">";
    for (var i = 0; i < GameSettings.AiList.length; i++) {
        var ai = GameSettings.AiList[i];
        html += "<option value=\"" + ai.key + "\">" + ai.text + "</option>";
    }
    html += "</select>";
    html += "</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "<input type=\"button\" value=\"Start Game\" onclick=\"StartNewGame()\" />";
    html += "</div>";
    document.getElementById("panelDiv").className = "gameSetupPanelDiv";
    document.getElementById("panelDiv").style.flexDirection = "row";
    SetPanel(html, "FFFFFF", "GAME-SETUP");
    document.getElementById("gameKeyTb")["value"] = g_gameSets.gameKey;
    document.getElementById("rightPlayerDd")["value"] = g_gameSets.compAiKey;
}
function SetRandomGameKey() {
    var tb = document.getElementById("gameKeyTb");
    var r = new RandomGen();
    tb["value"] = r.NextInt(0, 999999999);
}
function StartNewGame() {
    var gameKey = document.getElementById("gameKeyTb")["value"];
    if (gameKey == "") {
        alert("Game Key must be set.  Use any value.");
        return;
    }
    var aiKey = document.getElementById("rightPlayerDd")["value"];
    g_gameSets.gameKey = gameKey;
    g_gameSets.compAiKey = aiKey;
    g_gameSets.StoreValues();
    ClosePanel();
    InitGame(false);
}
function SetGameOptionsPanel() {
    var html = "";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\" style=\"font:normal 20px verdana;\">Game Options</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"inGamePanelRow\">";
    html += "<table>";
    html += "<tr>";
    html += "<td>Player Cell Colors</td>";
    html += "<td>&nbsp;</td>";
    html += "<td>Computer Cell Colors</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style=\"text-align:center;\">" + WriteCellColorSelect("playerCellColorDd", g_gameSets.playerColorOptionKey) + "</td>";
    html += "<td>&nbsp;</td>";
    html += "<td style=\"text-align:center;\">" + WriteCellColorSelect("compCellColorDd", g_gameSets.compColorOptionKey) + "</td>";
    html += "</tr>";
    html += "</table>";
    html += "</div>";
    html += "<div style=\"height:10px;\"></div>";
    html += "<div style=\"text-align:center;\">";
    html += "<input id=\"useOwnerSymsCb\" type=\"checkbox\" " + (g_gameSets.useOwnerCellSymbols ? "checked=\"true\"" : "") + " />";
    html += "<label for=\"useOwnerSymsCb\">Use Owner Symbols</label>";
    html += "</div>";
    html += "<div style=\"height:10px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "";
    html += "</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "<input type=\"button\" value=\"Cancel\" onclick=\"ClosePanel()\" style=\"width:110px;\" />";
    html += "&nbsp;";
    html += "<input type=\"button\" value=\"Apply\" onclick=\"ApplyGameOptionChanges();ClosePanel();\" style=\"width:110px;\" />";
    html += "</div>";
    document.getElementById("panelDiv").className = "inGamePanelDiv";
    document.getElementById("panelDiv").style.flexDirection = "row";
    SetPanel(html, "FFFFFF", "GAME-OPTIONS");
}
function ApplyGameOptionChanges() {
    g_gameSets.playerColorOptionKey = document.getElementById("playerCellColorDd")["value"];
    g_gameSets.compColorOptionKey = document.getElementById("compCellColorDd")["value"];
    g_gameSets.useOwnerCellSymbols = document.getElementById("useOwnerSymsCb")["checked"];
    g_gameSets.StoreValues();
    g_game.ApplyColorToGridCells();
}
function SetGameMenuPanel() {
    var html = "";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\" style=\"font:normal 20px verdana;\">Menu</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"gameSetupPanelRow\">";
    html += "<input type=\"button\" value=\"Cancel\" onclick=\"ClosePanel()\" style=\"width:110px;\" />";
    html += "&nbsp;";
    html += "<input type=\"button\" value=\"New Game\" onclick=\"NewGameBtnHit()\" style=\"width:110px;\" />";
    html += "</div>";
    document.getElementById("panelDiv").className = "inGamePanelDiv";
    document.getElementById("panelDiv").style.flexDirection = "row";
    SetPanel(html, "FFFFFF", "GAME-MENU");
}
function WriteCellColorSelect(ctrlId, selValue) {
    var html = "<select id=\"" + ctrlId + "\">";
    var ops = GameSettings.ColorOptions;
    for (var i = 0; i < ops.length; i++) {
        var col = ops[i];
        var selTxt = "";
        if (col.key == selValue) {
            selTxt = " selected=\"true\"";
        }
        html += "<option value=\"" + col.key + "\"" + selTxt + ">" + col.text + "</option>";
    }
    html += "</select>";
    return html;
}
function NewGameBtnHit() {
    if (!confirm("The current game will be abandoned.\n\nProceed?")) {
        return;
    }
    ClosePanel();
    ShowGameSetupOptions();
}
function SetGameOver(totalCells, playerCells) {
    var comp = totalCells - playerCells;
    var results = "It's a tie!";
    var bg = "";
    if (playerCells > comp) {
        results = "You Win!!!";
        bg = "80FF80";
    }
    else if (playerCells < comp) {
        results = "You have lost.";
        bg = "FF8080";
    }
    var html = "<div class=\"gameOverPanelRow\">" + results + "</div>";
    html += "<div style=\"height:10px;\"></div>";
    var playerRatio = playerCells / totalCells;
    var playerPercent = RatioToPercent(playerRatio);
    html += "<div class=\"gameOverPanelRow\">Player: " + playerPercent + "% (" + playerCells + "/" + totalCells + ")</div>";
    html += "<div style=\"height:10px;\"></div>";
    var compCells = totalCells - playerCells;
    var compRatio = compCells / totalCells;
    var compPercent = RatioToPercent(compRatio);
    html += "<div class=\"gameOverPanelRow\">Computer: " + compPercent + "% (" + compCells + "/" + totalCells + ")</div>";
    html += "<div style=\"height:10px;\"></div>";
    var map = "";
    if (g_game) {
        map = g_game.gameSeedKey;
    }
    html += "<div class=\"gameOverPanelRow\">Map: " + map + "</div>";
    html += "<div style=\"height:40px;\"></div>";
    html += "<div class=\"gameOverPanelRow\">";
    html += "<input type=\"button\" value=\"New Game Options\" onclick=\"ShowGameSetupOptions()\" style=\"width:210px;\" />";
    html += "<div style=\"width:5px;\"></div>";
    html += "<input type=\"button\" value=\"Start New Random Game Now\" onclick=\"ClosePanel();InitGame(true)\" style=\"width:210px;\" />";
    html += "</div>";
    document.getElementById("panelDiv").className = "gameOverDiv";
    document.getElementById("panelDiv").style.flexDirection = "column";
    SetPanel(html, bg, "GAME-OVER");
}
function SetPanel(contentHtml, bgColor, panelMode) {
    var div = document.getElementById("panelDiv");
    div.style.backgroundColor = "#" + bgColor;
    div.innerHTML = contentHtml;
    document.getElementById("panelContainerDiv").style.display = "flex";
    document.getElementById("backdropDiv").style.display = "block";
    g_panelMode = panelMode;
}
function ClosePanel() {
    document.getElementById("panelContainerDiv").style.display = "none";
    document.getElementById("backdropDiv").style.display = "none";
}
function RenderStatsPanel() {
    var html = "";
    html += g_statTxt;
    html += "Iterations: " + g_debug.IterationCount + "<br />";
    var div = document.getElementById("statsPanelDiv");
    div.innerHTML = html;
    div.className = "statsPanel";
}
//# sourceMappingURL=GameUi.js.map