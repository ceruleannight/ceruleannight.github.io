
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// A repeatable random number generator.
// For repeatability set the seed value before starting
// to call Next.
function RandomGen()
{
	this.seed=Math.floor(Math.random()*1000);
	
	//*****************************************
	this.Next=function()
	{
		this.seed=(this.seed*9301+49297) % 233280;
		return this.seed/233280;
	}
	//*****************************************
	this.NextInt=function(min,max)
	{
		min=min || 0;
		max=max || 1;
		
		this.seed=(this.seed*9301+49297) % 233280;
		var rnd=this.seed/233280;
		return Math.round(min+rnd*(max-min));
	}
	//*****************************************
	
	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//***********************************************
// Convert a single Base64 character to an integer (0-63)
// Characters that will not convert will return 0.
function Base64ToInt(ch)
{
	var i=ch.charCodeAt(0);
	if(i>=65 && i<=90){return i-65;}  // A-Z : maps to 0-25
	if(i>=97 && i<=122){return i-71;} // a-z : maps to 26-51
	if(i>=48 && i<=57){return i+5;}   // 0-9 : maps to 52-61
	if(i==43){return 62;}             // +   : maps to 62
	if(i==47){return 63;}             // /   : maps to 63
	return 0;
}
//***********************************************
function ClipValue(value,min,max)
{
	if(value<min){return min;}
	if(value>max){return max;}
	return value;
}
//***********************************************
// Converts a number between 0 and 1 to a percentage between 0 and 100.
function RatioToPercent(val){return ""+Math.round(val*100);}
//***********************************************
