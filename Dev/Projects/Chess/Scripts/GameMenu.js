
//********************************************
function RenderMenu()
{
	var html="<div class=\"menuBoxDiv\" "+
		"style=\"width:200px; background-color:#FFFFFF;\">";
	html+="Options<br />";
	html+="<div style=\"height:10px;\"></div>";
	html+=WriteMenuBtn("Reset Game","ResetGame();ShowMenu(false)",120);
	html+="<div style=\"height:10px;\"></div>";
	html+=WriteMenuBtn("Cancel","ShowMenu(false)",120);
	html+="</div>";

	document.getElementById("menuBoxDiv").innerHTML=html;
}
//********************************************
function WriteMenuBtn(text,onclick,width)
{
	return "<input type=\"button\" value=\""+text+"\" "+
		"onclick=\""+onclick+"\" style=\"width:"+width+"px;\" />";
}
//********************************************
function ShowMenu(showHide)
{
	document.getElementById("menuBoxDiv").style.height=showHide?"100%":"0%";
}
//********************************************
