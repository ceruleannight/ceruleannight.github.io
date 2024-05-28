
//******************************************
function RgbColor(rgb)
{
	// Methods
	this.ToRgbHex=RgbColor_ToRgbHex;
	this.AdjustColor=RgbColor_AdjustColor;
	
	// Data Memebers
	this.R=RedRgbVal(rgb);
	this.G=GreenRgbVal(rgb);
	this.B=BlueRgbVal(rgb);
	return this;
}
//******************************************
function RgbColor_ToRgbHex()
{
	return ColorElemenetsToRgbHex(this.R,this.G,this.B);
}
//******************************************
function RgbColor_AdjustColor(red,green,blue)
{
	this.R+=red;
	if(this.R<0){this.R=0;}
	if(this.R>255){this.R=255;}
	
	this.G+=green;
	if(this.G<0){this.G=0;}
	if(this.G>255){this.G=255;}
	
	this.B+=blue;
	if(this.B<0){this.B=0;}
	if(this.B>255){this.B=255;}
}
//******************************************

//******************************************
function ColorElemenetsToRgbHex(r,g,b)
{
	return ColorElementValueToHex(r)+ColorElementValueToHex(g)+ColorElementValueToHex(b);
}
//******************************************

//******************************************
function RedRgbVal(rgb)
{
	return parseInt(rgb.substr(0,2),16);
}
//******************************************
function GreenRgbVal(rgb)
{
	return parseInt(rgb.substr(2,2),16);
}
//******************************************
function BlueRgbVal(rgb)
{
	return parseInt(rgb.substr(4,2),16);
}
//******************************************
function ColorElementValueToHex(elementValue)
{
	var high=Math.floor(elementValue/16.0);
	var low=elementValue-high*16.0;
	low=Math.floor(low);
	
	return DecToHexLetter(high)+DecToHexLetter(low);
}
//******************************************
function DecToHexLetter(decVal)
{
	if(decVal<10){return ""+decVal;}
	switch(decVal)
	{
		case 10:return "A";
		case 11:return "B";
		case 12:return "C";
		case 13:return "D";
		case 14:return "E";
		case 15:return "F";
	}
	return "";
}
//******************************************

//******************************************
function PolarizeColor(startColorRgb,directionColorRgb,ratio)
{
	var rgb=new RgbColor(startColorRgb);
	var directionRgb=new RgbColor(directionColorRgb);
	
	var rDist=directionRgb.R-rgb.R;
	var gDist=directionRgb.G-rgb.G;
	var bDist=directionRgb.B-rgb.B;
	
	var r=Math.round(rgb.R+rDist*ratio);
	var g=Math.round(rgb.G+gDist*ratio);
	var b=Math.round(rgb.B+bDist*ratio);
	
	return ColorElemenetsToRgbHex(r,g,b);
}
//******************************************

//******************************************
function ColorRangeIterator(startRgbStr,endRgbStr,totalGradients,includeFirstColor)
{
	// Methods
	this.NextColor=ColorRangeIterator_NextColor;
	this.DoNext=ColorRangeIterator_DoNext;
	
	var scale=1.0/(totalGradients-1.01);
	var start=new RgbColor(startRgbStr);
	var end=new RgbColor(endRgbStr);
	
	// Construction
	this.rInc=(end.R-start.R)*scale;
	this.gInc=(end.G-start.G)*scale;
	this.bInc=(end.B-start.B)*scale;
	
	this.currentColor=start;
	this.totalGradients=totalGradients;
	this.gradientCount=0;
	this.includeFirstColor=includeFirstColor;
	this.isFirst=true;
	
	return this;
}
//******************************************
function ColorRangeIterator_NextColor()
{
	if(!this.includeFirstColor && this.isFirst)
	{
		// Just run the DoNext method but don't return anything unless it returns null
		var result=this.DoNext();
		if(result==null){return null;}
		this.isFirst=false;
	}
	
	return this.DoNext();
}
//******************************************
function ColorRangeIterator_DoNext()
{
	if(this.gradientCount>=this.totalGradients){return null;}
	
	var rgbStr=this.currentColor.ToRgbHex();
	this.currentColor.AdjustColor(this.rInc,this.gInc,this.bInc);
	this.gradientCount++;
	return rgbStr;
}
//******************************************
