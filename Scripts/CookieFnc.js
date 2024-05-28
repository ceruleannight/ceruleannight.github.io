
//************************************************
// Sets a cookie with a far distant future expiration
function SetCookieQuick(doc,cookieName,value)
{
	var dt=new Date("2030/01/01");
	var txt=cookieName+"="+escape(value)+"; expires="+dt.toGMTString()+"; path=/";
	doc.cookie=txt;
}
//************************************************
function ReadCookieQuick(doc,cookieName)
{
	var cookieArray=doc.cookie.split(';');
	for(var i=0; i<cookieArray.length; i++)
	{
		var c=cookieArray[i];
		var partArray=c.split('=');
		if(cookieName==partArray[0])
		{
			if(partArray.length<2){return "";}
			return unescape(partArray[1]);
		}
	}
	 return "";
}
//************************************************
