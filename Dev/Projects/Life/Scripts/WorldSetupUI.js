function RenderWorldSetupPanel() {
    var colorArray = [
        { "rgb": "FF0000", sel: true },
        { "rgb": "FFFF00", sel: true },
        { "rgb": "00FF00", sel: true },
        { "rgb": "0000FF", sel: true },
        { "rgb": "FF00FF", sel: true },
        { "rgb": "FFFFFF", sel: false },
        { "rgb": "000000", sel: false }
    ];
    var html = "";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div class=\"worldSetupAppTitle hCenter\">";
    html += "L&nbsp;&nbsp;&nbsp;";
    html += "I&nbsp;&nbsp;&nbsp;";
    html += "F&nbsp;&nbsp;&nbsp;";
    html += "E";
    html += "</div>";
    html += "<br />";
    html += "<div class=\"worldSetupPanelTxt hCenter\" style=\"font-size:170%;\">World Setup</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div style=\"width:280px; text-align:center;\">";
    html += "Cell Size: <span id=\"cellSizeDisplay\"></span><br />";
    html += "<input id=\"cellSizeRange\" type=\"range\" min=\"2\" max=\"30\" step=\"1\" value=\"7\" onchange=\"DrawCellSizeValue()\" /><br />";
    html += "<div style=\"height:20px;\"></div>";
    html += "<input id=\"createRandomWorldCb\" type=\"checkbox\" onclick=\"SyncWorldKeyDiv()\" checked=\"checked\" />";
    html += "<label for=\"createRandomWorldCb\">Generate Random World</label><br />";
    html += "<div id=\"worldKeyDiv\" style=\"display:none;\">";
    html += "World Key<br />";
    html += "<input id=\"worldKeyTb\" type=\"textbox\" value=\"1\" maxlength=\"50\" /><br />";
    html += "</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<input type=\"button\" value=\"Create World\" onclick=\"InitWorld()\" />";
    html += "&nbsp;&nbsp;";
    html += "<input id=\"cancelWorldRecreateBtn\" type=\"button\" value=\"Cancel\" onclick=\"CancelWorldRecreate()\" " +
        "style=\"display:none;\" />";
    html += "</div>";
    document.getElementById("worldSetupOuterPanelDiv").innerHTML = html;
}
function ShowWorldSetupPanel(state) {
    document.getElementById("worldSetupOuterPanelDiv").style.display = state ? "block" : "none";
}
function DrawCellSizeValue() {
    var range = document.getElementById("cellSizeRange");
    document.getElementById("cellSizeDisplay").innerHTML = range["value"];
}
function SyncWorldKeyDiv() {
    var checked = document.getElementById("createRandomWorldCb")["checked"];
    document.getElementById("worldKeyDiv").style.display = checked ? "none" : "block";
}
function ShowCancelWorldRecreateBtn(show) {
    document.getElementById("cancelWorldRecreateBtn").style.display = show ? "inline" : "none";
}
//# sourceMappingURL=WorldSetupUI.js.map