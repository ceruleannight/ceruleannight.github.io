
//*******************************************************
function Entity(faction,cellHue)
{
	this.faction=faction;
	this.cellHue=cellHue;

	this.alive=true;
	this.yearsDead=0;
	this.age=0;
	this.children=0;
	this.queueChild=false;
	this.smiley=false;

	// Constants
	this.adultAge=70;
	
	this.PassYear=Entity_PassYear;

	return this;
}
//*******************************************************
function Entity_PassYear(constants)
{
	// If dead then inc years dead
	if(!this.alive)
	{
		this.yearsDead++;
		return;
	}

	// Check death
	var deathProbability=constants.deathProbability;

	// Note: This makes death less probably for the youth
	if(this.age<this.adultAge){deathProbability*=3;} // (increasing make less probable)
	
	if(CheckRandomEvent(deathProbability))
	{
		this.alive=false;
		return;
	}
	
	// Inc age
	this.age++;

	// Check birth
	if(this.children<constants.maxChildren
		&& CheckRandomEvent(constants.birthProbability))
	{
		this.queueChild=true;
	}
}
//*******************************************************

//*******************************************************
function CheckRandomEvent(probability)
{
	return Math.random()*probability<1;
}
//*******************************************************
