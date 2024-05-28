
//*****************************************
// StringTokenizer - string tokenizer class.  This provides
//   functionality for breaking and manipulating delimited field string.
//   The delimiter cannot be a percent sign (%) and it must be only one
//   character long.  To embed an instance of the delimiter in a field
//   change it to %c.  To embed a percent sign in a field use %%.
function StringTokenizer(tokenStr,delimiter)
{
	if(delimiter=="%"){return null;}
	if(delimiter.length!=1){return null;}
	
  // -- Methods
  this.Init=StringTokenizer_Init;
  this.Count=StringTokenizer_Count;
  this.GetAt=StringTokenizer_GetAt;
  this.IndexOf=StringTokenizer_IndexOf;
  
  // -- Data Members
  this.tokenStr=tokenStr;
  this.delimiter=delimiter;
  this.tokenArray=new Array();
  
  // -- Construction
  this.Init();
  
  return this;
}
//*****************************************

//*****************************************
function StringTokenizer_Init()
{
  var tArray=this.tokenStr.split(this.delimiter);
  var len=tArray.length;
  for(var index=0;index<len;index++)
  {
		var val=tArray[index];
		this.tokenArray.push(UnEscapeTokenField(val));
  }
}
//*****************************************
function StringTokenizer_Count()
{
	return this.tokenArray.length;
}
//*****************************************
function StringTokenizer_GetAt(index)
{
	if(index<0){return null;}
	var len=this.tokenArray.length;
	if(index>=len){return null;}
	return this.tokenArray[index];
}
//*****************************************
// IndexOf - Returns the index of first instance of "val"
function StringTokenizer_IndexOf(val)
{
	var len=this.tokenArray.length;
	for(var index=0;index<len;index++)
	{
		if(this.tokenArray[index]==val){return index;}
	}
	return -1;
}
//*****************************************

//*****************************************
function EscapeTokenField(val,delimiter)
{
	if(val==null){return null;}
	var resultStr="";
	var len=val.length;
	for(var index=0;index<len;index++)
	{
		var ch=val.substring(index,index+1);
		if(ch=="%"){resultStr+="%%";}
		else if(ch==delimiter){resultStr+="%c";}
		else{resultStr+=ch;}
	}
	return resultStr;
}
//*****************************************
function UnEscapeTokenField(val,delimiter)
{
	if(val==null){return null;}
	var resultStr="";
	var len=val.length;
	var escapeMode=false;
	for(var index=0;index<len;index++)
	{
		var ch=val.substring(index,index+1);
		
		if(escapeMode)
		{
			if(ch=="%"){resultStr+="%";escapeMode=false;}
			else if(ch=="c"){resultStr+=delimiter;escapeMode=false;}
			else{escapeMode=false;}
		}
		else
		{
			if(ch=="%"){escapeMode=true;}
			else{resultStr+=ch;}
		}
	}
	return resultStr;
}
//*****************************************
