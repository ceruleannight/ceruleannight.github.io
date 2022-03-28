
//********************************************
function InitOkModalBox(msg,width,bgColor)
{
	var html="<div class=\"modalBoxDiv\" "+
		"style=\"width:"+width+"px; background-color:#"+bgColor+";\">";
	html+=msg;

	html+="<br /><br />";
	html+="<input type=\"button\" value=\"OK\" "+
		"style=\"width:70px;\" onclick=\"HideModal()\" />";

	html+="</div>";

	var div=document.getElementById("modalBoxDiv");
	div.innerHTML=html;
	//div.style.display="block";
	div.style.height="100%";
}
//********************************************
function InitModalBox(content,width,bgColor)
{
	var html="<div class=\"modalBoxDiv\" "+
		"style=\"width:"+width+"px; background-color:#"+bgColor+";\">";
	html+=content;
	html+="</div>";

	var div=document.getElementById("modalBoxDiv");
	div.innerHTML=html;
	//div.style.display="block";
	div.style.height="100%";
}
//********************************************
function HideModal()
{
	document.getElementById("modalBoxDiv").style.height=0;
}
//********************************************
