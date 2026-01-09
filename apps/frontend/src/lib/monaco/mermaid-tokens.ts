/**
 * Monaco Monarch Tokenizer for Mermaid Diagrams
 * Provides comprehensive syntax highlighting for all Mermaid diagram types
 * Uses Material-UI dark theme palette colors
 */

import type * as monaco from "monaco-editor";

/**
 * Monarch language definition for Mermaid syntax highlighting
 * Material-UI Dark Theme Color Palette:
 * - Primary: #90caf9 (blue)
 * - Secondary: #ce93d8 (purple)
 * - Success: #66bb6a (green)
 * - Error: #f44336 (red)
 * - Warning: #ffa726 (orange)
 * - Info: #29b6f6 (cyan)
 */
export const mermaidTokensProvider: monaco.languages.IMonarchLanguage = {
	defaultToken: "invalid",
	tokenPostfix: ".mermaid",

	// Keywords for different diagram types
	keywords: [
		// Diagram type keywords
		"graph",
		"flowchart",
		"sequenceDiagram",
		"classDiagram",
		"stateDiagram",
		"stateDiagram-v2",
		"erDiagram",
		"journey",
		"gantt",
		"pie",
		"gitGraph",
		"mindmap",
		"timeline",
		"quadrantChart",
		"requirementDiagram",
		"C4Context",
		"C4Container",
		"C4Component",
		"C4Dynamic",
		"C4Deployment",
		"sankey-beta",
		"xychart-beta",
		"block-beta",
		"packet-beta",
		// Direction keywords
		"TB",
		"TD",
		"BT",
		"RL",
		"LR",
		// Subgraph and styling
		"subgraph",
		"end",
		"style",
		"classDef",
		"class",
		"click",
		"call",
		"href",
		"linkStyle",
		"direction",
		// Sequence diagram keywords
		"participant",
		"actor",
		"activate",
		"deactivate",
		"note",
		"over",
		"loop",
		"alt",
		"else",
		"opt",
		"par",
		"and",
		"critical",
		"break",
		"rect",
		"autonumber",
		// Class diagram keywords
		"namespace",
		"interface",
		"abstract",
		"enum",
		"service",
		// State diagram keywords
		"state",
		"fork",
		"join",
		"choice",
		"concurrency",
		// ER diagram keywords
		"entity",
		"relationship",
		// Gantt keywords
		"dateFormat",
		"title",
		"excludes",
		"todayMarker",
		"section",
		"active",
		"done",
		"crit",
		"milestone",
		"after",
		// Git graph keywords
		"commit",
		"branch",
		"checkout",
		"merge",
		"cherry-pick",
		"reset",
		"revert",
		"tag",
		// Requirement diagram keywords
		"requirement",
		"functionalRequirement",
		"interfaceRequirement",
		"performanceRequirement",
		"physicalRequirement",
		"designConstraint",
		"element",
		"contains",
		"copies",
		"derives",
		"satisfies",
		"verifies",
		"refines",
		"traces",
		// C4 keywords
		"Person",
		"Person_Ext",
		"System",
		"System_Ext",
		"SystemDb",
		"SystemQueue",
		"System_Boundary",
		"Container",
		"Container_Ext",
		"ContainerDb",
		"ContainerQueue",
		"Container_Boundary",
		"Component",
		"Component_Ext",
		"ComponentDb",
		"ComponentQueue",
		"Rel",
		"BiRel",
		"Rel_Up",
		"Rel_Down",
		"Rel_Left",
		"Rel_Right",
		"Rel_Back",
		"RelIndex",
		"UpdateElementStyle",
		"UpdateRelStyle",
		"UpdateLayoutConfig",
		// Timeline keywords
		"period",
		// XY Chart keywords
		"x-axis",
		"y-axis",
		"line",
		"bar",
		// Packet keywords
		"packet",
		// Journey keywords
		"journey",
		"task",
	],

	// Operators and special characters
	operators: [
		"-->",
		"---",
		"-.->",
		"-.-",
		"==>",
		"===",
		"~~>",
		"~~~",
		"==",
		"--",
		"->>",
		"-->>",
		"-x",
		"--x",
		"-)",
		"--)",
		"->",
		"<->",
		"o--o",
		"<-->",
		"x--x",
		"<-->",
		"o..",
		"<..",
		"|",
		"||",
		"o|",
		"|o",
		"}|",
		"|{",
		"||--o{",
		"}o--||",
		"}|..|{",
		"||--|{",
		"}o..|{",
		"||..|{",
	],

	// Symbols
	symbols: /[=><!~?:&|+\-*/^%]+/,

	// C# style strings
	escapes:
		/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

	// The main tokenizer
	tokenizer: {
		root: [
			// Directives (%%{init: {...}}%%)
			[/%%\{[\s\S]*?\}%%/, "directive"],

			// Comments
			[/%%.+$/, "comment"],

			// Diagram type declarations (must come before identifiers)
			[
				/\b(?:graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|sankey-beta|xychart-beta|block-beta|packet-beta)\b/,
				"keyword.diagram-type",
			],

			// Direction keywords
			[/\b(?:TB|TD|BT|RL|LR)\b/, "keyword.direction"],

			// Keywords
			[
				/\b(?:subgraph|end|style|classDef|class|click|call|href|linkStyle|direction|participant|actor|activate|deactivate|note|over|loop|alt|else|opt|par|and|critical|break|rect|autonumber|namespace|interface|abstract|enum|service|state|fork|join|choice|concurrency|entity|relationship|dateFormat|title|excludes|todayMarker|section|active|done|crit|milestone|after|commit|branch|checkout|merge|cherry-pick|reset|revert|tag|requirement|functionalRequirement|interfaceRequirement|performanceRequirement|physicalRequirement|designConstraint|element|contains|copies|derives|satisfies|verifies|refines|traces|Person|Person_Ext|System|System_Ext|SystemDb|SystemQueue|System_Boundary|Container|Container_Ext|ContainerDb|ContainerQueue|Container_Boundary|Component|Component_Ext|ComponentDb|ComponentQueue|Rel|BiRel|Rel_Up|Rel_Down|Rel_Left|Rel_Right|Rel_Back|RelIndex|UpdateElementStyle|UpdateRelStyle|UpdateLayoutConfig|period|x-axis|y-axis|line|bar|packet|journey|task)\b/,
				"keyword",
			],

			// Node IDs and labels
			[/[A-Za-z_][\w]*(?=\[)/, "node.id"],
			[/[A-Za-z_][\w]*(?=\()/, "node.id"],
			[/[A-Za-z_][\w]*(?=\{)/, "node.id"],
			[/[A-Za-z_][\w]*(?=>)/, "node.id"],
			[/[A-Za-z_][\w]*(?=\|)/, "node.id"],

			// Strings in node labels [...], (...), {...}, >...], |...|
			[/\[/, { token: "bracket.node", bracket: "@open", next: "@nodeLabel" }],
			[/\(/, { token: "bracket.node", bracket: "@open", next: "@nodeLabel" }],
			[/\{/, { token: "bracket.node", bracket: "@open", next: "@nodeLabel" }],
			[/>/, { token: "bracket.node", next: "@nodeLabel" }],
			[/\|/, { token: "bracket.node", next: "@nodeLabelPipe" }],

			// Double quoted strings
			[/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
			[/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

			// Numbers
			[/\d+/, "number"],

			// Link operators
			[
				/(?:-->|---|-.->|-.-|==>|===|~~>|~~~|==|--|->|<->|->>|-->>|-x|--x|-\)|--\)|o--o|<-->|x--x|<-->|o\.\.|<\.\.)/,
				"operator.link",
			],

			// Relationship operators (ER diagram)
			[
				/(?:\|\|--o\{|\}o--\|\||\}\|\.\.|\{|\|\|--.|\{|\}o\.\.|\{|\|\|\.\.|\{)/,
				"operator.relationship",
			],

			// Delimiters and operators
			[/[;,.]/, "delimiter"],
			[/[{}()[\]]/, "@brackets"],
			[/@symbols/, "operator"],

			// Whitespace
			[/[ \t\r\n]+/, "white"],

			// Identifiers (catch-all)
			[/[a-zA-Z_]\w*/, "identifier"],
		],

		nodeLabel: [
			[/[^\])}>|\\]+/, "string.node-label"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/[\])}]/, { token: "bracket.node", bracket: "@close", next: "@pop" }],
			[/>/, { token: "bracket.node", next: "@pop" }],
		],

		nodeLabelPipe: [
			[/[^|\\]+/, "string.node-label"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/\|/, { token: "bracket.node", next: "@pop" }],
		],

		string: [
			[/[^\\"]+/, "string"],
			[/@escapes/, "string.escape"],
			[/\\./, "string.escape.invalid"],
			[/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
		],

		comment: [[/[^%]+/, "comment"]],

		directive: [[/[\s\S]*/, "directive"]],
	},
};
