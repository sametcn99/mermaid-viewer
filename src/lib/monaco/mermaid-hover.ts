/**
 * Monaco Hover Provider for Mermaid
 * Supplies contextual documentation snippets for common Mermaid keywords
 * and directives to help authors discover syntax while editing.
 */

import type * as monaco from "monaco-editor";

type HoverSection = {
	keywords: string[];
	title: string;
	description: string;
	example?: string;
};

type HoverEntry = {
	contents: monaco.IMarkdownString[];
};

const HOVER_SECTIONS: HoverSection[] = [
	{
		keywords: ["graph", "flowchart"],
		title: "Flowchart Diagram",
		description:
			"Introduces a flowchart. Follow the keyword with a direction such as `LR`, `RL`, `TB`, `TD`, or `BT` to control the layout.",
		example:
			"graph LR\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Continue]\n    B -->|No| D[Stop]",
	},
	{
		keywords: ["sequenceDiagram"],
		title: "Sequence Diagram",
		description:
			"Describes message exchanges between participants. Declare each actor with `participant` and connect them using arrows.",
		example:
			"sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->>Bob: Hello!",
	},
	{
		keywords: ["classDiagram"],
		title: "Class Diagram",
		description:
			"Models classes, interfaces, and their relationships. Use `class`, `classDef`, and relationship arrows to build UML diagrams.",
		example:
			"classDiagram\n    class Car {\n        +start()\n    }\n    class Engine\n    Car *-- Engine",
	},
	{
		keywords: ["stateDiagram", "stateDiagram-v2"],
		title: "State Diagram",
		description:
			"Captures system states and transitions. Start with `[ * ]` for the initial state and connect states with arrows.",
		example:
			"stateDiagram-v2\n    [*] --> Idle\n    Idle --> Running : play\n    Running --> [*] : stop",
	},
	{
		keywords: ["erDiagram"],
		title: "Entity Relationship Diagram",
		description:
			"Defines entities and their relationships. Use cardinalities such as `||--o{` to describe constraints.",
		example:
			"erDiagram\n    USER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains",
	},
	{
		keywords: ["journey"],
		title: "User Journey Diagram",
		description:
			"Represents user journeys. Group activities inside `section` blocks and score experiences with values from 1 to 5.",
		example:
			"journey\n    title Onboarding\n    section Sign-up\n      Register: 4: User\n      Confirm email: 3: User",
	},
	{
		keywords: ["gantt"],
		title: "Gantt Chart",
		description:
			"Visualizes project timelines. Use `dateFormat`, `section`, and task rows with start dates and durations.",
		example:
			"gantt\n    title Sample Project\n    dateFormat YYYY-MM-DD\n    section Planning\n      Spec :done, a1, 2024-01-01, 5d\n      Review :crit, a2, after a1, 3d",
	},
	{
		keywords: ["pie"],
		title: "Pie Chart",
		description:
			"Renders proportional data. Provide a title and one or more label/value pairs.",
		example:
			'pie title Languages\n    "TypeScript" : 55\n    "Python" : 30\n    "Other" : 15',
	},
	{
		keywords: ["gitGraph"],
		title: "Git Graph",
		description:
			"Illustrates Git commit history. Combine `commit`, `branch`, and `merge` commands to show repository flow.",
		example:
			'gitGraph\n    commit id: "init"\n    branch feature\n    checkout feature\n    commit id: "feature work"',
	},
	{
		keywords: ["mindmap"],
		title: "Mindmap Diagram",
		description:
			"Creates hierarchical trees centred around a root node. Indent branches to grow the map.",
		example: "mindmap\n  root((Idea))\n    Subtopic One\n      Detail",
	},
	{
		keywords: ["timeline"],
		title: "Timeline Diagram",
		description:
			"Displays events over time. Declare a `title` and list dated milestones or spans.",
		example:
			"timeline\n    title Product Launch\n    2024-01-01 : Kick-off\n    2024-03-15 : Beta",
	},
	{
		keywords: ["quadrantChart"],
		title: "Quadrant Chart",
		description:
			"Plots items across four labelled quadrants for prioritisation or classification tasks.",
		example:
			"quadrantChart\n    title Priority Matrix\n    x-axis Low --> High\n    y-axis Low --> High\n    FeatureA: [0.8, 0.9]",
	},
	{
		keywords: ["requirementDiagram"],
		title: "Requirement Diagram",
		description:
			"Captures system requirements and their relationships (`satisfies`, `verifies`, `contains`, etc.).",
		example:
			"requirementDiagram\n    requirement req1 {\n        id: 1\n        text: Authentication\n        risk: high\n    }",
	},
	{
		keywords: [
			"C4Context",
			"C4Container",
			"C4Component",
			"C4Dynamic",
			"C4Deployment",
		],
		title: "C4 Diagram",
		description:
			"Provides architectural views following the C4 model. Use context, container, component, dynamic, and deployment diagrams to describe systems.",
	},
	{
		keywords: ["sankey-beta"],
		title: "Sankey Diagram (Beta)",
		description:
			"Displays flow quantities between stages. Each row uses the format `Source,Target,Value`.",
		example: "sankey-beta\n    Production,Sales,40\n    Sales,Returns,5",
	},
	{
		keywords: ["xychart-beta"],
		title: "XY Chart (Beta)",
		description:
			"Plots numerical series on X/Y axes. Define labels with `x-axis` and ranges with `y-axis`.",
		example:
			'xychart-beta\n    title "KPIs"\n    x-axis [Jan, Feb, Mar]\n    y-axis "Score" 0 --> 100\n    line [20, 35, 50]',
	},
	{
		keywords: ["block-beta"],
		title: "Block Diagram (Beta)",
		description:
			"Arranges content into responsive columns using the experimental block diagram syntax.",
		example: "block-beta\n  columns 3\n  Header A B C",
	},
	{
		keywords: ["packet-beta"],
		title: "Packet Diagram (Beta)",
		description:
			"Visualises packet structures by marking bit ranges and labels.",
		example: 'packet-beta\n0-7: "Version"\n8-15: "Flags"',
	},
	{
		keywords: ["subgraph", "end"],
		title: "Subgraph Block",
		description:
			"Groups nodes inside flowcharts. Use `subgraph <label>` to open the block and `end` to close it.",
		example: "subgraph Process\n    A --> B\nend",
	},
	{
		keywords: ["style", "classDef", "class"],
		title: "Styling Helpers",
		description:
			"Customize presentation by defining reusable classes (`classDef`), applying them (`class`), or styling individual nodes (`style`).",
	},
	{
		keywords: ["click", "linkStyle"],
		title: "Interactivity",
		description:
			"Make diagrams interactive. Attach links with `click` or adjust edge appearance using `linkStyle`.",
	},
	{
		keywords: [
			"participant",
			"actor",
			"autonumber",
			"activate",
			"deactivate",
			"note",
			"loop",
			"alt",
			"opt",
			"par",
		],
		title: "Sequence Diagram Keywords",
		description:
			"Sequence diagrams rely on these helpers for participants, activation blocks, notes, and branching structures.",
	},
	{
		keywords: ["dateFormat", "section", "task", "done", "crit", "milestone"],
		title: "Gantt Chart Keywords",
		description:
			"Control timelines with `dateFormat`, group bars using `section`, and annotate tasks with markers like `done`, `crit`, or `milestone`.",
	},
	{
		keywords: ["TB", "TD", "BT", "LR", "RL"],
		title: "Layout Direction",
		description:
			"Defines diagram orientation. Use these values after a flowchart directive to adjust rendering direction.",
	},
];

const HOVER_LOOKUP = new Map<string, HoverEntry>();

function buildMarkdown(section: HoverSection): monaco.IMarkdownString[] {
	let value = `**${section.title}**\n\n${section.description}`;
	if (section.example) {
		value += `\n\n\`\`\`mermaid\n${section.example}\n\`\`\``;
	}
	return [{ value }];
}

for (const section of HOVER_SECTIONS) {
	const contents = buildMarkdown(section);
	for (const keyword of section.keywords) {
		if (!HOVER_LOOKUP.has(keyword)) {
			HOVER_LOOKUP.set(keyword, { contents });
		}
	}
}

function isTokenCharacter(char: string): boolean {
	return /[A-Za-z0-9_-]/.test(char);
}

function extractTokenAtPosition(
	model: monaco.editor.ITextModel,
	position: monaco.Position,
): { value: string; range: monaco.IRange } | null {
	const wordInfo = model.getWordAtPosition(position);
	if (wordInfo?.word) {
		return {
			value: wordInfo.word,
			range: {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: wordInfo.startColumn,
				endColumn: wordInfo.endColumn,
			},
		};
	}

	const lineContent = model.getLineContent(position.lineNumber);
	if (!lineContent) {
		return null;
	}

	const lineLength = lineContent.length;
	if (lineLength === 0) {
		return null;
	}

	const rawIndex = Math.min(Math.max(position.column - 1, 0), lineLength);
	let anchorIndex = rawIndex;

	if (anchorIndex === lineLength) {
		anchorIndex -= 1;
	}

	if (anchorIndex < 0) {
		return null;
	}

	if (!isTokenCharacter(lineContent[anchorIndex])) {
		if (anchorIndex > 0 && isTokenCharacter(lineContent[anchorIndex - 1])) {
			anchorIndex -= 1;
		} else if (
			anchorIndex + 1 < lineLength &&
			isTokenCharacter(lineContent[anchorIndex + 1])
		) {
			anchorIndex += 1;
		} else {
			return null;
		}
	}

	let startIndex = anchorIndex;
	while (startIndex > 0 && isTokenCharacter(lineContent[startIndex - 1])) {
		startIndex -= 1;
	}

	let endIndex = anchorIndex + 1;
	while (endIndex < lineLength && isTokenCharacter(lineContent[endIndex])) {
		endIndex += 1;
	}

	if (startIndex === endIndex) {
		return null;
	}

	const value = lineContent.slice(startIndex, endIndex);
	return {
		value,
		range: {
			startLineNumber: position.lineNumber,
			endLineNumber: position.lineNumber,
			startColumn: startIndex + 1,
			endColumn: endIndex + 1,
		},
	};
}

export const mermaidHoverProvider: monaco.languages.HoverProvider = {
	provideHover: (model, position) => {
		const token = extractTokenAtPosition(model, position);
		if (!token) {
			return null;
		}

		const entry = HOVER_LOOKUP.get(token.value);
		if (!entry) {
			return null;
		}

		return {
			range: token.range,
			contents: entry.contents,
		};
	},
};
