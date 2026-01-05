"use client";

import {
	BarChart3,
	Boxes,
	Brain,
	Building,
	Calendar,
	Database,
	FileCheck,
	GitBranch,
	GitGraph,
	Grid3x3,
	Layers,
	Network,
	Package,
	PieChart,
	UserCircle,
	Workflow,
	Clock,
} from "lucide-react";

import type { TemplateCategory } from "@/lib/templates";

export const CATEGORY_ICONS: Record<TemplateCategory, React.ReactNode> = {
	Flowchart: <GitBranch size={20} />,
	Sequence: <Network size={20} />,
	Class: <Boxes size={20} />,
	"ER Diagram": <Database size={20} />,
	Gantt: <Calendar size={20} />,
	State: <GitGraph size={20} />,
	"Pie Chart": <PieChart size={20} />,
	"Git Graph": <GitGraph size={20} />,
	Mindmap: <Brain size={20} />,
	Timeline: <Clock size={20} />,
	"Quadrant Chart": <Grid3x3 size={20} />,
	"User Journey": <UserCircle size={20} />,
	"C4 Diagram": <Building size={20} />,
	Sankey: <Workflow size={20} />,
	Requirement: <FileCheck size={20} />,
	"XY Chart": <BarChart3 size={20} />,
	Block: <Layers size={20} />,
	Packet: <Package size={20} />,
};

export const NEW_COLLECTION_OPTION = "__new__";
