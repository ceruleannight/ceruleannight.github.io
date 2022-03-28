
//****************************************************
function TextConsole(doc,mainDiv,panelWidth,panelHeight,panelCount,maxCharPerLine)
{
	this.doc=doc;
	this.mainDiv=mainDiv;
	this.panelCount=panelCount;
	this.panelWidth=panelWidth;
	this.panelHeight=panelHeight;
	this.maxCharPerLine=maxCharPerLine;

	this.subPanelArray=new Array();
	this.bottomPanel;

	this.InitPanels=TextConsole_InitPanels;
	this.ShiftTextUp=TextConsole_ShiftTextUp;
	this.WriteTextLine=TextConsole_WriteTextLine;
	this.WriteText=TextConsole_WriteText;

	return this;
}
//****************************************************
function TextConsole_InitPanels()
{
	var html="";
	for(var i=0;i<this.panelCount;i++)
	{
		var y=this.panelHeight*i;
		var id="tp"+i+"Div";
		html+="<div id=\""+id+"\" class=\"consoleLine\" "+
			"style=\"border:none; position:absolute; "+
				"left:0px; top:"+y+"px; width:"+this.panelWidth+"px; height:"+this.panelHeight+"px;\"></div>";
	}
	this.mainDiv.innerHTML=html;

	// Init subPanelArray
	for(var i=0;i<this.panelCount;i++)
	{
		var div=this.doc.getElementById("tp"+i+"Div");
		this.subPanelArray.push(div);
	}

	this.bottomPanel=this.subPanelArray[this.panelCount-1];
}
//****************************************************
function TextConsole_ShiftTextUp()
{
	for(var i=1;i<this.panelCount;i++)
	{
		var p1=this.subPanelArray[i-1];
		var p2=this.subPanelArray[i];
		p1.innerHTML=p2.innerHTML;
	}
}
//****************************************************
function TextConsole_WriteTextLine(text)
{
	this.ShiftTextUp();
	this.bottomPanel.innerHTML=text;
}
//****************************************************
function TextConsole_WriteText(text)
{
	if(text.length<=this.maxCharPerLine)
	{
		this.WriteTextLine(text);
		return;
	}

	var wordArray=text.split(" ");
	var lineAccum=0;
	var text="";
	for(var i=0;i<wordArray.length;i++)
	{
		var word=wordArray[i];
		var wordLen=word.length;
		if((lineAccum+wordLen)>this.maxCharPerLine)
		{
			this.WriteTextLine(text);
			lineAccum=wordLen;
			text=word;
			continue;
		}

		if(text!="")
		{
			text+=" ";
			lineAccum++;
		}
		text+=word;
		lineAccum+=wordLen;
	}

	if(text!="")
	{
		this.WriteTextLine(text);
	}
}
//****************************************************
