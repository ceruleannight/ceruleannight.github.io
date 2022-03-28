//************************************************
function DrawTitle() {
    var spacer = "&nbsp;&nbsp;&nbsp;&nbsp;";
    return "G" + spacer + "R" + spacer + "O" + spacer + "W" + spacer + "2";
}
//************************************************
//************************************************
function ShowWorldPanel(state) {
    document.getElementById("worldPanelDiv").style.display = state ? "block" : "none";
}
//************************************************
//************************************************
function RenderControlPanel() {
    var html = "";
    //html+="<input id=\"startStopBtn\" type=\"button\" value=\"Start\" onclick=\"ToggleRunning()\" "+
    //	"style=\"background-color:#A0FFA0; width:50px;\" /><br />";
    //html+="<div style=\"height:6px;\"></div>";
    html += "Speed<br />";
    html += "<div id=\"speedCtrlRange\"></div>";
    html += "<div style=\"height:6px;\"></div>";
    html += "Birth<br />";
    html += "<div id=\"birthCtrlRange\"></div>";
    html += "<div style=\"height:6px;\"></div>";
    html += "Death<br />";
    html += "<div id=\"deathCtrlRange\"></div>";
    html += "<div style=\"height:6px;\"></div>";
    html += "Influence<br />";
    html += "<div id=\"influenceCtrlRange\"></div>";
    html += "<div style=\"height:6px;\"></div>";
    html += "World Age: <span id=\"worldAgeSpan\"></span><br />";
    html += "<div style=\"height:6px;\"></div>";
    html += "<input id=\"showGridlinesCb\" type=\"checkbox\" value=\"\" onclick=\"g_world.SetGridLines()\" " +
        "style=\"\" />";
    html += "<label for=\"showGridlinesCb\">Show gridlines</label><br />";
    html += "<div style=\"height:20px;\"></div>";
    html += "<input type=\"button\" value=\"Restart World\" onclick=\"RestartWorld()\" />";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div id=\"debugInfoDiv\"></div>";
    document.getElementById("controlPanelDiv").innerHTML = html;
    RenderSpeedControls();
    RenderBirthControls();
    RenderDeathControls();
    RenderInfluenceControls();
    UpdateWorldAgeDisplay();
}
//************************************************
function ButtonRange(idPrefix, firstVal, btnCount, selVal, clickFnc) {
    var html = "<table style=\"border-spacing:0px;\"><tr>";
    for (var i = 0; i < btnCount; i++) {
        var val = firstVal + i;
        var idStr = idPrefix + val;
        var style = "";
        var css = "fullCenter rangeCell";
        if (i == selVal) {
            css += " rangeCell_sel";
            style = "cursor:default;";
        }
        else {
            style = "cursor:pointer;";
        }
        html += "<td>";
        html += "<div id=\"" + idStr + "\" class=\"" + css + "\" style=\"" + style + "\"" +
            " onclick=\"" + clickFnc + "(" + i + ")\">" + val + "</div>";
        html += "</td>";
    }
    html += "</tr></table>";
    return html;
}
//************************************************
//************************************************
function UpdateWorld() {
    if (g_world.settings.runSpeed == 0) {
        return;
    }
    if (!g_world.updating) {
        g_world.Update();
        UpdateWorldAgeDisplay();
    }
    setTimeout("UpdateWorld()", g_world.settings.clockDelayMs);
}
//************************************************
function RenderSpeedControls() {
    document.getElementById("speedCtrlRange").innerHTML =
        this.ButtonRange("speedBtn_", 0, 5, g_world.settings.runSpeed, "SetSpeedValue");
}
//************************************************
function SetSpeedValue(val) {
    g_world.settings.SetWorldSpeed(val);
    //g_world.settings.runSpeed=val;
    RenderSpeedControls();
    UpdateWorld();
}
//************************************************
//************************************************
function RenderBirthControls() {
    document.getElementById("birthCtrlRange").innerHTML =
        this.ButtonRange("birthBtn_", 0, 11, g_world.settings.birthRate, "SetBirthValue");
}
//************************************************
function SetBirthValue(val) {
    g_world.settings.SetBirthRate(val);
    RenderBirthControls();
}
//************************************************
//************************************************
function RenderDeathControls() {
    document.getElementById("deathCtrlRange").innerHTML =
        this.ButtonRange("deathBtn_", 0, 11, g_world.settings.deathRate, "SetDeathValue");
}
//************************************************
function SetDeathValue(val) {
    g_world.settings.SetDeathRate(val);
    RenderDeathControls();
}
//************************************************
//************************************************
function RenderInfluenceControls() {
    document.getElementById("influenceCtrlRange").innerHTML =
        this.ButtonRange("influenceBtn_", 0, 11, g_world.settings.influenceRate, "SetInfluenceValue");
}
//************************************************
function SetInfluenceValue(val) {
    g_world.settings.SetInfluenceRate(val);
    RenderInfluenceControls();
}
//************************************************
//************************************************
function UpdateWorldAgeDisplay() {
    var age = 0;
    if (g_world.worldAge) {
        age = g_world.worldAge;
    }
    document.getElementById("worldAgeSpan").innerHTML = "" + age;
}
//************************************************
//************************************************
// Call this to bring up the world init panel.
// This will also stop the current simulation.
function RestartWorld() {
    SetSpeedValue(0);
    ShowWorldPanel(false);
    ShowWorldSetupPanel(true);
}
//************************************************
function CancelWorldRecreate() {
    ShowWorldPanel(true);
    ShowWorldSetupPanel(false);
}
//************************************************
//# sourceMappingURL=CrtlPanelUI.js.map