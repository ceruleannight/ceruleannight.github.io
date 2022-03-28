
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function WorldData(width,height,worldRawData)
{
	this.width=width;
	this.height=height;
	this.worldRawData=worldRawData
	this.terrainArray=[]; // World map terrain data

	// cellStateArray contains state info about each cell.
	// Each index contains a bit vector value with state flags
	// Bits
	//   1 : Visited
	//   2 : Visible (Fog of War)
	this.cellStateArray=[];

	// Tracks the last time the player was on this location
	this.lastTurnVisitArray=[];

	this.terrainTypeArray=
	[
		{rgb:"CEAA2C", liteTxt:false, passable:true, temp:70, hunger:3, thirst:3, water:1, food:1, name:"Settlement",  key:"TOWN"},
		{rgb:"0000FF", liteTxt:false, passable:false,temp:65, hunger:3, thirst:3, water:0, food:0, name:"Sea",         key:"SEA"},
		{rgb:"00FF00", liteTxt:false, passable:true, temp:75, hunger:2, thirst:2, water:2, food:4, name:"Prairie",     key:"PRAIRIE"},
		{rgb:"FFFF40", liteTxt:false, passable:true, temp:110,hunger:3, thirst:6, water:1, food:2, name:"Desert",      key:"DESERT"},
		{rgb:"00C000", liteTxt:false, passable:true, temp:70, hunger:3, thirst:3, water:3, food:4, name:"Woodland",    key:"WOODLAND"},
		{rgb:"00A000", liteTxt:true,  passable:true, temp:65, hunger:3, thirst:3, water:3, food:4, name:"Forest",      key:"FOREST"},
		{rgb:"006E00", liteTxt:true,  passable:true, temp:50, hunger:5, thirst:3, water:2, food:4, name:"Deep Forest", key:"DEEP-FOREST"},
		{rgb:"CCFF00", liteTxt:false, passable:true, temp:90, hunger:3, thirst:4, water:2, food:3, name:"Savannas",    key:"SAVANNAS"},
		{rgb:"01FFA2", liteTxt:false, passable:true, temp:90, hunger:3, thirst:3, water:2, food:3, name:"Jungle",      key:"JUNGLE"},
		{rgb:"01B372", liteTxt:false, passable:true, temp:90, hunger:5, thirst:3, water:1, food:3, name:"Thick Jungle",key:"THICK-JUNGLE"},
		{rgb:"9EB101", liteTxt:true,  passable:true, temp:80, hunger:3, thirst:3, water:4, food:3, name:"Swamp",       key:"SWAMP"},
		{rgb:"739F75", liteTxt:true,  passable:true, temp:60, hunger:5, thirst:1, water:1, food:3, name:"Hills",       key:"HILLS"},
		{rgb:"90B9BC", liteTxt:false, passable:true, temp:0,  hunger:6, thirst:3, water:1, food:3, name:"Mountains",   key:"MOUNTAINS"},
		{rgb:"BDC9C9", liteTxt:false, passable:false,temp:0,  hunger:3, thirst:3, water:0, food:0, name:"Impassable Mountains",key:"IMPASSABLE"}
	];

	// ef=encounterFrequency
	// furs=furs obtainable
	this.entityArray=
	[
		{key:"RABBIT",     ef:.06, hostile:false,scary:false, hp:1, food:4, attack:0, furs:1,name:"rabbit",terrain:"PRAIRIE"},
		{key:"PRAIRIE-DOG",ef:.06, hostile:false,scary:false, hp:1, food:3, attack:0, furs:0,name:"prairie dog",terrain:"PRAIRIE"},
		{key:"PHEASANT",   ef:.06, hostile:false,scary:false, hp:1, food:3, attack:0, furs:0,name:"pheasant",terrain:"PRAIRIE"},
		{key:"BULL-SNAKE", ef:.04, hostile:true, scary:false, hp:1, food:1, attack:1, furs:0,name:"bull snake",terrain:"PRAIRIE"},
		{key:"FOX",        ef:.04, hostile:true, scary:false, hp:2, food:0, attack:1, furs:2,name:"fox",terrain:"PRAIRIE"},
		{key:"COYOTE",     ef:.04, hostile:true, scary:false, hp:2, food:0, attack:2, furs:2,name:"coyote",terrain:"PRAIRIE"},
		{key:"BADGER",     ef:.025,hostile:true, scary:false, hp:4, food:0, attack:3, furs:3,name:"badger",terrain:"PRAIRIE"},
		{key:"BISON",      ef:.015,hostile:true, scary:false, hp:6, food:10,attack:3, furs:4,name:"bison",terrain:"PRAIRIE"},

		{key:"DEER",           ef:.03, hostile:false,scary:false, hp:5, food:8, attack:0, furs:2,name:"deer",terrain:"WOODLAND"},
		{key:"BEAVER",         ef:.03, hostile:true, scary:false, hp:4, food:0, attack:2, furs:3,name:"beaver",terrain:"WOODLAND"},
		{key:"BADGER",         ef:.03, hostile:true, scary:false, hp:4, food:0, attack:3, furs:3,name:"badger",terrain:"WOODLAND"},
		{key:"WOODLAND-WEASEL",ef:.05,  hostile:true, scary:false, hp:2, food:1, attack:2, furs:2,name:"woodland weasel",terrain:"WOODLAND"},
		{key:"RACCOON",        ef:.05,  hostile:true, scary:false, hp:2, food:1, attack:3, furs:3,name:"raccoon",terrain:"WOODLAND"},
		{key:"CRAZED-COYOTE",  ef:.05, hostile:true, scary:false, hp:2, food:0, attack:4, furs:2,name:"crazed coyote",terrain:"WOODLAND"},

		{key:"DEER",      ef:.05, hostile:false,scary:false, hp:5, food:8, attack:0, furs:2,name:"deer",terrain:"FOREST"},
		{key:"MINK",      ef:.03, hostile:true, scary:false, hp:2, food:0, attack:2, furs:6,name:"mink",terrain:"FOREST"},
		{key:"WOLF",      ef:.05, hostile:true, scary:false, hp:5, food:0, attack:4, furs:2,name:"wolf",terrain:"FOREST"},
		{key:"BLACK-BEAR",ef:.05, hostile:true, scary:false, hp:5, food:0, attack:5, furs:3,name:"black bear",terrain:"FOREST"},

		{key:"BLACK-BEAR", ef:.05, hostile:true, scary:false,hp:5, food:0, attack:5, furs:3,name:"black bear",terrain:"DEEP-FOREST"},
		{key:"BOBCAT",     ef:.05, hostile:true, scary:false,hp:4, food:0, attack:4, furs:2,name:"bobcat",terrain:"DEEP-FOREST"},
		{key:"COUGAR",     ef:.05, hostile:true, scary:true, hp:5, food:0, attack:7, furs:2,name:"cougar",terrain:"DEEP-FOREST"},
		{key:"FIERCE-WOLF",ef:.05, hostile:true, scary:true, hp:5, food:0, attack:6, furs:0,name:"fierce wolf",terrain:"DEEP-FOREST"},
		
		{key:"ZEBRA",      ef:.03, hostile:false,scary:false, hp:5, food:4, attack:0, furs:3,name:"zebra",terrain:"SAVANNAS"},
		{key:"BABOON",     ef:.05, hostile:true, scary:false, hp:5, food:1, attack:3, furs:2,name:"baboon",terrain:"SAVANNAS"},
		{key:"WARTHOG",    ef:.05, hostile:true, scary:false, hp:4, food:5, attack:4, furs:0,name:"warthog",terrain:"SAVANNAS"},
		{key:"HYENA",      ef:.05, hostile:true, scary:true,  hp:8, food:1, attack:5, furs:1,name:"hyena",terrain:"SAVANNAS"},
		{key:"ELEPHANT",   ef:.03, hostile:true, scary:false, hp:15,food:15,attack:6, furs:0,name:"elephant",terrain:"SAVANNAS"},
		
		{key:"SCORPION",      ef:.05, hostile:true, scary:false, hp:1, food:0, attack:3, furs:0,name:"scorpion",terrain:"DESERT"},
		{key:"BLACK-SCORPION",ef:.03, hostile:true, scary:false, hp:1, food:0, attack:5, furs:0,name:"black scorpion",terrain:"DESERT"},
		{key:"SIDEWINDER",    ef:.05, hostile:true, scary:false, hp:2, food:0, attack:5, furs:0,name:"sidewinder",terrain:"DESERT"},
		{key:"GILA-MONSTER",  ef:.03, hostile:true, scary:false, hp:5, food:0, attack:3, furs:0,name:"gila monster",terrain:"DESERT"},
		{key:"ADDAX",         ef:.03, hostile:true, scary:false, hp:5, food:0, attack:2, furs:3,name:"addax",terrain:"DESERT"},
		
		{key:"TARANTULA",       ef:.06, hostile:true, scary:false, hp:1, food:0, attack:3, furs:0,name:"tarantula",terrain:"JUNGLE"},
		{key:"SAVAGE-TARANTULA",ef:.03, hostile:true, scary:false, hp:1, food:0, attack:5, furs:0,name:"savage tarantula",terrain:"JUNGLE"},
		{key:"PYTHON",          ef:.06, hostile:true, scary:false, hp:5, food:0, attack:6, furs:0,name:"python",terrain:"JUNGLE"},
		{key:"HIPPO",           ef:.05, hostile:true, scary:false, hp:10,food:0, attack:7, furs:0,name:"hippo",terrain:"JUNGLE"},

		{key:"GORILLA",    ef:.05, hostile:true, scary:true, hp:6,  food:0, attack:7, furs:2,name:"gorilla",terrain:"THICK-JUNGLE"},
		{key:"JAGUAR",     ef:.05, hostile:true, scary:true, hp:6,  food:0, attack:7, furs:2,name:"jaguar",terrain:"THICK-JUNGLE"},
		{key:"TIGAR",      ef:.05, hostile:true, scary:true, hp:10, food:0, attack:10,furs:0,name:"tigar",terrain:"THICK-JUNGLE"},
		{key:"CROCODILE",  ef:.06, hostile:true, scary:true, hp:10, food:0, attack:10, furs:0,name:"crocodile",terrain:"THICK-JUNGLE"},

		{key:"SWAMP-MINK",     ef:.05, hostile:true, scary:false,hp:3,  food:0, attack:2,  furs:6,name:"swamp mink",terrain:"SWAMP"},
		{key:"SNAPPING-TURTLE",ef:.06, hostile:true, scary:false,hp:4,  food:3, attack:3,  furs:0,name:"snapping turtle",terrain:"SWAMP"},
		{key:"ALLIGATOR",      ef:.05, hostile:true, scary:false,hp:7,  food:3, attack:7,  furs:2,name:"Alligator",terrain:"SWAMP"},
		{key:"CROCODILE",      ef:.03, hostile:true, scary:true, hp:10, food:0, attack:10, furs:0,name:"crocodile",terrain:"SWAMP"},
		{key:"ANACONDA",       ef:.03, hostile:true, scary:true, hp:5,  food:0, attack:7,  furs:0,name:"anaconda",terrain:"SWAMP"},
		
		{key:"BISON",      ef:.02, hostile:true, scary:false, hp:6, food:10,attack:4, furs:4,name:"bison",terrain:"HILLS"},
		{key:"ELK",        ef:.05, hostile:true, scary:false, hp:5, food:10,attack:5, furs:3,name:"elk",terrain:"HILLS"},
		{key:"HILL-WEASEL",ef:.05, hostile:true, scary:false, hp:4, food:1, attack:3, furs:2,name:"hill weasel",terrain:"HILLS"},
		{key:"BROWN-BEAR", ef:.05, hostile:true, scary:true,  hp:7, food:1, attack:10,furs:2,name:"brown bear",terrain:"HILLS"},
		
		{key:"MARMOT",         ef:.07, hostile:false,scary:false, hp:2, food:2, attack:0, furs:4,name:"marmot",terrain:"MOUNTAINS"},
		{key:"MOUNTAIN-WEASEL",ef:.07, hostile:true, scary:false, hp:2, food:1, attack:3, furs:2,name:"mountain weasel",terrain:"MOUNTAINS"},
		{key:"MOUNTAIN-RAM",   ef:.07, hostile:true, scary:false, hp:5, food:4, attack:6, furs:1,name:"mountain ram",terrain:"MOUNTAINS"},
		{key:"YAK",            ef:.07, hostile:true, scary:false, hp:5, food:4, attack:3, furs:3,name:"yak",terrain:"MOUNTAINS"},
		{key:"BROWN-BEAR",     ef:.05, hostile:true, scary:true,  hp:7, food:1, attack:10,furs:2,name:"brown bear",terrain:"MOUNTAINS"}
	];

	//this.specialEncounter={key:"SPECIAL"};

	//****************************************
	// Parse terrain data
	this.ParseData=function()
	{
		var dataStr=this.worldRawData;
		var blocks=this.width*this.height;
		var lastIdx=blocks-1;
		
		for(var i=0; i<blocks; i++)
		{
			var b64Ch=dataStr.substr(i,1);
			var palIdx=Base64ToInt(b64Ch);
			if(palIdx<0){palIdx=0;}
			if(palIdx>lastIdx){palIdx=lastIdx;}
			this.terrainArray.push(palIdx);
			this.cellStateArray.push(0);
			this.lastTurnVisitArray.push(-2);
		}
	}
	//****************************************
	this.GetWorldIndexFromCoords=function(x,y)
	{
		if(x<0 || y<0 || x>=this.width || y>=this.height){return -1;}
		return this.width*y+x;;
	}
	//****************************************
	// Loads a terrain index value from a location on the world map
	this.GetWorldTerrainIdx=function(x,y)
	{
		var i=this.width*y+x;
		if(i<0 || i>=this.terrainArray.length){return 0;} // Return water when out of bounds
		return this.terrainArray[i];
	}
	//****************************************
	// Gets a terrain type value from a world position
	this.GetTerrainTypeAt=function(x,y)
	{
		var palIdx=this.GetWorldTerrainIdx(x,y);
		return this.GetTerrainType(palIdx);
	}
	//****************************************
	this.GetTerrainTypeByKey=function(key)
	{
		for(var i=0; i<this.terrainTypeArray.length; i++)
		{
			var t=this.terrainTypeArray[i];
			if(t.key==key){return t;}
		}
		return null;
	}
	//****************************************
	// Gets a terrain type object from a terrain index value
	this.GetTerrainType=function(i)
	{
		if(i<0 || i>=this.terrainTypeArray.length){return null;}
		return this.terrainTypeArray[i];
	}
	//****************************************

	// Turn tracking functions
	//****************************************
	this.GetLastTurnAtLocation=function(i)
	{
		if(i<0 || i>=this.lastTurnVisitArray.length){return -1;}
		return this.lastTurnVisitArray[i];
	}
	//****************************************
	this.SetLastTurnAtLocation=function(i,turnNum)
	{
		if(i<0 || i>=this.lastTurnVisitArray.length){return;}
		this.lastTurnVisitArray[i]=turnNum;
	}
	//****************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// This holds conditional values per terrain type.
function TerrainState(terrainKey)
{
	this.key=terrainKey;
	this.skill=0; // Player's skill in this terrain type
	this.lastReportedLevel=0;

	// Special water and food discovery for this terrain
	this.foodDiscovery=false;
	this.waterDiscovery=false;
	
	//****************************************
	this.IncrementSkill=function(amount)
	{
		this.skill+=amount;
		if(this.skill>1){this.skill=1;}
	}
	//****************************************
	this.AssessLevel=function()
	{
		return Math.round(this.skill*4);
	}
	//****************************************
	this.CheckForLevelup=function()
	{
		var lvl=this.AssessLevel();
		return lvl>this.lastReportedLevel;
	}
	//****************************************
	this.GetTerrainTitle=function(terrainName)
	{
		var lvl=this.AssessLevel();
		switch(lvl)
		{
			case 0:return "Greenhorn of the "+terrainName;
			case 1:return terrainName+" Novice";
			case 2:return terrainName+" Guide";
			case 3:return terrainName+" Ranger";
			case 4:return terrainName+" Master";
		}
		return "?";
	}
	//****************************************

	//****************************************
	this.CheckFoodDiscovery=function()
	{
		if(this.foodDiscovery){return false;} // Discovery has already been made
		if(this.CheckSpecialDiscovery())
		{
			this.foodDiscovery=true;
			return true;
		}
		return false;
	}
	//****************************************
	// For each terrain there is a special resource increasing discovery that can be made.
	// Once this is made the player will automatically
	this.CheckWaterDiscovery=function()
	{
		if(this.waterDiscovery){return false;} // Discovery has already been made
		if(this.CheckSpecialDiscovery())
		{
			this.waterDiscovery=true;
			return true;
		}
		return false;
	}
	//****************************************
	// This runs the logic for the special food and water discovery check.
	this.CheckSpecialDiscovery=function()
	{
//return true;
		var lvl=this.AssessLevel();
		if(lvl<1){return false;} // Cannot be discovered until at least level 1
		if(lvl==1){return Chance(.001);} // Small chance at level 1
		if(lvl==2 || lvl==3){return Chance(.02);}
		if(lvl==4){return Chance(.1);} // At master level you are going to discover it pretty quick
		return false;
	}
	//****************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
