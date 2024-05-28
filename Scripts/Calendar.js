
//***************************************
function Calendar(yearListDiv,monthListDiv,monthBlockDiv,
	firstYear,lastYear,abbreviate,focusDate,
	headerCssClass,cellCssClass)
{
	// -- Methods
	this.DrawAll=Calendar_DrawAll;
	this.SetYear=Calendar_SetYear;
	this.SetMonth=Calendar_SetMonth;
	this.DrawYearList=Calendar_DrawYearList;
	this.DrawMonthList=Calendar_DrawMonthList;
	this.DrawMonthBlock=Calendar_DrawMonthBlock;
	
	this.yearListDiv=yearListDiv;
	this.monthListDiv=monthListDiv;
	this.monthBlockDiv=monthBlockDiv;
	this.firstYear=firstYear;
	this.lastYear=lastYear;
	this.abbreviate=abbreviate;
	this.headerCssClass=headerCssClass;
	this.cellCssClass=cellCssClass;
	
	this.focusDate=focusDate;
	this.currentYear=focusDate.getFullYear();
	this.currentMonthIndex=focusDate.getMonth();
	return this;
}
//***************************************
function Calendar_DrawAll()
{
	this.DrawYearList();
	this.DrawMonthList();
	this.DrawMonthBlock();
}
//***************************************
function Calendar_SetYear(year)
{
	this.currentYear=year;
	this.DrawYearList();
	this.DrawMonthBlock();
}
//***************************************
function Calendar_SetMonth(monthIndex)
{
	this.currentMonthIndex=monthIndex;
	this.DrawMonthList();
	this.DrawMonthBlock();
}
//***************************************
function Calendar_DrawYearList()
{
	var html="";
	html+="<table cellspacing=0 border=1 class=\""+this.cellCssClass+"\">";
	html+="<tr align=\"center\">";
	html+="<td class=\""+this.headerCssClass+"\">Year</td>";
	html+="</tr>";
	
	var lastYear=this.lastYear+1;
	for(var year=this.firstYear;year<lastYear;year++)
	{
		var styleTxt="";
		if(year==this.currentYear)
		{
			styleTxt=" style=\"border-color:#0000FF;\"";
		}
		
		var onMouseOverTxt=" onMouseOver=\"HLite(this);\"";
		var onMouseOutTxt=" onMouseOut=\"UnHLite(this);\"";
		
		html+="<tr align=\"center\">";
		html+="<td "+styleTxt+onMouseOverTxt+onMouseOutTxt+
			" onclick=\"CalendarYearClicked("+year+");\">"+year+"</td>";
		html+="</tr>";
	}
	html+="</table>";
	
	this.yearListDiv.innerHTML=html;
}
//***************************************
function Calendar_DrawMonthList()
{
	var html="";
	html+="<table cellspacing=0 border=1 class=\""+this.cellCssClass+"\">";
	html+="<tr align=\"center\">";
	html+="<td class=\""+this.headerCssClass+"\">Month</td>";
	html+="</tr>";
	for(var monthIndex=0;monthIndex<12;monthIndex++)
	{
		var styleTxt="";
		if(monthIndex==this.currentMonthIndex)
		{
			styleTxt=" style=\"border-color:#0000FF;\"";
		}
		
		var onMouseOverTxt=" onMouseOver=\"HLite(this);\"";
		var onMouseOutTxt=" onMouseOut=\"UnHLite(this);\"";
		var monthName=GetMonthName(monthIndex,this.abbreviate);
		html+="<tr align=\"center\">";
		html+="<td "+styleTxt+onMouseOverTxt+onMouseOutTxt+
			" onclick=\"CalendarMonthClicked("+monthIndex+");\">"+monthName+"</td>";
		html+="</tr>";
	}
	html+="</table>";
	this.monthListDiv.innerHTML=html;
}
//***************************************
function Calendar_DrawMonthBlock()
{
	var year=this.currentYear;
	var monthIndex=this.currentMonthIndex;
	
	var focusDayOfMonth=this.focusDate.getDate();
	var isFocusMonth=false;
	if(this.focusDate.getFullYear()==year
		&& this.focusDate.getMonth()==monthIndex)
	{isFocusMonth=true;}
	
	var monthName=GetMonthName(monthIndex,this.abbreviate);
	
	var html="";
	html+="<table cellspacing=0 border=1 class=\""+this.cellCssClass+"\">";
	html+="<tr align=\"center\">";
	html+="<td colspan=7 class=\""+this.headerCssClass+"\">"+monthName+" "+year+"</td>";
	html+="</tr>";
	
	html+="<tr align=\"center\">";
	html+="<td>S</td>";
	html+="<td>M</td>";
	html+="<td>T</td>";
	html+="<td>W</td>";
	html+="<td>T</td>";
	html+="<td>F</td>";
	html+="<td>S</td>";
	html+="</tr>";
	
	var numDaysInMonth=GetNumDaysInMonth(year,monthIndex);
	var startDate=new Date(year,monthIndex,1);
	var startDow=startDate.getDay();
	
	var monthStarted=false;
	var monthEnded=false;
	var day=1;
	for(var column=0;column<7;column++)
	{
		html+="<tr align=\"center\">";
		for(var dow=0;dow<7;dow++)
		{
			if(dow==startDow){monthStarted=true;}
			
			var dayTxt="&nbsp;";
			var styleTxt="";
			var onMouseOverTxt="";
			var onMouseOutTxt="";
			var onClickTxt="";
			if(monthStarted && !monthEnded)
			{
				// -- handle focus box
				if(isFocusMonth && day==focusDayOfMonth)
				{
					styleTxt=" style=\"border-color:#0000FF;\"";
				}
				
				dayTxt=""+day;
				onMouseOverTxt=" onMouseOver=\"HLite(this);\"";
				onMouseOutTxt=" onMouseOut=\"UnHLite(this);\"";
				onClickTxt=" onclick=\"CalendarDayClicked("+day+");\"";
				if(day==numDaysInMonth){monthEnded=true;}
				day++;
			}
			html+="<td"+styleTxt+onMouseOverTxt+onMouseOutTxt+onClickTxt+">"+dayTxt+"</td>";
		}
		html+="</tr>";
		
		if(monthEnded){break;}
	}
	
	html+="</table>";
	this.monthBlockDiv.innerHTML=html;
}
//***************************************

//***************************************
function GetNumDaysInMonth(year,monthIndex)
{
	var oDate=new Date(year,monthIndex+1,0); // -- trick to get the last day of a month
	return oDate.getDate();
}
//***************************************
function GetMonthName(monthIndex,abbreviate)
{
	if(abbreviate)
	{
		switch(monthIndex)
		{
			case 0:return "Jan";
			case 1:return "Feb";
			case 2:return "Mar";
			case 3:return "Apr";
			case 4:return "May";
			case 5:return "June";
			case 6:return "July";
			case 7:return "Aug";
			case 8:return "Sept";
			case 9:return "Oct";
			case 10:return "Nov";
			case 11:return "Dec";
		}
	}
	else
	{
		switch(monthIndex)
		{
			case 0:return "January";
			case 1:return "February";
			case 2:return "March";
			case 3:return "April";
			case 4:return "May";
			case 5:return "June";
			case 6:return "July";
			case 7:return "August";
			case 8:return "September";
			case 9:return "October";
			case 10:return "November";
			case 11:return "December";
		}
	}
	return "";
}
//***************************************
