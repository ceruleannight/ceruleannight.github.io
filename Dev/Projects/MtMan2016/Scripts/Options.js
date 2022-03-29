
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Options(game)
{
	this.game=game;
	this.mode="MAIN-MENU";
	this.active=false;

	//********************************************
	//this.Render=function()
	//{
	//	switch(this.mode)
	//	{
	//		case "MAIN-MENU":this.RenderMainMenu();break;
	//		case "PROGRESS-CHART":this.RenderProgressChart();break;
	//	}
	//}
	//********************************************
	this.RenderMainMenu=function()
	{
		var html="<table cellspacing=\"0\" style=\"width:100%\"><tr><td style=\"text-align:center;\">";
		html+="<span class=\"text16px\">Options</span><br /><br />";
		html+="Choose an option.<br /><br />"
		html+=WriteGameBtn("SHOW-PROGRESS-CHART","Progress Chart",150)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("SHOW-SOUND-LVL-FORM","Sound Level",150)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("CLOSE-OPTIONS","Close",150)+"<br />";
		html+="<div style=\"height:5px;\"></div>";

		html+="</td></tr></table>";

		this.game.optionsPanel.WriteContent(html);
		this.mode="MAIN-MENU";
	}
	//********************************************
	this.RenderProgressChart=function()
	{
		var html="";
		//var html="<table cellspacing=\"0\" style=\"width:100%\"><tr><td style=\"text-align:center;\">";
		//html+="<span class=\"text16px\">Options</span><br /><br />";
		//html+="Choose an option.<br /><br />"
		//html+=WriteGameBtn("SHOW-PROGRESS-CHART","Progress Chart",150)+"<br />";
		//html+="<div style=\"height:5px;\"></div>";
		//html+="</td></tr></table>";

		var g=this.game;
		var w=g.world;
		var p=g.player;

		var skillPercent=""+Math.round(p.mtManSkill*100);
		
		html+="Moutain Man Reputation: <b>"+g.GetMtManTitle()+"</b><br />";
		html+="Overall Mastery: <b>"+skillPercent+"%</b><br />";
		
		html+="<div style=\"height:5px;\"></div>";

		html+="<table cellspacing=\"0\" class=\"displayTbl\" style=\"width:100%\">";
		html+="<tr style=\"background-color:#CEAA2C;\">";
		html+="<th>Terrain</th>";
		html+="<th>Title</th>";
		html+="<th>Mastery</th>";
		//html+="<th></th>";
		html+="</tr>";

		for(var i=0; i<p.terrainStatArray.length; i++)
		{
			var tStat=p.terrainStatArray[i];
			var tType=w.GetTerrainTypeByKey(tStat.key);
			tTitle=tStat.GetTerrainTitle(tType.name);

			skillPercent=""+Math.round(tStat.skill*100);
			if(skillPercent=="100" && tStat.skill<1){skillPercent="99";}

			if(tStat.skill>0)
			{
				html+="<tr style=\"text-align:center;\">";
				html+="<td>"+tType.name+"</td>";
				html+="<td>"+tTitle+"</td>";
				html+="<td>"+skillPercent+"%</td>";
				html+="</tr>";
			}
			else
			{
				html+="<tr style=\"text-align:center;\">";
				html+="<td>?</td>";
				html+="<td>-</td>";
				html+="<td>-</td>";
				html+="</tr>";
			}
		}
		html+="</table>";

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("GO-TO-MAIN-MENU","OK",65);
		this.game.optionsPanel.WriteContent(html);
		this.mode="PROGRESS-CHART";
	}
	//********************************************
	this.RenderSoundLevelForm=function()
	{
		var html="";

		//html+="<div style=\"display:flex; width:430px; height:380px;\">";
		// align-items:center; justify-content:center;

		var vol=this.game.soundFx.volume*100;

		var html="<table cellspacing=\"0\" style=\"width:100%\"><tr><td style=\"text-align:center;\">";

		html+="<span class=\"text16px\">Set Sound Level</span><br /><br /><br />";
		html+="<input id=\"volumeSlider\" type=\"range\" min=\"0\" max=\"100\" "+
			"value=\""+vol+"\" style=\"width:200px;\" /><br /><br /><br />";

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("SET-SOUND-VOLUME","OK",65);

		html+="</td></tr></table>";
		//html+="</div>";

		this.game.optionsPanel.WriteContent(html);
		this.mode="SOUND-LVL-FORM";
	}
	//********************************************
	this.SetSoundVolume=function()
	{
		var s=document.getElementById("volumeSlider");
		if(s)
		{
			var lvl=parseFloat(s.value)/100;
			this.game.soundFx.volume=lvl
			SetCookieQuick(document,"MtManSoundLvl",""+lvl);
		}
		
		this.game.optionsPanel.Show(false);
		this.active=false;
	}
	//********************************************
	this.Command=function(cmd,param1)
	{
		if(cmd=="ESC")
		{
			if(this.mode=="MAIN-MENU"){cmd="CLOSE-OPTIONS";} // (will close below)
			if(this.mode=="PROGRESS-CHART"){cmd="GO-TO-MAIN-MENU";} // (will close below)
			if(this.mode=="SOUND-LVL-FORM"){cmd="GO-TO-MAIN-MENU";} // (will close below)
		}

		if(cmd=="SHOW-PROGRESS-CHART"){this.RenderProgressChart();}
		if(cmd=="SHOW-SOUND-LVL-FORM"){this.RenderSoundLevelForm();}
		if(cmd=="SET-SOUND-VOLUME"){this.SetSoundVolume();}

		if(cmd=="GO-TO-MAIN-MENU"){this.RenderMainMenu();return;}
		if(cmd=="CLOSE-OPTIONS")
		{
			this.game.optionsPanel.Show(false);
			this.active=false;
		}
	}
	//********************************************
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
