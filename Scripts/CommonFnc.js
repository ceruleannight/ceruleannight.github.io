
//*****************************************************
function TrimChar(str,chToRemove)
{
	if(str==null){return null;}
	str=""+str;
	
	var len=str.length;
	var start=0;
	for(var i=0; i<len; i++)
	{
		var ch=""+str.substr(i,1);
		if(ch!=chToRemove){break;}
		start=i+1;
	}
	
	var end=len;
	for(var i=len-1; i>0; i--)
	{
		var ch=str.substr(i,1);
		if(ch!=chToRemove){break;}
		end=i;
	}
	
	return str.substr(start,end-start);
}
//*****************************************************
function Trim(str)
{
  return TrimChar(str," ");
}
//*****************************************************
function ReplaceChar(str,chToFind,chToReplaceWith)
{
	if(str==null){return str;}
	var len=str.length;
	var resultStr="";
	for(var index=0;index<len;index++)
	{
		var ch=str.substring(index,index+1);
		if(ch==chToFind){resultStr+=chToReplaceWith;}
		else{resultStr+=ch;}
	}
	return resultStr;
}
//*****************************************************
function LeftStr(str,width)
{
	if(!str || str.length==0 || width>=str.length){return str;}
	return str.substring(0,width);
}
//*****************************************************
function RightStr(str,width)
{
	if(!str || str.length==0 || width>=str.length){return str;}
	return str.substr(str.length-width,width);
}
//*****************************************************
function RoundTo(value,place)
{
	if(place<1){return Math.round(value);}
	var multiple=place*10;
	return Math.round(value*multiple)/multiple;
}
//*****************************************************
function GetSelectedText(oDoc)
{
	if(oDoc.selection)
	{
		var selection=oDoc.selection;
		var range=selection.createRange();
		if(selection.type=="Text")
		{
			return range.text;
		}
	}
	return "";
}
//*****************************************************
function GetSelectedTextRange(oDoc)
{
	if(oDoc.selection)
	{
		var selection=oDoc.selection;
		var range=selection.createRange();
		if(selection.type=="Text")
		{
			return range;
		}
	}
	return null;
}
//*****************************************************
function RoundTo(value,place)
{
	if(place<1){return Math.round(value);}
	var multiple=Math.pow(10,place);
	return Math.round(value*multiple)/multiple;
}
//*****************************************************
function CommaFormatNum(numVal)
{
	return numVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//*****************************************************
function EscCloseWnd(evt,wnd)
{
	evt=evt?evt:window.event; // compatibility
	if(evt.keyCode==27)
	{
		window.close();
		return false;
	}
	return true;
}
//*****************************************************
function MousePos(evt,wnd)
{
	evt=wnd.event||evt;// (IE compatibility)
	
	this.X=0;
	this.Y=0;
	if(evt.pageX || evt.pageY)
	{
		this.X=evt.pageX;
		this.Y=evt.pageY;
	}
	else if(evt.clientX || evt.clientY)
	{
		this.X=evt.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
		this.Y=evt.clientY+document.body.scrollTop+document.documentElement.scrollTop;
	}
	return this;
}
//*****************************************************

// Textbox entry value retrieval
//*****************************************************
function GetTextboxValue(doc,tbId,defaultValue)
{
	var tb=doc.getElementById(tbId);
	if(!tb){return defaultValue;}
	return tb.value;
}
//*****************************************************
function GetTextboxInt(doc,tbId,defaultValue)
{
	var tb=doc.getElementById(tbId);
	if(!tb){return defaultValue;}

	try
	{
		return parseInt(tb.value,10);
	}
	catch(e){}

	return defaultValue;
}
//*****************************************************
function GetTextboxFloat(doc,tbId,defaultValue)
{
	var tb=doc.getElementById(tbId);
	if(!tb){return defaultValue;}

	try
	{
		return parseFloat(tb.value);
	}
	catch(e){}

	return defaultValue;
}
//*****************************************************
function IsMobile()
{
	if(navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		|| navigator.userAgent.match(/Opera Mini/i)
		|| navigator.userAgent.match(/IEMobile/i)
	){return true;}
	return false;
}
//*****************************************************
