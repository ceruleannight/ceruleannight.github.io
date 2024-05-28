
//****************************************
// NameValueList - This class provides functionality for 
//   manipulating correlating lists of names and values.

//   The class is dependant on the StringTokenizer class
//   found in another library file.
function NameValueList(valueList,nameList,delimiter)
{
	// -- Methods
	this.GetAt=NameValueList_GetAt;
	this.IndexOfValue=NameValueList_IndexOfValue;
	
	// --Data Members
	this.nameValueArray=new Array();
	
	// -- Construction
	var valueList=new StringTokenizer(valueList,delimiter);
	var nameList=new StringTokenizer(nameList,delimiter);
	
	var len=valueList.Count();
	for(var index=0;index<len;index++)
	{
		var value=valueList.GetAt(index);
		var name=nameList.GetAt(index);
		this.nameValueArray.push(new NameValue(name,value));
	}
	
	return this;
}
//****************************************

//****************************************
function NameValueList_GetAt(index)
{
	if(index<0 || index>=this.nameValueArray.length){return null;}
	return this.nameValueArray[index];
}
//****************************************
function NameValueList_IndexOfValue(val)
{
	var len=this.nameValueArray.length;
	for(var index=0;index<len;index++)
	{
		var oNv=this.nameValueArray[index];
		if(oNv.value==val){return index;}
	}
	return -1;
}
//****************************************

//****************************************
function NameValue(name,value)
{
	this.name=name;
	this.value=value;
	return this;
}
//****************************************
