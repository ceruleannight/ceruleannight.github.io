
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Shop(player)
{
	this.player=player;
	//this.rName=rName;
	//this.rCurrent=rCurrent;
	//this.rMax=rMax;
	//this.rPrice=rPrice;

	this.doTransaction=false;

	//********************************************
	this.InitShop=function
	(
		amountToPurchase,rName,rNameCap,rCurrent,rMax,meterBgColor,rPrice,silver,purchaseKey
	)
	{
		var p=this.player;
		var html="";

		//----------------------------------------------
		// Handle purchase
		if(amountToPurchase)
		{
			var cost=amountToPurchase*rPrice;
			if(cost>silver)
			{
				html+="<div class=\"noticeTxt\">You do not have enough silver to purchase "+amountToPurchase+" "+rName+".</div><br /><br />";
			}
			else if((amountToPurchase+rCurrent)>rMax)
			{
				html+="You do not have enough room to store "+amountToPurchase+" more "+rName+".<br /><br />";
			}
			else
			{
				this.doTransaction=true;
				rCurrent+=amountToPurchase;
				silver-=cost;
			}

		}
		//----------------------------------------------

		//----------------------------------------------
		//var foodTxt="",foodCss="";
		//if(p.food==0){foodTxt="&nbsp;Starving";foodCss=" pulsateTxt"}
		html+="<table cellspacing=\"0\">";
		html+="<tr>";
		html+="<td>"+rNameCap+"</td>";
		html+="<td>"+DrawHorzMeter("",230,20,rCurrent,rMax,"E1DED5",meterBgColor,"meterDiv","")+"</td>";
		html+="<td style=\"text-align:center;\">"+Math.round(rCurrent)+"/"+Math.round(rMax)+"</td>";
		html+="</tr>";
		html+="</table>";
		html+="<br />";
		//----------------------------------------------
		
		// Display purchase controls
		if(rCurrent==rMax)
		{
			html+="Your "+rName+" is at maximum.<br /><br />";
		}
		else
		{
			html+="Silver: "+silver+"<br /><br />";
			html+="Price : 1 "+rName+" for "+rPrice+" silver<br /><br />";

			// Calculate buy max
			var rNeeded=rMax-rCurrent;
			var maxYouCanAfford=Math.floor(p.silver/rPrice);
			var maxObtainable=rNeeded<maxYouCanAfford?rNeeded:maxYouCanAfford;

			html+="<table cellspacing=\"0\"><tr>";
			html+="<td>"+WriteGameBtn(purchaseKey,"Buy 1 "+rNameCap,120,1)+"</td>";
			html+="<td>"+WriteGameBtn(purchaseKey,"Buy 10 "+rNameCap,120,10)+"</td>";
			html+="<td>"+WriteGameBtn(purchaseKey,"Buy Max "+rNameCap+" ("+maxObtainable+")",150,maxObtainable)+"</td>";
			html+="</tr></table>";
		}

		//html+="<div style=\"height:5px;\"></div>";
		//html+=WriteGameBtn("GO-TO-MAIN-MENU","Done",120);
		//this.game.settlementPanel.WriteContent(html);
		//this.mode="BUY-FOOD";

		return html;
	}
	//********************************************
	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
