
function PopupPanel(hostDivId,contentDivId)
{
	//this.Game=game;
	this.hostDiv=document.getElementById(hostDivId);
	this.contentDiv=document.getElementById(contentDivId);
	this.IsUp=false;

	//********************************************
	this.Show=function(showHide)
	{
		this.hostDiv.style.display=showHide?"block":"none";
		this.IsUp=showHide
	}
	//********************************************
	this.SetHostBgColor=function(rgb)
	{
		this.hostDiv.style.backgroundColor="#"+rgb;
	}
	//********************************************
	this.WriteContent=function(html)
	{
		this.contentDiv.innerHTML=html;
	}
	//********************************************
	
	return this;
}
