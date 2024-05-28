
//*****************************************
function PrependToTextLines(txt,valueToPrepend)
{
	if(txt==null){return null;}
	if(txt==""){return "";}
	
	var newTxt="";
	var doPrepend=true;
	for(var index=0;index<txt.length;index++)
	{
		if(doPrepend)
		{
			newTxt+=valueToPrepend;
			doPrepend=false;
		}
		
		var ch=txt.substring(index,index+1);
		if(ch.charCodeAt(0)==13)
		{
			newTxt+=String.fromCharCode(13,10);
			doPrepend=true;
			index++;
		}
		else
		{
			newTxt+=ch;
		}
	}
	return newTxt;
}
//*****************************************
