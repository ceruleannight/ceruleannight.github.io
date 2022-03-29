
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Intro()
{
	this.active=true;

	//********************************************
	this.Command=function(cmd)
	{
		if(cmd=="TO-STORY1"){this.StoryPanel1();}
		if(cmd=="TO-STORY2"){this.StoryPanel2();}
		if(cmd=="BEGIN"){this.active=false;}
	}
	//********************************************
	this.Splash=function()
	{
		var html="";
		html+="<div class=\"introSplashBgPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\"></div>";
	
		html+="<div class=\"introMainPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\">";
		html+="<br />";
		html+="<img src=\"_imgs/Logo_main1.gif\" />";
		html+="<br /><a href=\"#\" onclick=\"IntroCmd('TO-STORY1');return false;\" class=\"introLink\">&gt; Start &lt;</a>";
		html+="</div>";
		document.getElementById("worldDiv").innerHTML=html;
	}
	//********************************************
	this.StoryPanel1=function()
	{
		var html="";
		html+="<div class=\"introLeadInBgPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\"></div>";
	
		html+="<div class=\"introMainPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\">";
		html+="<br />";

		html+="<div style=\"width:730px; font-size:24px;\">";
		html+="After years employed as a tweed weaver you have come to yearn for more adventure in life.&nbsp; ";
		html+="Reasoning that weaving tweed has well prepared you for life in the rugged wilderness, ";
		html+="you board a stage and travel west to the edge of the frontier.&nbsp; ";
		html+="You are confident that fame and fortune as a mountain man is your destiny.&nbsp; ";

		html+="After a long journey the stage coach rolls to a stop and you step off at the edge of a small settlement.&nbsp; ";
		html+="To the east is the long dusty road back home, and to the west you see the open prairie.&nbsp; ";
		html+="Eager for a taste of the wild you turn your face west and start walking.&nbsp; ";
		html+="Just then you hear a voice: <i>\"Hey, Tenderfoot! So you've come to die in the wilderness, eh boy?\"</i>";
		html+="</div>";

		html+="<br /><a href=\"#\" onclick=\"IntroCmd('TO-STORY2');return false;\" class=\"introLink\">&gt; Next &lt;</a>";
		html+="</div>";
		document.getElementById("worldDiv").innerHTML=html;
	}
	//********************************************
	this.StoryPanel2=function()
	{
		var html="";
		html+="<div class=\"introLeadInBgPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\"></div>";
	
		html+="<div class=\"introMainPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\">";
		html+="<br />";

		html+="<div style=\"width:730px; font-size:24px;\">";
		html+="You turn to see an old man rocking in a chair, dressed in weathered buckskin.&nbsp; ";
		html+="The man smiles and says <i>\"Son, you look like you could use a bit of advice.\"</i> &nbsp; ";
		html+="Feeling a bit insulted, you are about to walk away when a little voice inside says that maybe you had better listen to the man.&nbsp; ";
		html+="So you walk over and have a seat.&nbsp; ";
		html+="After explaining your ambitions the old man is delighted at your spunk, but takes pity on you ";
		html+="and provides you with a rifle and some ammunition.&nbsp; ";
		html+="The thought had not occurred to you until this point that you might face some real dangers in the wilderness.&nbsp; ";
		html+="With newfound gravity you thank the man, stand to your feet and head westward.&nbsp; ";
		html+="The old man calls after you, <i>\"Stop back any time boy, and let me know how you're doing.\"</i>";
		html+="</div>";

		html+="<br /><a href=\"#\" onclick=\"IntroCmd('BEGIN');return false;\" class=\"introLink\">&gt; Begin &lt;</a>";
		html+="</div>";
		document.getElementById("worldDiv").innerHTML=html;
	}
	//********************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
