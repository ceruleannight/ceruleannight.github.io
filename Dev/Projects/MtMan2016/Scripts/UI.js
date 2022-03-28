
//*****************************************
function DrawHorzMeter(id,width,height,val,maxVal,bgColor,fillColor,cssClass,text)
{
	var fillWidth=val/maxVal*width;

	var html="<div id=\""+id+"\" class=\""+cssClass+"\" style=\"width:"+width+"px; height:"+height+"px; background-color:#"+bgColor+";\">";
	html+="<div style=\"width:"+fillWidth+"px; height:"+height+"px; background-color:#"+fillColor+";\">"+text+"</div>";
	html+="</div>";
	return html;
}
//*****************************************
