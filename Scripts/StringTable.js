
//****************************************
// StringTable - This class provides functionality for manipulating
//   a table of columns and rows.
//   The first row of the table contains the field names.
function StringTable(tblBlob,rowDelimter,fieldDelimiter)
{
	// Construction
	var tblTokenizer=new StringTokenizer(tblBlob,rowDelimter);
	var rowArray=new Array();
	for(var rowIndex=0; rowIndex<tblTokenizer.Count(); rowIndex++)
	{
		var rowBlob=tblTokenizer.GetAt(rowIndex);
		var rowTokenizer=new StringTokenizer(rowBlob,fieldDelimiter);
		var fieldArray=new Array();
		for(var fieldIndex=0; fieldIndex<rowTokenizer.Count(); fieldIndex++)
		{
			var fieldValue=rowTokenizer.GetAt(fieldIndex);
			fieldArray.push(fieldValue);
		}
		rowArray.push(fieldArray);
	}
	
	this.rowArray=rowArray;
	
	// Methods
	this.ToJson=StringTable_ToJson;
	
	return this;
}
//****************************************
function StringTable_ToJson()
{
	if(this.rowArray.length<1){return "";}
	var json="";
	var hdrRow=this.rowArray[0];
	for(var index=0; index<this.rowArray.length; index++)
	{
		var row=this.rowArray[index];
		
		// TODO: finish this
		//json
	}
	return json;
}
//****************************************

