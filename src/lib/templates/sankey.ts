import type { DiagramTemplate } from "./types";

export const sankeyTemplates: DiagramTemplate[] = [
	{
		id: "sankey-energy-flow",
		name: "Energy Flow",
		category: "Sankey",
		description: "Energy flow diagram showing energy sources and consumption",
		tags: ["sankey", "energy", "flow", "consumption"],
		code: `sankey

    Agricultural 'waste',Bio-conversion,124.729
    Bio-conversion,Liquid,0.597
    Bio-conversion,Losses,26.862
    Bio-conversion,Solid,280.322
    Bio-conversion,Gas,81.144
    Biofuel imports,Liquid,35
    Biomass imports,Solid,35
    Coal imports,Coal,11.606
    Coal reserves,Coal,63.965
    Coal,Solid,75.571
    District heating,Industry,10.639
    District heating,Heating and cooling - commercial,22.505
    District heating,Heating and cooling - homes,46.184
    Electricity grid,Over generation / exports,104.453
    Electricity grid,Heating and cooling - homes,113.726
    Electricity grid,H2 conversion,27.14
    Electricity grid,Industry,342.165
    Electricity grid,Road transport,37.797
    Electricity grid,Agriculture,4.412
    Electricity grid,Heating and cooling - commercial,40.858
    Electricity grid,Losses,56.691
    Electricity grid,Rail transport,7.863
    Electricity grid,Lighting & appliances - commercial,90.008
    Electricity grid,Lighting & appliances - homes,93.494`,
	},
	{
		id: "sankey-budget",
		name: "Budget Flow",
		category: "Sankey",
		description: "Budget allocation and spending flow diagram",
		tags: ["sankey", "budget", "money", "allocation"],
		code: `sankey
    Revenue,Sales,100000
    Revenue,Investments,25000
    Revenue,Other,15000
    Sales,Product A,45000
    Sales,Product B,30000
    Sales,Product C,25000
    Investments,Stocks,15000
    Investments,Bonds,10000
    Product A,Marketing,15000
    Product A,Development,20000
    Product A,Operations,10000
    Product B,Marketing,10000
    Product B,Development,12000
    Product B,Operations,8000
    Product C,Marketing,8000
    Product C,Development,10000
    Product C,Operations,7000`,
	},
	{
		id: "sankey-website-traffic",
		name: "Website Traffic Flow",
		category: "Sankey",
		description: "Website visitor flow and conversion analysis",
		tags: ["sankey", "traffic", "website", "conversion"],
		code: `sankey
    Organic Search,Homepage,1200
    Social Media,Homepage,800
    Direct Traffic,Homepage,600
    Paid Ads,Homepage,400
    Email Campaign,Homepage,300
    Homepage,Product Pages,1500
    Homepage,Blog,900
    Homepage,About,400
    Homepage,Contact,200
    Homepage,Bounce,500
    Product Pages,Cart,300
    Product Pages,Wishlist,200
    Product Pages,Bounce,1000
    Cart,Checkout,250
    Cart,Abandon,50
    Checkout,Purchase,200
    Checkout,Abandon,50
`,
	},
];
