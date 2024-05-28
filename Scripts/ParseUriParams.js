
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function UriParameters(fullUrl)
{
	this.paramNameArray=[];
	this.paramValueArray=[];

	//var sURL=window.document.URL.toString();
	if(fullUrl.indexOf("?")>0)
	{
		var paramArray=(fullUrl.split("?")[1]).split("&");

		for(var i=0; i<paramArray.length; i++)
		{
			var param=paramArray[i].split("=");
			this.paramNameArray.push(param[0]);
			this.paramValueArray.push(unescape(param[1]));
		}
	}

	//*****************************************************
	this.GetValue=function(paramName,defaultVal)
	{
		for(var i=0; i<this.paramNameArray.length; i++)
		{
			var name=this.paramNameArray[i];
			if(name===paramName)
			{
				return this.paramValueArray[i];
			}
		}
		return defaultVal;
	}
	//*****************************************************
	this.GetValueInt=function(paramName,defaultVal)
	{
		var val=this.GetValue(paramName,null);
		if(val===null){return defaultVal;}

		try
		{
			return parseInt(val,10);
		}
		catch(e){}
		return defaultVal;
	}
	//*****************************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
