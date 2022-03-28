//************************************************
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
    html += "G&nbsp;&nbsp;&nbsp;";
    html += "R&nbsp;&nbsp;&nbsp;";
    html += "O&nbsp;&nbsp;&nbsp;";
    html += "W&nbsp;&nbsp;&nbsp;";
    html += "2";
    html += "</div>";
    html += "<br />";
    html += "<div class=\"worldSetupPanelTxt hCenter\" style=\"font-size:170%;\">World Setup</div>";
    html += "<div style=\"height:20px;\"></div>";
    html += "<div style=\"width:280px; text-align:center;\">";
    html += "Cell Size: <span id=\"cellSizeDisplay\"></span><br />";
    html += "<input id=\"cellSizeRange\" type=\"range\" min=\"2\" max=\"30\" step=\"1\" value=\"7\" onchange=\"DrawCellSizeValue()\" /><br />";
    html += "<div style=\"height:20px;\"></div>";
    html += "Entity Colors";
    html += "<div style=\"height:2px;\"></div>";
    html += "<div style=\"position:relative; left:30px;\">";
    var offsetWidth = 30;
    for (var i = 0; i < colorArray.length; i++) {
        var color = colorArray[i];
        var offset = offsetWidth * i;
        var checkedTxt = color.sel ? "checked=\"checked\"" : "";
        html += "<div class=\"fullCenter\" " +
            "style=\"position:absolute; left:" + offset + "px; width:25px; height:25px; background-color:#" + color.rgb + "; border:solid 1px #909090;\">";
        html += "<input id=\"colorCb_" + i + "\" type=\"checkbox\" " + checkedTxt + " value=\"" + color.rgb + "\" />";
        html += "</div>";
    }
    html += "</div>";
    html += "<div style=\"height:45px;\"></div>";
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
//************************************************
function ShowWorldSetupPanel(state) {
    document.getElementById("worldSetupOuterPanelDiv").style.display = state ? "block" : "none";
}
//************************************************
function DrawCellSizeValue() {
    var range = document.getElementById("cellSizeRange");
    document.getElementById("cellSizeDisplay").innerHTML = range["value"];
}
//************************************************
function GetColorArray() {
    var colorArray = [];
    var i = 0;
    while (true) {
        var cb = document.getElementById("colorCb_" + i);
        if (!cb) {
            break;
        }
        if (!cb["checked"]) {
            i++;
            continue;
        }
        colorArray.push(cb["value"]);
        i++;
    }
    return colorArray;
}
//************************************************
function SyncWorldKeyDiv() {
    var checked = document.getElementById("createRandomWorldCb")["checked"];
    document.getElementById("worldKeyDiv").style.display = checked ? "none" : "block";
}
//************************************************
function ShowCancelWorldRecreateBtn(show) {
    document.getElementById("cancelWorldRecreateBtn").style.display = show ? "inline" : "none";
}
//************************************************
//# sourceMappingURL=WorldSetupUI.js.map