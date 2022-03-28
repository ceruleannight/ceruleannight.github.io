
//****************************************************
function Parser(verbArray,itemArray,adjectiveArray)
{
	this.Parse=Parser_Parse;
	this.ResolveSentence=Parser_ResolveSentence;

	this.verbArray=verbArray;
	this.itemArray=itemArray;
	this.adjectiveArray=adjectiveArray;
	
	return this;
}
//****************************************************
function Parser_Parse(text)
{
	text=text.replace(".","").replace(",","").replace("?",""); // take any punctuation out of the way so it doesn't mess with parsing
	text=text.replace("pick up","pickup"); // hack to make simple using the verb "pick up"
	
	var wordArray=text.split(" ");
	if(wordArray==null){return null;}

	// Trim all the words
	for(var i=0;i<wordArray.length;i++)
	{
		wordArray[i]=Trim(wordArray[i]).toLowerCase();
	}

	return this.ResolveSentence(wordArray);
}
//****************************************************
function Parser_ResolveSentence(wordArray)
{
	var verbFound=null;
	var itemFound=null;
	var itemAsNamed="";
	var verbWordIndex=-1;
	var itemWordIndex=-1;
	for(var wi=0;wi<wordArray.length;wi++)
	{
		var word=wordArray[wi];

		// Check if this is a verb
		for(var vi=0;vi<this.verbArray.length && !verbFound;vi++)
		{
			var verb=this.verbArray[vi];
			for(var vwi=0;vwi<verb.wordArray.length;vwi++)
			{
				var verbWord=verb.wordArray[vwi];
				if(word==verbWord)
				{
					verbWordIndex=wi;
					verbFound=verb;
				}
			}
		}

		// Check if this is an item name
		for(var ii=0;ii<this.itemArray.length && !itemFound;ii++)
		{
			var item=this.itemArray[ii];
			for(var iwi=0;iwi<item.wordArray.length;iwi++)
			{
				var itemWord=item.wordArray[iwi];
				if(word==itemWord)
				{
					itemFound=item;
					itemAsNamed=word;
					itemWordIndex=wi;
				}
			}
		}

		// Check for adjectives
		//this.adjectiveArray
	}

	var understood=verbFound!=null;

	var confused=false;
	if(verbFound && itemFound && verbWordIndex>itemWordIndex){confused=true;}
	
	return new Sentence(verbFound,itemFound,itemAsNamed,understood,confused);
}
//****************************************************

//****************************************************
function Sentence(verb,item,itemAsNamed,understood,confused)
{
	this.verb=verb;
	this.item=item;
	this.itemAsNamed=itemAsNamed; // what the user said in this sentence
	this.understood=understood; // understand at all?
	this.confused=confused; // words out of order
	return this;
}
//****************************************************

//****************************************************
// Remove leading or trailing spaces
function Trim(str)
{
	if(str.trim){return str.trim();}
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
//****************************************************

// Items
//------------
// Blue Key
// Yellow Key
// Large Key
// Blue Door
// Yellow Door
// Large Door
// Table
// Rug
// Box
// Wall
// Toolbox
// Switch
// Stairs

// Rooms
//----------------
// Dimly Lit Room
// Center of Long Hall
// End of Long Hall
// Intersecting Halls
// North of Short Hall
// Top of Stairs
// Cellar
// Large Room
// Attic

// Verbs
//----------------
// N, North
// E, East
// W, West
// S, South
// U Up
// D Down
// L, Look
// I, Inventory, Hands
// Take, Pick up
// Move
// Search
// Pull
// Go
// Hit, Smash, Pound, Break
// Unlock, Lock
// Open, Close
//****************************************************
