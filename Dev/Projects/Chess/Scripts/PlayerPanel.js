
//********************************************
function DrawBothPlayerPanels()
{
	DrawPlayerPanel(1);
	DrawPlayerPanel(2);
}
//********************************************
function DrawPlayerPanel(playerNum)
{
	var faction,otherFaction;

	if(playerNum==1)
	{
		faction=g_liteSide;
		otherFaction=g_darkSide;
	}
	else
	{
		faction=g_darkSide;
		otherFaction=g_liteSide;
	}

	var isThisPlayersTurn=faction.sideKey==g_whoseTurn;

	var setXOffset=2;
	var setYOffset=16;
	var cellSize=25;
	var pieceSize=23;
	var pieceOffset=24;

	var html="<table class=\"playerPanelTbl\" style=\"width:202px; height:30px;\" cellspacing=\"0\">";
	html+="<tr><th style=\"\">"+faction.title+"<th></tr>";
	html+="</table>";

	html+="<div style=\"position:relative; left:0px; top:0px; width:200px; height:70px;\">";
	html+="&nbsp;Captures";
	var xi=0,yi=0;
	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.sideKey!=otherFaction.sideKey){continue;}
		
		var x=xi*pieceOffset+setXOffset;
		var y=yi*pieceOffset+setYOffset;
		html+="<div class=\"captureCell\" "+
			"style=\"position:absolute; left:"+x+"px; top:"+y+"px; "+
				"width:"+cellSize+"px; height:"+cellSize+"px;\">"
		if(piece.isCaptured)
		{
			html+=WriteCapturedPieceImg(piece,x,y,pieceSize);
		}
		html+="</div>";
		
		xi++;
		if(xi>=8)
		{
			xi=0;
			yi++;
		}
	}
	html+="</div>";

	if(isThisPlayersTurn && !g_gameOver)
	{
		html+="<div class=\"playerTurnTag\" "+
			"style=\"position:relative; left:1px; top:0px; width:189px; padding:5px;\">It is "+faction.title+"'s turn.</div>";
	}
	if(faction.isInCheck && !g_gameOver)
	{
		html+="<div class=\"playerInCheck\" "+
			"style=\"position:relative; left:1px; top:0px; width:189px; padding:5px;\">"+faction.title+" is in check!!</div>";
	}

	document.getElementById("player"+playerNum+"PanelDiv").innerHTML=html;
}
//********************************************
function WriteCapturedPieceImg(piece,x,y,pieceSize)
{
	//return "<img class=\"smallPieceImg\" src=\""+piece.imgSrc+"\" "+
	//	"style=\"position:absolute; left:"+x+"px; top:"+y+"px;\" />";

	return "<img class=\"smallPieceImg\" src=\""+piece.imgSrc+"\" "+
		"style=\"position:relative; \" "+
		"width=\""+pieceSize+"\" height=\""+pieceSize+"\""+
		"/>";
}
//********************************************
function WriteGameOverMsg()
{
	var msg="It was a stalemate.";
	if(g_winningFaction){msg=g_winningFaction.title+" won.";}
	var html="Game Over<div style=\"height:8px;\"></div>"+msg;
	var div=document.getElementById("gameOverPanelDiv");
	div.innerHTML=html;
	div.style.display="block";
}
//********************************************