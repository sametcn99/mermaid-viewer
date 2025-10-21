"use client";

import {
	DIAGRAM_TEMPLATES,
	TEMPLATE_CATEGORIES,
	getTemplateCategoryCount,
	searchTemplates,
	type DiagramTemplate,
	type TemplateCategory,
} from "@/lib/templates";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	InputAdornment,
	List,
	ListItemButton,
	ListItemText,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import {
	FileText,
	Search,
	X,
	GitBranch,
	Database,
	Network,
	Calendar,
	Boxes,
	PieChart,
	GitGraph,
	Brain,
	Clock,
	Grid3x3,
	UserCircle,
	Building,
	Workflow,
	FileCheck,
	BarChart3,
	Layers,
	Package,
} from "lucide-react";
import { useMemo, useState } from "react";

interface TemplateDialogProps {
	open: boolean;
	onClose: () => void;
	onSelectTemplate: (code: string, name: string) => void;
}

const CATEGORY_ICONS: Record<TemplateCategory, React.ReactNode> = {
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

export default function TemplateDialog({
	open,
	onClose,
	onSelectTemplate,
}: TemplateDialogProps) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [selectedCategory, setSelectedCategory] = useState<
		TemplateCategory | "All"
	>("All");
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Filter templates based on category and search
	const filteredTemplates = useMemo(() => {
		let templates = DIAGRAM_TEMPLATES;

		// Filter by category
		if (selectedCategory !== "All") {
			templates = templates.filter(
				(template) => template.category === selectedCategory,
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			templates = searchTemplates(searchQuery);
			if (selectedCategory !== "All") {
				templates = templates.filter(
					(template) => template.category === selectedCategory,
				);
			}
		}

		return templates;
	}, [selectedCategory, searchQuery]);

	const handleSelectTemplate = (template: DiagramTemplate) => {
		onSelectTemplate(template.code, template.name);
		onClose();
		setSearchQuery("");
		setSelectedCategory("All");
	};

	const handleClose = () => {
		onClose();
		setSearchQuery("");
		setSelectedCategory("All");
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="lg"
			fullWidth
			fullScreen={isMobile}
			PaperProps={{
				sx: {
					height: isMobile ? "100%" : "80vh",
				},
			}}
		>
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<FileText size={24} />
						<Typography variant="h6">Browse Templates</Typography>
					</Box>
					<IconButton onClick={handleClose} size="small">
						<X />
					</IconButton>
				</Box>
				<TextField
					fullWidth
					placeholder="Search templates by name, description, or tags..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					size="small"
					sx={{ mt: 2 }}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search size={20} />
							</InputAdornment>
						),
					}}
				/>
			</DialogTitle>
			<Divider />
			<DialogContent sx={{ p: 0, display: "flex", height: "100%" }}>
				{/* Sidebar - Categories */}
				<Box
					sx={{
						width: isMobile ? "100%" : 250,
						borderRight: isMobile ? 0 : 1,
						borderColor: "divider",
						overflowY: "auto",
						display: isMobile && selectedCategory !== "All" ? "none" : "block",
					}}
				>
					<List>
						<ListItemButton
							selected={selectedCategory === "All"}
							onClick={() => setSelectedCategory("All")}
						>
							<ListItemText
								primary="All Templates"
								secondary={`${DIAGRAM_TEMPLATES.length} templates`}
							/>
						</ListItemButton>
						<Divider />
						{TEMPLATE_CATEGORIES.map((category) => {
							const count = getTemplateCategoryCount(category);
							return (
								<ListItemButton
									key={category}
									selected={selectedCategory === category}
									onClick={() => setSelectedCategory(category)}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											width: "100%",
										}}
									>
										{CATEGORY_ICONS[category]}
										<ListItemText
											primary={category}
											secondary={`${count} template${count !== 1 ? "s" : ""}`}
										/>
									</Box>
								</ListItemButton>
							);
						})}
					</List>
				</Box>

				{/* Main Content - Templates Grid */}
				<Box
					sx={{
						flex: 1,
						overflowY: "auto",
						p: 2,
						display: isMobile && selectedCategory === "All" ? "none" : "block",
					}}
				>
					{isMobile && selectedCategory !== "All" && (
						<Button
							startIcon={<X size={16} />}
							onClick={() => setSelectedCategory("All")}
							sx={{ mb: 2 }}
						>
							Back to Categories
						</Button>
					)}

					{filteredTemplates.length === 0 ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								gap: 2,
							}}
						>
							<Search size={48} opacity={0.3} />
							<Typography variant="h6" color="text.secondary">
								No templates found
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Try adjusting your search or category filter
							</Typography>
						</Box>
					) : (
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "repeat(2, 1fr)",
									md: "repeat(3, 1fr)",
								},
								gap: 2,
							}}
						>
							{filteredTemplates.map((template) => (
								<Card
									key={template.id}
									variant="outlined"
									sx={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
										transition: "all 0.2s",
										bgcolor: "transparent",
										"&:hover": {
											boxShadow: theme.shadows[4],
										},
									}}
								>
									<CardContent sx={{ flexGrow: 1 }}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
												mb: 1,
											}}
										>
											{CATEGORY_ICONS[template.category]}
											<Typography variant="h6" component="div">
												{template.name}
											</Typography>
										</Box>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 1.5 }}
										>
											{template.description}
										</Typography>
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
											{template.tags.map((tag) => (
												<Chip
													key={tag}
													label={tag}
													size="small"
													variant="outlined"
												/>
											))}
										</Box>
									</CardContent>
									<CardActions>
										<Button
											fullWidth
											variant="contained"
											onClick={() => handleSelectTemplate(template)}
										>
											Use Template
										</Button>
									</CardActions>
								</Card>
							))}
						</Box>
					)}
				</Box>
			</DialogContent>
		</Dialog>
	);
}
