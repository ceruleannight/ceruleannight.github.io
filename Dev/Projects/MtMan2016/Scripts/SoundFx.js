
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
function SoundFx()
{
	this.volume=.5;
	this.gunShot=new Audio("_sounds/GunShot.wav");
	this.knifeImpact=new Audio("_sounds/KnifeImpact.wav");
	this.playerHurt=new Audio("_sounds/PlayerHurt.wav");
	this.runAway=new Audio("_sounds/WalkOff.wav");
	
	

	//********************************************
	this.PlaySound=function(key)
	{
		if(this.volume==0){return;}

		var sfx=null;
		switch(key)
		{
			case "GUN-SHOT":sfx=this.gunShot;break;
			case "KNIFE-IMPACT":sfx=this.knifeImpact;break;
			case "PLAYER-HURT":sfx=this.playerHurt;break;
			case "RUN-AWAY":sfx=this.runAway;break;
		}
		if(!sfx){return;}
		sfx.volume=this.volume;
		sfx.play();
	}
	//********************************************

	return this;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
