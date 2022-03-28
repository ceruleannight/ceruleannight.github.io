var AiEngine=(function(){function AiEngine(boardStateStr,sideKey,fiftyMoveRuleCounter){this.debugTxt="";this.boardMgr=new ChessBoardManager(boardStateStr);this.sideKey=sideKey;this.fiftyMoveRuleCounter=fiftyMoveRuleCounter;this.side=this.boardMgr.GetASide(sideKey);this.side.isInCheck=this.boardMgr.IsInCheck(sideKey,this.side.GetKingIdx());this.AssessSidePowers()}
AiEngine.prototype.MakeMove=function(aiKey){var move=null;switch(aiKey){case "0":move=this.Ai_Suicidal();break;case "1":move=this.Ai_Randumb();break;case "2":move=this.Ai_AggressiveDumb();break;case "3":move=this.Ai_BasicIntelligence1();break;case "EXP":move=this.Ai_BasicExp();break}
if(!move){return this.FormatReturnResults("NONE",null)}
if(this.fiftyMoveRuleCounter>=50&&this.thisSidePower==0||this.fiftyMoveRuleCounter>=120){return this.FormatReturnResults("CLAIM-STALEMATE",null)}
return this.FormatReturnResults("MOVE",move)};AiEngine.prototype.FormatReturnResults=function(cmd,move){if(cmd=="MOVE"){return "{"+"\"cmd\":\"MOVE\""+",\"startX\":"+move.piece.x+",\"startY\":"+move.piece.y+",\"endX\":"+move.spot.x+",\"endY\":"+move.spot.y+",\"pawnPromotionKey\":\""+move.promoteKey+"\""+"}"}
return "{"+"\"cmd\":\""+cmd+"\""+"}"};AiEngine.prototype.Ai_AggressiveDumb=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;if(allMoveList.length==0){return null}
var moveIdx=0;if(allMoveList.length>1){moveIdx=-1;for(var i=0;i<allMoveList.length;i++){var move_1=allMoveList[i];if(move_1.capture){moveIdx=i;break}}
if(moveIdx==-1){return this.Ai_Randumb()}}
var move=allMoveList[moveIdx];return new AiMove(move.pieceToMove,move,"Q")};AiEngine.prototype.Ai_Randumb=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;var moveCount=allMoveList.length;if(moveCount==0){return null}
var moveIdx=0;if(moveCount>1){var rnd=new RandomGen();moveIdx=rnd.NextInt(0,moveCount-1)}
var move=allMoveList[moveIdx];return new AiMove(move.pieceToMove,move,this.RandomPromote())};AiEngine.prototype.Ai_UltraDumb=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;if(allMoveList.length==0){return null}
var move=allMoveList[0];return new AiMove(move.pieceToMove,move,"K")};AiEngine.prototype.Ai_Suicidal=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;if(allMoveList.length==0){return null}
var move=allMoveList[0];if(allMoveList.length>1){var capsArr=[];var noCapsArr=[];for(var i=0;i<allMoveList.length;i++){var m=allMoveList[i];if(m.capture){capsArr.push(m)}
else{noCapsArr.push(m)}}
if(noCapsArr.length>0){move=this.GetRandomArrayPiece(noCapsArr)}
else{move=this.GetRandomArrayPiece(capsArr)}}
return new AiMove(move.pieceToMove,move,"K")};AiEngine.prototype.Ai_BasicIntelligence1=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;if(allMoveList.length==0){return null}
this.AssessPieceMovePossibilities(allMoveList);var moveToMake=allMoveList[0];if(allMoveList.length>1){for(var i=0;i<allMoveList.length;i++){var thisMove=allMoveList[i];var facts=thisMove.facts;if(facts.putsOtherSideInCheckMate){facts.moveValuePro=100;continue}
if(facts.putsOtherSideInCheck){facts.moveValuePro+=5}
if(facts.capRisk){facts.moveValueCon+=AiEngine.GetGeneralPieceValue(thisMove.pieceToMove.key)}
if(facts.willBeGuarded){facts.moveValuePro+=2}
facts.moveValuePro+=facts.captureValue}
moveToMake=this.ChooseWeightedMove(allMoveList)}
return new AiMove(moveToMake.pieceToMove,moveToMake,"Q")};AiEngine.prototype.Ai_BasicExp=function(){this.boardMgr.InitAllMovesArray(this.sideKey);var allMoveList=this.boardMgr.allCurrentMoves;if(allMoveList.length==0){return null}
this.AssessCurrentPieceStatuses();this.AssessPieceMovePossibilities(allMoveList);var moveToMake=allMoveList[0];if(allMoveList.length>1){for(var i=0;i<allMoveList.length;i++){var thisMove=allMoveList[i];var facts=thisMove.facts;var pieceStat=this.pieceCurStatArray[thisMove.pieceToMove.idx];var pieceValue=AiEngine.GetGeneralPieceValue(thisMove.pieceToMove.key);if(facts.putsOtherSideInCheckMate){facts.moveValuePro=100;continue}
if(pieceStat.captureRisk){facts.moveValuePro+=pieceValue;if(pieceValue>1){facts.moveValuePro--}}
if(facts.putsOtherSideInCheck){facts.moveValuePro+=8}
if(facts.causesStaleMate){if(this.thatSidePower==0&&this.thatSidePower>0){facts.moveValueCon+=100}}
if(facts.capRisk){var pro=AiEngine.GetGeneralPieceValue(thisMove.pieceToMove.key);facts.moveValueCon+=pro*2}
if(facts.willBeGuarded){facts.moveValuePro+=2}
facts.moveValuePro+=facts.captureValue;if(facts.captureValue>0){}
var capturablePieceCount=facts.capturablePieces.length;if(capturablePieceCount>1){facts.moveValuePro+=2}
if(capturablePieceCount>2){facts.moveValuePro++}}
moveToMake=this.ChooseWeightedMove(allMoveList)}
return new AiMove(moveToMake.pieceToMove,moveToMake,"Q")};AiEngine.prototype.ChooseWeightedMove=function(moveList){var moveToMake=moveList[0];var maxBalVal=-100;var countAtVal=0;for(var i=0;i<moveList.length;i++){var thisMove=moveList[i];var facts=thisMove.facts;facts.moveValueBal=facts.moveValuePro-facts.moveValueCon;if(facts.moveValueBal>maxBalVal){maxBalVal=facts.moveValueBal;countAtVal=1}
else if(facts.moveValueBal==maxBalVal){countAtVal++}}
var idxToUse=0;if(countAtVal>1){var rnd=new RandomGen();idxToUse=rnd.NextInt(0,countAtVal-1)}
var idx=0;for(var i=0;i<moveList.length;i++){var thisMove=moveList[i];var facts=thisMove.facts;if(facts.moveValueBal==maxBalVal){if(idx==idxToUse){moveToMake=thisMove;break}
idx++}}
return moveToMake};AiEngine.prototype.AssessCurrentPieceStatuses=function(){var bm=this.boardMgr.DeepClone();var otherSideKey=this.side.GetOtherSideKey();bm.InitAllMovesArray(otherSideKey);this.pieceCurStatArray=[];var pieceArr=this.boardMgr.pieceArray;for(var i=0;i<pieceArr.length;i++){var piece=pieceArr[i];var stat=new PieceCurrentStat(piece);stat.captureRisk=!1;for(var mi=0;mi<bm.allCurrentMoves.length;mi++){var move=bm.allCurrentMoves[mi];if(!move.onBoard||!move.capture||move.pieceAtLocation==null){continue}
if(move.pieceAtLocation.idx!=piece.idx){continue}
stat.captureRisk=!0}
this.pieceCurStatArray.push(stat)}};AiEngine.prototype.AssessPieceMovePossibilities=function(moveList){for(var i=0;i<moveList.length;i++){var move=moveList[i];move.facts=new MoveWeight();move.facts.AssessMovePossibilities(move,this.boardMgr,this.side)}};AiEngine.prototype.AssessSidePowers=function(){this.thisSidePower=0;this.thatSidePower=0;var pieceArray=this.boardMgr.pieceArray;for(var i=0;i<pieceArray.length;i++){var p=pieceArray[i];if(!p.isCaptured){var val=AiEngine.GetGeneralPieceValue(p.key);if(p.side.sideKey==this.sideKey){this.thisSidePower+=val}
else{this.thatSidePower+=val}}}};AiEngine.prototype.GetRandomArrayPiece=function(arr){if(arr.length==0){return null}
if(arr.length==1){return arr[0]}
return arr[(new RandomGen()).NextInt(0,arr.length-1)]};AiEngine.prototype.RandomPromote=function(){var rnd=new RandomGen();return "QRBK".substr(rnd.NextInt(0,3),1)};AiEngine.GetGeneralPieceValue=function(pieceKey){switch(pieceKey){case "Q":return 8;case "R":return 5;case "B":return 3.5;case "K":return 3;case "P":return 1}
return 0};return AiEngine}());var AiMove=(function(){function AiMove(piece,spot,promoteKey){this.piece=piece;this.spot=spot;this.promoteKey=promoteKey}
return AiMove}());var PieceCurrentStat=(function(){function PieceCurrentStat(piece){this.captureRisk=!1;this.piece=piece}
return PieceCurrentStat}());var MoveWeight=(function(){function MoveWeight(){this.moveValuePro=0;this.moveValueCon=0;this.moveValueBal=0;this.captureValue=0;this.putsOtherSideInCheck=!1;this.putsOtherSideInCheckMate=!1;this.causesStaleMate=!1;this.capRisk=!1;this.willBeGuarded=!1;this.capturablePieces=[];this.topCapturablePieceKey="";this.debugTxt=""}
MoveWeight.prototype.AssessMovePossibilities=function(move,currentBm,currentSide){this.move=move;if(move.capture&&move.pieceAtLocation){this.captureValue=AiEngine.GetGeneralPieceValue(move.pieceAtLocation.key)}
var bm=currentBm.DeepClone();var pieceToMove=bm.pieceArray[move.pieceToMove.idx];var pieceToCapture=null;if(move.capture&&move.pieceAtLocation!=null){pieceToCapture=bm.pieceArray[move.pieceAtLocation.idx]}
this.MoveAPiece(pieceToMove,move.x,move.y,move.capture,pieceToCapture);var guardBm=bm.DeepClone();guardBm.InitAllMovesArray(currentSide.sideKey);this.willBeGuarded=guardBm.IsPieceGuarded(move.pieceToMove.idx);var movedPiece=bm.pieceArray[move.pieceToMove.idx];var otherSideKey=currentSide.GetOtherSideKey();var otherSide=bm.GetASide(otherSideKey);bm.InitAllMovesArray(otherSideKey);this.putsOtherSideInCheck=bm.IsInCheck(otherSideKey,otherSide.GetKingIdx());var noMoves=bm.allCurrentMoves.length==0;this.putsOtherSideInCheckMate=noMoves&&this.putsOtherSideInCheck;this.causesStaleMate=noMoves&&!this.putsOtherSideInCheck;var arr=bm.GetCaptureMovesForPieceArray(movedPiece.idx);if(arr.length>0){this.capRisk=!0}
bm.InitAllMovesArray(currentSide.sideKey);for(var i=0;i<bm.allCurrentMoves.length;i++){var move_2=bm.allCurrentMoves[i];if(!move_2.capture||!move_2.pieceAtLocation){continue}
this.capturablePieces.push(move_2.pieceAtLocation)}};MoveWeight.prototype.MoveAPiece=function(pieceToMove,x,y,isACapture,pieceToCapture){pieceToMove.x=x;pieceToMove.y=y;if(isACapture&&pieceToCapture!=null){pieceToCapture.isCaptured=!0}};return MoveWeight}());var g_useBattleRatApi=!1;var g_isBattleRatApiReady=!1;var g_battleRatUrl="http://www.battle"+"rat.net/Chess/ChessAiSvc.aspx";function BattleRatApi_LoadAiList(){g_useBattleRatApi=localStorage.getItem("useBattleRatAiApi")=="Y";if(!g_useBattleRatApi){return}
var params="cmd=LIST";BattleRatApi_ajaxCall("LIST",g_battleRatUrl,params,"",AddBattleRatAisToControllerDds)}
function SetBattleRatAiUse(){var cb=document.getElementById("useBattleRatApiCb");if(!cb){return}
g_useBattleRatApi=cb.checked;localStorage.setItem("useBattleRatAiApi",g_useBattleRatApi?"Y":"N")}
function BattleRatApi_GetMove(boardState,sideKey,aiKey){var params="cmd=MOVE"+"&boardState="+boardState+"&sideKey="+sideKey+"&aiKey="+aiKey+"&returnFormatKey="+GameSettings.BattleRatMoveResultFormatKey;BattleRatApi_ajaxCall("MOVE",g_battleRatUrl,params,"",BattleRatApi_GetMove_callback)}
function BattleRatApi_ajaxCall(cmd,url,params,context,callbackFnc){var xmlhttp=new XMLHttpRequest();xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==XMLHttpRequest.DONE){if(xmlhttp.status==200){callbackFnc(xmlhttp,cmd,context)}
else if(xmlhttp.status==400){alert("Battle Rat returned HTTP Error 400 (Bad Request)")}
else{alert("Battle Rat returned HTTP Error "+xmlhttp.status)}}};xmlhttp.open("POST",url,!0);xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");xmlhttp.send(params)}
function BattleRatApi_GetMove_callback(xmlhttp,cmd,context){g_game.BattleRatPieceMove(new PlayerMove("V1",xmlhttp.responseText))}
var ChessBoardManager=(function(){function ChessBoardManager(boardStateStr){this.enPassant=null;this.topSide=null;this.botSide=null;this.allCurrentMoves=[];this.guardMoves=[];this.topSide=new GameSide("T",1,"");this.botSide=new GameSide("B",-1,"");this.pieceArray=new Array();this.InitPieceObjects();this.enPassant=ParseAndSetBoardState(boardStateStr,this.pieceArray);var t=this.topSide;var b=this.botSide;t.isInCheck=this.IsInCheck(t.sideKey,t.GetKingIdx());b.isInCheck=this.IsInCheck(b.sideKey,b.GetKingIdx())}
ChessBoardManager.prototype.DeepClone=function(){return new ChessBoardManager(BuildBoardStateString(this.pieceArray,this.enPassant))};ChessBoardManager.prototype.InitPieceObjects=function(){var ts=this.topSide;var bs=this.botSide;this.pieceArray.push(new GamePiece(0,"R","Rook","B",ts));this.pieceArray.push(new GamePiece(1,"K","Knight","B",ts));this.pieceArray.push(new GamePiece(2,"B","Bishop","B",ts));this.pieceArray.push(new GamePiece(3,"Q","Queen","B",ts));this.pieceArray.push(new GamePiece(4,"X","King","B",ts));this.pieceArray.push(new GamePiece(5,"B","Bishop","B",ts));this.pieceArray.push(new GamePiece(6,"K","Knight","B",ts));this.pieceArray.push(new GamePiece(7,"R","Rook","B",ts));this.pieceArray.push(new GamePiece(8,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(9,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(10,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(11,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(12,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(13,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(14,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(15,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(16,"R","Rook","W",bs));this.pieceArray.push(new GamePiece(17,"K","Knight","W",bs));this.pieceArray.push(new GamePiece(18,"B","Bishop","W",bs));this.pieceArray.push(new GamePiece(19,"Q","Queen","W",bs));this.pieceArray.push(new GamePiece(20,"X","King","W",bs));this.pieceArray.push(new GamePiece(21,"B","Bishop","W",bs));this.pieceArray.push(new GamePiece(22,"K","Knight","W",bs));this.pieceArray.push(new GamePiece(23,"R","Rook","W",bs));this.pieceArray.push(new GamePiece(24,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(25,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(26,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(27,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(28,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(29,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(30,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(31,"P","Pawn","W",bs))};ChessBoardManager.prototype.GetASide=function(sideKey){if(sideKey=="T"){return this.topSide}
return this.botSide};ChessBoardManager.prototype.InitAllMovesArray=function(sideKey){var arr=[];for(var i=0;i<this.pieceArray.length;i++){var piece=this.pieceArray[i];if(piece.side.sideKey!=sideKey){continue}
if(piece.isCaptured){continue}
arr=arr.concat(this.GetPieceMoveInfoArray(piece))}
this.allCurrentMoves=arr;var currentSide=this.GetASide(sideKey);var newMoves=[];for(var i=0;i<this.allCurrentMoves.length;i++){var move=this.allCurrentMoves[i];var pieceToCaptureIdx=-1;if(move.pieceAtLocation){pieceToCaptureIdx=move.pieceAtLocation.idx}
if(!this.WillLeaveInCheck(move.pieceToMove.idx,move.cellIdx,pieceToCaptureIdx)){newMoves.push(move)}}
this.allCurrentMoves=newMoves};ChessBoardManager.prototype.GetPieceMoveArray=function(pieceIdx){var arr=[];for(var i=0;i<this.allCurrentMoves.length;i++){var move=this.allCurrentMoves[i];if(move.pieceToMove.idx==pieceIdx){arr.push(move)}}
return arr};ChessBoardManager.prototype.GetCaptureMovesForPieceArray=function(pieceIdx){var arr=[];for(var i=0;i<this.allCurrentMoves.length;i++){var move=this.allCurrentMoves[i];if(move.capture&&move.pieceAtLocation&&move.pieceAtLocation.idx==pieceIdx){arr.push(move)}}
return arr};ChessBoardManager.prototype.IsMoveAllowed=function(pieceIdx,cellIdx){for(var i=0;i<this.allCurrentMoves.length;i++){var move=this.allCurrentMoves[i];if(move.pieceToMove.idx==pieceIdx&&move.cellIdx==cellIdx){return!0}}
return!1};ChessBoardManager.prototype.GetAllMoveInfo=function(sideKey){var allMoveStr="";var hdr="";for(var i=0;i<this.pieceArray.length;i++){var piece=this.pieceArray[i];var moveArray=this.GetPieceMoveInfoArray(piece);var moveStr=piece.idx.toString(10)+":";if(piece.side.sideKey==sideKey){for(var mi=0;mi<moveArray.length;mi++){var move=moveArray[mi];moveStr+=move.x.toString();moveStr+=move.y.toString();moveStr+=move.capture?"C":"-"}}
if(i>0){allMoveStr+=";"}
allMoveStr+=moveStr}
return hdr+"|"+allMoveStr};ChessBoardManager.prototype.GetPieceMoveInfoArray=function(piece){var vertMult=piece.side.dirY;var x=piece.x;var y=piece.y;var moveArray=[];var place;if(piece.key=="P"){place=new PotentialMove(x,y+1*vertMult,piece,this.pieceArray);if(place.onBoard&&!place.pieceAtLocation){moveArray.push(place);if(!piece.hasMoved){place=new PotentialMove(x,y+2*vertMult,piece,this.pieceArray);if(place.onBoard&&!place.pieceAtLocation){moveArray.push(place)}}}
this.PawnCaptureCheck(x-1,y+1*vertMult,piece,moveArray);this.PawnCaptureCheck(x+1,y+1*vertMult,piece,moveArray)}
if(piece.key=="R"){this.PerpendicularMoveCheck(x,y,GameSettings.gridSize,piece,moveArray)}
if(piece.key=="K"){this.CheckKnightMoves(x,y,piece,moveArray)}
if(piece.key=="B"){this.DiagMoveCheck(x,y,GameSettings.gridSize,piece,moveArray)}
if(piece.key=="Q"){this.PerpendicularMoveCheck(x,y,GameSettings.gridSize,piece,moveArray);this.DiagMoveCheck(x,y,GameSettings.gridSize,piece,moveArray)}
if(piece.key=="X"){this.PerpendicularMoveCheck(x,y,1,piece,moveArray);this.DiagMoveCheck(x,y,1,piece,moveArray);this.CheckCastling(piece,moveArray)}
return moveArray};ChessBoardManager.prototype.PawnCaptureCheck=function(x,y,piece,moveArray){var place=new PotentialMove(x,y,piece,this.pieceArray);if(place.onBoard){if(place.pieceAtLocation){if(piece.side.sideKey==place.pieceAtLocation.side.sideKey){this.guardMoves.push(place)}
else{place.capture=!0;moveArray.push(place)}}
else if(this.enPassant&&place.cellIdx==this.enPassant.cellIdx){place.capture=!0;moveArray.push(place)}}};ChessBoardManager.prototype.PerpendicularMoveCheck=function(startX,startY,range,piece,moveArray){var x=0;var y=startY;var end=startX+range+1;for(x=startX+1;x<end;x++){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
end=startX-range-1;for(x=startX-1;x>end;x--){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
x=startX;end=startY+range+1;for(y=startY+1;y<end;y++){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
end=startY-range-1;for(y=startY-1;y>end;y--){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}};ChessBoardManager.prototype.DiagMoveCheck=function(startX,startY,range,piece,moveArray){var x=startX+1;var y=startY+1;for(var i=0;i<range;i++,x++,y++){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
x=startX+1;y=startY-1;for(var i=0;i<range;i++,x++,y--){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
x=startX-1;y=startY-1;for(var i=0;i<range;i++,x--,y--){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}
x=startX-1;y=startY+1;for(var i=0;i<range;i++,x--,y++){if(this.MoveCheck(x,y,piece,moveArray,null)){break}}};ChessBoardManager.prototype.CheckKnightMoves=function(x,y,piece,moveArray){this.MoveCheck(x-2,y-1,piece,moveArray,null);this.MoveCheck(x-1,y-2,piece,moveArray,null);this.MoveCheck(x+2,y-1,piece,moveArray,null);this.MoveCheck(x+1,y-2,piece,moveArray,null);this.MoveCheck(x-2,y+1,piece,moveArray,null);this.MoveCheck(x-1,y+2,piece,moveArray,null);this.MoveCheck(x+2,y+1,piece,moveArray,null);this.MoveCheck(x+1,y+2,piece,moveArray,null)};ChessBoardManager.prototype.CheckCastling=function(kingPiece,moveArray){if(kingPiece.hasMoved||kingPiece.side.isInCheck){return}
var leftRange=new CastlingRange(kingPiece,-1,this.pieceArray);this.CheckCastlingThroughCheck(leftRange);if(leftRange.castleAllowed){var place=leftRange.p2;this.MoveCheck(place.x,place.y,kingPiece,moveArray,leftRange)}
var rightRange=new CastlingRange(kingPiece,1,this.pieceArray);this.CheckCastlingThroughCheck(rightRange);if(rightRange.castleAllowed){var place=rightRange.p2;this.MoveCheck(place.x,place.y,kingPiece,moveArray,rightRange)}};ChessBoardManager.prototype.CheckCastlingThroughCheck=function(range){if(!range.castleAllowed){return}
var sideKey=range.rookPiece.side.sideKey;var p1CellIdx=range.p1.cellIdx;for(var i=0;i<this.pieceArray.length;i++){var piece=this.pieceArray[i];if(piece.isCaptured){continue}
if(piece.side.sideKey==sideKey){continue}
if(piece.key=="X"){continue}
var moveArray=this.GetPieceMoveInfoArray(piece);for(var mi=0;mi<moveArray.length;mi++){var place=moveArray[mi];if(place.cellIdx==p1CellIdx){range.castleAllowed=!1;return}}}};ChessBoardManager.prototype.IsInCheck=function(sideKey,kingPieceIdx){for(var i=0;i<this.pieceArray.length;i++){var piece=this.pieceArray[i];if(piece.isCaptured){continue}
if(piece.side.sideKey==sideKey){continue}
var moveArray=this.GetPieceMoveInfoArray(piece);for(var mi=0;mi<moveArray.length;mi++){var place=moveArray[mi];if(!place.pieceAtLocation){continue}
if(place.pieceAtLocation.idx==kingPieceIdx){return!0}}}
return!1};ChessBoardManager.prototype.WillLeaveInCheck=function(movedPieceIdx,movedToCellIdx,pieceToCaptureIdx){var movedPiece=this.pieceArray[movedPieceIdx];var side=movedPiece.side;var cellXy=new IdxToXy(movedToCellIdx);var pieceToCapture=null;if(pieceToCaptureIdx>-1){pieceToCapture=this.pieceArray[pieceToCaptureIdx]}
var storedX=movedPiece.x;var storedY=movedPiece.y;movedPiece.x=cellXy.x;movedPiece.y=cellXy.y;if(pieceToCapture){pieceToCapture.isCaptured=!0}
var allowMove=this.IsInCheck(movedPiece.side.sideKey,side.GetKingIdx());movedPiece.x=storedX;movedPiece.y=storedY;if(pieceToCapture){pieceToCapture.isCaptured=!1}
return allowMove};ChessBoardManager.prototype.DoAllMovesResultInCheck=function(sideKey){this.InitAllMovesArray(sideKey);if(this.allCurrentMoves.length>0){return!1}
return!0};ChessBoardManager.prototype.IsPieceGuarded=function(pieceIdx){for(var i=0;i<this.guardMoves.length;i++){var move=this.guardMoves[i];if(!move.pieceAtLocation){continue}
if(move.pieceAtLocation.idx==pieceIdx){return!0}}
return!1};ChessBoardManager.prototype.MoveCheck=function(x,y,piece,moveArray,castlingRange){var place=new PotentialMove(x,y,piece,this.pieceArray);place.castlingRange=castlingRange;var otherPiece=place.pieceAtLocation;if(!place.onBoard){return!0}
if(!otherPiece){moveArray.push(place)}
else if(otherPiece.side.sideKey!=piece.side.sideKey){place.capture=!0;moveArray.push(place);return!0}
else{this.guardMoves.push(place);return!0}
return!1};return ChessBoardManager}());var PotentialMove=(function(){function PotentialMove(x,y,pieceToMove,pieceArray){this.cellIdx=-1;this.capture=!1;this.castlingRange=null;this.facts=null;this.onBoard=!0;this.pieceToMove=pieceToMove;this.pieceAtLocation=null;this.cellIdx=XyToIdx(x,y);this.x=x;this.y=y;this.capture=!1;this.castlingRange=null;if(x<0||y<0||x>GameSettings.maxCoorIdx||y>GameSettings.maxCoorIdx){this.onBoard=!1}
else{for(var i=0;i<pieceArray.length;i++){var piece=pieceArray[i];if(piece.isCaptured){continue}
if(piece.x==x&&piece.y==y){this.pieceAtLocation=piece;break}}}}
return PotentialMove}());var CastlingRange=(function(){function CastlingRange(kingPiece,xInc,pieceArray){var x=kingPiece.x+xInc;var y=kingPiece.y;var p1=new PotentialMove(x,y,kingPiece,pieceArray);x+=xInc;var p2=new PotentialMove(x,y,kingPiece,pieceArray);x+=xInc;var p3=new PotentialMove(x,y,kingPiece,pieceArray);x+=xInc;var p4=new PotentialMove(x,y,kingPiece,pieceArray);var castleAllowed=!1;var rookPiece=null;if(!p1.pieceAtLocation&&!p2.pieceAtLocation){if(p3.pieceAtLocation&&p3.pieceAtLocation.key=="R"&&!p3.pieceAtLocation.hasMoved){castleAllowed=!0;rookPiece=p3.pieceAtLocation}
else if(!p3.pieceAtLocation&&p4.onBoard&&p4.pieceAtLocation&&p4.pieceAtLocation.key=="R"&&!p4.pieceAtLocation.hasMoved){castleAllowed=!0;rookPiece=p4.pieceAtLocation}}
this.p1=p1;this.p2=p2;this.p3=p3;this.p4=p4;this.castleAllowed=castleAllowed;this.rookPiece=rookPiece}
return CastlingRange}());var g_game;var g_player;var g_modalAllowsEsc;var g_dragDropToMove=!0;var g_debugMode=!1;var g_isDevMode=!1;var g_debugInfoTxt="";function PageInit(){InitDebugState();InitPieceMoveMode();RenderMenu();InitControllerDropDowns();BattleRatApi_LoadAiList();ResetGame()}
function KeyDown(evt){evt=evt||window.event;if(evt.keyCode==27){if(g_modalAllowsEsc){HideModal()}
ShowMenu(!1);ShowHideDebugPanel(!1)}
return!0}
function PageClicked(evt){evt=evt||window.event;g_game.SetCellSelection(!1,null)}
function MouseOverPiece(pieceIdx){if(!g_game.boardMgr){return}
g_game.HighlightPieceMoves(pieceIdx);if(g_debugMode){WriteTestInfo("Piece IDX: "+pieceIdx)}}
function MouseOutPiece(pieceIdx){g_game.RemoveAllHighlighting();WriteTestInfo("")}
function CellClick(evt,cellIdx){if(g_dragDropToMove){return}
evt=evt||window.event;evt.stopPropagation();g_game.CellClicked(cellIdx)}
function PieceClicked(evt,pieceIdx){if(g_dragDropToMove){return}
evt=evt||window.event;evt.stopPropagation();g_game.PieceClicked(pieceIdx)}
function InitPieceMoveMode(){var ddMode=localStorage.getItem("dragDropToMove");if(ddMode===null){ddMode="Y"}
g_dragDropToMove=ddMode=="Y"}
function SetDragDropMode(){var dd=document.getElementById("useDragDropModeCb")["checked"];g_dragDropToMove=dd;localStorage.setItem("dragDropToMove",g_dragDropToMove?"Y":"N")}
function ShowEndGameMessage(key){g_game.ShowEndGameMessage(key)}
function ResetGame(){ClearAllTestInfo();ResetGameOverMsgPanel();g_game=new ChessGame();ChooseSetTestCase();if(g_isDevMode){WriteTurnCounter(g_game.turnCounter);WriteDebugInfo()}
g_game.ReinitGameBoardManager();DrawBothSidePanels();SetAiPause(!1);g_game.InitTurn();TurnCheck()}
function ToggleAiPause(){g_game.pauseAi=!g_game.pauseAi;SetAiPause(g_game.pauseAi)}
function SetAiPause(paused){var btn=document.getElementById("aiPauseGoBtn");btn.value=paused?"Resume AIs":"Pause AIs";btn.className=paused?"pauseBtnPaused":""}
function TurnCheck(){if(g_game.gameOver){return}
if(!g_game.pauseAi){var playerKey="";if(g_game.whoseTurn=="T"){playerKey=document.getElementById("topPlayerDd")["value"]}
if(g_game.whoseTurn=="B"){playerKey=document.getElementById("botPlayerDd")["value"]}
g_game.InitController(playerKey);if(!g_game.userInControl){switch(g_game.controller.moveSrc){case "LOCAL":g_game.CallLocalComputerAiTurn();break;case "BRAPI":g_game.BattleRat_ApiCall();break}}}
setTimeout("TurnCheck()",g_isDevMode?1:200)}
function StartDragEvent(evt,pieceIdx){if(!g_dragDropToMove){return}
evt=evt||window.event;g_game.StartPieceDrag(evt,pieceIdx)}
function DragOverCellEvent(evt,cellIdx){if(!g_dragDropToMove){return}
evt=evt||window.event;g_game.CheckAllowPieceDropOnCell(evt,cellIdx)}
function DragOverPieceEvent(evt,pieceIdx){if(!g_dragDropToMove){return}
evt=evt||window.event;g_game.CheckAllowPieceDropOnPiece(evt,pieceIdx)}
function DropPieceOnPiece(evt,cellIdx){if(!g_dragDropToMove){return}
evt=evt||window.event;g_game.DropPieceOnPiece(evt,cellIdx)}
function DropPieceOnCellEvent(evt,cellIdx){if(!g_dragDropToMove){return}
evt=evt||window.event;g_game.DropPieceOnCell(evt,cellIdx)}
var ChessGame=(function(){function ChessGame(){this.gameOver=!1;this.pauseAi=!1;this.userInControl=!0;this.turnCounter=0;this.fiftyMoveRuleCounter=0;this.whoseTurn="B";this.topSide=null;this.botSide=null;this.winningSide=null;this.sideSequence="BW";this.boardMgr=null;this.selectedCellIdx=-1;this.currentTurnSide=null;this.otherSide=null;this.currentDrag=null;this.currentEnPassant=null;this.showCellIdx=!1;this.RenderGrid();this.InitSides();this.InitGamePieces();this.PositionAllPieces();this.moveLogger=new GameMoveLogger(this)}
ChessGame.prototype.InitSides=function(){this.topSide=new GameSide("T",1,"Black");this.botSide=new GameSide("B",-1,"White")};ChessGame.prototype.ReinitGameBoardManager=function(){this.boardMgr=this.CreateBoardManagerFromCurrentGame()};ChessGame.prototype.CreateBoardManagerFromCurrentGame=function(){var boardState=BuildBoardStateString(this.pieceArray,this.currentEnPassant);return new ChessBoardManager(boardState)};ChessGame.prototype.RenderGrid=function(){var gw=GameSettings.gridSize;var gh=GameSettings.gridSize;var cw=GameSettings.cellSize;var ch=GameSettings.cellSize;var html="";var rowStartClass="liteCell";for(var y=0;y<gw;y++){var rowClass=rowStartClass;for(var x=0;x<gh;x++){var i=x+y*gw;html+=this.RenderCell(i,x*cw,y*ch,cw,ch,"cell "+rowClass);if(rowClass=="liteCell"){rowClass="darkCell"}
else{rowClass="liteCell"}}
if(rowStartClass=="liteCell"){rowStartClass="darkCell"}
else{rowStartClass="liteCell"}}
document.getElementById("boardDiv").innerHTML=html};ChessGame.prototype.RenderCell=function(idx,x,y,w,h,cssClass){var html="<div id=\"cell-"+idx+"\" class=\""+cssClass+"\""+" style=\"position:absolute; left:"+x+"px; top:"+y+"px; width:"+w+"px; height:"+h+"px;\""+" onclick=\"CellClick(event,"+idx+")\""+" ondragover=\"DragOverCellEvent(event,"+idx+")\""+" ondrop=\"DropPieceOnCellEvent(event,"+idx+")\"";if(g_debugMode){var xy=new IdxToXy(idx);html+=" onmouseover=\"WriteTestInfo('Cell: "+xy.x+","+xy.y+" (IDX:"+idx+")');\"";html+=" onmouseout=\"WriteTestInfo('');\""}
html+=">"+(this.showCellIdx?idx:"")+"</div>";return html};ChessGame.prototype.InitGamePieces=function(){this.pieceArray=new Array();var ts=this.topSide;var bs=this.botSide;this.pieceArray.push(new GamePiece(0,"R","Rook","B",ts));this.pieceArray.push(new GamePiece(1,"K","Knight","B",ts));this.pieceArray.push(new GamePiece(2,"B","Bishop","B",ts));this.pieceArray.push(new GamePiece(3,"Q","Queen","B",ts));this.pieceArray.push(new GamePiece(4,"X","King","B",ts));this.pieceArray.push(new GamePiece(5,"B","Bishop","B",ts));this.pieceArray.push(new GamePiece(6,"K","Knight","B",ts));this.pieceArray.push(new GamePiece(7,"R","Rook","B",ts));this.pieceArray.push(new GamePiece(8,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(9,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(10,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(11,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(12,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(13,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(14,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(15,"P","Pawn","B",ts));this.pieceArray.push(new GamePiece(16,"R","Rook","W",bs));this.pieceArray.push(new GamePiece(17,"K","Knight","W",bs));this.pieceArray.push(new GamePiece(18,"B","Bishop","W",bs));this.pieceArray.push(new GamePiece(19,"Q","Queen","W",bs));this.pieceArray.push(new GamePiece(20,"X","King","W",bs));this.pieceArray.push(new GamePiece(21,"B","Bishop","W",bs));this.pieceArray.push(new GamePiece(22,"K","Knight","W",bs));this.pieceArray.push(new GamePiece(23,"R","Rook","W",bs));this.pieceArray.push(new GamePiece(24,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(25,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(26,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(27,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(28,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(29,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(30,"P","Pawn","W",bs));this.pieceArray.push(new GamePiece(31,"P","Pawn","W",bs));ParseAndSetBoardState(GameSettings.initialBoardStateStr,this.pieceArray);var html="";for(var i=0;i<this.pieceArray.length;i++){var p=this.pieceArray[i];var colorKey=this.sideSequence.charAt(p.idx<16?0:1);var imgSrc="imgs/"+p.title+"_"+colorKey+".gif";html+=this.RenderPieceImg(p.idx,imgSrc)}
document.getElementById("piecesDiv").innerHTML=html};ChessGame.prototype.RenderPieceImg=function(pieceIdx,imgSrc){return "<img id=\"pieceImg-"+pieceIdx+"\" src=\""+imgSrc+"\" style=\"position:absolute; left:0px; top:0px;\""+" draggable=\"true\""+" onclick=\"PieceClicked(event,"+pieceIdx+")\""+" ondragstart=\"StartDragEvent(event,"+pieceIdx+")\""+" ondragover=\"DragOverPieceEvent(event,"+pieceIdx+")\""+" ondrop=\"DropPieceOnPiece(event,"+pieceIdx+")\""+" onmouseover=\"MouseOverPiece("+pieceIdx+")\""+" onmouseout=\"MouseOutPiece("+pieceIdx+")\""+"/>"};ChessGame.prototype.PositionAllPieces=function(){for(var i=0;i<this.pieceArray.length;i++){var p=this.pieceArray[i];p.SetImageObject();p.SetImagePosition()}};ChessGame.prototype.FindPiece=function(pieceIdx){for(var i=0;i<this.pieceArray.length;i++){var p=this.pieceArray[i];if(p.idx==pieceIdx){return p}}
return null};ChessGame.prototype.GetPieceOnCell=function(cellIdxToCheck){for(var i=0;i<this.pieceArray.length;i++){var p=this.pieceArray[i];if(p.isCaptured){continue}
var cIdx=XyToIdx(p.x,p.y);if(cIdx==cellIdxToCheck){return p}}
return null};ChessGame.prototype.HighlightPieceMoves=function(pieceIdx){if(this.gameOver||!this.userInControl){return}
var moveList=this.boardMgr.GetPieceMoveArray(pieceIdx);for(var i=0;i<moveList.length;i++){this.SetHighlighting(moveList[i],!1)}
if(!g_isDevMode){return}
var guardList=this.boardMgr.guardMoves;for(var i=0;i<guardList.length;i++){var move=guardList[i];if(move.pieceToMove.idx!=pieceIdx){continue}
this.SetHighlighting(guardList[i],!0)}};ChessGame.prototype.SetHighlighting=function(move,guardCheck){var placeIdx=XyToIdx(move.x,move.y);var div=document.getElementById("cell-"+placeIdx);if(!div){return}
var color="#80FF80";if(guardCheck){color="#FFFF80"}
else if(move.capture){color="#FF8080"}
div.style.backgroundColor=color};ChessGame.prototype.RemoveAllHighlighting=function(){for(var i=0;i<64;i++){var div=document.getElementById("cell-"+i);if(!div){return}
div.style.backgroundColor=""}};ChessGame.prototype.InitController=function(playerDataStr){this.controller=new ChessPlayer(playerDataStr);this.userInControl=this.controller.playerType=="USER"};ChessGame.prototype.SwitchTurn=function(){this.whoseTurn=this.whoseTurn=="T"?"B":"T";this.InitTurn();if(g_isDevMode){WriteTurnCounter(this.turnCounter);g_debugInfoTxt="50 Move counter: "+this.fiftyMoveRuleCounter+"<br />"+g_debugInfoTxt;WriteDebugInfo()}};ChessGame.prototype.InitTurn=function(){g_game.awaitingRemoteCall=!1;if(this.whoseTurn=="T"){this.currentTurnSide=this.topSide;this.otherSide=this.botSide}
else{this.currentTurnSide=this.botSide;this.otherSide=this.topSide}
this.ReinitGameBoardManager();this.boardMgr.InitAllMovesArray(this.whoseTurn);this.CheckSetCheck();var cbm=this.CreateBoardManagerFromCurrentGame();if(cbm.DoAllMovesResultInCheck(this.whoseTurn)){var key="STALE-MATE";if(this.currentTurnSide.isInCheck){this.winningSide=this.otherSide;key="CHECK-MATE"}
this.gameOver=!0;DrawBothSidePanels();setTimeout("ShowEndGameMessage('"+key+"')",300);return}
DrawBothSidePanels()};ChessGame.prototype.CallLocalComputerAiTurn=function(){var ctrl=this.controller;var ai=new AiEngine(BuildBoardStateString(this.pieceArray,this.currentEnPassant),this.whoseTurn,this.fiftyMoveRuleCounter);var moveStr=ai.MakeMove(ctrl.aiVersionKey);var move=new PlayerMove("V3",moveStr);g_debugInfoTxt+=ai.debugTxt;if(move.status!="OK"){alert("Move parse produced an unexpected state: "+move.status);ToggleAiPause();return}
if(move.cmd==""){alert("The AI failed to make a move.");ToggleAiPause();return}
if(move.cmd=="CLAIM-STALEMATE"){if(this.fiftyMoveRuleCounter>=50){this.gameOver=!0;DrawBothSidePanels();setTimeout("ShowEndGameMessage('50-MOVE-STALE-MATE')",300)}
else{alert("The AI called fifty move stalemate, but it is not valid.");ToggleAiPause()}
return}
if(move.cmd!="MOVE"){alert("AI command not supported: "+move.cmd);ToggleAiPause();return}
var fromCellIdx=XyToIdx(move.startX,move.startY);var cellIdx=XyToIdx(move.endX,move.endY);var pieceToMove=this.GetPieceOnCell(fromCellIdx);if(!pieceToMove){alert("API Error: No piece at location to move ("+move.startX+","+move.startY+")");return}
var pieceIdx=pieceToMove.idx;this.boardMgr.InitAllMovesArray(this.whoseTurn);if(!this.boardMgr.IsMoveAllowed(pieceIdx,cellIdx)){alert("API Error: Move not allowed ("+move.endX+","+move.endY+")");return}
this.GameMove(pieceIdx,cellIdx);this.CheckForPawnPromotion(pieceIdx,move.pawnPromoteKey);this.SwitchTurn()};ChessGame.prototype.BattleRat_ApiCall=function(){if(g_game.awaitingRemoteCall){return}
var bs=BuildBoardStateString(this.pieceArray,this.currentEnPassant);BattleRatApi_GetMove(bs,this.whoseTurn,this.controller.aiVersionKey);g_game.awaitingRemoteCall=!0};ChessGame.prototype.BattleRatPieceMove=function(move){if(this.gameOver){return}
if(this.controller.moveSrc!="BRAPI"){return}
if(g_debugMode){WriteApiTestInfo("API results: "+move.inputMoveStr)}
var startCellIdx=XyToIdx(move.startX,move.startY);var destCellIdx=XyToIdx(move.endX,move.endY);var pieceToMove=this.GetPieceOnCell(startCellIdx);if(pieceToMove==null){alert("API Error: Piece not at starting location ("+move.inputMoveStr+")");return}
this.boardMgr.InitAllMovesArray(this.whoseTurn);if(!this.boardMgr.IsMoveAllowed(pieceToMove.idx,destCellIdx)){alert("API Error: Move not allowed ("+move.inputMoveStr+")");return}
this.GameMove(pieceToMove.idx,destCellIdx);this.CheckForPawnPromotion(pieceToMove.idx,move.pawnPromoteKey);this.SwitchTurn()};ChessGame.prototype.PieceClicked=function(pieceIdx){if(this.gameOver||!this.userInControl){return}
var piece=this.pieceArray[pieceIdx];var cellIdx=XyToIdx(piece.x,piece.y);this.CellClicked(cellIdx)};ChessGame.prototype.CellClicked=function(cellIdx){if(this.gameOver||!this.userInControl){return}
var pieceOnCell=this.GetPieceOnCell(cellIdx);if(this.selectedCellIdx!=-1){var pieceToMove=this.GetPieceOnCell(this.selectedCellIdx);if(pieceToMove==null){alert("Problem with piece move!!");this.SetCellSelection(!1,null);return}
if(pieceOnCell!=null&&pieceToMove.side.sideKey==pieceOnCell.side.sideKey){this.SetCellSelection(!1,this.selectedCellIdx);this.SetCellSelection(!0,cellIdx);return}
this.SetCellSelection(!1,null);this.GameMove(pieceToMove.idx,cellIdx);if(this.CheckForPawnPromotion(pieceToMove.idx,"")){return}
this.SwitchTurn();return}
if(pieceOnCell.side.sideKey!=this.whoseTurn){return}
this.SetCellSelection(!0,cellIdx)};ChessGame.prototype.SetCellSelection=function(selState,cellIdx){var div=document.getElementById("selPieceDiv");if(selState){var cell=new IdxToXy(cellIdx);var cellSize=GameSettings.cellSize;var size=cellSize-20;div.style.left=""+(cell.x*cellSize)+"px";div.style.top=""+(cell.y*cellSize)+"px";div.style.width=""+size+"px";div.style.height=""+(size+1)+"px";div.style.display="block";this.selectedCellIdx=cellIdx}
else{div.style.display="none";this.selectedCellIdx=-1}};ChessGame.prototype.StartPieceDrag=function(evt,pieceIdx){if(this.gameOver||!this.userInControl){return}
this.RemoveAllHighlighting();var piece=this.pieceArray[pieceIdx];if(piece.side.sideKey!=this.whoseTurn){return}
var moveList=this.boardMgr.GetPieceMoveArray(pieceIdx);this.currentDrag=new PieceDrag(piece,moveList);evt.dataTransfer.setData("text",pieceIdx)};ChessGame.prototype.CheckAllowPieceDropOnPiece=function(evt,pieceIdx){if(!this.currentDrag){return}
if(this.currentDrag.piece.idx==pieceIdx){return}
var piece=this.pieceArray[pieceIdx];if(piece.side.sideKey==this.whoseTurn){return}
var cellIdx=XyToIdx(piece.x,piece.y);this.CheckAllowPieceDropOnCell(evt,cellIdx)};ChessGame.prototype.CheckAllowPieceDropOnCell=function(evt,cellIdx){if(!this.currentDrag){return}
var cell=this.currentDrag.CheckForPlace(cellIdx);if(!cell){return}
evt.preventDefault()};ChessGame.prototype.DropPieceOnPiece=function(evt,pieceIdx){if(!this.currentDrag){return}
if(this.currentDrag.piece.idx==pieceIdx){return}
var piece=this.pieceArray[pieceIdx];if(piece.side.sideKey==this.whoseTurn){return}
var cellIdx=XyToIdx(piece.x,piece.y);this.DropPieceOnCell(evt,cellIdx)};ChessGame.prototype.DropPieceOnCell=function(evt,cellIdx){evt.preventDefault();var pieceIdx=evt.dataTransfer.getData("text");var cell=this.currentDrag.CheckForPlace(cellIdx);if(!cell){return!1}
if(!this.GameMove(pieceIdx,cellIdx)){return}
if(this.CheckForPawnPromotion(pieceIdx,"")){return}
this.FinishMove()};ChessGame.prototype.FinishMove=function(){this.currentDrag=null;this.SwitchTurn()};ChessGame.prototype.GameMove=function(pieceIdx,cellIdx){var moveList=this.boardMgr.GetPieceMoveArray(pieceIdx);var cell=null;for(var i=0;i<moveList.length;i++){var move=moveList[i];if(move.cellIdx==cellIdx){cell=move}}
var pieceToCapture=null;var epCapPawnX=-1;var epCapPawnY=-1;if(cell.capture){if(this.currentEnPassant&&this.currentEnPassant.cellIdx==cellIdx){pieceToCapture=this.pieceArray[this.currentEnPassant.pieceIdx];epCapPawnX=pieceToCapture.x;epCapPawnY=pieceToCapture.y}
else{var pieceOnCell=this.GetPieceOnCell(cellIdx);if(pieceOnCell!=null&&pieceOnCell.side.sideKey!=this.currentTurnSide.sideKey){pieceToCapture=pieceOnCell}}}
var boardMgr=this.CreateBoardManagerFromCurrentGame();if(boardMgr.WillLeaveInCheck(pieceIdx,cellIdx,pieceToCapture?pieceToCapture.idx:-1)){if(this.userInControl){g_modalAllowsEsc=!0;InitOkModalBox("Move not allowed.<br /><br />This move would leave your king in check!",400,"FFD060")}
return!1}
if(pieceToCapture){pieceToCapture.SetToCaptured();DrawBothSidePanels()}
this.currentEnPassant=CheckForEnPassantInit(pieceIdx,cellIdx,this.pieceArray);var piece=this.FindPiece(pieceIdx);if(pieceToCapture!=null||piece.key=="P"){this.fiftyMoveRuleCounter=0}
else{this.fiftyMoveRuleCounter+=.5}
this.moveLogger.LogMove(pieceIdx,cellIdx,"-");this.MoveAPiece(pieceIdx,cellIdx);if(epCapPawnX>-1){this.moveLogger.LogEnPassantCapture(epCapPawnX,epCapPawnY)}
var cr=cell.castlingRange;if(cr&&cr.castleAllowed){this.moveLogger.LogCastlingRookMove(cr.rookPiece.idx,cr.p1.cellIdx);this.MoveAPiece(cr.rookPiece.idx,cr.p1.cellIdx)}
this.turnCounter++;return!0};ChessGame.prototype.MoveAPiece=function(pieceIdx,cellIdx){var pos=new IdxToXy(cellIdx);var piece=this.pieceArray[pieceIdx];if(piece.x==pos.x&&piece.y==pos.y){return}
piece.Move(pos.x,pos.y);piece.hasMoved=!0};ChessGame.prototype.CheckSetCheck=function(){var side=this.currentTurnSide;side.isInCheck=this.boardMgr.IsInCheck(side.sideKey,side.GetKingIdx());this.otherSide.isInCheck=!1};ChessGame.prototype.CheckForPawnPromotion=function(pieceIdx,aiPromoteKey){var piece=this.FindPiece(pieceIdx);if(piece.key!="P"){return!1}
if(piece.side.pawnPromoteY!=piece.y){return!1}
if(this.userInControl){this.currentPawnToPromote=piece;this.SelectPawnPromotionPiece(piece.colorKey)}
else{this.moveLogger.LogPawnPromotion(piece.idx,aiPromoteKey);piece.PromoteTo(aiPromoteKey,this.sideSequence)}
return!0};ChessGame.prototype.SelectPawnPromotionPiece=function(colorKey){var html="Congratulations! A pawn is being promoted!<br /><br />";html+="Please select the promotion piece.<br /><br />";html+="<table style=\"width:100%;\"><tr>";html+=this.DrawPromoImg("Q","Queen",colorKey);html+=this.DrawPromoImg("R","Rook",colorKey);html+=this.DrawPromoImg("B","Bishop",colorKey);html+=this.DrawPromoImg("K","Knight",colorKey);html+="</tr></table>";g_modalAllowsEsc=!1;InitModalBox(html,400,"B0FFB0")};ChessGame.prototype.DrawPromoImg=function(promoteKey,title,colorKey){return "<td><a href=\"#\" onclick=\"g_game.PromotePawn('"+promoteKey+"');return false;\">"+"<img src=\"imgs/"+title+"_"+colorKey+".gif\" /></a></td>"};ChessGame.prototype.PromotePawn=function(promoteKey){HideModal();this.moveLogger.LogPawnPromotion(this.currentPawnToPromote.idx,promoteKey);this.currentPawnToPromote.PromoteTo(promoteKey,this.sideSequence);this.currentPawnToPromote=null;this.FinishMove()};ChessGame.prototype.ShowEndGameMessage=function(endKey){if(endKey=="CHECK-MATE"){g_modalAllowsEsc=!0;InitOkModalBox("CHECKMATE!!!<br /><br />"+this.winningSide.title+" wins!",400,"C0FFC0")}
if(endKey=="STALE-MATE"){g_modalAllowsEsc=!0;InitOkModalBox("STALEMATE! - Neither side wins.<br /><br />",400,"FFD060")}
if(endKey=="50-MOVE-STALE-MATE"){g_modalAllowsEsc=!0;InitOkModalBox("STALEMATE!<br /><br />No capture or pawn moved for 50 moves.<br /><br />"+this.currentTurnSide.title+" chose stalemate.<br /><br />",400,"FFD060")}
WriteGameOverMsg(this.winningSide)};return ChessGame}());var PieceDrag=(function(){function PieceDrag(piece,movesList){this.piece=piece;this.movesList=movesList}
PieceDrag.prototype.CheckForPlace=function(cellIdx){for(var i=0;i<this.movesList.length;i++){var cell=this.movesList[i];if(cell.cellIdx==cellIdx){return cell}}
return null};return PieceDrag}());var ChessPlayer=(function(){function ChessPlayer(playerDataStr){var dataArr=playerDataStr.split("-");this.playerType=dataArr[0];this.moveSrc=dataArr[1];this.aiVersionKey=dataArr[2]}
return ChessPlayer}());var PlayerMove=(function(){function PlayerMove(formatKey,inputMoveStr){this.status="OK";this.cmd="";this.inputMoveStr=inputMoveStr;switch(formatKey){case "V1":this.ParseVersion1(inputMoveStr);break;case "V2":this.ParseVersion2(inputMoveStr);break;case "V3":this.ParseVersion3(inputMoveStr);break}}
PlayerMove.prototype.ParseVersion1=function(moveStr){this.cmd="MOVE";this.startX=parseInt(moveStr.substr(0,1),10);this.startY=parseInt(moveStr.substr(1,1),10);this.endX=parseInt(moveStr.substr(2,1),10);this.endY=parseInt(moveStr.substr(3,1),10);this.pawnPromoteKey=moveStr.substr(4,1)};PlayerMove.prototype.ParseVersion2=function(moveStr){this.cmd="MOVE";var partArray=moveStr.split("|");this.startX=parseInt(partArray[0],10);this.startY=parseInt(partArray[1],10);this.endX=parseInt(partArray[2],10);this.endY=parseInt(partArray[3],10);this.pawnPromoteKey=partArray[4]};PlayerMove.prototype.ParseVersion3=function(moveStr){try{var moveIn=JSON.parse(moveStr);this.cmd=moveIn.cmd;this.startX=moveIn.startX;this.startY=moveIn.startY;this.endX=moveIn.endX;this.endY=moveIn.endY;this.pawnPromoteKey=moveIn.pawnPromotionKey}
catch(e){this.status="Move results parse error.  MoveStr:"+moveStr}};return PlayerMove}());var GameMoveLogger=(function(){function GameMoveLogger(game){this.moveArray=[];this.game=game}
GameMoveLogger.prototype.LogMove=function(pieceIdx,cellIdx,pawnPromoKey){var moveStr=this.GetMoveStr(pieceIdx,cellIdx,pawnPromoKey);this.moveArray.push(moveStr)};GameMoveLogger.prototype.LogCastlingRookMove=function(pieceIdx,cellIdx){var moveStr=this.GetMoveStr(pieceIdx,cellIdx,"");this.moveArray.push("CASTLING-ROOK:"+moveStr)};GameMoveLogger.prototype.LogPawnPromotion=function(pieceIdx,pawnPromoKey){var piece=this.game.pieceArray[pieceIdx];this.moveArray.push("PROMOTE-PAWN:"+piece.x+piece.y+pawnPromoKey)};GameMoveLogger.prototype.LogEnPassantCapture=function(epCapPawnX,epCapPawnY){this.moveArray.push("En-PASSANT-PAWN-CAP:"+epCapPawnX+epCapPawnY)};GameMoveLogger.prototype.GetMoveStr=function(pieceIdx,cellIdx,pawnPromoKey){var endPos=new IdxToXy(cellIdx);var piece=this.game.pieceArray[pieceIdx];if(piece.x==endPos.x&&piece.y==endPos.y){return ""}
return ""+piece.x+piece.y+endPos.x+endPos.y+pawnPromoKey};return GameMoveLogger}());function AddSelectOptionGroup(ctrl,groupLabel){var optArr=ctrl.options;var group=document.createElement("OPTGROUP");group.label=groupLabel;ctrl.appendChild(group);return group}
function AddSelectOption(ctrl,val,txt,selOptVal){var optArr=ctrl.options;var opt=new Option(txt,val);opt.selected=val==selOptVal;optArr[optArr.length]=opt}
function AddOptionToSelectGroup(group,val,txt,selOptVal){var opt=new Option(txt,val);opt.selected=val==selOptVal;group.appendChild(opt)}
function InitDebugState(){g_debugMode=localStorage.getItem("chessDebugMode")=="Y";g_isDevMode=window.location.hostname=="localhost";document.getElementById("debugBtn").style.display=g_isDevMode?"inline":"none"}
function SetDebugMode(){var cb=document.getElementById("debugModeCb");if(!cb){return}
g_debugMode=cb.checked;localStorage.setItem("chessDebugMode",g_debugMode?"Y":"N")}
function ChooseSetTestCase(){}
function SetATestCases(testKey){switch(testKey){case "ALL-PIECES-CAPTURED":for(var i=0;i<32;i++){g_game.pieceArray[i].SetToCaptured()}
break;case "TOP-ALL-CAP-BUT-KING":for(var i=0;i<16;i++){if(i==4){continue}
g_game.pieceArray[i].SetToCaptured()}
break;case "TOP-KING-IN-CHECK":g_game.pieceArray[2].Move(1,3);g_game.pieceArray[21].Move(5,5);g_game.pieceArray[11].Move(3,2);break;case "TOP-KING-ONE-MOVE":SetATestCases("TOP-ALL-CAP-BUT-KING");g_game.pieceArray[4].Move(4,1);g_game.pieceArray[16].Move(0,0);g_game.pieceArray[19].Move(2,2);break;case "PAWN-PROMOTION":g_game.pieceArray[0].SetToCaptured();g_game.pieceArray[1].SetToCaptured();g_game.pieceArray[2].SetToCaptured();g_game.pieceArray[3].SetToCaptured();g_game.pieceArray[4].SetToCaptured();g_game.pieceArray[5].SetToCaptured();g_game.pieceArray[6].SetToCaptured();g_game.pieceArray[7].SetToCaptured();g_game.pieceArray[10].SetToCaptured();g_game.pieceArray[16].SetToCaptured();g_game.pieceArray[24].SetToCaptured();g_game.pieceArray[8].Move(0,6);g_game.pieceArray[26].Move(2,1);break;case "TOP-SIDE-CHECK-MATE":g_game.pieceArray[12].SetToCaptured();g_game.pieceArray[14].SetToCaptured();g_game.pieceArray[6].Move(4,1);g_game.pieceArray[22].Move(6,4);break;case "ENPASSANT-CHECK":g_game.pieceArray[11].Move(3,4);break;case "TOP-ENPASSANT-WOULD-CAUSE-KING-CHECK":for(var i=0;i<16;i++){if(i==4||i==11){continue}
g_game.pieceArray[i].SetToCaptured()}
g_game.pieceArray[4].Move(3,1);g_game.pieceArray[11].Move(3,4);g_game.pieceArray[16].Move(0,0);g_game.pieceArray[19].Move(1,2);g_game.pieceArray[18].Move(0,5);g_game.pieceArray[23].Move(3,5);break;case "TOP-COMPUTER-ENPASSANT-CHECK":for(var i=0;i<16;i++){if(i==11){continue}
g_game.pieceArray[i].SetToCaptured()}
break;case "STALEMATE-COMPUTER":for(var i=0;i<16;i++){if(i==4){continue}
g_game.pieceArray[i].SetToCaptured()}
g_game.pieceArray[18].Move(1,4);g_game.pieceArray[19].Move(1,1);break;case "BOT-PAWNS-ON-3":for(var i=26;i<32;i++){var p=g_game.pieceArray[i];p.Move(p.x,p.y-3)}
break;case "BAD-TRADE-SETUP":CaptureAllBut("3,4,6,11,12,13,19,20");g_game.pieceArray[6].Move(4,2);g_game.pieceArray[19].Move(4,6);break}}
function CaptureAllBut(keepIdxStr){var idxArr=keepIdxStr.split(",");for(var i=0;i<32;i++){var keep=!1;for(var j=0;j<idxArr.length;j++){if(i==parseInt(idxArr[j],10)){keep=!0;break}}
if(keep){continue}
g_game.pieceArray[i].SetToCaptured()}}
function ClearAllTestInfo(){document.getElementById("testInfoDiv").innerHTML="";document.getElementById("apiTestInfoDiv").innerHTML=""}
function WriteTurnCounter(count){document.getElementById("turnCounterDiv").innerHTML="Moves: "+count}
function WriteDebugInfo(){document.getElementById("debugInfoDiv").innerHTML=g_debugInfoTxt;g_debugInfoTxt=""}
function WriteTestInfo(html){document.getElementById("testInfoDiv").innerHTML=html}
function WriteApiTestInfo(html){document.getElementById("apiTestInfoDiv").innerHTML=html}
var g_isDebugPanelOpen=!1;function RenderDebugCtrlPanel(){var html="";html+="<div class=\"stdPanel\" style=\"position:absolute; "+"left:10px; top:10px; width:600px; height:585px; padding:5px; "+"\">";var moveArr=g_game.moveLogger.moveArray;html+="Move List<br />";html+="<div class=\"stdPanel\" style=\"width:300px; height:500px; overflow:auto;\">";for(var i=0;i<moveArr.length;i++){var moveStr=moveArr[i];html+=moveStr+"<br />"}
html+="</div>";html+="</div>";document.getElementById("debugCtrlPanelDiv").innerHTML=html}
function ToggleDebugPanel(){ShowHideDebugPanel(!g_isDebugPanelOpen)}
function ShowHideDebugPanel(showHide){g_isDebugPanelOpen=showHide;document.getElementById("debugCtrlPanelDiv").style.display=showHide?"block":"none";if(showHide){RenderDebugCtrlPanel()}}
var GameSettings=(function(){function GameSettings(){}
GameSettings.GetPieceColorKey=function(pieceIdx,sideSequence){return sideSequence.charAt(pieceIdx<16?0:1)};return GameSettings}());GameSettings.gridSize=8;GameSettings.maxCoorIdx=7;GameSettings.cellSize=72;GameSettings.pieceXOffset=10;GameSettings.pieceYOffset=7;GameSettings.initialBoardStateStr="RB00---KB10---BB20---QB30---XB40---BB50---KB60---RB70---"+"PB01---PB11---PB21---PB31---PB41---PB51---PB61---PB71---"+"RW07---KW17---BW27---QW37---XW47---BW57---KW67---RW77---"+"PW06---PW16---PW26---PW36---PW46---PW56---PW66---PW76---";GameSettings.TopKingIdx=4;GameSettings.BotKingIdx=20;GameSettings.BattleRatMoveResultFormatKey="V3";var GameSide=(function(){function GameSide(sideKey,dirY,title){this.sideKey=sideKey;this.dirY=dirY;this.title=title;this.isInCheck=!1;this.pawnPromoteY=dirY==1?7:0}
GameSide.prototype.GetKingIdx=function(){if(this.sideKey=="T"){return GameSettings.TopKingIdx}
return GameSettings.BotKingIdx};GameSide.prototype.GetOtherSideKey=function(){if(this.sideKey=="T"){return "B"}
return "T"};return GameSide}());var GamePiece=(function(){function GamePiece(pieceIdx,key,title,colorKey,side){this.img=null;this.idx=pieceIdx;this.colorKey=colorKey;this.key=key;this.title=title;this.side=side}
GamePiece.prototype.SetImageObject=function(){this.img=document.getElementById("pieceImg-"+this.idx)};GamePiece.prototype.SetImagePosition=function(){var x=this.x*GameSettings.cellSize+GameSettings.pieceXOffset;var y=this.y*GameSettings.cellSize+GameSettings.pieceYOffset;this.img.style.left=x+"px";this.img.style.top=y+"px"};GamePiece.prototype.Move=function(gridX,gridY){if(!this.img){return}
if(gridX<0||gridX>=GameSettings.gridSize||gridY<0||gridY>=GameSettings.gridSize){return}
var x=gridX*GameSettings.cellSize+GameSettings.pieceXOffset;var y=gridY*GameSettings.cellSize+GameSettings.pieceYOffset;if(this.img){this.img.style.left=x+"px";this.img.style.top=y+"px"}
this.x=gridX;this.y=gridY};GamePiece.prototype.PromoteTo=function(promoteKey,sideSequence){var title="Queen";switch(promoteKey){case "Q":title="Queen";break;case "R":title="Rook";break;case "B":title="Bishop";break;case "K":title="Knight";break}
var pieceColorKey=GameSettings.GetPieceColorKey(this.idx,sideSequence);this.key=promoteKey;this.title=title;this.img.src="imgs/"+this.title+"_"+pieceColorKey+".gif"};GamePiece.prototype.SetToCaptured=function(){this.isCaptured=!0;this.x=9;this.y=9;if(this.img){this.img.style.display="none"}};return GamePiece}());var EnPassant=(function(){function EnPassant(pieceIdx,cellIdx){this.pieceIdx=pieceIdx;this.cellIdx=cellIdx}
return EnPassant}());function CheckForEnPassantInit(pieceIdx,targetCellIdx,pieceArray){var piece=pieceArray[pieceIdx];if(piece.key!="P"||piece.hasMoved){return null}
var xy=new IdxToXy(targetCellIdx);var moveRange=Math.abs(xy.y-piece.y);if(moveRange!=2){return null}
var passedCellIdx=XyToIdx(piece.x,piece.y+piece.side.dirY);return new EnPassant(pieceIdx,passedCellIdx)}
function ParseAndSetBoardState(boardStateStr,pieceArray){var ep=null;var pieceFormatLen=7;for(var i=0;i<32;i++){var pieceFormatStr=boardStateStr.substr(i*pieceFormatLen,pieceFormatLen);var piece=pieceArray[i];var key=pieceFormatStr.substr(0,1);piece.key=key;piece.title=GetPieceTitle(key);piece.colorKey=pieceFormatStr.substr(1,1);piece.x=parseInt(pieceFormatStr.substr(2,1),10);piece.y=parseInt(pieceFormatStr.substr(3,1),10);piece.hasMoved=pieceFormatStr.substr(4,1)=="M";piece.isCaptured=pieceFormatStr.substr(5,1)=="C";if(pieceFormatStr.substr(6,1)=="E"){var dirY=piece.side.dirY;if(dirY>0&&piece.y==3||dirY<0&&piece.y==4){var epCellIdx=XyToIdx(piece.x,piece.y-dirY);ep=new EnPassant(i,epCellIdx)}}}
return ep}
function GetPieceTitle(key){switch(key){case "P":return "Pawn";case "R":return "Rook";case "K":return "Knight";case "B":return "Bishop";case "Q":return "Queen";case "X":return "King"}
return ""}
function BuildBoardStateString(pieceArray,enPassant){var str="";for(var i=0;i<pieceArray.length;i++){var piece=pieceArray[i];var ep="-";if(enPassant&&piece.idx==enPassant.pieceIdx){ep="E"}
str+=piece.key;str+=piece.colorKey;str+=piece.x;str+=piece.y;str+=piece.hasMoved?"M":"-";str+=piece.isCaptured?"C":"-";str+=ep}
return str}
var IdxToXy=(function(){function IdxToXy(cellIdx){this.y=Math.floor(cellIdx/GameSettings.gridSize);this.x=cellIdx-this.y*GameSettings.gridSize}
return IdxToXy}());function XyToIdx(x,y){return GameSettings.gridSize*y+x}
function OpenMenu(){RenderMenu();ShowMenu(!0)}
function RenderMenu(){var html="<div class=\"menuBoxDiv\" "+"style=\"width:200px; background-color:#FFFFFF;\">";html+="Options<br />";html+="<div style=\"height:10px;\"></div>";html+=WriteMenuCheckbox("useDragDropModeCb","Use Drag/Drop to Move","SetDragDropMode()",g_dragDropToMove);html+="<div style=\"height:10px;\"></div>";html+=WriteMenuCheckbox("useBattleRatApiCb","Use Battle Rat AI","SetBattleRatAiUse()",g_useBattleRatApi);html+="<div style=\"height:10px;\"></div>";html+=WriteMenuCheckbox("debugModeCb","Debug Mode","SetDebugMode()",g_debugMode);html+="<div style=\"height:10px;\"></div>";html+=WriteMenuBtn("Done","ShowMenu(false)",120);html+="</div>";document.getElementById("menuBoxDiv").innerHTML=html}
function WriteMenuBtn(text,onclick,width){return "<input type=\"button\" value=\""+text+"\" "+"onclick=\""+onclick+"\" style=\"width:"+width+"px;\" />"}
function WriteMenuCheckbox(id,text,onclick,checkState){var checkedTxt="";if(checkState){checkedTxt="checked=\"checked\""}
return "<input id=\""+id+"\" type=\"checkbox\" onclick=\""+onclick+"\" "+checkedTxt+" />"+"<label for=\""+id+"\">"+text+"</label>"}
function ShowMenu(showHide){document.getElementById("menuBoxDiv").style.height=showHide?"100%":"0%"}
function InitOkModalBox(msg,width,bgColor){var html="<div class=\"modalBoxDiv\" "+"style=\"width:"+width+"px; background-color:#"+bgColor+";\">";html+=msg;html+="<br /><br />";html+="<input type=\"button\" value=\"OK\" "+"style=\"width:70px;\" onclick=\"HideModal()\" />";html+="</div>";var div=document.getElementById("modalBoxDiv");div.innerHTML=html;div.style.height="100%"}
function InitModalBox(content,width,bgColor){var html="<div class=\"modalBoxDiv\" "+"style=\"width:"+width+"px; background-color:#"+bgColor+";\">";html+=content;html+="</div>";var div=document.getElementById("modalBoxDiv");div.innerHTML=html;div.style.height="100%"}
function HideModal(){document.getElementById("modalBoxDiv").style.height=""+0}
var UriParameters=(function(){function UriParameters(fullUrl){this.paramNameArray=[];this.paramValueArray=[];if(fullUrl.indexOf("?")>0){var paramArray=(fullUrl.split("?")[1]).split("&");for(var i=0;i<paramArray.length;i++){var param=paramArray[i].split("=");this.paramNameArray.push(param[0]);this.paramValueArray.push(decodeURIComponent(param[1]))}}}
UriParameters.prototype.GetValue=function(paramName,defaultVal){for(var i=0;i<this.paramNameArray.length;i++){var name=this.paramNameArray[i];if(name==paramName){return this.paramValueArray[i]}}
return defaultVal};UriParameters.prototype.GetValueInt=function(paramName,defaultVal){var val=this.GetValue(paramName,null);if(val==null){return defaultVal}
try{return parseInt(val,10)}
catch(e){}
return defaultVal};return UriParameters}());var RandomGen=(function(){function RandomGen(){this.seed=Math.floor(Math.random()*1000)}
RandomGen.prototype.Next=function(){this.seed=(this.seed*9301+49297)%233280;return this.seed/233280};RandomGen.prototype.NextInt=function(min,max){min=min||0;max=max||1;this.seed=(this.seed*9301+49297)%233280;var rnd=this.seed/233280;var val=Math.round(min+rnd*(max-min));if(val<min){return min}
if(val>max){return max}
return val};return RandomGen}());function Base64ToInt(ch){var i=ch.charCodeAt(0);if(i>=65&&i<=90){return i-65}
if(i>=97&&i<=122){return i-71}
if(i>=48&&i<=57){return i+5}
if(i==43){return 62}
if(i==47){return 63}
return 0}
function ClipValue(value,min,max){if(value<min){return min}
if(value>max){return max}
return value}
function RatioToPercent(val){return ""+Math.round(val*100)}
function InitControllerDropDowns(){InitAController(document.getElementById("topPlayerDd"));InitAController(document.getElementById("botPlayerDd"))}
function InitAController(dd){var group=AddSelectOptionGroup(dd,"Local UI");AddSelectOption(dd,"USER-LOCAL-0","User","");group=AddSelectOptionGroup(dd,"Local Computer AIs");AddOptionToSelectGroup(group,"COMP-LOCAL-0","Suicidal","");AddOptionToSelectGroup(group,"COMP-LOCAL-1","Dumb","");AddOptionToSelectGroup(group,"COMP-LOCAL-2","Dumb, Aggressive","");AddOptionToSelectGroup(group,"COMP-LOCAL-3","Basic 1","");AddOptionToSelectGroup(group,"COMP-LOCAL-EXP","* Experimental *","")}
function AddBattleRatAisToControllerDds(xmlhttp,cmd,context){var txt=xmlhttp.responseText;if(txt==""){alert("Could not init BattleRat AIs: blank response from API.");return}
var aiArr=txt.split(",");var tDd=document.getElementById("topPlayerDd");var bDd=document.getElementById("botPlayerDd");var topGroup=AddSelectOptionGroup(tDd,"BattleRat AIs");var botGroup=AddSelectOptionGroup(bDd,"BattleRat AIs");for(var i=0;i<aiArr.length;i++){var aiTxt=aiArr[i];var aiTxtArr=aiTxt.split(":");var key=aiTxtArr[0].replace("-","");var name=aiTxtArr[1];AddOptionToSelectGroup(topGroup,"COMP-BRAPI-"+key,name,"");AddOptionToSelectGroup(botGroup,"COMP-BRAPI-"+key,name,"")}}
function DrawBothSidePanels(){DrawSidePanel("T");DrawSidePanel("B")}
function DrawSidePanel(sideKey){var side=g_game.topSide.sideKey==sideKey?g_game.topSide:g_game.botSide;var isThisPlayersTurn=g_game.whoseTurn==sideKey;var setXOffset=2;var setYOffset=16;var cellSize=25;var pieceSize=23;var pieceOffset=24;var html="<table class=\"playerPanelTbl\" style=\"width:202px; height:30px;\" cellspacing=\"0\">";html+="<tr><th style=\"\">"+side.title+"<th></tr>";html+="</table>";html+="<div style=\"position:relative; left:0px; top:0px; width:200px; height:70px;\">";html+="&nbsp;Captures";var xi=0,yi=0;for(var i=0;i<g_game.pieceArray.length;i++){var piece=g_game.pieceArray[i];if(piece.side.sideKey==sideKey){continue}
var x=xi*pieceOffset+setXOffset;var y=yi*pieceOffset+setYOffset;html+="<div class=\"captureCell\" "+"style=\"position:absolute; left:"+x+"px; top:"+y+"px; "+"width:"+cellSize+"px; height:"+cellSize+"px;\">";if(piece.isCaptured){html+=WriteCapturedPieceImg(piece,x,y,pieceSize)}
html+="</div>";xi++;if(xi>=8){xi=0;yi++}}
html+="</div>";if(isThisPlayersTurn&&!g_game.gameOver){html+="<div class=\"playerTurnTag\" "+"style=\"position:relative; left:1px; top:0px; width:189px; padding:5px;\">It is "+side.title+"'s turn.</div>"}
if(side.isInCheck&&!g_game.gameOver){html+="<div class=\"playerInCheck\" "+"style=\"position:relative; left:1px; top:0px; width:189px; padding:5px;\">"+side.title+" is in check!!</div>"}
document.getElementById("sidePanelDiv_"+sideKey).innerHTML=html}
function WriteCapturedPieceImg(piece,x,y,pieceSize){var colorKey=GameSettings.GetPieceColorKey(piece.idx,g_game.sideSequence);var imgPath="imgs/"+piece.title+"_"+colorKey+".gif";return "<img class=\"smallPieceImg\" src=\""+imgPath+"\" "+"style=\"position:relative; \" "+"width=\""+pieceSize+"\" height=\""+pieceSize+"\""+"/>"}
function WriteGameOverMsg(winningSide){var msg="It was a stalemate.";if(winningSide){msg=winningSide.title+" won."}
var html="Game Over<div style=\"height:8px;\"></div>"+msg;var div=document.getElementById("gameOverPanelDiv");div.innerHTML=html;div.style.display="block"}
function ResetGameOverMsgPanel(){var div=document.getElementById("gameOverPanelDiv");div.innerHTML="";div.style.display="none"}
