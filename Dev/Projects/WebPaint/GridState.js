
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function GridState()
{
	this.cellWidth=20;
	this.cellHeight=20;

	this.gridWidth=30;
	this.gridHeight=30;

	this.maxX=this.gridWidth-1;
	this.maxY=this.gridHeight-1;

	this.cells=[];

	this.Test=function(){var a=0;}
	//********************************************
	this.SetResolution=function(resIdx)
	{
		if(resIdx<1){resIdx=1;}
		if(resIdx>10){resIdx=10;}
		var resVal=11-resIdx;

		var cellSize=resVal*4;
		this.cellWidth=cellSize;
		this.cellHeight=cellSize;

		var gridEdge=Math.floor(600/cellSize);
		this.gridWidth=gridEdge;
		this.gridHeight=gridEdge;

		this.maxX=gridEdge-1;
		this.maxY=gridEdge-1;
	};
	//********************************************
	this.WriteStorageJson=function()
	{
		// Write color list
		var list="";
		for(var i=0; i<this.cells.length; i++)
		{
			var cell=this.cells[i];
			if(list!=""){list+=",";}
			list+="\""+cell.bgColor+"\"";
		}

		var json="{";
		json+="\"cellWidth\":"+this.cellWidth;
		json+=",\"cellHeight\":"+this.cellHeight;
		json+=",\"gridWidth\":"+this.gridWidth;
		json+=",\"gridHeight\":"+this.gridHeight;
		json+=",\"cellColors\":["+list+"]";
		json+="}";
		return json;
	};
	//********************************************
	this.LoadFromJson=function(jsonStr)
	{
		var obj=JSON.parse(jsonStr);

		this.cellWidth=obj.cellWidth;
		this.cellHeight=obj.cellHeight;

		this.gridWidth=obj.gridWidth;
		this.gridHeight=obj.gridHeight;

		this.maxX=this.gridWidth-1;
		this.maxY=this.gridHeight-1;

		this.cells=[];
		for(var i=0; i<obj.cellColors.length; i++)
		{
			var rgb=obj.cellColors[i];
			this.cells.push(new Cell(i,rgb));
		}
	};
	//********************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function Cell(idx,bgColor)
{
	this.idx=idx;
	this.bgColor=bgColor;
	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
