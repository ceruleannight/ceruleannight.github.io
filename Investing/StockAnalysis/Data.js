﻿
//******************************************************
function InitDataArray1()
{
	/*
		{
			"ticker":"",
			"infoDate":"",
			"pb":"",
			"pe":"",
			"peg":"",
			"pLeveredFcf":"",
			"debtToEquity":"",
			"insiderOwnership":""
		}
	*/

	var data=
	[
		{
			type:"STOCK",
			ticker:"ISRG",
			companyName:"Intuitive Surgical, Inc.",
			inDepth:"InDepth/ISRG/ISRG.htm",
			infoDate:"2012/5/5",
			pb:"7.84",
			pe:"42.71",
			peg:"1.88",
			pLeveredFcf:"43",
			debtToEquity:"0",
			roe:"20.72",
			roic:"20",
			roic5YAvg:"19.2",
			insiderOwnership:"1.8%",
			notes:""
		},
		{
			type:"STOCK",
			ticker:"CMI",
			companyName:"Cummins Inc.",
			inDepth:"InDepth/CMI/CMI.htm",
			infoDate:"2012/4/13",
			pb:"4.02",
			pe:"11.94",
			peg:".74",
			pLeveredFcf:"21.1",
			debtToEquity:".12",
			roe:"36.37",
			roic:"26.9",
			roic5YAvg:"17.2",
			insiderOwnership:".99%"
		},
		{
			type:"STOCK",
			ticker:"ESV",
			companyName:"Ensco",
			inDepth:"",
			infoDate:"",
			pb:"",
			pe:"",
			peg:"",
			pLeveredFcf:"",
			debtToEquity:"",
			roe:"",
			roic:"",
			insiderOwnership:""
		},
		{
			type:"STOCK",
			ticker:"ATW",
			companyName:"Atwood Oceanics",
			inDepth:"InDepth/ATW/ATW.htm",
			infoDate:"2012/2/10",
			pb:"1.66",
			pe:"9.82",
			peg:".75",
			pLeveredFcf:"(negative cash flow)",
			debtToEquity:".34",
			roe:"18.07",
			roic:"14.1",
			insiderOwnership:"1.2%"
		},
		{
			type:"STOCK",
			ticker:"HIMX",
			companyName:"Himax",
			inDepth:"InDepth/HIMX/HIMX.htm",
			infoDate:"2013/7/25",
			pb:"2.92",
			pe:"23.2",
			peg:".55",
			pLeveredFcf:"17.1",
			debtToEquity:"[no debt]",
			insiderOwnership:"12.38%",
			grahamNumber:"4.295",
			website:{url:"http://www.himax.com.tw/",title:"Himax's web site"}
		},
		{
			type:"STOCK",
			ticker:"WAG",
			companyName:"Walgreen",
			inDepth:"InDepth/WAG/WAG.htm",
			infoDate:"2012/2/14",
			pb:"2.07",
			pe:"11.72",
			peg:"1.5",
			pLeveredFcf:"14.5",
			debtToEquity:".16",
			insiderOwnership:".81%"
		},
		{
			type:"STOCK",
			ticker:"UFPT",
			companyName:"UFP Technologies, Inc.",
			inDepth:"InDepth/UFPT/UFPT.htm",
			infoDate:"2012/2/23",
			pb:"1.76",
			pe:"10.72",
			peg:"?",
			pLeveredFcf:"13.9",
			debtToEquity:".11",
			roe:"18.44",
			roic:"16.6",
			insiderOwnership:"15.62"
		},
		{
			type:"STOCK",
			ticker:"BPI",
			companyName:"Bridgepoint Education",
			infoDate:"2012/2/23",
			pb:"4.2",
			pe:"8.75",
			peg:".51",
			pLeveredFcf:"7.57",
			debtToEquity:"0",
			insiderOwnership:"0%"
		},
		{
			type:"STOCK",
			ticker:"SLP",
			companyName:"Simulations Plus",
			infoDate:"2012/2/14",
			pb:"3.69",
			pe:"18.44",
			peg:"?",
			pLeveredFcf:"19.73",
			debtToEquity:"0",
			insiderOwnership:"40.85%"
		},
		{
			type:"STOCK",
			ticker:"BCPC",
			companyName:"Balchem Corp.",
			inDepth:"InDepth/BCPC/BCPC.htm",
			infoDate:"2012/7/3",
			pb:"3.98",
			pe:"25.95",
			peg:"2.06",
			pLeveredFcf:"26.47",
			debtToEquity:"0",
			insiderOwnership:"1.75%",
		},
		{type:"SPACER"},
		{
			type:"STOCK",
			ticker:"WPRT",
			companyName:"Westport Innovations Inc.",
			website:{url:"http://www.westport.com/",title:"Westport's web site"},
			infoDate:"2012/2/14",
			pb:"11.29",
			pe:"?",
			peg:"?",
			pLeveredFcf:"(negative cash flow)",
			debtToEquity:".46",
			insiderOwnership:"?"
		},
		{
			type:"STOCK",
			ticker:"ORAN",
			companyName:"Orange",
			infoDate:"2013/2/25",
			pb:".75",
			pe:"24.69",
			peg:"",
			pLeveredFcf:"2.83",
			debtToEquity:"1.33",
			insiderOwnership:""
		},
		{type:"SPACER"},
		{
			type:"STOCK",
			ticker:"PSMT",
			companyName:"PriceSmart",
			infoDate:"2012/2/15",
			pb:"5.6",
			pe:"34.24",
			peg:"1.86",
			pLeveredFcf:"96.1",
			debtToEquity:".2",
			insiderOwnership:"50.83%"
		},
		{
			type:"STOCK",
			ticker:"CLNE",
			companyName:"Clean Energy Fuels Corp",
			infoDate:"2012/4/16",
			pb:"3.15",
			pe:"?",
			peg:"-1.2",
			pLeveredFcf:"(negative cash flow)",
			debtToEquity:".54",
			insiderOwnership:"?"
		},
		{
			type:"STOCK",
			ticker:"WDC",
			companyName:"Western Digital",
			infoDate:"2012/4/27",
			pb:"1.75",
			pe:"13.02",
			peg:".39",
			pLeveredFcf:"15.213",
			debtToEquity:".04",
			roe:"12.43",
			roic:"11.5",
			roic5YAvg:"22.6",
			insiderOwnership:".36%"
		},
		{
			type:"STOCK",
			ticker:"CGNX",
			companyName:"Cognex Corporation ",
			infoDate:"2012/5/3",
			price:"38.97",
			pb:"3.05",
			pe:"23.81",
			peg:"2.4",
			pLeveredFcf:"34.68",
			debtToEquity:"0",
			roe:"12.89",
			roic:"12.8",
			roic5YAvg:"8",
			insiderOwnership:"8%",
			notes:"This is an SA stock."
		},
		{type:"SPACER"},
		{
			type:"STOCK",
			ticker:"AAPL",
			companyName:"Apple",
			inDepth:"InDepth/AAPL/AAPL.htm",
			infoDate:"2012/2/14",
			pb:"5.2",
			pe:"14.5",
			peg:".61",
			pLeveredFcf:"18.69",
			debtToEquity:"0",
			insiderOwnership:".83%"
		},
		{
			type:"STOCK",
			ticker:"SCCO",
			companyName:"Southern Copper Corp.",
			infoDate:"2012/2/23",
			pb:"7.04",
			pe:"12.2",
			peg:"1.2",
			pLeveredFcf:"21.3",
			debtToEquity:".68",
			insiderOwnership:"76%"
		},
		{
			type:"STOCK",
			ticker:"CHRW",
			companyName:"C. H. Robinson Worldwide",
			infoDate:"2012/2/15",
			pb:"8.54",
			pe:"24.27",
			peg:"1.55",
			pLeveredFcf:"27.91",
			debtToEquity:"?",
			insiderOwnership:"1.62"
		},
		{
			type:"STOCK",
			ticker:"INTC",
			companyName:"Intel",
			inDepth:"InDepth/INTC/INTC.htm",
			infoDate:"2012/5/28",
			price:"25.74",
			pb:"2.75",
			pe:"10.89",
			peg:".87",
			pLeveredFcf:"20.33",
			debtToEquity:".16",
			roe:"26.61",
			roic:"22",
			roic5YAvg:"17.2",
			insiderOwnership:"0%",
			notes:""
		}
	];

	return data;
}
//******************************************************
