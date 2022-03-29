
//*******************************************************
function GamePlayTimer()
{
	// Note: durations are in milliseconds
	this.storedDurationMs=0;
	this.lastStartTime=null;

	this.Reset=GamePlayTimer_Reset;
	this.Start=GamePlayTimer_Start;
	this.Stop=GamePlayTimer_Stop;
	this.GetFormattedDurationStr=GamePlayTimer_GetFormattedDurationStr;

	return this;
}
//*******************************************************
function GamePlayTimer_Reset()
{
	this.storedDurationMs=0;
	this.lastStartTime=null;
}
//*******************************************************
function GamePlayTimer_Start()
{
	this.lastStartTime=new Date();
}
//*******************************************************
function GamePlayTimer_Stop()
{
	if(!this.lastStartTime){return;}

	var now=new Date();
	this.storedDurationMs+=now.getTime()-this.lastStartTime.getTime();
	this.lastStartTime=null;
}
//*******************************************************
function GamePlayTimer_GetFormattedDurationStr()
{
	// Start with the stored duration
	var duration=this.storedDurationMs;

	// Add any not yet stored duration
	if(this.lastStartTime)
	{
		var now=new Date();
		duration+=now.getTime()-this.lastStartTime.getTime();
	}

	return DurationMsToTimeStr(duration)
}
//*******************************************************

//*******************************************************
function DurationMsToTimeStr(durationMs)
{
	var hours=Math.floor(durationMs/1000/60/60);
	durationMs-=(hours*60*60*1000); // remove hours
	var minutes=Math.floor(durationMs/1000/60);
	durationMs-=(minutes*60*1000); // remove minutes
	var seconds=Math.floor(durationMs/1000);

	var str="";
	if(hours>0){str+=hours+":";}
	str+=minutes+":";
	str+=ZeroPadNumberStr(seconds,2);

	return str;
}
//*******************************************************
function ZeroPadNumberStr(number,length)
{
	var str=""+number;
	while(str.length<length)
	{
		str="0"+str;
	}   
	return str;
}
//*******************************************************
