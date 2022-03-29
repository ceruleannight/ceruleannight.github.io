
//********************************************
// Checks to see if the other side after the current move has places
// that player in check.
function CheckSetCheck()
{
	var faction=g_liteSide;
	if(GetOtherSide(g_whoseTurn)=="dark"){faction=g_darkSide;}
	faction.isInCheck=IsInCheck(faction.sideKey,faction.kingIdx);
}
//********************************************
function IsInCheck(sideKey,kingPieceIdx)
{
	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.isCaptured){continue;} // Don't worry about captured pieces
		if(piece.sideKey==sideKey){continue;} // Only worried about pieces from the other side

		var moveArray=GetMoveInfoArray(piece);

		// Check to see if the player's king can be reached.
		for(var mi=0; mi<moveArray.length; mi++)
		{
			var place=moveArray[mi];
			if(!place.piece){continue;} // Is there a piece in this reachable board cell, if not then continue
			if(place.piece.idx==kingPieceIdx){return true;}
		}
	}
	return false;
}
//********************************************
// Returns true if the move would leave the player in check.
function WillLeaveInCheck(movedPieceIdx,movedToCellIdx,pieceToCapture)
{
	// Run each pieces moves to see if move would leave current player in check.

	var movedPiece=FindPiece(movedPieceIdx);
	if(!movedPiece){alert("Problem: could not find piece!");return;}
	var faction=movedPiece.faction;
	var cellXy=new IdxToXy(movedToCellIdx);

	// Temporarily move the piece to be moved and capture pieceToCapture is need be
	var storedX=movedPiece.x;
	var storedY=movedPiece.y;
	movedPiece.x=cellXy.x;
	movedPiece.y=cellXy.y;

	if(pieceToCapture){pieceToCapture.isCaptured=true;}
	
	var allowMove=IsInCheck(movedPiece.sideKey,faction.kingIdx);

	// Move the piece back
	movedPiece.x=storedX;
	movedPiece.y=storedY;
	if(pieceToCapture){pieceToCapture.isCaptured=false;}
	return allowMove;
}
//********************************************
/// Returns true if all possible moves by the faction will
// result in check.  This can be used by a check for check-mate
// or stale-mate.
function DoAllMovesResultInCheck(faction)
{
	// Check through all of the current faction's possible moves to
	// see if anything will allow them to get out of check.
	// If not then it is check-mate.
	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.isCaptured){continue;} // Don't worry about captured pieces
		if(piece.sideKey!=faction.sideKey){continue;} // Check only the side indicated

		var moveArray=GetMoveInfoArray(piece);
		for(var mi=0; mi<moveArray.length; mi++)
		{
			var place=moveArray[mi];
			//if(!place.piece){continue;} // Is there a piece in this reachable board cell, if not then continue

			if(!WillLeaveInCheck(piece.idx,place.cellIdx,place.piece))
			{
				return false;
			}
		}
	}
	return true; // CHECK-MATE!
}
//********************************************

//********************************************
// Return an array containing the possible moves a given piece can make currently.
function GetMoveInfoArray(piece)
{
	var vertMult=piece.faction.vertMult;
	var x=piece.x;
	var y=piece.y;

	var moveArray=[];
	var place;

	if(piece.type=="Pawn")
	{
		// Check straight ahead spot
		place=new CheckBoardAt(x,y+1*vertMult);
		if(place.onBoard && !place.piece)
		{
			moveArray.push(place);

			// Check for second place straight ahead from original spot
			if(!piece.hasMoved)
			{
				place=new CheckBoardAt(x,y+2*vertMult);
				if(place.onBoard && !place.piece)
				{
					moveArray.push(place);
				}
			}
		}

		// Check for option for pawn to take a piece
		place=new CheckBoardAt(x-1,y+1*vertMult);
		if(place.onBoard)
		{
			if
			(
				place.piece && piece.sideKey!=place.piece.sideKey
				|| g_currentEnPassant && place.cellIdx==g_currentEnPassant.cellIdx
			)
			{
				place.capture=true;
				moveArray.push(place);
			}
		}

		place=new CheckBoardAt(x+1,y+1*vertMult);
		//if(place.onBoard && place.piece && piece.sideKey!=place.piece.sideKey)
		if(place.onBoard)
		{
			if
			(
				place.piece && piece.sideKey!=place.piece.sideKey
				|| g_currentEnPassant && place.cellIdx==g_currentEnPassant.cellIdx
			)
			{
				place.capture=true;
				moveArray.push(place);
			}
		}
	}

	if(piece.type=="Rook")
	{
		PerpendicularMoveCheck(x,y,g_facts.gridSize,piece,moveArray);
	}

	if(piece.type=="Knight")
	{
		CheckKnightMoves(x,y,piece,moveArray);
	}

	if(piece.type=="Bishop")
	{
		DiagMoveCheck(x,y,g_facts.gridSize,piece,moveArray);
	}

	if(piece.type=="Queen")
	{
		PerpendicularMoveCheck(x,y,g_facts.gridSize,piece,moveArray);
		DiagMoveCheck(x,y,g_facts.gridSize,piece,moveArray);
	}

	if(piece.type=="King")
	{
		PerpendicularMoveCheck(x,y,1,piece,moveArray);
		DiagMoveCheck(x,y,1,piece,moveArray);
		CheckCastling(piece,moveArray);
	}

	return moveArray;
}
//********************************************
function PerpendicularMoveCheck(startX,startY,range,piece,moveArray)
{
	// Check right
	var y=startY;
	var end=startX+range+1;
	for(var x=startX+1; x<end; x++)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Check left
	end=startX-range-1;
	for(var x=startX-1; x>end; x--)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Check down
	x=startX;
	end=startY+range+1;
	for(var y=startY+1; y<end; y++)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Check up
	end=startY-range-1;
	for(var y=startY-1; y>end; y--)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}
}
//********************************************
function DiagMoveCheck(startX,startY,range,piece,moveArray)
{
	// Right/Down
	var x=startX+1;
	var y=startY+1;
	for(var i=0; i<range; i++,x++,y++)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Right/Up
	x=startX+1;
	y=startY-1;
	for(var i=0; i<range; i++,x++,y--)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Left/Up
	x=startX-1;
	y=startY-1;
	for(var i=0; i<range; i++,x--,y--)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}

	// Left/Down
	x=startX-1;
	y=startY+1;
	for(var i=0; i<range; i++,x--,y++)
	{
		if(MoveCheck(x,y,piece,moveArray,null)){break;}
	}
}
//********************************************
function CheckKnightMoves(x,y,piece,moveArray)
{
	// Up/left moves
	MoveCheck(x-2,y-1,piece,moveArray,null);
	MoveCheck(x-1,y-2,piece,moveArray,null);

	// Up/left moves
	MoveCheck(x+2,y-1,piece,moveArray,null);
	MoveCheck(x+1,y-2,piece,moveArray,null);

	// Down/left moves
	MoveCheck(x-2,y+1,piece,moveArray,null);
	MoveCheck(x-1,y+2,piece,moveArray,null);

	// Down/right moves
	MoveCheck(x+2,y+1,piece,moveArray,null);
	MoveCheck(x+1,y+2,piece,moveArray,null);
}
//********************************************
function CheckCastling(kingPiece,moveArray)
{
	// Rules:
	// Not allowed if the king is in check
	// Not allowed if the king has moved
	// Not allowed if the rook has moved
	if(kingPiece.hasMoved || kingPiece.faction.isInCheck){return;}

	var leftRange=new CastlingRange(kingPiece,-1);
	CheckCastlingThroughCheck(leftRange);
	if(leftRange.castleAllowed)
	{
		var place=leftRange.p2;
		MoveCheck(place.x,place.y,kingPiece,moveArray,leftRange);
	}

	var rightRange=new CastlingRange(kingPiece,1);
	CheckCastlingThroughCheck(rightRange);
	if(rightRange.castleAllowed)
	{
		var place=rightRange.p2;
		MoveCheck(place.x,place.y,kingPiece,moveArray,rightRange);
	}
}
//********************************************
// Checks the range for the case of the king castling across a
// space that is in check. This is disallowed by the rules of
// castling.
function CheckCastlingThroughCheck(range)
{
	if(!range.castleAllowed){return;} // Don't mess with this if this range has already been disallowed
	var sideKey=range.rookPiece.sideKey;
	var p1CellIdx=range.p1.cellIdx; // The spot to check

	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.isCaptured){continue;} // Don't worry about captured pieces
		if(piece.sideKey==sideKey){continue;} // Only worried about pieces from the other side
		if(piece.type=="King"){continue;} // Don't check the other side's king as this doesn't matter and could trigger an infinite loop

		var moveArray=GetMoveInfoArray(piece);

		// Check to see the range
		for(var mi=0; mi<moveArray.length; mi++)
		{
			var place=moveArray[mi];
			if(place.cellIdx==p1CellIdx)
			{
				range.castleAllowed=false;
				return;
			}
		}
	}
}
//********************************************
function CastlingRange(kingPiece,xInc)
{
	var x=kingPiece.x+xInc;
	var y=kingPiece.y;
	var p1=new CheckBoardAt(x,y);
	x+=xInc;
	var p2=new CheckBoardAt(x,y);
	x+=xInc;
	var p3=new CheckBoardAt(x,y);
	x+=xInc;
	var p4=new CheckBoardAt(x,y);

	var castleAllowed=false;
	var rookPiece=null;
	if(!p1.piece && !p2.piece) // First two places by the king must be empty
	{
		if(p3.piece && p3.piece.type=="Rook" && !p3.piece.hasMoved)
		{
			castleAllowed=true;
			rookPiece=p3.piece;
		}
		else if(!p3.piece && p4.onBoard && p4.piece && p4.piece.type=="Rook" && !p4.piece.hasMoved)
		{
			castleAllowed=true;
			rookPiece=p4.piece;
		}
	}

	this.p1=p1;
	this.p2=p2;
	this.p3=p3;
	this.p4=p4;
	this.castleAllowed=castleAllowed;
	this.rookPiece=rookPiece;

	return this;
}
//********************************************

//********************************************
function CheckForPawnPromotion(pieceIdx,cellIdx)
{
	var piece=g_pieces[pieceIdx];
	if(piece.type!="Pawn"){return false;}
	var y=g_facts["promoteY_"+piece.sideKey];
	if(piece.y!=y){return false;}

	g_pawnToPromote=piece;
	SelectPawnPromotionPiece(piece.sideKey);
	
	return true;
}
//********************************************
function SelectPawnPromotionPiece(sideKey)
{
	var html="Congratulations! A pawn is being promoted!<br /><br />";
	html+="Please select the promotion piece.<br /><br />";
	html+="<table style=\"width:100%;\"><tr>";
	html+=DrawPromoImg("Queen",sideKey);
	html+=DrawPromoImg("Rook",sideKey);
	html+=DrawPromoImg("Bishop",sideKey);
	html+=DrawPromoImg("Knight",sideKey);
	html+="</tr></table>";
	g_modalAllowsEsc=false;
	InitModalBox(html,400,"B0FFB0");
}
//********************************************
function DrawPromoImg(type,sideKey)
{
	return "<td><a href=\"#\" onclick=\"PromotePawn('"+type+"');return false;\">"+
		"<img src=\"imgs/"+type+"_"+sideKey+".gif\" /></a></td>";
}
//********************************************
function PromotePawn(type)
{
	HideModal();
	g_pawnToPromote.PromoteTo(type);
	g_pawnToPromote=null;
	FinishMove();
}
//********************************************

//********************************************
// When a pawn moves two spaces off the original space then
// an EnPassant object is created to track the possibility
// of en passant.
function CheckForEnPassantInit(pieceIdx,targetCellIdx)
{
	g_currentEnPassant=null;
	var piece=g_pieces[pieceIdx];
	if(piece.type!="Pawn" || piece.hasMoved){return;}

	// Check if the pawn moved two spots
	var xy=new IdxToXy(targetCellIdx);
	var moveRange=Math.abs(xy.y-piece.y);
	if(moveRange!=2){return;}

	var passedCellIdx=XyToIdx(piece.x,piece.y+piece.faction.vertMult);
	g_currentEnPassant=new EnPassant(pieceIdx,passedCellIdx);
}
//********************************************
// Defines the current En Passant if one is possible.
// An object of this is created when it becomes possible after a pawn
// moves two ranks forward from a starting place.
function EnPassant(pieceIdx,cellIdx)
{
	this.pieceIdx=pieceIdx;
	this.cellIdx=cellIdx;
	return this;
}
//********************************************

//********************************************
// Checks a proposed move to see if it is on the board,
// and if so and no other piece is there is add it to
// moveArray.  If a piece of the other side is then it adds
// it to moveArray setting the capture flag and in this case
// returns true.  If another piece of the same side is
// encountered then true is returned indicating that the
// move direction should go no further.
function MoveCheck(x,y,piece,moveArray,castlingRange)
{
	var place=new CheckBoardAt(x,y);
	place.castlingRange=castlingRange;
	var otherPiece=place.piece;
	if(!place.onBoard){return true;}
	if(!otherPiece){moveArray.push(place);}
	else if(otherPiece.sideKey!=piece.sideKey)
	{
		place.capture=true;
		moveArray.push(place);
		return true;
	}
	else{return true;} // Own piece encountered
	return false;
}
//********************************************
// Return object with info about the specified board location.
function CheckBoardAt(x,y)
{
	this.onBoard=true;
	this.piece=null;
	this.cellIdx=XyToIdx(x,y);
	this.x=x;
	this.y=y;
	this.capture=false; // Would this move result in a capture (value gets set later)
	this.castlingRange=null;

	if(x<0 || y<0 || x>g_facts.maxCoordVal || y>g_facts.maxCoordVal)
	{
		this.onBoard=false;
	}
	else
	{
		for(var i=0; i<g_pieces.length; i++)
		{
			var piece=g_pieces[i];
			if(piece.isCaptured){continue;} // Ignore captured pieces
			if(piece.x==x && piece.y==y){this.piece=piece;break;}
		}
	}
	return this;
}
//********************************************

//********************************************
function FindPiece(pieceIdx)
{
	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.idx==pieceIdx){return piece;}
	}
	return null;
}
//********************************************
function GetKing(sideKey)
{
	for(var i=0; i<g_pieces.length; i++)
	{
		var piece=g_pieces[i];
		if(piece.sideKey!=sideKey){continue;}
		if(piece.type=="King"){return piece;}
	}
	return null;
}
//********************************************
function IdxToXy(cellIdx)
{
	this.y=Math.floor(cellIdx/g_facts.gridSize);
	this.x=cellIdx-this.y*g_facts.gridSize;
	return this;
}
//********************************************
function XyToIdx(x,y)
{
	return g_facts.gridSize*y+x;
}
//********************************************

//********************************************
// Runs the allowed move calulations for a piece and then
// highlights those locations on the board.
function HighlightAllowedMoves(pieceIdx)
{
	if(g_gameOver || !g_userCtrlActive){return;}
	var piece=g_pieces[pieceIdx];

	if(piece.sideKey!=g_whoseTurn){return;} // Not their turn

	var moveArray=GetMoveInfoArray(piece);
	for(var i=0; i<moveArray.length; i++)
	{
		var cell=moveArray[i];

		var bgColor=g_facts.moveHLitColor;
		if(cell.capture){bgColor=g_facts.captureHLitColor;}
		HighlightCell(cell.cellIdx,bgColor);
	}
}
//********************************************
