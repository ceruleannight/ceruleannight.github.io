
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Settlement(game)
{
	this.game=game;
	this.mode="MAIN-MENU";
	this.active=false;

	this.furPrice=5;
	this.herbsPrice=1;
	this.foodPrice=1;
	this.ammoPrice=2;

	this.adviceIdx=1;

	//********************************************
	this.Render=function()
	{
		switch(this.mode)
		{
			case "MAIN-MENU":this.RenderMainMenu();break;
		}
	}
	//********************************************
	this.RenderMainMenu=function()
	{
		var html="<table cellspacing=\"0\" style=\"width:100%\"><tr><td style=\"text-align:center;\">";
		html+="<span class=\"text16px\">In Town</span><br /><br />";
		html+="What would you like to do?<br /><br />"
		html+=WriteGameBtn("SELL-FURS","Sell Furs",145)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("BUY-HERBS","Buy Health Herbs",145)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("BUY-FOOD","Buy Food",145)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("BUY-AMMO","Buy Ammo",145)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("VISIT-OLD-MAN","Visit Old Trapper",145)+"<br />";
		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("LEAVE-TOWN","Leave Town",145);
		html+="</td></tr></table>";

		this.game.settlementPanel.WriteContent(html);
		this.mode="MAIN-MENU";
	}
	//********************************************
	this.SellFurs=function()
	{
		var p=this.game.player;
		
		var html="<span class=\"text16px\">In Town : Selling Furs</span><br /><br />";

		if(p.furs>0)
		{
			var silverGained=p.furs*this.furPrice;
			html+=""+p.furs+" furs sold for "+this.furPrice+" silver each = "+silverGained+" silver obtained.<br /><br />";

			// Execute the transaction
			p.furs=0;
			p.silver+=silverGained;
		}
		else
		{
			html+="You have no furs to sell.<br /><br />";
		}

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("GO-TO-MAIN-MENU","OK",65);
		this.game.settlementPanel.WriteContent(html);
		this.mode="SELL-FURS";
	}
	//********************************************
	this.BuyHerbs=function(amountToPurchase)
	{
		amountToPurchase=parseInt(""+amountToPurchase,10);
		var p=this.game.player;
		var shop=new Shop(p);

		var html="<span class=\"text16px\">In Town : Buy Health Herbs</span><br /><br />";
		html+=shop.InitShop(amountToPurchase,"health","Health",p.hp,p.hpMax,"FF0000",this.herbsPrice,p.silver,"BUY-HERBS");

		// Run the transaction
		if(amountToPurchase && shop.doTransaction)
		{
			var cost=amountToPurchase*this.herbsPrice;
			p.hp+=amountToPurchase;
			p.silver-=cost;
		}

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("GO-TO-MAIN-MENU","Done",120);
		this.game.settlementPanel.WriteContent(html);
		this.mode="BUY-HERBS";
	}
	//********************************************
	this.BuyFood=function(amountToPurchase)
	{
		amountToPurchase=parseInt(""+amountToPurchase,10);
		var p=this.game.player;

		var html="<span class=\"text16px\">In Town : Buy Food</span><br /><br />";

		//----------------------------------------------
		// Handle purchase
		if(amountToPurchase)
		{
			var cost=amountToPurchase*this.foodPrice;
			if(cost>p.silver)
			{
				html+="<div class=\"noticeTxt\">You do not have enough silver to purchase "+amountToPurchase+" food.</div><br /><br />";
			}
			else if((amountToPurchase+p.food)>p.foodMax)
			{
				html+="You do not have enough room to store "+amountToPurchase+" more food.<br /><br />";
			}
			else
			{
				p.food+=amountToPurchase;
				p.silver-=cost;
			}

			//if(p.foodMax
			//amountToPurchase
		}
		//----------------------------------------------

		//----------------------------------------------
		var foodTxt="",foodCss="";
		if(p.food==0){foodTxt="&nbsp;Starving";foodCss=" pulsateTxt"}
		html+="<table cellspacing=\"0\">";
		html+="<tr>";
		html+="<td>Food</td>";
		html+="<td>"+DrawHorzMeter("",230,20,p.food,p.foodMax,"E1DED5","90F040","meterDiv"+foodCss,foodTxt)+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.food)+"/"+Math.round(p.foodMax)+"</td>";
		html+="</tr>";
		html+="</table>";
		html+="<br />";
		//----------------------------------------------
		
		// Display purchase controls
		if(p.food==p.foodMax)
		{
			html+="Your food is at maximum.<br /><br />";
		}
		else
		{
			html+="Silver: "+p.silver+"<br /><br />";
			html+="Price : 1 food for "+this.foodPrice+" silver<br /><br />";

			// Calculate buy max
			var foodNeeded=p.foodMax-p.food;
			var maxYouCanAfford=Math.floor(p.silver/this.foodPrice);
			var maxObtainable=foodNeeded<maxYouCanAfford?foodNeeded:maxYouCanAfford;

			html+="<table cellspacing=\"0\"><tr>";
			html+="<td>"+WriteGameBtn("BUY-FOOD","Buy 1 Food",120,1)+"</td>";
			html+="<td>"+WriteGameBtn("BUY-FOOD","Buy 10 Food",120,10)+"</td>";
			html+="<td>"+WriteGameBtn("BUY-FOOD","Buy Max Food ("+maxObtainable+")",150,maxObtainable)+"</td>";
			html+="</tr></table>";
		}

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("GO-TO-MAIN-MENU","Done",120);
		this.game.settlementPanel.WriteContent(html);
		this.mode="BUY-FOOD";
	}
	//********************************************
	this.BuyAmmo=function(amountToPurchase)
	{
		amountToPurchase=parseInt(""+amountToPurchase,10);
		var p=this.game.player;

		var html="<span class=\"text16px\">In Town : Buy Ammo</span><br /><br />";

		//----------------------------------------------
		// Handle purchase
		if(amountToPurchase)
		{
			var cost=amountToPurchase*this.ammoPrice;
			if(cost>p.silver)
			{
				html+="<div class=\"noticeTxt\">You do not have enough silver to purchase "+amountToPurchase+" ammo.</div><br /><br />";
			}
			else if((amountToPurchase+p.ammo)>p.ammoMax)
			{
				html+="You do not have enough room to store "+amountToPurchase+" more ammo.<br /><br />";
			}
			else
			{
				p.ammo+=amountToPurchase;
				p.silver-=cost;
			}
		}
		//----------------------------------------------

		//----------------------------------------------
		html+="<table cellspacing=\"0\">";
		html+="<tr>";
		html+="<td>Ammo</td>";
		html+="<td>"+DrawHorzMeter("",230,20,p.ammo,p.ammoMax,"E1DED5","848484","meterDiv","")+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(p.ammo)+"/"+Math.round(p.ammoMax)+"</td>";
		html+="</tr>";
		html+="</table>";
		html+="<br />";
		//----------------------------------------------
		
		// Display purchase controls
		if(p.ammo==p.ammoMax)
		{
			html+="Your ammo is at maximum.<br /><br />";
		}
		else
		{
			html+="Silver: "+p.silver+"<br /><br />";
			html+="Price : 1 ammo for "+this.ammoPrice+" silver<br /><br />";

			// Calculate buy max
			var ammoNeeded=p.ammoMax-p.ammo;
			var maxYouCanAfford=Math.floor(p.silver/this.ammoPrice);
			var maxObtainable=ammoNeeded<maxYouCanAfford?ammoNeeded:maxYouCanAfford;

			html+="<table cellspacing=\"0\"><tr>";
			html+="<td>"+WriteGameBtn("BUY-AMMO","Buy 1",120,1)+"</td>";
			html+="<td>"+WriteGameBtn("BUY-AMMO","Buy 10",120,10)+"</td>";
			html+="<td>"+WriteGameBtn("BUY-AMMO","Buy Max ("+maxObtainable+")",150,maxObtainable)+"</td>";
			html+="</tr></table>";
		}

		html+="<div style=\"height:5px;\"></div>";
		html+=WriteGameBtn("GO-TO-MAIN-MENU","Done",120);
		this.game.settlementPanel.WriteContent(html);
		this.mode="BUY-AMMO";
	}
	//********************************************
	this.VisitTrapper=function(cmd,ideaKey)
	{
		var p=this.game.player;

		var html="<span class=\"text16px\">In Town : Visiting the Old Trapper</span><br /><br />";

		if(cmd=="VISIT-OLD-MAN")
		{
			html+="Out on the edge of town a leathery old man sits in his buckskin clothes slowly rocking his chair. ";
			html+="The old man's thin, flat smile broadens as you approach.<br /><br />";
			html+="<i>Have a seat son.  Tell me what's on you mind.</i><br /><br />";

			html+=WriteGameBtn("SHARE-IDEAS-WITH-OLD-MAN","Share an Idea",120)+"&nbsp;";
			html+=WriteGameBtn("JUST-CHAT","Just Chat a While",140)+"&nbsp;";

			html+="<div style=\"height:20px;\"></div>";
			html+=WriteGameBtn("GO-TO-MAIN-MENU","Back to Town",120);
		}

		if(cmd=="SHARE-IDEAS-WITH-OLD-MAN")
		{
			if(p.ideas==0)
			{
				html+="You explain your latest thoughts and ideas, ";
				html+="but the old man wrinkles his brow and gives a short grunt.&nbsp; ";
				html+="<i>\"Naw, my boy, I don't see how these ideas could help you.\"</i><br /><br />";
				html+=WriteGameBtn("VISIT-OLD-MAN","Back",60);
			}
			else
			{
				html+="As you explain your thoughts the man nods his head approvingly and says, ";
				html+="<i>Hmm yes, yes my boy! A great idea! Couldn't be better if I had thought of it myself.&nbsp;";
				html+="Now here's how you put that into practice...</i><br /><br />";

				html+="Improve: ";
				html+=WriteGameBtn("IMPROVE-STATS","Health",67,"HEALTH")+"&nbsp;";
				html+=WriteGameBtn("IMPROVE-STATS","Food",60,"FOOD")+"&nbsp;";
				html+=WriteGameBtn("IMPROVE-STATS","Water",65,"WATER")+"&nbsp;";
				html+=WriteGameBtn("IMPROVE-STATS","Ammo",65,"AMMO")+"&nbsp;";
				html+=WriteGameBtn("IMPROVE-STATS","Furs",55,"FURS");

				html+="<div style=\"height:20px;\"></div>";
				html+=WriteGameBtn("VISIT-OLD-MAN","Back",60);
			}
		}

		if(cmd=="JUST-CHAT")
		{
			html+="The old man shares a few more of his wilderness stories then leans back in his chair and says...<br /><br />";

			var adviceCount=8;
			var idx=this.adviceIdx;
			if(idx<1 || idx>adviceCount){idx=1;}
			switch(idx)
			{
				case 1:
					html+="<i>\"So you want to be a mountain man!  Well boy then you better get used to hunting.&nbsp; "+
						"Sell the furs you collect for big money and then go get some more!\"</i>";
					idx++;
					break;

				case 2:
					html+="<i>\"When you're wondering around the wilderness son, you gotta keep a close eye on your food and water supply at all times.&nbsp; "+
					"Run out of those and things can get dire in a hurry.\"</i>";
					idx++;
					break;

				case 3:
					html+="<i>\"It's a good idea to stay in the same terrain until you build up knowledge and skill there.&nbsp; "+
						"Wandering too far from home before you know what you're doing is a sure fire way to run into trouble.\"</i>";
					idx++;
					break;

				case 4:
					html+="<i>\"If you are injured out in the wilderness it will gradually heal, but you will heal much faster if you can obtain some health herbs.\"</i>";
					idx++;
					break;

				case 5:
					html+="<i>\"The more skilled you become in a certain type of terrain the better you will get at collecting food and water along the way as you travel.\"</i>";
					idx++;
					break;

				case 6:
					html+="<i>\"Mountain men don't spend their time all in one place.  Their great experience comes from knowing entire regions.\"</i>";
					idx++;
					break;

				case 7:
					html+="<i>\"I’ve always used a compass myself, but there's an old legend that say you can navigate with WASD.&nbsp; "+
						"Haven't a clue what that is, but if I ever find out I'll let you know.\"</i>";
					idx++;
					break;

				case 8:
					html+="<i>\"My boy, if you're ever out in the wilderness and a great idea hits you, come on back and tell me about it "+
						"when you have a chance.&nbsp; I know a few ways to take a great idea and make practical use of it.\"</i>";
					idx++;
					break;

				//html+="<i>\".\"</i>";
			}
			this.adviceIdx=idx;

			html+="<div style=\"height:20px;\"></div>";
			html+=WriteGameBtn("VISIT-OLD-MAN","Back",60)+"&nbsp;";
			html+=WriteGameBtn("JUST-CHAT","Keep Chatting",120);
		}

		if(cmd=="IMPROVE-STATS")
		{
			switch(ideaKey)
			{
				case "HEALTH":
					p.hpMax+=5;
					p.hp+=5;
					p.ideas--;
					html+="You feel healthier. (Health max increased by 5)";
					break;
				case "FOOD":
					p.foodMax+=10;
					p.food+=10;
					p.ideas--;
					html+="You can now carry more food. (Max increased by 10)";
					break;
				case "WATER":
					p.waterMax+=10;
					p.water+=10;
					p.ideas--;
					html+="You can now carry more water. (Max increased by 10)";
					break;
				case "AMMO":
					p.ammoMax+=3;
					p.ammo+=3;
					p.ideas--;
					html+="You can now carry more ammunition. (Max increased by 3)";
					break;
				case "FURS":
					p.fursMax+=3;
					p.ideas--;
					html+="You can now carry more furs. (Max increased by 3)";
					break;
			}
			html+="<br /><br />";
			html+=WriteGameBtn("VISIT-OLD-MAN","Continue Visit",120);
		}

		//html+="<div style=\"height:20px;\"></div>";
		//html+=WriteGameBtn("GO-TO-MAIN-MENU","Back to Town",120);
		this.game.settlementPanel.WriteContent(html);
		this.mode="VISITING-TRAPPER";
	}
	//********************************************

	//********************************************
	this.Command=function(cmd,param1)
	{
		if(cmd=="ESC")
		{
			if(this.mode=="MAIN-MENU"){cmd="LEAVE-TOWN";} // (will close below)
			if(this.mode=="SELL-FURS"){cmd="GO-TO-MAIN-MENU";} // (will close below)
			if(this.mode=="BUY-HERBS"){cmd="GO-TO-MAIN-MENU";} // (will close below)
			if(this.mode=="BUY-FOOD"){cmd="GO-TO-MAIN-MENU";} // (will close below)
			if(this.mode=="BUY-AMMO"){cmd="GO-TO-MAIN-MENU";} // (will close below)
			if(this.mode=="VISITING-TRAPPER"){cmd="GO-TO-MAIN-MENU";} // (will close below)
		}

		if(cmd=="GO-TO-MAIN-MENU"){this.RenderMainMenu();return;}
		if(cmd=="SELL-FURS"){this.SellFurs();return;}
		if(cmd=="BUY-HERBS"){this.BuyHerbs(param1);return;}
		if(cmd=="BUY-FOOD"){this.BuyFood(param1);return;}
		if(cmd=="BUY-AMMO"){this.BuyAmmo(param1);return;}

		if(cmd=="VISIT-OLD-MAN"){this.VisitTrapper(cmd,param1);return;}
		if
		(
			this.mode=="VISITING-TRAPPER"
			&&
			(
				cmd=="VISIT-OLD-MAN"
				|| cmd=="SHARE-IDEAS-WITH-OLD-MAN"
				|| cmd=="JUST-CHAT"
				|| cmd=="IMPROVE-STATS"
			)
		)
		{
			this.VisitTrapper(cmd,param1);
			return;
		}
		//if(cmd=="VISIT-OLD-MAN"){this.VisitTrapper(cmd);return;}
		//if(cmd=="SHARE-IDEAS-WITH-OLD-MAN"){this.VisitTrapper(cmd);return;}
		//if(cmd=="IMPROVE-STATS"){this.VisitTrapper(cmd,param1);return;}
		
		if(cmd=="LEAVE-TOWN")
		{
			this.game.settlementPanel.Show(false);
			this.active=false;
		}
	}
	//********************************************
	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
