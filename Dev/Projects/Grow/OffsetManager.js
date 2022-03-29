
// Facilitates selecting a position offset another position
// within a short range.

//*******************************************************
function OffsetTier(tierIndex)
{
	this.edgeElementCount=tierIndex*2
	this.elementCount=this.edgeElementCount*4;
	if(this.elementCount==0){this.elementCount=1;}
	return this;
}
//*******************************************************
function Offset(tierIndex,index)
{
	var edgeElementCount=tierIndex*2
	var elementCount=edgeElementCount*4;
	if(elementCount==0){elementCount=1;}
	var side=Math.floor(index/edgeElementCount);
	var indexOnSide=index-side*edgeElementCount

	var x=0;
	var y=0;
	switch(side)
	{
		case 0:
			y=0;
			x=indexOnSide;
			break;
		case 1:
			y=indexOnSide;
			x=edgeElementCount;
			break;
		case 2:
			y=edgeElementCount;
			x=edgeElementCount-indexOnSide;
			break;
		case 3:
			y=edgeElementCount-indexOnSide;
			x=0;
			break;
	}

	// Center over the origin
	x-=tierIndex;
	y-=tierIndex;
	
	this.x=x;
	this.y=y;
	return this;
}
//*******************************************************
// 0 1 2 3 4
// . . . . 5
// . . . . 6
// . . . . 7
// . . . . 8
