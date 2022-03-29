
//****************************************************
function Game(console)
{
	// Methods
	this.Init=Game_Init;
	this.EvaluateSentence=Game_EvaluateSentence;
	this.GoDirection=Game_GoDirection;
	this.FindPassage=Game_FindPassage;
	this.SetItemLocation=Game_SetItemLocation;
	this.FindItemById=Game_FindItemById;
	this.GetItemByName=Game_GetItemByName;
	this.GetCurrentRoom=Game_GetCurrentRoom;
	this.Look=Game_Look;
	this.DisplayInventory=Game_DisplayInventory;
	this.Take=Game_Take;
	this.Drop=Game_Drop;
	this.Move=Game_Move;
	this.Search=Game_Search;
	this.Pull=Game_Pull;
	this.Hit=Game_Hit;
	this.Unlock=Game_Unlock;
	this.Lock=Game_Lock;
	this.Open=Game_Open;
	this.Close=Game_Close;
	this.Examine=Game_Examine;
	this.CheckForGameEnd=Game_CheckForGameEnd;
	this.GetKeyAndDoorFacts=Game_GetKeyAndDoorFacts;
	this.SetAdminMode=Game_SetAdminMode;
	this.DataReport=Game_DataReport;
	
	// Data Memebers
	this.console=console;
	this.playerPosIndex=0;
	this.stringInAtticIsKnown=false;
	this.wallBroken=false;
	this.gameOver=false;

	// Construction
	this.Init();

	return this;
}
//****************************************************
function Game_Init()
{
	//function Room(id,name,lit,description)
	this.roomArray=new Array();
	this.roomArray.push(new Room(0,"Dimly Lit Room",true,false,"You are in a dimly lit room. There is a small table and a rug on the floor. There is a blue door on the south side of the room."));
	this.roomArray.push(new Room(1,"Center of Long Hall",true,false,"You are at the center of a long hall running east and west.  There is a blue door to the north wall."));
	this.roomArray.push(new Room(2,"End of Long Hall",true,false,"You are at the west end of a long hall running east and west.  There is a red door on the west wall."));
	this.roomArray.push(new Room(3,"Intersecting Halls",true,false,"You at the east end of a long hall running east and west and at the center of a short hall running north and south."));
	this.roomArray.push(new Room(4,"North of Short Hall",true,false,"You are at the north end of a short hall running north and south.  There is a yellow door on the west wall."));
	this.roomArray.push(new Room(5,"Top of Stairs",true,false,"You are at the south end of a short hall running north and south.  There are stairs here leading down."));
	this.roomArray.push(new Room(6,"Cellar",true,false,"You are in a dingy cellar at the bottom of a flight of stairs. The walls are cracked and dusty. There is a card board box in the corner."));
	this.roomArray.push(new Room(7,"Large Room",true,false,"You are in a large empty room.  There are stairs leading up."));
	this.roomArray.push(new Room(8,"Attic",false,false,"You are in a small, dusty attic."));
	this.roomArray.push(new Room(9,"Outside",true,false,"You are on the edge of a vast open field.  There is a small lonely house here."));

	//-------------------------------------------------
	// Passages(fromRoomId,toRoomId,direction,doorId)
	this.passageArray=new Array();
	this.passageArray.push(new Passages(0,1,4,0));   // Dimly Lit Room
	this.passageArray.push(new Passages(1,0,1,1));   // Center of Long Hall
	this.passageArray.push(new Passages(1,2,2,null));
	this.passageArray.push(new Passages(1,3,3,null));
	this.passageArray.push(new Passages(2,9,2,2));  // End of Long Hall
	this.passageArray.push(new Passages(2,1,3,null));
	this.passageArray.push(new Passages(3,4,1,null));//Intersecting Halls
	this.passageArray.push(new Passages(3,1,2,null));
	this.passageArray.push(new Passages(3,5,4,null));
	this.passageArray.push(new Passages(4,7,2,3));   //North of Short Hall
	this.passageArray.push(new Passages(4,3,4,null));
	this.passageArray.push(new Passages(5,3,1,null));//Top of Stairs
	this.passageArray.push(new Passages(5,6,6,null));
	this.passageArray.push(new Passages(6,5,5,null));//Cellar
	this.passageArray.push(new Passages(7,4,3,4));   //Large Room
	this.passageArray.push(new Passages(7,8,5,null));
	this.passageArray.push(new Passages(8,7,6,null));//Attic
	//-------------------------------------------------

	this.directionArray=new Array();
	this.directionArray.push(new Directions(1,"North"));
	this.directionArray.push(new Directions(2,"West"));
	this.directionArray.push(new Directions(3,"East"));
	this.directionArray.push(new Directions(4,"South"));
	this.directionArray.push(new Directions(5,"Up"));
	this.directionArray.push(new Directions(6,"Down"));

	// Verbs
	this.verbArray=new Array();
	this.verbArray.push(new Verb(1,["n","north"]));
	this.verbArray.push(new Verb(2,["w","west"]));
	this.verbArray.push(new Verb(3,["e","east"]));
	this.verbArray.push(new Verb(4,["s","south"]));
	this.verbArray.push(new Verb(5,["u","up"]));
	this.verbArray.push(new Verb(6,["d","down"]));
	this.verbArray.push(new Verb(7,["l","look","view","see"]));
	this.verbArray.push(new Verb(8,["i","inventory","hands","holding","carrying"]));
	this.verbArray.push(new Verb(9,["take","pickup"]));
	this.verbArray.push(new Verb(10,["drop"]));
	this.verbArray.push(new Verb(11,["move"]));
	this.verbArray.push(new Verb(12,["search"]));
	this.verbArray.push(new Verb(13,["pull"]));
	this.verbArray.push(new Verb(14,["hit","smash","pound","break","bash"]));
	this.verbArray.push(new Verb(15,["unlock"]));
	this.verbArray.push(new Verb(16,["lock"]));
	this.verbArray.push(new Verb(17,["open"]));
	this.verbArray.push(new Verb(18,["close"]));
	this.verbArray.push(new Verb(19,["inspect","examine","check"]));
	this.verbArray.push(new Verb(20,["boom"]));
	
	// Item(id,wordArray,type,locked,open,visible,takeable,movable,posIndex)
	this.itemArray=new Array();
	this.itemArray.push(new	Item(0,["blue door","door"],"door",true,false,true,false,false,0)); // in dimly lit room
	this.itemArray.push(new	Item(1,["blue door","door"],"door",true,false,true,false,false,1)); // in hall
	this.itemArray.push(new	Item(2,["red door","door"],"door",true,false,true,false,false,2));
	this.itemArray.push(new	Item(3,["yellow door","door"],"door",true,false,true,false,false,4)); // in hall
	this.itemArray.push(new	Item(4,["yellow door","door"],"door",true,false,true,false,false,7)); // in large empty room
	this.itemArray.push(new	Item(5,["table"],"",false,false,true,false,true,0));
	this.itemArray.push(new	Item(6,["rug"],"",false,false,true,false,true,0));
	this.itemArray.push(new	Item(7,["blue key","key"],"key",false,false,false,true,true,0));
	this.itemArray.push(new	Item(8,["red key","key"],"key",false,false,false,true,true,6));
	this.itemArray.push(new	Item(9,["yellow key","key"],"key",false,false,false,true,true,6));
	this.itemArray.push(new	Item(10,["cardboard box","box"],"box",false,false,true,false,true,6));
	this.itemArray.push(new	Item(11,["toolbox","box"],"box",false,false,true,false,true,8));
	this.itemArray.push(new Item(12,["hammer"],"",false,false,false,true,true,8));
	this.itemArray.push(new Item(13,["wall"],"wall",false,false,true,false,false,-2)); // always available
	this.itemArray.push(new Item(14,["string"],"",false,false,true,false,true,8));
	
	this.adjectiveArray=new Array();
	this.adjectiveArray.push(new Adjective("blue"));
	this.adjectiveArray.push(new Adjective("red"));
	this.adjectiveArray.push(new Adjective("yellow"));

	this.keyDoorArray=new Array();
	this.keyDoorArray.push(new KeyDoorSet(7,0,1));
	this.keyDoorArray.push(new KeyDoorSet(9,3,4));
	this.keyDoorArray.push(new KeyDoorSet(8,2,2));
}
//****************************************************
function Game_EvaluateSentence(sentence)
{
	if(this.gameOver)
	{
		this.console.WriteText("You have won. You have nothing more to worry about.");
		return;
	}

	if(sentence==null || !sentence.understood)
	{
		this.console.WriteText("I don't understand.");
		return;
	}
	if(sentence.confused)
	{
		this.console.WriteText("What??");
		return;
	}
	
	switch(sentence.verb.id)
	{
		case 1:this.GoDirection(1,"north");break;
		case 2:this.GoDirection(2,"west");break;
		case 3:this.GoDirection(3,"east");break;
		case 4:this.GoDirection(4,"south");break;
		case 5:this.GoDirection(5,"up");break;
		case 6:this.GoDirection(6,"down");break;
		case 7:this.Look(true);break;
		case 8:this.DisplayInventory();break;
		case 9:this.Take(sentence);break;
		case 10:this.Drop(sentence);break;
		case 11:this.Move(sentence);break;
		case 12:this.Search(sentence);break;
		case 13:this.Pull(sentence);break;
		case 14:this.Hit(sentence);break;
		case 15:this.Unlock(sentence);break;
		case 16:this.Lock(sentence);break;
		case 17:this.Open(sentence);break;
		case 18:this.Close(sentence);break;
		case 19:this.Examine(sentence);break;
		case 20:this.SetAdminMode();break;
	}

	this.CheckForGameEnd();
}
//****************************************************
function Game_GoDirection(dirId,dirName)
{
	var passage=this.FindPassage(dirId);
	if(passage==null)
	{
		this.console.WriteText("You cannot go "+dirName+".");
		return;
	}

	// Check door
	if(passage.doorId!=null)
	{
		var itemIndex=this.FindItemById(passage.doorId);
		if(itemIndex==-1)
		{
			this.console.WriteText("Door not found.");
			return;
		}
		var door=this.itemArray[itemIndex];
		if(!door.open)
		{
			this.console.WriteText("The door is closed.");
			return;
		}
	}

	this.GetCurrentRoom().visited=true; // make sure the room you are leaving is set as visited
	this.console.WriteText("You go "+dirName+".");
	this.playerPosIndex=passage.toRoomId; // Move the player
	this.Look(false); // not explicit
	this.GetCurrentRoom().visited=true;
}
//****************************************************
function Game_FindPassage(dirId)
{
	var room=this.roomArray[this.playerPosIndex];
	for(var i=0;i<this.passageArray.length;i++)
	{
		var p=this.passageArray[i];
		if(p.fromRoomId==room.id && p.direction==dirId){return p;}
	}
	return null;
}
//****************************************************
function Game_SetItemLocation(itemId,posIndex)
{
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		if(item.id==itemId)
		{
			item.posIndex=posIndex;
		}
	}
}
//****************************************************
function Game_FindItemById(itemId)
{
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		if(item.id==itemId){return i;}
	}
	return -1;
}
//****************************************************
function Game_GetItemByName(name,searchPlayerPos,searchPlayerInv,visibleOnly)
{
	var resolvedItem=null;
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		var consider=false;
		if(searchPlayerPos && (item.posIndex==this.playerPosIndex || item.posIndex==-2)){consider=true;} // Note: an item at -2 is available from anywhere
		if(searchPlayerInv && item.posIndex==-1){consider=true;}
		if(visibleOnly && !item.visible){consider=false;}
		
		if(consider)
		{
			for(var wi=0;wi<item.wordArray.length;wi++)
			{
				var word=item.wordArray[wi];
				if(word==name)
				{
					resolvedItem=item;
					break;
				}
			}
		}
	}
	return resolvedItem;
}
//****************************************************
function Game_GetCurrentRoom()
{
	if(this.playerPosIndex<0 || this.playerPosIndex>=this.roomArray.length){return null;}
	return this.roomArray[this.playerPosIndex];
}
//****************************************************
// Write the room description and visible items.
// If the room has been visited before then just show the room name,
// unless explicit=true then show all.
function Game_Look(explicit)
{
	var room=this.GetCurrentRoom();
	if(room==null)
	{
		this.console.WriteText("*** Error with player location ***");
		return;
	}

	this.console.WriteText("<span class=\"roomTitle\">&nbsp;"+room.name+"&nbsp;</span>");

	if(!room.lit)
	{
		if(!room.visited || explicit)
		{
			this.console.WriteText("It is pitch black you can't see anything.");
		}

		if(room.id==8 && this.stringInAtticIsKnown)
		{
			this.console.WriteText("However, you feel a string which seems to be attached to the ceiling.");
		}

		return;
	}
	
	if(!room.visited || explicit)
	{
		this.console.WriteText(room.description);
	}
	
	// Look at items
	var itemList="";
	var conjunction=" and ";
	for(var i=this.itemArray.length-1;i>=0;i--)
	{
		var item=this.itemArray[i];
		if(item.posIndex==this.playerPosIndex && item.visible)
		{
			if(itemList!="")
			{
				itemList=conjunction+itemList;
				conjunction=", ";
			}
			itemList=" a "+item.wordArray[0]+itemList;
		}
	}
	if(itemList!="")
	{
		this.console.WriteText("You see "+itemList);
	}
}
//****************************************************
function Game_DisplayInventory()
{
	var itemList="";
	var conjunction=" and ";
	for(var i=this.itemArray.length-1;i>=0;i--)
	{
		var item=this.itemArray[i];
		if(item.posIndex==-1) //-1 location is in your inventory
		{
			if(itemList!="")
			{
				itemList=conjunction+itemList;
				conjunction=", ";
			}
			itemList=" a "+item.wordArray[0]+itemList;
		}
	}
	if(itemList=="")
	{
		this.console.WriteText("You have nothing in your hands.");
	}
	else
	{
		this.console.WriteText("You are carrying "+itemList);
	}
}
//****************************************************
function Game_Take(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Take what?");
		return;

		// Consider changing this to automatically take an item if there is only
		// one takeable item present.
	}

	// Can the item be seen?
	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,false,true);

	if(item==null || !item.visible)
	{
		this.console.WriteText("You don't see a "+sentence.itemAsNamed+" here.");
		return;
	}

	if(!item.takeable)
	{
		this.console.WriteText("It cannot be taken.");
		return;
	}

	item.posIndex=-1;// place in your hands
	var itemName=item.wordArray[0];
	this.console.WriteText("You take the "+itemName+".");
}
//****************************************************
function Game_Drop(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Drop what?");
		return;

		// Consider changing this to automatically drop an item if you are only holding one.
	}

	if(item.posIndex>-1)
	{
		this.console.WriteText("You are not holding that.");
		return;
	}

	item.posIndex=this.playerPosIndex; // the drop
	var itemName=item.wordArray[0];
	this.console.WriteText("You have dropped the "+itemName+".");
}
//****************************************************
function Game_Move(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Move what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}
	
	if(!item.movable)
	{
		this.console.WriteText("That cannot be moved.");
		return;
	}
	
	// Moving the rug reveals the blue key.  rug=6, blue key=7
	var blueKey=this.itemArray[7];
	// If the rug is being moved and the blue key is in the room and not yet visible then reveal it.
	if(item.id==6 && blueKey.posIndex==this.playerPosIndex && !blueKey.visible)
	{
		blueKey.visible=true;
		this.console.WriteText("You move the rug.");
		this.console.WriteText("Moving the rug reveals a blue key.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,true,true);
	
	if(item==null)
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	this.console.WriteText("You move the "+sentence.itemAsNamed+", but nothing happens.");
}
//****************************************************
function Game_Search(sentence)
{
	//this.verbArray.push(new Verb(12,["search","check"]));
	
	var item=sentence.item;
	if(item==null)
	{
		// No item specified so do a general room search

		var room=this.GetCurrentRoom();

		if(this.playerPosIndex==8 && !room.lit && !this.stringInAtticIsKnown)
		{
			this.stringInAtticIsKnown=true;
			this.console.WriteText("Feeling your way in the darkness you discover what feels like a string hanging from the ceiling.");
			return;
		}

		this.console.WriteText("You search the room, but find nothing special.");

		return;
	}
	
	// When an item is specified just run the Examine method
	this.Examine(sentence);
}
//****************************************************
function Game_Pull(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Pull what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(this.playerPosIndex==8 && item.id==14 && this.stringInAtticIsKnown)
	{
		if(room.lit)
		{
			room.lit=false;
			this.console.WriteText("You pull the string and the light goes out.");
		}
		else
		{
			room.lit=true;
			this.console.WriteText("You pull the string and a light on the ceiling turns on.");
		}
		return;
	}

	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,true,true);
	
	// Check for the item being present
	if(item==null)
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	this.console.WriteText("Pulling the "+sentence.itemAsNamed+" does nothing.");
}
//****************************************************
function Game_Hit(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Hit what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,true,true);
	if(item==null)
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	var hammer=this.itemArray[this.FindItemById(12)];
	var hammerInHands=hammer.posIndex==-1;
	var redKey=this.itemArray[this.FindItemById(8)];

	if(item.id!=13 || !hammerInHands || room.id!=6 || redKey.visible) // wall=13, cellar=6
	{
		this.console.WriteText("You hit the "+sentence.itemAsNamed+", but nothing happens.");
		return;
	}
	
	this.console.WriteText("You hit the wall with the hammer.");
	this.console.WriteText("A chunk of the wall breaks away and a red key falls out to the floor.");
	redKey.visible=true;
}
//****************************************************
function Game_Unlock(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Unlock what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,false,true);

	// Check for the item being present
	if(item==null || (item.posIndex!=-1 && item.posIndex!=this.playerPosIndex))
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	if(item.type!="door")
	{
		this.console.WriteText("The "+sentence.itemAsNamed+" cannot be unlocked.");
		return;
	}

	// Reaching this point means that "item" is a door.

	if(!item.locked) // already unlocked
	{
		this.console.WriteText("The door is already unlocked.");
		return;
	}

	var facts=this.GetKeyAndDoorFacts();
	if(facts==null)
	{
		this.console.WriteText("There is not a door here to unlock.");
		return;
	}

	// Check that you have a matching key for the door present
	if(!facts.playerHasMatchingKey)
	{
		this.console.WriteText("You lack the appropriate key.");
		return;
	}
	
	facts.doorSide1.locked=false;
	facts.doorSide2.locked=false; // unlock both sides of the door
	
	this.console.WriteText("You unlock the door.");
}
//****************************************************
function Game_Lock(sentence)
{
	//this.verbArray.push(new Verb(16,["lock"]));
}
//****************************************************
function Game_Open(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Open what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,false,true);

	// Check for the item being present
	if(item==null || (item.posIndex!=-1 && item.posIndex!=this.playerPosIndex))
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	if(item.type!="door" && item.type!="box")
	{
		this.console.WriteText("The "+sentence.itemAsNamed+" cannot be opened.");
		return;
	}

	if(item.open)
	{
		this.console.WriteText("The "+sentence.itemAsNamed+" is already open.");
		return;
	}

	if(item.type=="door")
	{
		// Check for locked
		if(item.locked)
		{
			this.console.WriteText("The door is locked.");
			return;
		}
		
		var facts=this.GetKeyAndDoorFacts();
		if(facts==null){return;} // shouldn't happen but it is a good idea to check anyway
		facts.doorSide1.open=true;
		facts.doorSide2.open=true; // open both sides of the door
	}

	this.console.WriteText("You open the "+sentence.itemAsNamed+".");

	if(item.type=="box")
	{
		var yellowKey=this.itemArray[this.FindItemById(9)];
		if(item.id==10 && !yellowKey.visible)
		{
			item.open=true;
			yellowKey.visible=true;
			this.console.WriteText("Opening the box reveals a yellow key.");
		}

		var hammer=this.itemArray[this.FindItemById(12)];
		if(item.id==11 && !hammer.visible)
		{
			item.open=true;
			hammer.visible=true;
			this.console.WriteText("Opening the toolbox reveals a hammer.");
		}
	}
}
//****************************************************
function Game_Close(sentence)
{
	//this.verbArray.push(new Verb(18,["close"]));
}
//****************************************************
function Game_Examine(sentence)
{
	var item=sentence.item;
	if(item==null)
	{
		this.console.WriteText("Examine what?");
		return;
	}

	var room=this.GetCurrentRoom();
	if(!room.lit)
	{
		this.console.WriteText("It's too dark in the room to see what you are doing.");
		return;
	}

	item=this.GetItemByName(sentence.itemAsNamed,true,true,true);

	// Check for the item being present
	if(item==null)
	{
		this.console.WriteText("You do not see a "+sentence.itemAsNamed+" here.");
		return;
	}

	var text="";

	if(item.type=="door")
	{
		if(item.open)
		{
			this.console.WriteText("The door is open.");
			return;
		}
		text="The door is closed";
		if(item.locked){text+=" and locked";}
		text+=".";
		this.console.WriteText(text);
		return;
	}

	var itemName=sentence.itemAsNamed;
	if(item.id==11){itemName="toolbox";}

	if(item.type=="box")
	{
		text="The "+itemName+" is ";
		text+=(item.open?"open.":"closed.");
		this.console.WriteText(text);
		return;
	}

	var blueKey=this.itemArray[7];
	if(item.id==6 && !blueKey.visible) // rug
	{
		this.console.WriteText("It looks like there is something under the rug.");
		return;
	}

	if(item.id==12)
	{
		this.console.WriteText("You check the hammer.");
		this.console.WriteText("Written on the handle are the words \"Wall Smasher\".");
		return;
	}
	
	this.console.WriteText("You see nothing unusual about the "+sentence.itemAsNamed+".");
}
//****************************************************
function Game_CheckForGameEnd()
{
	if(this.playerPosIndex==9) // (Outside)
	{
		this.console.WriteText("");
		this.console.WriteText("You have escaped the house!  Well done.");
		this.console.WriteText("");
		this.console.WriteText("YOU WIN!!!");
		this.gameOver=true;
	}
}
//****************************************************
function Game_GetKeyAndDoorFacts()
{
	// Find any door present at the players location
	var door=null;
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		if(item.type=="door" && item.posIndex==this.playerPosIndex)
		{
			door=item;
			break;
		}
	}
	if(door==null){return null;}
	
	// Find a door/key set that matches the present door
	var doorKeySet=null;
	for(var i=0;i<this.keyDoorArray.length;i++)
	{
		var set=this.keyDoorArray[i];
		if(set.doorIdSide1==door.id || set.doorIdSide2==door.id)
		{
			doorKeySet=set;
			break;
		}
	}

	// See if the player has the matching key
	var playerHasMatchingKey=false;
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		if(item.id==doorKeySet.keyId && item.posIndex==-1)
		{
			playerHasMatchingKey=true;
			break;
		}
	}
	
	var facts={};
	facts.playerHasMatchingKey=playerHasMatchingKey;

	var doorSide1Index=this.FindItemById(doorKeySet.doorIdSide1);
	var doorSide2Index=this.FindItemById(doorKeySet.doorIdSide2);

	facts.doorSide1=this.itemArray[doorSide1Index];
	facts.doorSide2=this.itemArray[doorSide2Index];
	
	return facts;
}
//****************************************************
function Game_SetAdminMode()
{
	// Open all doors
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		if(item.type=="door")
		{
			item.open=true;
		}
	}
	this.console.WriteText("All doors are open!");
}
//****************************************************
function Game_DataReport()
{
	var html="<table cellspacing=\"0\" class=\"reportTbl\">"
	html+="<tr style=\"background-color:#E0E0E0;\">";
	html+="<td>ID</td>";
	html+="<td>Item Name</td>";
	html+="<td>Visible</td>";
	html+="<td>Locked</td>";
	html+="<td>Open</td>";
	html+="<td>Takeable</td>";
	html+="<td>Movable</td>";
	html+="<td>Pos</td>";
	html+="</tr>";
	for(var i=0;i<this.itemArray.length;i++)
	{
		var item=this.itemArray[i];
		html+="<tr>";
		html+="<td>"+item.id+"</td>";
		html+="<td>"+item.wordArray[0]+"</td>";
		html+="<td>"+item.visible+"</td>";
		html+="<td>"+item.locked+"</td>";
		html+="<td>"+item.open+"</td>";
		html+="<td>"+item.takeable+"</td>";
		html+="<td>"+item.movable+"</td>";
		html+="<td>"+item.posIndex+"</td>";
		html+="</tr>";
	}
	html+="</table>";
	return html;
}
//****************************************************

//****************************************************
function Room(id,name,lit,visited,description)
{
	this.id=id;
	this.name=name;
	this.lit=lit;
	this.visited=visited;
	this.description=description;
	return this;
}
//****************************************************
function Passages(fromRoomId,toRoomId,direction,doorId)
{
	this.fromRoomId=fromRoomId;
	this.toRoomId=toRoomId;
	this.direction=direction;
	this.doorId=doorId;
	return this;
}
//****************************************************
function Verb(id,wordArray)
{
	this.id=id;
	this.wordArray=wordArray;
	return this;
}
//****************************************************
function Item(id,wordArray,type,locked,open,visible,takeable,movable,posIndex)
{
	this.id=id;
	this.wordArray=wordArray;
	this.type=type;
	this.locked=locked;
	this.open=open;
	this.visible=visible;
	this.takeable=takeable;
	this.movable=movable;
	this.posIndex=posIndex;
	return this;
}
//****************************************************
function Adjective(word)
{
	this.word=word;
	return this;
}
//****************************************************
function Directions(id,name)
{
	this.id=id;
	this.name=name;
	return this;
}
//****************************************************
function KeyDoorSet(keyId,doorIdSide1,doorIdSide2) // key and matching door (from both sides of the door)
{
	this.keyId=keyId;
	this.doorIdSide1=doorIdSide1;
	this.doorIdSide2=doorIdSide2;
	return this;
}
//****************************************************
