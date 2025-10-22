import type { DiagramTemplate } from "./types";

export const xyChartTemplates: DiagramTemplate[] = [
	{
		id: "xy-chart-line",
		name: "Line Chart",
		category: "XY Chart",
		description: "Simple line chart showing data trends over time",
		tags: ["xy-chart", "line", "trend", "time"],
		code: `xychart-beta
    title "Sales Revenue"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue (in USD)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 8800, 9000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 8800, 9000]`,
	},
	{
		id: "xy-chart-multiple",
		name: "Multiple Data Series",
		category: "XY Chart",
		description: "Chart with multiple data series for comparison",
		tags: ["xy-chart", "multiple", "comparison", "series"],
		code: `xychart-beta
    title "Website Analytics"
    x-axis [Q1, Q2, Q3, Q4]
    y-axis "Visitors" 0 --> 10000
    bar "Desktop" [8000, 8500, 7000, 6500]
    bar "Mobile" [4000, 5500, 7500, 8000]
    line "Tablet" [2000, 2200, 2500, 2800]`,
	},
	{
		id: "xy-chart-performance",
		name: "Performance Metrics",
		category: "XY Chart",
		description: "Performance monitoring chart with multiple metrics",
		tags: ["xy-chart", "performance", "monitoring", "metrics"],
		code: `xychart-beta
    title "System Performance Metrics"
    x-axis ["00:00", "06:00", "12:00", "18:00", "24:00"]
    y-axis "Usage %" 0 --> 100
    line "CPU Usage" [20, 45, 80, 65, 30]
    line "Memory Usage" [30, 55, 70, 85, 40]
    line "Disk Usage" [10, 15, 25, 30, 20]`,
	},
	{
		id: "xy-chart-regional-sales",
		name: "Regional Sales Comparison",
		category: "XY Chart",
		description: "Quarterly revenue comparison across regions with targets",
		tags: ["xy-chart", "sales", "comparison", "revenue"],
		code: `xychart-beta
    title "Quarterly Regional Revenue"
    x-axis [Q1, Q2, Q3, Q4]
    y-axis "Revenue (USD)" 0 --> 200
    bar "Target" [120, 135, 150, 180]
    line "North America" [130, 140, 160, 175]
    line "Europe" [110, 125, 145, 165]
    line "Asia Pacific" [100, 130, 155, 190]`,
	},
];
