# Mermaid Live Editor & Viewer

A simple web application built with Next.js that allows you to create, view, and edit [Mermaid](https://mermaid.js.org/) diagrams in real-time.

## Features

- **Live Preview:**
- **Split View:**
- **Syntax Highlighting:**
- **Responsive Design:**
- **Debounced Rendering:**
- **Quickly Share Diagrams**

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sametcn99/mermaid-viewer.git # Replace with your repo URL
   cd mermaid-viewer
   ```

2. Install dependencies:

   ```bash
   bun install # or npm install / yarn install / pnpm install
   ```

### Running the Development Server

```bash
bun dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The editor panel is on the left (or top on small screens), and the diagram preview is on the right (or bottom).

## How It Works

- The application uses `react-split` for the adjustable panels.
- The editor uses `@monaco-editor/react` (or your chosen editor component) for code input.
- Mermaid code changes trigger a debounced update to the diagram panel.
- The `DiagramPanel` component renders the Mermaid code using the Mermaid.js library.

## Technology Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mermaid.js](https://mermaid.js.org/)
- [Material UI (MUI)](https://mui.com/) (for UI components and styling)
- `react-split`
- `lodash.debounce`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
