/**
 * Monaco Completion Provider for Mermaid
 * Provides intelligent autocomplete suggestions for all Mermaid diagram types
 */

import type * as monaco from "monaco-editor";

// A custom type that makes the 'range' property optional for our initial definitions
type MermaidCompletionItem = Omit<monaco.languages.CompletionItem, "range"> & {
	range?: monaco.languages.CompletionItem["range"];
};

/**
 * Keywords organized by category for better completion suggestions
 * Note: Strings contain Monaco snippet syntax ($1, ${1:default}, etc.)
 * These are NOT template literals - they're Monaco's snippet format
 */

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const DIAGRAM_TYPES: MermaidCompletionItem[] = [
	{
		label: "graph",
		kind: 14, // Keyword
		insertText: "graph ${1|TB,TD,BT,LR,RL|}\n    $0",
		insertTextRules: 4, // InsertAsSnippet
		documentation: "Create a flowchart diagram",
		detail: "Flowchart",
	},
	{
		label: "flowchart",
		kind: 14,
		insertText: "flowchart ${1|TB,TD,BT,LR,RL|}\n    $0",
		insertTextRules: 4,
		documentation: "Create a flowchart diagram (recommended over 'graph')",
		detail: "Flowchart",
	},
	{
		label: "sequenceDiagram",
		kind: 14,
		insertText: "sequenceDiagram\n    participant ${1:A}\n    participant ${2:B}\n    $0",
		insertTextRules: 4,
		documentation: "Create a sequence diagram showing interactions between actors",
		detail: "Sequence Diagram",
	},
	{
		label: "classDiagram",
		kind: 14,
		insertText:
			"classDiagram\n    class ${1:ClassName} {\n        ${2:+attribute}\n        ${3:+method()}\n    }\n    $0",
		insertTextRules: 4,
		documentation: "Create a UML class diagram",
		detail: "Class Diagram",
	},
	{
		label: "stateDiagram-v2",
		kind: 14,
		insertText: "stateDiagram-v2\n    [*] --> ${1:State1}\n    $0",
		insertTextRules: 4,
		documentation: "Create a state diagram showing state transitions",
		detail: "State Diagram",
	},
	{
		label: "erDiagram",
		kind: 14,
		insertText:
			'erDiagram\n    ${1:ENTITY1} ||--o{ ${2:ENTITY2} : "${3:relationship}"\n    $0',
		insertTextRules: 4,
		documentation: "Create an Entity-Relationship diagram",
		detail: "ER Diagram",
	},
	{
		label: "gantt",
		kind: 14,
		insertText:
			"gantt\n    title ${1:Project Schedule}\n    dateFormat YYYY-MM-DD\n    section ${2:Section}\n    ${3:Task} :${4:a1}, ${5:2024-01-01}, ${6:30d}\n    $0",
		insertTextRules: 4,
		documentation: "Create a Gantt chart for project scheduling",
		detail: "Gantt Chart",
	},
	{
		label: "pie",
		kind: 14,
		insertText: 'pie title ${1:Title}\n    "${2:Label}" : ${3:40}\n    $0',
		insertTextRules: 4,
		documentation: "Create a pie chart",
		detail: "Pie Chart",
	},
	{
		label: "gitGraph",
		kind: 14,
		insertText: 'gitGraph\n    commit id: "${1:Initial commit}"\n    $0',
		insertTextRules: 4,
		documentation: "Create a Git graph showing branches and commits",
		detail: "Git Graph",
	},
	{
		label: "mindmap",
		kind: 14,
		insertText: "mindmap\n  root((${1:Central Idea}))\n    ${2:Branch 1}\n    $0",
		insertTextRules: 4,
		documentation: "Create a mindmap diagram",
		detail: "Mindmap",
	},
	{
		label: "timeline",
		kind: 14,
		insertText: "timeline\n    title ${1:Timeline}\n    ${2:2024} : ${3:Event}\n    $0",
		insertTextRules: 4,
		documentation: "Create a timeline diagram",
		detail: "Timeline",
	},
	{
		label: "quadrantChart",
		kind: 14,
		insertText:
			'quadrantChart\n    title ${1:Title}\n    x-axis ${2:Low} --> ${3:High}\n    y-axis ${4:Low} --> ${5:High}\n    ${6:Item}: [${7:0.5}, ${8:0.5}]\n    $0',
		insertTextRules: 4,
		documentation: "Create a quadrant chart for prioritization",
		detail: "Quadrant Chart",
	},
	{
		label: "requirementDiagram",
		kind: 14,
		insertText:
			'requirementDiagram\n    requirement ${1:req1} {\n        id: ${2:1}\n        text: ${3:description}\n        risk: ${4|low,medium,high|}\n        verifymethod: ${5|test,inspection,analysis,demonstration|}\n    }\n    $0',
		insertTextRules: 4,
		documentation: "Create a requirement diagram",
		detail: "Requirement Diagram",
	},
	{
		label: "C4Context",
		kind: 14,
		insertText:
			'C4Context\n    title ${1:System Context}\n    Person(${2:user}, "${3:User}", "${4:Description}")\n    System(${5:system}, "${6:System}", "${7:Description}")\n    Rel(${2:user}, ${5:system}, "${8:Uses}")\n    $0',
		insertTextRules: 4,
		documentation: "Create a C4 Context diagram",
		detail: "C4 Diagram",
	},
	{
		label: "sankey-beta",
		kind: 14,
		insertText:
			"sankey-beta\n    ${1:Source},${2:Target},${3:Value}\n    ${4:A},${5:B},${6:10}\n    $0",
		insertTextRules: 4,
		documentation: "Create a Sankey diagram (Beta feature)",
		detail: "Sankey Diagram",
	},
	{
		label: "xychart-beta",
		kind: 14,
		insertText:
			'xychart-beta\n    title "${1:Chart Title}"\n    x-axis [${2:A}, ${3:B}, ${4:C}]\n    y-axis "${5:Y Label}" ${6:0} --> ${7:100}\n    line [${8:10}, ${9:20}, ${10:30}]\n    $0',
		insertTextRules: 4,
		documentation: "Create an XY chart (Beta feature)",
		detail: "XY Chart",
	},
	{
		label: "block-beta",
		kind: 14,
		insertText: 'block-beta\n  columns ${1:3}\n  ${2:A} ${3:B} ${4:C}\n  $0',
		insertTextRules: 4,
		documentation: "Create a block diagram (Beta feature)",
		detail: "Block Diagram",
	},
	{
		label: "packet-beta",
		kind: 14,
		insertText: 'packet-beta\n0-15: "${1:Field Name}"\n$0',
		insertTextRules: 4,
		documentation: "Create a packet diagram (Beta feature)",
		detail: "Packet Diagram",
	},
	{
		label: "journey",
		kind: 14,
		insertText:
			"journey\n    title ${1:User Journey}\n    section ${2:Section}\n      ${3:Task}: ${4:5}: ${5:Actor}\n      $0",
		insertTextRules: 4,
		documentation: "Create a user journey diagram",
		detail: "User Journey",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const FLOWCHART_KEYWORDS: MermaidCompletionItem[] = [
	{
		label: "subgraph",
		kind: 14,
		insertText: "subgraph ${1:title}\n    $0\nend",
		insertTextRules: 4,
		documentation: "Create a subgraph/container",
		detail: "Flowchart",
	},
	{
		label: "end",
		kind: 14,
		insertText: "end",
		documentation: "End a subgraph block",
		detail: "Flowchart",
	},
	{
		label: "style",
		kind: 14,
		insertText:
			"style ${1:nodeId} fill:${2:#f9f},stroke:${3:#333},stroke-width:${4:2px}",
		insertTextRules: 4,
		documentation: "Apply styling to a node",
		detail: "Styling",
	},
	{
		label: "classDef",
		kind: 14,
		insertText: "classDef ${1:className} fill:${2:#f9f},stroke:${3:#333}",
		insertTextRules: 4,
		documentation: "Define a reusable CSS class",
		detail: "Styling",
	},
	{
		label: "class",
		kind: 14,
		insertText: "class ${1:nodeId} ${2:className}",
		insertTextRules: 4,
		documentation: "Apply a CSS class to nodes",
		detail: "Styling",
	},
	{
		label: "click",
		kind: 14,
		insertText: 'click ${1:nodeId} "${2:http://example.com}" "${3:Tooltip}"',
		insertTextRules: 4,
		documentation: "Add a click event to a node",
		detail: "Interactivity",
	},
	{
		label: "linkStyle",
		kind: 14,
		insertText: "linkStyle ${1:0} stroke:${2:#ff3},stroke-width:${3:2px}",
		insertTextRules: 4,
		documentation: "Style a specific link/edge",
		detail: "Styling",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const SEQUENCE_KEYWORDS: MermaidCompletionItem[] = [
	{
		label: "participant",
		kind: 14,
		insertText: "participant ${1:name}",
		insertTextRules: 4,
		documentation: "Define a participant in the sequence",
		detail: "Sequence Diagram",
	},
	{
		label: "actor",
		kind: 14,
		insertText: "actor ${1:name}",
		insertTextRules: 4,
		documentation: "Define an actor (shown as stick figure)",
		detail: "Sequence Diagram",
	},
	{
		label: "activate",
		kind: 14,
		insertText: "activate ${1:participant}",
		insertTextRules: 4,
		documentation: "Activate a participant (show lifeline)",
		detail: "Sequence Diagram",
	},
	{
		label: "deactivate",
		kind: 14,
		insertText: "deactivate ${1:participant}",
		insertTextRules: 4,
		documentation: "Deactivate a participant",
		detail: "Sequence Diagram",
	},
	{
		label: "note",
		kind: 14,
		insertText: "note ${1|left of,right of,over|} ${2:participant}: ${3:text}",
		insertTextRules: 4,
		documentation: "Add a note",
		detail: "Sequence Diagram",
	},
	{
		label: "loop",
		kind: 14,
		insertText: "loop ${1:condition}\n    $0\nend",
		insertTextRules: 4,
		documentation: "Create a loop block",
		detail: "Sequence Diagram",
	},
	{
		label: "alt",
		kind: 14,
		insertText: "alt ${1:condition}\n    $0\nelse\n    \nend",
		insertTextRules: 4,
		documentation: "Create an alternative path block",
		detail: "Sequence Diagram",
	},
	{
		label: "opt",
		kind: 14,
		insertText: "opt ${1:condition}\n    $0\nend",
		insertTextRules: 4,
		documentation: "Create an optional block",
		detail: "Sequence Diagram",
	},
	{
		label: "par",
		kind: 14,
		insertText: "par ${1:label}\n    $0\nand\n    \nend",
		insertTextRules: 4,
		documentation: "Create parallel execution block",
		detail: "Sequence Diagram",
	},
	{
		label: "autonumber",
		kind: 14,
		insertText: "autonumber",
		documentation: "Enable automatic message numbering",
		detail: "Sequence Diagram",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const GANTT_KEYWORDS: MermaidCompletionItem[] = [
	{
		label: "dateFormat",
		kind: 14,
		insertText: "dateFormat ${1:YYYY-MM-DD}",
		insertTextRules: 4,
		documentation: "Set the date format for the Gantt chart",
		detail: "Gantt Chart",
	},
	{
		label: "title",
		kind: 14,
		insertText: "title ${1:Project Title}",
		insertTextRules: 4,
		documentation: "Set the title of the diagram",
		detail: "Gantt Chart",
	},
	{
		label: "section",
		kind: 14,
		insertText: "section ${1:Section Name}",
		insertTextRules: 4,
		documentation: "Create a new section in the Gantt chart",
		detail: "Gantt Chart",
	},
	{
		label: "task",
		kind: 14,
		insertText: "${1:Task name} :${2:a1}, ${3:2024-01-01}, ${4:30d}",
		insertTextRules: 4,
		documentation: "Add a task with ID, start date, and duration",
		detail: "Gantt Chart",
	},
	{
		label: "active",
		kind: 14,
		insertText: "active, ",
		documentation: "Mark task as active",
		detail: "Gantt Chart",
	},
	{
		label: "done",
		kind: 14,
		insertText: "done, ",
		documentation: "Mark task as done",
		detail: "Gantt Chart",
	},
	{
		label: "crit",
		kind: 14,
		insertText: "crit, ",
		documentation: "Mark task as critical",
		detail: "Gantt Chart",
	},
	{
		label: "milestone",
		kind: 14,
		insertText: "milestone, ",
		documentation: "Mark task as milestone",
		detail: "Gantt Chart",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const GIT_KEYWORDS: MermaidCompletionItem[] = [
	{
		label: "commit",
		kind: 14,
		insertText: 'commit id: "${1:message}"',
		insertTextRules: 4,
		documentation: "Create a commit",
		detail: "Git Graph",
	},
	{
		label: "branch",
		kind: 14,
		insertText: "branch ${1:branch-name}",
		insertTextRules: 4,
		documentation: "Create a new branch",
		detail: "Git Graph",
	},
	{
		label: "checkout",
		kind: 14,
		insertText: "checkout ${1:branch-name}",
		insertTextRules: 4,
		documentation: "Switch to a branch",
		detail: "Git Graph",
	},
	{
		label: "merge",
		kind: 14,
		insertText: "merge ${1:branch-name}",
		insertTextRules: 4,
		documentation: "Merge a branch",
		detail: "Git Graph",
	},
];

const ARROWS: MermaidCompletionItem[] = [
	{
		label: "-->",
		kind: 12,
		insertText: " --> ",
		documentation: "Solid arrow with text",
		detail: "Arrow",
	},
	{
		label: "-.->",
		kind: 12,
		insertText: " -.-> ",
		documentation: "Dotted arrow",
		detail: "Arrow",
	},
	{
		label: "==>",
		kind: 12,
		insertText: " ==> ",
		documentation: "Thick arrow",
		detail: "Arrow",
	},
	{
		label: "->>",
		kind: 12,
		insertText: "->>",
		documentation: "Solid line with arrowhead (sequence)",
		detail: "Sequence Arrow",
	},
	{
		label: "-->>",
		kind: 12,
		insertText: "-->>",
		documentation: "Dashed line with arrowhead (sequence)",
		detail: "Sequence Arrow",
	},
	{
		label: "-x",
		kind: 12,
		insertText: "-x",
		documentation: "Solid line with cross (sequence)",
		detail: "Sequence Arrow",
	},
	{
		label: "--x",
		kind: 12,
		insertText: "--x",
		documentation: "Dashed line with cross (sequence)",
		detail: "Sequence Arrow",
	},
	{
		label: "-)",
		kind: 12,
		insertText: "-)",
		documentation: "Solid line with open arrow (sequence)",
		detail: "Sequence Arrow",
	},
	{
		label: "--)",
		kind: 12,
		insertText: "--)",
		documentation: "Dashed line with open arrow (sequence)",
		detail: "Sequence Arrow",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const NODE_SHAPES: MermaidCompletionItem[] = [
	{
		label: "[Rectangle]",
		kind: 15,
		insertText: "[${1:text}]",
		insertTextRules: 4,
		documentation: "Rectangular node",
		detail: "Node Shape",
	},
	{
		label: "(Rounded)",
		kind: 15,
		insertText: "(${1:text})",
		insertTextRules: 4,
		documentation: "Node with rounded edges",
		detail: "Node Shape",
	},
	{
		label: "([Stadium])",
		kind: 15,
		insertText: "([${1:text}])",
		insertTextRules: 4,
		documentation: "Stadium-shaped node",
		detail: "Node Shape",
	},
	{
		label: "[[Subroutine]]",
		kind: 15,
		insertText: "[[${1:text}]]",
		insertTextRules: 4,
		documentation: "Subroutine shape",
		detail: "Node Shape",
	},
	{
		label: "[(Database)]",
		kind: 15,
		insertText: "[(${1:text})]",
		insertTextRules: 4,
		documentation: "Database cylinder shape",
		detail: "Node Shape",
	},
	{
		label: "{Diamond}",
		kind: 15,
		insertText: "{${1:text}}",
		insertTextRules: 4,
		documentation: "Diamond decision node",
		detail: "Node Shape",
	},
	{
		label: "{{Hexagon}}",
		kind: 15,
		insertText: "{{${1:text}}}",
		insertTextRules: 4,
		documentation: "Hexagon shape",
		detail: "Node Shape",
	},
	{
		label: ">Asymmetric]",
		kind: 15,
		insertText: ">${1:text}]",
		insertTextRules: 4,
		documentation: "Asymmetric shape",
		detail: "Node Shape",
	},
	{
		label: "((Circle))",
		kind: 15,
		insertText: "((${1:text}))",
		insertTextRules: 4,
		documentation: "Circle shape",
		detail: "Node Shape",
	},
];

// biome-ignore lint/suspicious/noTemplateCurlyInString: Monaco snippet placeholders
const DIRECTIVES: MermaidCompletionItem[] = [
	{
		label: "%%{init}%%",
		kind: 15,
		insertText: "%%{init: {'theme':'${1|default,dark,forest,neutral|}'}}%%",
		insertTextRules: 4,
		documentation: "Initialize diagram with theme configuration",
		detail: "Directive",
	},
	{
		label: "Comment",
		kind: 3,
		insertText: "%% ${1:comment}",
		insertTextRules: 4,
		documentation: "Add a comment line",
		detail: "Comment",
	},
];

/**
 * Completion item provider for Mermaid language
 */
export const mermaidCompletionProvider: monaco.languages.CompletionItemProvider =
	{
		provideCompletionItems: (model, position) => {
			const textUntilPosition = model.getValueInRange({
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column,
			});

			const word = model.getWordUntilPosition(position);
			const range = {
				startLineNumber: position.lineNumber,
				endLineNumber: position.lineNumber,
				startColumn: word.startColumn,
				endColumn: word.endColumn,
			};

			// Determine context
			const lines = textUntilPosition.split("\n");
			const firstLine = lines[0].trim();

			// If we're at the start or first line, suggest diagram types
			if (position.lineNumber === 1 || !firstLine) {
				return {
					suggestions: [...DIAGRAM_TYPES, ...DIRECTIVES].map((item) => ({
						...item,
						range,
					})),
				};
			}

			// Determine diagram type from first line
			const diagramType = firstLine.split(/\s+/)[0];

			let suggestions: MermaidCompletionItem[] = [
				...DIRECTIVES,
				...NODE_SHAPES,
			];

			// Add context-specific suggestions based on diagram type
			switch (diagramType) {
				case "graph":
				case "flowchart":
					suggestions.push(
						...FLOWCHART_KEYWORDS,
						...ARROWS,
						...NODE_SHAPES,
					);
					break;
				case "sequenceDiagram":
					suggestions.push(...SEQUENCE_KEYWORDS, ...ARROWS);
					break;
				case "gantt":
					suggestions.push(...GANTT_KEYWORDS);
					break;
				case "gitGraph":
					suggestions.push(...GIT_KEYWORDS);
					break;
				default:
					// For other diagram types, provide general keywords
					suggestions.push(
						...FLOWCHART_KEYWORDS,
						...SEQUENCE_KEYWORDS,
					);
			}

			return {
				suggestions: suggestions.map(
					(item) =>
						({
							...item,
							range,
						}) as monaco.languages.CompletionItem,
				),
			};
		},
	};
