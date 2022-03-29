
//*******************************************************
function World(width,height,cellSize,worldDiv,bgGridDiv,statsPanelDiv)
{
	this.width=width;
	this.height=height;
	this.cellSize=cellSize;
	this.worldDiv=worldDiv;
	this.bgGridDiv=bgGridDiv;
	this.statsPanelDiv=statsPanelDiv;
	
	this.fullSizeAge=70; // (when cells reach full size)
	this.deathDuration=40;
	this.worldAge=0;
	this.gameTimeStr="";
	
	// Iteration toggle forward and backward to avoid giving a subtle advantage to
	// the top left of the grid.
	this.forwardIteration=true;
	
	this.Init=World_Init;
	this.RenderBackgroundGrid=World_RenderBackgroundGrid;
	this.Render=World_Render;
	this.RenderStats=World_RenderStats;
	this.PassYear=World_PassYear;
	this.RenderCell=World_RenderCell;
	this.GetX=World_GetX;
	this.GetY=World_GetY;
	this.GetIndex=World_GetIndex;
	this.CheckBoundaries=World_CheckBoundaries;
	this.AddChildEntity=World_AddChildEntity;
	this.AddEntity=World_AddEntity;

	this.Init();
	return this;
}
//*******************************************************
function World_Init()
{
	this.cellCount=this.width*this.height;
	this.entityArray=new Array(this.cellCount);

	for(var i=0;i<this.cellCount;i++)
	{
		this.entityArray[i]=null;
	}

	this.factionArray=[
		{name:"A",color:"E09090",count:0},
		{name:"B",color:"E0E090",count:0},
		{name:"C",color:"90E090",count:0},
		{name:"D",color:"9090E0",count:0}
	];

	// Add some factions
	//-------------------------------------------------
	//this.entityArray[25]=new Entity("A","E09090");
	//this.entityArray[67]=new Entity("A","E09090");
	//this.entityArray[40]=new Entity("B","E0E090");
	//this.entityArray[86]=new Entity("B","E0E090");
	//this.entityArray[309]=new Entity("C","90E090");
	//this.entityArray[355]=new Entity("C","90E090");
	//this.entityArray[328]=new Entity("D","9090E0");
	//this.entityArray[370]=new Entity("D","9090E0");
	//-------------------------------------------------

	//-------------------------------------------------
	this.entityArray[164]=new Entity("A","E09090");
	this.entityArray[185]=new Entity("A","E09090");
	this.entityArray[166]=new Entity("B","E0E090");
	this.entityArray[189]=new Entity("B","E0E090");
	this.entityArray[207]=new Entity("C","90E090");
	this.entityArray[230]=new Entity("C","90E090");
	this.entityArray[211]=new Entity("D","9090E0");
	this.entityArray[232]=new Entity("D","9090E0");
	//-------------------------------------------------
}
//*******************************************************
function World_PassYear(constants)
{
	var i=0;
	if(!this.forwardIteration){i=this.cellCount-1;}

	//for(var i=0;i<this.cellCount;i++)
	while(true)
	{
		if(this.forwardIteration)
		{
			if(i>=this.cellCount){break;}
		}
		else
		{
			if(i<0){break;}
		}
		
		var entity=this.entityArray[i];
		if(entity)
		{
			entity.PassYear(constants);

			// Add new children
			if(entity.queueChild)
			{
				if(this.AddChildEntity(i)) // Returns true if an entity ends up getting added
				{
					entity.children++;
				}
				entity.queueChild=false;
			}
		}

		if(this.forwardIteration){i++;}
		else{i--;}
	}

	// Toggle iteration direction
	this.forwardIteration=!this.forwardIteration;

	this.worldAge++;
}
//*******************************************************
function World_RenderBackgroundGrid()
{
	var html="";
	for(var i=0;i<this.cellCount;i++)
	{
		var x=this.GetX(i);
		var y=this.GetY(i);
		var cellOffset=this.cellSize+1;
		x*=cellOffset;
		y*=cellOffset;

		var attribStr=" onclick=\"CellClicked("+i+");\"";
		
		html+=WriteDiv(x,y,this.cellSize,this.cellSize,"","cell","",attribStr);
	}
	
	this.bgGridDiv.innerHTML=html;
}
//*******************************************************
function World_Render()
{
	var html="";
	for(var i=0;i<this.cellCount;i++)
	{
		html+=this.RenderCell(i);
	}
	
	this.worldDiv.innerHTML=html;

	this.RenderStats();

	//document.getElementById("testTa").innerText=html;
}
//*******************************************************
function World_RenderStats()
{
	var livingEntities=0;
	var deadEntities=0;
	var emptyCells=0;
	var maxAge=0;
	var indexOfOldest=-1;

	// Clear faction counts
	for(var fi=0;fi<this.factionArray.length;fi++)
	{
		this.factionArray[fi].count=0;
	}

	// Run main counts
	for(i=0;i<this.cellCount;i++)
	{
		var entity=this.entityArray[i];
		if(entity)
		{
			if(entity.alive)
			{
				livingEntities++;

				if(entity.age>maxAge)
				{
					maxAge=entity.age;
					indexOfOldest=i;
				}

				for(var fi=0;fi<this.factionArray.length;fi++)
				{
					var faction=this.factionArray[fi];
					if(entity.faction==faction.name){faction.count++;}
				}
			}
			else{deadEntities++;}

			entity.smiley=false;
		}
		else{emptyCells++;}
	}
	if(indexOfOldest>-1)
	{
		this.entityArray[indexOfOldest].smiley=true;
	}

	var html="<div style=\"border:solid 1px #000000; padding:3px;\">";
	html+=""+livingEntities+" : Living Entities<br />";
	html+=""+deadEntities+" : Dead Entities<br />";
	html+=""+emptyCells+" : Empty Cells<br />";
	html+="<br />";

	html+="Faction Counts<br />";
	html+="<table cellspacing=\"0\"><tr>";
	for(var fi=0;fi<this.factionArray.length;fi++)
	{
		var faction=this.factionArray[fi];
		html+="<td style=\"background-color:#"+faction.color+"; "+
			"width:15px; height:15px; padding:3px;\">"+faction.count+"</td>";
	}
	html+="</tr></table>";
	html+="<br />";
	html+="Time: "+this.gameTimeStr+"<br />";
	html+=""+this.worldAge+" : World Age<br />";
	html+=""+maxAge+" : Oldest Entity<br />";
	
	html+="</div>";
	this.statsPanelDiv.innerHTML=html;
}
//*******************************************************
function World_RenderCell(index)
{
	var x=this.GetX(index);
	var y=this.GetY(index);
	var cellOffset=this.cellSize+1;
	x*=cellOffset;
	y*=cellOffset;
	
	var entity=this.entityArray[index];
	var bgColorStr="";
	var cellContent="";
	var html="";

	if(entity)
	{
		if(entity.alive)
		{
			// Calc entity size
			var maxEntitySize=this.cellSize-2;
			var entitySize=entity.age/this.fullSizeAge*maxEntitySize;
			if(entitySize>maxEntitySize){entitySize=maxEntitySize;}

			var xOff=(this.cellSize-entitySize)/2;
			var yOff=xOff;

			var cellContent="";
			//if(entity.age>=this.fullSizeAge){cellContent=""+entity.age;}
			if(entity.smiley){cellContent=":)";}

			bgColorStr=" background-color:#"+entity.cellHue+";";
			html+=WriteDiv(x+xOff,y+yOff,entitySize,entitySize,cellContent,"cell",bgColorStr,"");
		}
		else // (dead)
		{
			if(entity.yearsDead>this.deathDuration)
			{
				this.entityArray[index]=null; // empty out cell
			}
			else // render skull and bones
			{
				html+=RenderImg(x+5,y+5,"SkullNBones25.gif");
			}
		}
	}
	
	return html;
}
//*******************************************************
function World_GetX(index)
{
	var y=this.GetY(index);
	return index-y*this.width;
}
//*******************************************************
function World_GetY(index)
{
	return Math.floor(index/this.width);
}
//*******************************************************
function World_GetIndex(x,y)
{
	return y*this.width+x;
}
//*******************************************************
function World_CheckBoundaries(x,y)
{
	if(x<0 || y<0){return false;}
	if(x>=this.width){return false;}
	if(y>=this.height){return false;}
	return true;
}
//*******************************************************
function World_AddChildEntity(parentIndex)
{
	var px=this.GetX(parentIndex);
	var py=this.GetY(parentIndex);

	var parentEntity=this.entityArray[parentIndex];
	var faction=parentEntity.faction;
	var cellHue=parentEntity.cellHue;
	
	for(var tierIndex=1;tierIndex<2;tierIndex++)
	{
		var tier=new OffsetTier(tierIndex);
		var startIndex=GetRandomInt(0,tier.elementCount-1);
		var os=new Offset(tierIndex,startIndex);
		os.x+=px;
		os.y+=py;
		if(this.AddEntity(os.x,os.y,faction,cellHue)){return true;}
		
		for(var i=1;i<tier.elementCount;i++)
		{
			var index=startIndex+i;
			if(index>=tier.elementCount){index-=tier.elementCount;}

			os=new Offset(tierIndex,index);
			os.x+=px;
			os.y+=py;

			if(this.AddEntity(os.x,os.y,faction,cellHue)){return true;}
		}
	}

	return false;
}
//*******************************************************
function World_AddEntity(x,y,faction,cellHue)
{
	if(!this.CheckBoundaries(x,y)){return false;}
	var index=this.GetIndex(x,y);
	if(this.entityArray[index]!=null){return false;} // this spot is filled
	this.entityArray[index]=new Entity(faction,cellHue);
	return true;
}
//*******************************************************

//*******************************************************
function WriteDiv(x,y,width,height,content,className,styles,divAttribStr)
{
	return "<div class=\""+className+"\" "+
		"style=\"position:absolute; left:"+x+"px; top:"+y+"px; width:"+width+"px; height:"+height+"px;"+
			styles+"\" "+divAttribStr+">"+content+"</div>";
}
//*******************************************************
function RenderImg(x,y,src)
{
	return "<img src=\""+src+"\" "+
		"style=\"position:absolute; left:"+x+"px; top:"+y+"px; border:none;\" />";
}
//*******************************************************
function GetRandomInt(lowest,highest)
{
	var range=highest-lowest;
	return Math.floor(Math.random()*range)+lowest;
}
//*******************************************************