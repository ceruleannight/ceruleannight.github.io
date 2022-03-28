
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Game(world,cellWidth,cellHeight,randGen,soundFx)
{
	this.world=world;
	this.cellWidth=cellWidth;
	this.cellHeight=cellHeight;
	this.randGen=randGen;
	this.soundFx=soundFx;
	this.playerImg;
	this.player=
	{
		X:26,
		Y:22,

		silver:20,
		ammoMax:6,
		ammo:6,

		hpMax:7,
		hp:7,
		foodMax:40,
		food:40,
		waterMax:40,
		water:40,
		fursMax:5,
		furs:0,

		mtManSkill:0, // (0-1)
		lastReportedMtManLvl:0,
		terrainStatArray:[], // Terrain specific state such as terrain skill
		ideas:0
	}
	this.settlementPos={X:26,Y:22}
	this.turnNum=0;

	this.infoPanelDiv=null;
	this.terrainDisplayPanelDiv=null;

	this.currentEvent=null; // Set when an event is in progress and taking commands
	this.popupPanel=null;

	this.settlement=null; // settlement shop etc
	this.gameWon=false;

	//********************************************
	this.WriteGridEtc=function()
	{
		var cw=this.cellWidth;
		var ch=this.cellHeight;
		var ww=this.world.width;
		var wh=this.world.height;

		var html="";

		// Draw grid
		for(var y=0; y<ww; y++)
		{
			for(var x=0; x<wh; x++)
			{
				var terrain=this.world.GetTerrainTypeAt(x,y);

				var i=x+y*ww;
				var id="cell-"+i;
				//html+=WriteCell(id,i,x*cw,y*ch,cw,ch,terrain.rgb);
				html+=WriteCell(id,i,x*cw,y*ch,cw,ch,"000000");
			}
		}

		// Add player image
		html+="<img id=\"manImg\" src=\"_imgs/Man2.gif\" "+
			"style=\"border:none; position:absolute; left:0px; top:0px; z-index:10000;\" />";

		html+="<img id=\"settlementImg\" src=\"_imgs/Settlement_19x19.gif\" "+
			"style=\"border:none; position:absolute; left:494px; top:418px; z-index:1000;\" />";

		//------------------------------------------------------------------
		// Render side panel
		html+="<div class=\"sidePanel\" style=\"position:absolute; left:540px; top:0px; width:347px; height:532px;\">";

		// Header
		html+="<div style=\"position:absolute; left:0px; top:0px; height:26px; background-color:#8E7624;\">";
		html+="<table cellspacing=\"0\" style=\"100%;\"><tr><td style=\"text-align:center;\">";
		html+="<img src=\"_imgs/MyManLogo.gif\" />";
		html+="</td></tr></table>";
		html+="</div>";

		// Info panel stub.  The contents will be rewritten with every turn
		html+="<div id=\"infoPanelDiv\" style=\"position:absolute; left:7px; top:28px; width:298px; height:200px;\"></div>";

		html+="<div id=\"terrainDisplayPanelDiv\" style=\"position:absolute; left:0px; top:230px; width:348px; height:300px;\"></div>";

		html+="<div style=\"position:absolute; left:95px; top:400px;\">";
		html+=this.DrawNavPanelBtns();
		html+="</div>";

		html+="<div style=\"position:absolute; left:257px; top:489px;\">";
		html+=WriteGameBtn("OPTIONS","Options");
		html+="</div>";

		html+="</div>"; // (end side panel)
		//------------------------------------------------------------------

		// Options popup panel (must float above everything including the settlment panel etc)
		html+="<div id=\"optionsPanelHostDiv\" class=\"optionsPanelHostDiv\" "+
			"style=\"display:none; z-index:10020; position:absolute; left:37px; top:50px; width:450px; height:400px;\">";
			html+="<div id=\"optionsPanelDiv\" class=\"optionsPanel\" style=\"width:430px; height:380px;\"></div>";
		html+="</div>";

		// Encounter panel (floats above everything else)
		html+="<div id=\"popupPanelHostDiv\" class=\"popupPanelHostDiv\" "+
			"style=\"display:none; z-index:10010; position:absolute; left:37px; top:50px; width:450px; height:400px;\">";
			html+="<div id=\"popupPanelDiv\" class=\"popupPanel\" style=\"width:430px; height:380px;\"></div>";
		html+="</div>";

		// Settlement popup panel (floats above everything else also)
		html+="<div id=\"settlementPanelHostDiv\" class=\"settlementPanelHostDiv\" "+
			"style=\"display:none; z-index:10010; position:absolute; left:37px; top:50px; width:450px; height:400px;\">";
			html+="<div id=\"settlementPanelDiv\" class=\"settlementPanel\" style=\"width:430px; height:380px;\"></div>";
		html+="</div>";

		// Level-up popup panel (floats above everything else also)
		html+="<div id=\"levelUpPanelHostDiv\" class=\"levelUpPanelHostDiv\" "+
			"style=\"display:none; z-index:10010; position:absolute; left:37px; top:50px; width:450px; height:400px;\">";
			html+="<div id=\"levelUpPanelDiv\" class=\"levelUpPanel\" style=\"width:430px; height:380px;\"></div>";
		html+="</div>";

		html+="<div id=\"gameOverPanelDiv\" class=\"gameOverDiv\" style=\"display:none; position:absolute; left:0px; top:0px; width:900px; height:550px; z-index:2000;\"></div>";
		//html+="<div id=\"gameWonPanelDiv\" class=\"gameWonDiv\" style=\"display:none; position:absolute; left:0px; top:0px; width:900px; height:550px; z-index:2000;\"></div>";
		
		document.getElementById("worldDiv").innerHTML=html;

		this.playerImg=document.getElementById("manImg");
		this.infoPanelDiv=document.getElementById("infoPanelDiv");
		this.terrainDisplayPanelDiv=document.getElementById("terrainDisplayPanelDiv");
		
		this.optionsPanel=new PopupPanel("optionsPanelHostDiv","optionsPanelDiv");
		this.options=new Options(this);

		this.settlementPanel=new PopupPanel("settlementPanelHostDiv","settlementPanelDiv");
		this.settlement=new Settlement(this);
		
		this.popupPanel=new PopupPanel("popupPanelHostDiv","popupPanelDiv"); // General popup panel - Use by encounter system
		this.levelUpPanel=new PopupPanel("levelUpPanelHostDiv","levelUpPanelDiv");
		
		this.SetPlayerImg();
		this.SetPlayerTerrainVisibility(this.player.X,this.player.Y);
		this.UpdateInfoPanel();
		this.UpdateTerrainDisplayPanel();
	}
	//********************************************
	this.UpdateInfoPanel=function()
	{
		var p=this.player;

		var html="";
		html+="<div style=\"height:6px;\"></div>"; // (vert spacer)

		var foodTxt="",foodCss="";
		var waterTxt="",waterCss="";
		if(p.food==0){foodTxt="&nbsp;Starving";foodCss=" pulsateTxt"}
		if(p.water==0){waterTxt="&nbsp;Thirst";waterCss=" pulsateTxt"}

		// Meters
		html+="<table cellspacing=\"0\">";
		html+="<tr>";
		html+="<td>Health</td>";
		html+="<td>"+DrawHorzMeter("",225,20,p.hp,p.hpMax,"E1DED5","FF0000","meterDiv","")+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.hp)+"/"+Math.round(p.hpMax)+"</td>";
		html+="</tr>";
		html+="<tr>";
		html+="<td>Food</td>";
		html+="<td>"+DrawHorzMeter("",225,20,p.food,p.foodMax,"E1DED5","90F040","meterDiv"+foodCss,foodTxt)+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.food)+"/"+Math.round(p.foodMax)+"</td>";
		html+="</tr>";
		html+="<tr>";
		html+="<td>Water</td>";
		html+="<td>"+DrawHorzMeter("",225,20,p.water,p.waterMax,"E1DED5","2B80FF","meterDiv"+waterCss,waterTxt)+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.water)+"/"+Math.round(p.waterMax)+"</td>";
		html+="</tr>";
		html+="<tr>";
		html+="<td>Ammo</td>";
		html+="<td>"+DrawHorzMeter("",225,20,p.ammo,p.ammoMax,"E1DED5","848484","meterDiv","")+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.ammo)+"/"+Math.round(p.ammoMax)+"</td>";
		html+="</tr>";
		html+="<tr>";
		html+="<td>Furs</td>";
		html+="<td>"+DrawHorzMeter("",225,20,p.furs,p.fursMax,"E1DED5","C9921D","meterDiv","")+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.furs)+"/"+Math.round(p.fursMax)+"</td>";
		html+="</tr>";
		html+="</table>";

		html+="<div style=\"height:3px;\"></div>"; // (vert spacer)
		
		// Value stats
		html+="Silver: "+p.silver+"<br />";
		html+="<div style=\"height:3px;\"></div>";

		var ideaStye=p.ideas>0?"background-color:#FFFF00":"";
		html+="<span style=\""+ideaStye+"\">Ideas: "+p.ideas+"</span><br />";

		html+="<div style=\"height:3px;\"></div>";
		html+="Reputation: "+this.GetMtManTitle()+"<br />";
		//html+="Exp: <span style=\"background-color:#FFFF00;\">"+this.player.mtManSkill+"</span><br />";

		this.infoPanelDiv.innerHTML=html;
	}
	//********************************************
	this.UpdateTerrainDisplayPanel=function()
	{
		var terrain=this.GetPlayerCurrentTerrain();

		var html="<div class=\"text16px\" style=\"position:absolute; left:108px;\">Current Location</div>";

		html+="<div class=\"text16px\" style=\"position:absolute; "+
			"left:109px; top:23px; width:130px; height:70px; "+
			"text-align:center; "+
			"background-color:#"+terrain.rgb+"; border:solid 1px #000000;\">";
		html+="<div style=\"height:27px;\"></div>";
		html+=terrain.name;
		html+="</div>";

		// Display terrain player level
		if(terrain.key=="TOWN")
		{
			html+="<div style=\"height:12px;\"></div>";
			html+="<a href=\"#\" class=\"button button-color\" "+
				"style=\"position:absolute; left:104px; top:105px; width:140px;\" "+
				"onclick=\"GameCmd('VISIT-TOWN');return false;\"><span>Visit Settlement</span></a>";
		}
		else
		{
			html+="<div style=\"position:absolute; top:100px; width:347px;\">";
			html+="<table style=\"width:100%; text-align:center;\"><tr><td>";
			html+=terrain.name+" Title: "+this.GetPlayerTerrainTitle(terrain.key);
			html+="</td></tr></table>";
			html+="</div>";
		}

		this.terrainDisplayPanelDiv.innerHTML=html;
	}
	//********************************************
	this.DrawNavPanelBtns=function()
	{
		var html="";

		// Add nav buttons
		//html+="<div style=\"position:absolute; left:90px; top:388px;\">";
		//html+=this.RenderNavBtn(46,0,45,45,"UpArrow.gif",6,"GameCmd('GO-NORTH')");
		//html+=this.RenderNavBtn(0,23,45,45,"LeftArrow.gif",2,"GameCmd('GO-WEST')");
		//html+=this.RenderNavBtn(92,23,45,45,"RightArrow.gif",2,"GameCmd('GO-EAST')");
		//html+=this.RenderNavBtn(46,46,45,45,"DownArrow.gif",11,"GameCmd('GO-SOUTH')");

		html+=this.RenderNavBtn(55,0,45,45,"UpArrow.gif",6,"GameCmd('GO-NORTH')");
		html+=this.RenderNavBtn(0,28,45,45,"LeftArrow.gif",2,"GameCmd('GO-WEST')");
		html+=this.RenderNavBtn(108,28,45,45,"RightArrow.gif",2,"GameCmd('GO-EAST')");
		html+=this.RenderNavBtn(55,55,45,45,"DownArrow.gif",11,"GameCmd('GO-SOUTH')");
		//html+="</div>";

		return html;
	}
	//********************************************
	this.RenderNavBtn=function(x,y,w,h,imgName,imgTopMargin,onClick)
	{
		return "<a href=\"#\" class=\"button button-color\" "+
			"style=\"position:absolute; left:"+x+"px; top:"+y+"px; width:"+w+"px; height:"+h+"px;\" "+
			"onclick=\""+onClick+";return false;\">"+
				"<img src=\"_imgs/"+imgName+"\" style=\"margin-top:"+imgTopMargin+"px;\" /></a>";
	}
	//********************************************
	this.InitPlayer=function()
	{
		var arr=this.player.terrainStatArray;
		arr.push(new TerrainState("PRAIRIE"));
		arr.push(new TerrainState("WOODLAND"));
		arr.push(new TerrainState("FOREST"));
		arr.push(new TerrainState("DEEP-FOREST"));
		arr.push(new TerrainState("DESERT"));
		arr.push(new TerrainState("SAVANNAS"));
		arr.push(new TerrainState("JUNGLE"));
		arr.push(new TerrainState("THICK-JUNGLE"));
		arr.push(new TerrainState("SWAMP"));
		arr.push(new TerrainState("HILLS"));
		arr.push(new TerrainState("MOUNTAINS"));
	}
	//********************************************
	// Gets the player's terrain status object that contains how experienced
	// the player is on the specified terrain.
	this.GetPlayerTerrainStat=function(terrainTypeKey)
	{
		var arr=this.player.terrainStatArray;
		for(var i=0; i<arr.length; i++)
		{
			var tr=arr[i];
			if(tr.key==terrainTypeKey){return tr;}
		}
		return null;
	}
	//********************************************
	// Sets the overall Mt Man skill by tallying up all of the 
	// current terrain skills and normalizing the value.
	this.RecalculateMtManSkill=function()
	{
		var mtManSkill=0;
		var arr=this.player.terrainStatArray;
		for(var i=0; i<arr.length; i++)
		{
			mtManSkill+=arr[i].skill;
		}
		this.player.mtManSkill=mtManSkill/arr.length;
	}
	//********************************************
	this.CheckPlayerNeeds=function()
	{
		var p=this.player;
		var hpRatio=p.hp/p.hpMax;
		var foodRatio=p.food/p.foodMax;
		var waterRatio=p.water/p.waterMax;
		var ammoRatio=p.ammo/p.ammoMax;
		var fursRatio=p.furs/p.fursMax;
		
		var needKey="";
		var usable=0;

		if(waterRatio<foodRatio){needKey="WATER";usable=p.waterMax-p.water;}
		else if(foodRatio<1){needKey="FOOD";usable=p.foodMax-p.food;}
		else if(hpRatio<1){needKey="HP";usable=p.hpMax-p.hp;}
		else if(ammoRatio<1){needKey="AMMO";usable=p.ammoMax-p.ammo;}
		else if(fursRatio<1){needKey="FURS";usable=p.fursMax-p.furs;}

		return {key:needKey,usable:usable};
	}
	//********************************************
	
	//********************************************
	this.MovePlayer=function(xOff,yOff)
	{
		var x=this.player.X+xOff;
		var y=this.player.Y+yOff;

		// Check boundaries
		if(x<0 || x>(this.world.width-1)){return false;}
		if(y<0 || y>(this.world.height-1)){return false;}

		var terrain=this.world.GetTerrainTypeAt(x,y);

		if(!terrain.passable){return false;}

		this.player.X=x;
		this.player.Y=y;

		//this.SetPloyerPos(x,y);
		this.SetPlayerImg();
		this.SetPlayerTerrainVisibility(this.player.X,this.player.Y);

		return true;
	}
	//********************************************
	this.GetPlayerCurrentTerrain=function()
	{
		return this.world.GetTerrainTypeAt(this.player.X,this.player.Y);
	}
	//********************************************
	this.SetPlayerImg=function()
	{
		var gx=this.cellWidth*this.player.X;
		var gy=this.cellHeight*this.player.Y;
		gx+=0;
		gy+=0;
		this.playerImg.style.left=""+gx+"px";
		this.playerImg.style.top=""+gy+"px";
	}
	//********************************************
	this.SetPlayerTerrainVisibility=function(centerX,centerY)
	{
		var w=this.world;
		this.SetTerrainVisibility(centerX-1,centerY-1);
		this.SetTerrainVisibility(centerX,centerY-1);
		this.SetTerrainVisibility(centerX+1,centerY-1);
		this.SetTerrainVisibility(centerX-1,centerY);
		this.SetTerrainVisibility(centerX,centerY);
		this.SetTerrainVisibility(centerX+1,centerY);
		this.SetTerrainVisibility(centerX-1,centerY+1);
		this.SetTerrainVisibility(centerX,centerY+1);
		this.SetTerrainVisibility(centerX+1,centerY+1);
	}
	//********************************************
	this.SetTerrainVisibility=function(x,y)
	{
		var w=this.world;
		var i=w.GetWorldIndexFromCoords(x,y);
		if(i==-1){return;}
		w.cellStateArray[i]|=2; // 2=visibility
		var div=document.getElementById("cell-"+i);
		if(!div){return;}

		var tt=w.GetTerrainTypeAt(x,y);
		div.style.backgroundColor="#"+tt.rgb;
	}
	//********************************************
	// Handle any input from the user
	this.Command=function(cmd,param1)
	{
		if(cmd=="CONTINUE-PLAYING-AFTER-WIN")
		{
			g_gameOver=false;
			document.getElementById("worldDiv").style.display="block";
			document.getElementById("winScreenDiv").style.display="none";
			return;
		}
		if(g_gameOver){return;}

		//-------------------------------------
		// Options
		if(cmd=="OPTIONS")
		{
			this.options.RenderMainMenu();
			this.options.active=true;
			this.optionsPanel.Show(true);
		}
		else if(this.options.active)
		{
			this.options.Command(cmd,param1);
			//this.UpdateInfoPanel();
			return;
		}
		//-------------------------------------

		//-------------------------------------
		// Launch settlement options
		if(cmd=="VISIT-TOWN" && !this.settlement.active)
		{
			this.settlement.RenderMainMenu();
			this.settlement.active=true;
			this.settlementPanel.Show(true);
		}

		// Route commands to settlement popup
		if(this.settlement.active)
		{
			this.settlement.Command(cmd,param1);
			this.UpdateInfoPanel();
			return;
		}
		//-------------------------------------

		//-------------------------------------
		// Control level-up popup
		// Note: this must be before the encounter handler below to avoid a button clicking bug
		if(this.levelUpPanel.IsUp && cmd=="OK")
		{
			this.levelUpPanel.Show(false);
		}
		//-------------------------------------

		//-------------------------------------
		// Route commands to encounter popup
		if(this.currentEvent)
		{
			var evt=this.currentEvent;
			evt.Command(cmd);
			if(!evt.active) // End event
			{
				this.currentEvent=null;

				if(this.player.hp==0)
				{
					this.popupPanel.Show(false);
					InitGameOverSequence();
				}
			}
			return;
		}
		//-------------------------------------

		var newTurn=false;
		switch(cmd)
		{
			case "GO-NORTH":
				newTurn=this.MovePlayer(0,-1);
				break;
			case "GO-EAST":
				newTurn=this.MovePlayer(1,0);
				break;
			case "GO-SOUTH":
				newTurn=this.MovePlayer(0,1);
				break;
			case "GO-WEST":
				newTurn=this.MovePlayer(-1,0);
				break;
		}

		if(newTurn)
		{
			this.turnNum++;
			this.TakeTurn();
		}
	}
	//********************************************
	this.TakeTurn=function()
	{
		var p=this.player;
		var tt=this.world.GetTerrainTypeAt(p.X,p.Y);
		var tStat=this.GetPlayerTerrainStat(tt.key);

		this.UpdateTerrainDisplayPanel(); // (to move the player image)

		// Check if the player is at the settlement
		var atSettlement=(p.X==this.settlementPos.X && p.Y==this.settlementPos.Y);
		if(atSettlement)
		{
			p.water=p.waterMax;
			this.UpdateInfoPanel();
		}
		else
		{
			// If the player has not recently been at this location then he will get some experience.
			var w=this.world;
			var locationIdx=w.GetWorldIndexFromCoords(p.X,p.Y);
			var lastTurnHere=w.GetLastTurnAtLocation(locationIdx);
			if(lastTurnHere==-1){lastTurnHere=9000000;}
			if(lastTurnHere==-2 || (lastTurnHere+30)<this.turnNum)
			{
				tStat.IncrementSkill(.001);
				this.RecalculateMtManSkill();
			}
			w.SetLastTurnAtLocation(locationIdx,this.turnNum);
		}

		//-------------------------------------
		// Consume resources (if not in town)
		if(!atSettlement)
		{
			var food=p.food-tt.hunger;
			p.food=ClipValue(p.food-tt.hunger,0,p.foodMax);
			p.water=ClipValue(p.water-tt.thirst,0,p.waterMax);
		}
		//-------------------------------------

		//-------------------------------------
		// Collect resources
		// A chance to collect the amount of food the terrain can provide.
		// This chance is based on the player skill in the current terrain.
		if(Chance(tStat.skill*.9+.1)){p.food+=tt.food;}
		if(Chance(tStat.skill*.9+.1)){p.water+=tt.water;}
		if(tStat.foodDiscovery){p.food+=2;}
		if(tStat.waterDiscovery){p.water+=2;}

		p.food=ClipValue(p.food,0,p.foodMax);
		p.water=ClipValue(p.water,0,p.waterMax);

		// Chance to heal automatic by 1 HP.
		// This chance is better the higher mtManSkill is.
		if(p.hp<p.hpMax && Chance(p.mtManSkill*.5+.1)){p.hp++;}
		//-------------------------------------

		//-------------------------------------
		// Check for shortage of food or water
		var hpHit=0;
		if(tt.hunger>p.food){hpHit++;}
		if(tt.thirst>p.water){hpHit++;}
		p.hp=ClipValue(p.hp-hpHit,0,p.hpMax);
		//-------------------------------------

		//-------------------------------------
		// Run encounters & check level-up
		if(p.hp!=0) // (don't start an encounter if you just died of starvation or whatever)
		{
			var evt=new GameEncounter(this,tt);
			evt.CheckForEncounter();

			if(evt.active) // Did an encounter happen
			{
				evt.InitEncounter(tt);
				this.currentEvent=evt;
			}
			else
			{
				// Leveling up checks
				this.CheckLevelUp();
				this.CheckSpecialResourceDiscoveries();
			}
		}
		//-------------------------------------

		this.UpdateInfoPanel();
		this.UpdateTerrainDisplayPanel();

		if(p.hp==0){InitGameOverSequence();}
		if(p.mtManSkill>.95 && !this.gameWon){alert(this.gameWon);InitWinningSequence();}
	}
	//********************************************
	this.CellClicked=function(idx)
	{
		var blockVal=this.world.terrainArray[idx];
		var terrain=this.world.GetTerrainType(blockVal);
		alert(terrain.name);
	}
	//********************************************
	this.AssessMtManLevel=function()
	{
		return Math.round(this.player.mtManSkill*6);
	}
	//********************************************
	this.GetMtManTitle=function()
	{
		var lvl=this.AssessMtManLevel();
		switch(lvl)
		{
			case 0:return "Tenderfoot";
			case 1:return "Adventurer";
			case 2:return "Scout";
			case 3:return "Frontiersman";
			case 4:return "Trailblazer";
			case 5:return "Ranger";
			case 6:return "Mountain Man";
		}
		return "?";
	}
	//********************************************
	this.GetPlayerTerrainTitle=function(terrainKey)
	{
		var terrainType=this.world.GetTerrainTypeByKey(terrainKey);
		var tStat=this.GetPlayerTerrainStat(terrainKey);
		return tStat.GetTerrainTitle(terrainType.name);
	}
	//********************************************
	this.CheckLevelUp=function()
	{
		// Check terrain level-up
		var p=this.player;
		var terrain=this.GetPlayerCurrentTerrain();
		var tstat=this.GetPlayerTerrainStat(terrain.key);
		
		var html="";
		if(tstat.CheckForLevelup())
		{
			var lvlName=tstat.GetTerrainTitle(terrain.name);

			html+="<table cellspacing=\"0\" style=\"width:100%;\"><tr>"+
				"<td class=\"text18px\" style=\"background-color:#"+terrain.rgb+"; text-align:center;\">"+lvlName+"</td></tr></table>";

			html+="<div style=\"height:6px;\"></div>";
			html+="In a moment of deep contemplation you suddenly realize some things about the ";
			html+=terrain.name.toLowerCase()+" that you had not thought of before.<br /><br />";
			html+="As you reflect on these new insights an idea occurs to you.<br /><br />";
			html+="You should discuss your new idea with the old trapper back at the edge of town.<br /><br />";
			
			tstat.lastReportedLevel=tstat.AssessLevel();
			this.player.ideas++;
		}
		else
		{
			// Check Mt Man level-up
			var lvl=this.AssessMtManLevel();
			if(lvl>p.lastReportedMtManLvl)
			{
				p.lastReportedMtManLvl=lvl;

				var lvlName=this.GetMtManTitle();
				var lvlNameLow=lvlName.toLowerCase();

				html+="<table cellspacing=\"0\" style=\"width:100%;\"><tr>"+
					"<td class=\"text18px\" style=\"text-align:center;\">"+lvlName+"</td></tr></table>";

				html+="<div style=\"height:6px;\"></div>";
				
				if(lvl<6) // Anything less than a "Mountain Man"
				{
					html+="Folks have been talking, and these days they see you as a true <b>"+lvlNameLow+"</b>.&nbsp; ";
					html+="That's great, but as a man aspiring to legend you still have farther to go.&nbsp; ";
					html+="Keep pressing forward.<br /><br />";
				}
				
				if(lvl==6)
				{
					html+="Your reputation has advanced greatly, and folks far and wide now see <u>you</u> as a <b>"+lvlNameLow+"</b>.&nbsp; ";
					html+="This is a remarkable achievement, but you long for true legendary status!&nbsp; ";
					html+="Keep pressing forward mountain man - legend awaits you!<br /><br />";
				}
				
				//tstat.lastReportedLevel=tstat.AssessLevel();
			}
		}

		if(html!="")
		{
			html+=WriteGameBtn("OK","OK",50,null);
			this.levelUpPanel.WriteContent(html);
			this.levelUpPanel.Show(true);
		}
	}
	//********************************************
	this.CheckSpecialResourceDiscoveries=function()
	{
		var terrain=this.GetPlayerCurrentTerrain();
		var tstat=this.GetPlayerTerrainStat(terrain.key);

		var resource="";
		var resourceCaps="";
		if(tstat.CheckWaterDiscovery()){resource="water";resourceCaps="Water";}
		if(tstat.CheckFoodDiscovery()){resource="food";resourceCaps="Food";}
		
		var html="";
		if(resource!="")
		{
			var tName=terrain.name.toLowerCase();
			html+="<table cellspacing=\"0\" style=\"width:100%;\"><tr><td class=\"text18px\" "+
				"style=\"background-color:#"+terrain.rgb+"; text-align:center;\">"+terrain.name+" "+resourceCaps+" Discovery</td></tr></table>";

			html+="<div style=\"height:6px;\"></div>";
			html+="While walking through the "+tName+" and pondering your surroundings a new technique ";
			html+="for discovering "+resource+" in the "+tName+" occurs to you.<br /><br />";

			html+="(More "+resource+" will be found each day while navigating the "+tName+".)<br /><br />";
		}
		if(html!="")
		{
			html+=WriteGameBtn("OK","OK",50,null);
			this.levelUpPanel.WriteContent(html);
			this.levelUpPanel.Show(true);
		}
	}
	//********************************************
	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function WriteDiv(id,cssClass,x,y,w,h,onclick,content)
{
	return "<div id=\""+id+"\" class=\""+cssClass+"\" "+
		"onclick=\""+onclick+"\" "+
		"style=\"position:absolute; left:"+x+"px; top:"+y+"px; width:"+w+"px; height:"+h+"px;"+
			"\">"+content+"</div>";
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function WriteCell(id,idx,x,y,w,h,bgColor)
{
	return "<div id=\""+id+"\" class=\"cell\" "+
		"onclick=\"Cc("+idx+")\" "+
		"style=\"position:absolute; left:"+x+"px; top:"+y+"px; width:"+w+"px; height:"+h+"px;"+
			"background-color:#"+bgColor+";"+
			"\"></div>";
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

//********************************************
function InitGameOverSequence()
{
	g_gameOver=true;

	var html="";
	html+=WriteDiv("","diedTxt",163,127,600,80,"","You Have Died");
	html+=WriteDiv("","gameOverTxt",212,287,490,80,"","GAME OVER");

	var div=document.getElementById("gameOverPanelDiv");
	div.innerHTML=html;
	div.style.display="block";

	g_gameOverFader=new ColorRangeIterator("FF4040","000000",80,false);
	setTimeout("GameOverPause1()",3000);
}
//********************************************
function GameOverPause1()
{
	setTimeout("GameOverAdvanceBgColor()",40);
}
//********************************************
function GameOverAdvanceBgColor()
{
	var rgb=g_gameOverFader.NextColor();
	if(rgb==null){return;}

	document.getElementById("gameOverPanelDiv").style.backgroundColor="#"+rgb;
	setTimeout("GameOverAdvanceBgColor()",35);
}
//********************************************

//********************************************
function InitWinningSequence()
{
	g_game.gameWon=true;
	g_gameOver=true;

	var html="";
	html+="<div class=\"gameWonBgPanel\" style=\"position:absolute; left:0px; top:0px; width:889px; height:534px;\"></div>";

	html+="<div class=\"gameWonMainPanel\" style=\"position:absolute; left:75px; top:81px; width:889px; height:534px;\">";
	html+="<span style=\"color:#000000;\">&nbsp;Congratulations!!!</span>";
	html+="<div style=\"height:35px;\"></div>";
	html+="<span style=\"color:#273751;\">&nbsp;You have reached</span>";
	html+="<div style=\"height:35px;\"></div>";
	html+="<span style=\"color:#014ECD; font-size:60px;\">LEGENDARY STATUS!!</span>";

	html+="<div style=\"position:absolute; left:10px; top:350px; font-size:24px;\">You are a <u>true</u> Mountain Man!!  Thank you for playing.</div>";

	html+="<div style=\"position:absolute; left:227px; top:403px; font-size:24px;\">";
	html+="<a href=\"#\" onclick=\"GameCmd('CONTINUE-PLAYING-AFTER-WIN');return false;\" class=\"introLink\">&gt; Continue Playing &lt;</a>";
	html+="</div>";

	html+="</div>";

	var winScreenDiv=document.getElementById("winScreenDiv");
	//div.innerHTML=WriteDiv("","",108,81,880,80,"",html);
	winScreenDiv.innerHTML=html;
	winScreenDiv.style.display="block";
	
	document.getElementById("worldDiv").style.display="none";
}
//********************************************
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function WriteGameBtn(key,label,width,param1)
{
	var styleTxt="style=\"";
	if(width){styleTxt+="width:"+width+"px;";}
	styleTxt+="\"";

	return "<a href=\"#\" class=\"button button-color\" "+styleTxt+" "+
		"onclick=\"GameCmd('"+key+"','"+param1+"');return false;\"><span>"+label+"</span></a>";
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function WritePanelHeader(title,bgColor)
{
	return "<table cellspacing=\"0\" style=\"width:100%;\"><tr>"+
		"<td class=\"text18px\" style=\"background-color:#"+bgColor+"; text-align:center;\">"+title+"</td></tr></table><br />";
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
