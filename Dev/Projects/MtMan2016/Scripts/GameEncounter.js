
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function GameEncounter(game,terrainType)
{
	this.game=game;
	this.terrainType=terrainType;
	this.active=false;
	this.encounterType="";
	this.entity=null;

	this.dropAdvantage=""; // Does either side get the drop on the other

	//********************************************
	this.CheckForEncounter=function()
	{
		this.encounterType="";
		this.entity=null;
		var entityArray=this.game.world.entityArray;
		for(var i=0; i<entityArray.length; i++)
		{
			var entity=entityArray[i];
			if(entity.terrain==this.terrainType.key) // Do these appear in current terrain
			{
				if(Chance(entity.ef))
				{
					this.active=true;
					this.entity=entity;
					this.encounterType="BATTLE";
					return;
				}
			}
		}

		// If we reach this point then no entity encounter has been triggered yet.

		// Check for a special encounter
		if(Chance(.04)){this.encounterType="FRIENDLY-NATIVES";}
		if(Chance(.0017)){this.encounterType="HEALTH-TRUFFLE-FOUND";}
//alert(this.terrainType.key);
		
		if(this.encounterType!=""){this.active=true;}
	}
	//********************************************
	this.InitEncounter=function(terrainType)
	{
		var p=this.game.player;
		var stat=this.game.GetPlayerTerrainStat(terrainType.key);
		//var outcome=Chance(stat.skill); // Check for positive or negative outcome of the encounter

		if(this.encounterType=="BATTLE")
		{
			this.dropAdvantage=this.InitDrop(stat);
			this.WriteBattleEncounterPanel();
		}
		else
		{
			this.WriteSpecialEncounterPanel();
		}

		this.game.popupPanel.Show(true);
		this.game.popupPanel.SetHostBgColor(terrainType.rgb);
	}
	//********************************************
	this.InitDrop=function(stat)
	{
		// Check if anyone gets the drop.  This should not happen all the time.
		if(Chance(.5)){return "";}

		var itDoes=false;
		if(Chance(.2)){itDoes=true;}

		// If the player terrain skill is great enough then he can turn keep
		// the mob from getting the drop on him.
		if(itDoes && Chance(stat.skill)){itDoes=false;}
		if(itDoes){return "IT";}

		// Reaching this point means that the player gets a chance to have the drop
		if(Chance(.5) && Chance(stat.skill)){return "YOU";}
		return "";
	}
	//********************************************

	//********************************************
	this.WriteBattleEncounterPanel=function()
	{
		var e=this.entity;
		var drop=this.dropAdvantage;

		var html="<span class=\"text16px\">";
		html+="You have encountered a "+e.name+"!<br /><br />";

		if(drop=="YOU"){html+="But it doesn't see you.<br /><br />";}
		else if(drop=="IT" && e.hostile)
		{
			html+="It approaches before you are ready.<br /><br />";
		}

		html+="What are you going to do?<br /><br />";

		var btnArr=[];
		if(drop=="YOU")
		{
			btnArr.push("ATTACK");
			if(e.hostile){btnArr.push("HIDE");}
			else{btnArr.push("IGNORE");}
		}
		else if(drop=="IT")
		{
			if(e.hostile){btnArr.push("DEFEND-AGAINST-ATTACK");}
			else
			{
				btnArr.push("ATTACK");
				btnArr.push("IGNORE");
			}
		}
		else // No one gets the drop
		{
			btnArr.push("ATTACK");
			if(e.hostile)
			{
				//btnArr.push("DEFEND");
				btnArr.push("RUN");
			}
			else{btnArr.push("IGNORE");}
		}

		// Write buttons
		for(var i=0; i<btnArr.length; i++)
		{
			var btn=btnArr[i];
			html+=this.WriteBtn(btn);
			html+="&nbsp;";
		}
		
		html+="</span>";
		this.game.popupPanel.WriteContent(html);
	}
	//********************************************
	this.WriteSpecialEncounterPanel=function()
	{
		var p=this.game.player;
		var html="<span class=\"text16px\">";

		if(this.encounterType=="FRIENDLY-NATIVES")
		{
			html+=WritePanelHeader("Friendly Natives","AC8E28");
			html+="You encounter some friendly natives.<br /><br />";

			var playerNeed=this.game.CheckPlayerNeeds();
			var usable=playerNeed.usable;

			if(usable>0)
			{
				var amountGiven=this.game.randGen.NextInt(1,usable);

				html+="They supply you with ";
			
				switch(playerNeed.key)
				{
					case "WATER":
						html+=amountGiven+" water.";
						p.water+=amountGiven;
						break;
					case "FOOD":
						html+=amountGiven+" food.";
						p.food+=amountGiven;
						break;
					case "HP":
						html+=amountGiven+" herbs.";
						p.hp+=amountGiven;
						break;
					case "AMMO":
						html+=amountGiven+" ammunition.";
						p.ammo+=amountGiven;
						break;
					case "FURS":
						html+=amountGiven+" furs.";
						p.furs+=amountGiven;
						break;
				}
				html+="<br /><br />";
			}
			else
			{
				html+="They smile at you and you smile back at them.<br /><br />";
			}
		}

		if(this.encounterType=="HEALTH-TRUFFLE-FOUND")
		{
			html+=WritePanelHeader("Health Truffle Found","A88200");
			html+="You have discovered a rare health boosting truffle.<br /><br />";
			html+="(Max health increased by 3)<br /><br />";
			p.hpMax+=3;
			p.hp+=3;
		}

		

		html+=this.WriteBtn("OK");
		html+="</span>";
		this.game.popupPanel.WriteContent(html);
	}
	//********************************************
	this.WriteBtn=function(key)
	{
		var label="";
		var width=85;
		switch(key)
		{
			case "DEFEND-AGAINST-ATTACK":
				label="Defend Yourself";
				width=160;
				break;
			case "ATTACK":label="Attack";break;
			case "RUN":label="Run";break;
			case "HIDE":label="Hide";break;
			case "IGNORE":label="Ignore";break;
			case "OK":label="OK";break;
			case "OH-NO":
				label="---- OH NO! ----";
				width=170;
				break;
		}
		//return "<input type=\"button\" value=\""+label+"\" onclick=\"GameCmd('"+key+"')\" />";
		return WriteGameBtn(key,label,width,null);
	}
	//********************************************

	//********************************************
	this.Command=function(cmd)
	{
		if(cmd=="ATTACK"){this.PlayerAttacks();}
		if(cmd=="DEFEND-AGAINST-ATTACK"){this.EntityAttacks();}
		if(cmd=="RUN" || cmd=="IGNORE"){this.PlayerRuns();}
		if(cmd=="HIDE"){this.PlayerHides();}

		if(cmd=="OK" || cmd=="OH-NO") // cmd=="ESC"
		{
			this.game.popupPanel.Show(false);
			this.active=false;
		}
	}
	//********************************************

	//********************************************
	this.PlayerAttacks=function()
	{
		var game=this.game;
		var p=game.player;
		var stat=game.GetPlayerTerrainStat(terrainType.key);
		var e=this.entity;
		var drop=this.dropAdvantage;

		// Calculate damages etc.
		var damageToIt=0;
		var shotFired=false;
		var didShotHit=false;
		var didItEscape=false;
		var didItAttackBack=false;

		var damageToYou=0;
		var didItMissYou=false;

		var fursCollected=0;
		var fursWasted=0;
		var foodCollected=0;
		var foodWasted=0;

		//------------------------------------------
		// Calculate what happens
		if(p.ammo>0) // Take shot with rifle
		{
			shotFired=true;
			p.ammo--;
			PlaySound("GUN-SHOT");

			// Calculate how good of a shot it is
			var baseHitChance=.30;
			if(drop=="YOU"){baseHitChance+=.2;} // Better chance if you have the drop
			didShotHit=Chance(baseHitChance+p.mtManSkill);

			// Calculate how good of a hit it was
			var howGoodOfHit=0;
			if(didShotHit)
			{
				var baseDamageScale=.3;
				howGoodOfHit=baseDamageScale+game.randGen.Next(); // (normalized)
				if(howGoodOfHit>1){howGoodOfHit=1;}

				stat.IncrementSkill(.006);
			}

			// Calculate the actual damage 
			var gunDamage=20;
			damageToIt=gunDamage*howGoodOfHit;
			
			stat.IncrementSkill(.015);
		}
		else // Attack with hands
		{
			var escapeChance=.70;
			if(drop=="YOU"){escapeChance=.45;}
			escapeChance-=(p.mtManSkill*.3); // Mt man level improves your chance of running up to the entity
			didItEscape=Chance(escapeChance);

			if(!didItEscape)
			{
				var baseDamageScale=.5;
				howGoodOfHit=baseDamageScale+(game.randGen.Next()*.5); // (normalized)
				if(howGoodOfHit>1){howGoodOfHit=1;}

				var knifeDamage=5;
				damageToIt=knifeDamage*howGoodOfHit;

				PlaySound("KNIFE-IMPACT");

				stat.IncrementSkill(.015);
			}
			stat.IncrementSkill(.006);
		}

		var entityKilled=damageToIt>e.hp;

		// Calculate enemy attacks back
		if(!entityKilled && e.hostile)
		{
			var ch=.5;
			if(didShotHit){ch=.3;} // The mob is more reluctant to attack back if it was actually hit
			didItAttackBack=Chance(ch);

			if(didItAttackBack)
			{
				didItMissYou=Chance(.2);

				if(!didItMissYou)
				{
					damageToYou=e.attack;
					if(Chance(.4)){damageToYou++;} // Add some extra damage chances
					if(Chance(.1)){damageToYou++;}
				}
				stat.IncrementSkill(.006);
			}
		}

		// Calculate furs and food obtained
		if(entityKilled)
		{
			fursCollected=e.furs;

			// A combination of over all mt man level and terrain skill level
			// gives a chance at double firs.
			if(Chance(p.mtManSkill*stat.skill)){fursCollected+=e.furs;}

			p.furs+=fursCollected;

			// Calculate furs that were wasted (if any) and keep from going over your max furs.
			if(p.furs>p.fursMax)
			{
				fursWasted=p.furs-p.fursMax;
				p.furs=p.fursMax;
			}

			// Calculate food
			foodCollected+=e.food; // Food always collected

			// More food possibly collected
			if(Chance(p.mtManSkill*stat.skill)){foodCollected+=e.food;}
			p.food+=foodCollected;

			if(p.food>p.foodMax)
			{
				foodWasted=p.food-p.foodMax;
				p.food=p.foodMax;
			}
		}

		// Apply any damage to player
		p.hp-=damageToYou;
		if(p.hp<0){p.hp=0;}

		if(damageToYou>0){PlaySound("PLAYER-HURT");}

		game.RecalculateMtManSkill();
		//------------------------------------------

		//------------------------------------------
		// Write about what happened
		var html="<span class=\"text16px\">";

		if(shotFired)
		{
			html+="You draw up your rifle on the "+e.name+" and fire...<br /><br />";
			if(didShotHit)
			{
				html+="Its a hit!<br /><br />";
				if(entityKilled){html+="The "+e.name+" has been defeated!<br /><br />";}
				else if(didItAttackBack)
				{
					html+="But the "+e.name+" lunges at you... ";
					if(didItMissYou){html+="It missed you.  Then ran off.<br /><br />";}
					else{html+="and injures you.<br /><br />";}
				}
				else{html+="But the "+e.name+" escaped anyway.<br /><br />";}
			}
			else
			{
				html+="But you missed.<br /><br />";
				if(didItAttackBack)
				{
					html+="The "+e.name+" attacks back!...<br /><br />";
					if(didItMissYou){html+="But it missed you.<br /><br />";}
					else{html+="You were injured in the attack.<br /><br />";}
				}
				else{html+="The "+e.name+" runs away.<br /><br />";}
			}
		}
		else
		{
			html+="With your hunting knife you lunge at the "+e.name+"...<br /><br />";

			if(entityKilled)
			{
				html+="With a terrific stab it was defeated!<br /><br />";
			}
			else if(didItEscape){html+="But it escaped before you could reach it.<br /><br />";}
			else
			{
				html+="A fierce struggle ensues and then the "+e.name+" fled.<br /><br />";
			}
		}

		if(fursCollected>0)
		{
			html+="You obtained "+fursCollected+" furs";
			if(fursWasted>0){html+=", but "+fursWasted+" furs were wasted.";}
			html+=".<br /><br />";
		}
		if(foodCollected>0)
		{
			html+="You collected "+foodCollected+" food";
			if(foodWasted>0){html+=", but "+foodWasted+" food were wasted.";}
			html+=".<br /><br />";
		}
		
		html+=this.WriteBtn("OK");

		html+="</span>";
		game.popupPanel.WriteContent(html);
		game.UpdateInfoPanel();
	}
	//********************************************
	this.PlayerRuns=function()
	{
		var game=this.game;
		var p=game.player;
		//var stat=game.GetPlayerTerrainStat(terrainType.key);
		var e=this.entity;

		var html="<span class=\"text16px\">";

		// Consider...
		// - Chance: you get away successfully
		// - Chance: Enemy gets a hit in (if hostile)
		// - If it is a really dangerous enemy then there is a special message such as...
		//   "You run like the dickens!"
		// - Chance: loose some food, water or health

		//p.mtManSkill

		var damageToYou=0;

		if(!e.hostile)
		{
			this.active=false;
			this.game.popupPanel.Show(false);
			return;
		}
		else if(Chance(.25) || Chance(p.mtManSkill*.4)) // General and mt man-based run success chance
		{
			if(e.scary){html+="You run like the dickens!<br /><br />";}
			else
			{
				// In this case just go ahead and close the encounter panel
				this.active=false;
				this.game.popupPanel.Show(false);
				PlaySound("RUN-AWAY");
				return;
			}
		}
		else // You don't make a clean getaway (and enemy is hostile)
		{
			if(Chance(.5)) // Does enemy gets a lick in
			{
				if(Chance(.5)) // Does he get a full hit in
				{
					damageToYou=e.attack;
				}
				else // Or about half hit
				{
					damageToYou=Math.round(damageToYou/2)+1;
				}
				html+="The "+this.entity.name+" gets a lick in as you flee.<br /><br />";
				html+="You sustain "+damageToYou+" damage!<br /><br />";

				p.hp-=damageToYou;
				if(p.hp<0){p.hp=0;}
				if(damageToYou>0){PlaySound("PLAYER-HURT");}
			}
			else
			{
				// Check for other stuff that may involve loosing some food, water or health
				//html+="[ implement other running trouble ]";

				this.active=false;
				this.game.popupPanel.Show(false);
				PlaySound("RUN-AWAY");
				return;
			}
		}
		

		//damageToYou

		//var mtManChance=Chance(p.mtManSkill);
		//html+="[ implement running ]<br /><br />";

		html+=this.WriteBtn("OK");
		html+="</span>";
		game.popupPanel.WriteContent(html);
		game.UpdateInfoPanel();
	}
	//********************************************
	this.PlayerHides=function()
	{
		var html="<span class=\"text16px\">";

		html+="You hide.<br /><br />";
		html+="The "+this.entity.name+" moves away.<br /><br />";

		html+=this.WriteBtn("OK");
		html+="</span>";
		game.popupPanel.WriteContent(html);
		game.UpdateInfoPanel();
	}
	//********************************************
	this.EntityAttacks=function()
	{
		//var game=this.game;
		var p=game.player;
		var stat=game.GetPlayerTerrainStat(terrainType.key);
		var e=this.entity;
		//var drop=this.dropAdvantage;

		//---------------------------------------
		// Determine what happened
		var damageToYou=e.attack;
		if(Chance(p.mtManSkill*stat.skill)) // Chance to reduce enemy damage
		{
			damageToYou=Math.round(damageToYou/2-.1);
		}
		p.hp-=damageToYou;
		if(p.hp<0){p.hp=0;}
		if(damageToYou>0){PlaySound("PLAYER-HURT");}

		stat.IncrementSkill(.008); // A small exp bump from the experience
		
		//---------------------------------------

		//---------------------------------------
		// Write about it
		var html="<span class=\"text16px\">";
		html+="The "+e.name+" viciously attacks!<br /><br />";

		if(damageToYou==0){html+="But you were not harmed.<br /><br />";}
		else{html+="And wounds you.<br /><br />";}

		if(p.hp>0){html+=this.WriteBtn("OK");}
		else{html+=this.WriteBtn("OH-NO");}
		
		html+="</span>";
		//---------------------------------------

		game.popupPanel.WriteContent(html);
		game.UpdateInfoPanel();
	}
	//********************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
