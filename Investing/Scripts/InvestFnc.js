
//*******************************************************
//Square Root of (22.5 * TTM Earnings per Share * MRQ Book Value per Share)
function CalcBenGrahamNum(ttmEps,mrqBv,constVal)
{
	if(!constVal){constVal=22.5;}
	return Math.pow(ttmEps*mrqBv*constVal,.5)
}
//*******************************************************
function CalcPercentOffGrahamNum(price,grahamNum)
{
	return 100*price/grahamNum-100;
}
//*******************************************************
