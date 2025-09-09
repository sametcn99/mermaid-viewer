<div align="center">

# 🧜‍♀️ Mermaid Live Editor & Viewer

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mermaid](https://img.shields.io/badge/Mermaid-11.11.0-FF3670?logo=mermaid&logoColor=white)](https://mermaid.js.org/)
[![MUI](https://img.shields.io/badge/MUI-7.3.2-007FFF?logo=mui&logoColor=white)](https://mui.com/)

**🚀 Create, edit, and share beautiful Mermaid diagrams in real-time!**

*A powerful, modern web application that transforms your ideas into stunning diagrams with live preview and instant sharing capabilities.*

[✨ **Live Demo**](https://mermaid-viewer-alpha.vercel.app) • [🐛 **Report Bug**](https://github.com/sametcn99/mermaid-viewer/issues) • [💡 **Request Feature**](https://github.com/sametcn99/mermaid-viewer/issues)

</div>

---

## ✨ Features

### 🔥 **Core Features**

- **⚡ Live Preview:** See your diagrams update instantly as you type
- **📱 Responsive Split View:** Adjustable panels that work perfectly on all devices
- **🎨 Syntax Highlighting:** Monaco Editor with intelligent code completion
- **🚀 Fast Rendering:** Debounced updates for smooth performance
- **📤 Quick Sharing:** Generate shareable links with URL encoding
- **🌙 Dark/Light Theme:** Beautiful themes that adapt to your preference

### 💎 **Advanced Features**

- **🔍 Zoom & Pan:** Interactive diagram navigation with mouse and touch
- **💾 Auto-Save:** Your work is automatically saved in browser storage
- **📋 One-Click Copy:** Copy diagrams as SVG or share links instantly
- **🔄 Real-time Validation:** Immediate feedback on syntax errors
- **📱 Mobile Optimized:** Perfect experience on phones and tablets
- **⌨️ Keyboard Shortcuts:** Power user shortcuts for faster workflow

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17.0 or higher)
- **Bun** (recommended) or npm/yarn/pnpm
- **Git** for version control

### ⚡ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sametcn99/mermaid-viewer.git
   cd mermaid-viewer
   ```

2. **Install dependencies**

   ```bash
   # Using Bun (recommended for fastest installation)
   bun install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   
   # Or using pnpm
   pnpm install
   ```

3. **Start the development server**

   ```bash
   # Using Bun
   bun dev
   
   # Or using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   
   # Or using pnpm
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) and start creating diagrams! 🎉

---

## 📖 Usage Examples

### 🎯 **Basic Flowchart**

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

### 🏢 **Sequence Diagram**

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Create diagram
    Frontend->>API: Validate syntax
    API->>Database: Save diagram
    Database-->>API: Success
    API-->>Frontend: Confirmation
    Frontend-->>User: Show result
```

### 📊 **Class Diagram**

```mermaid
classDiagram
    class DiagramEditor {
        +String content
        +Boolean isValid
        +updateContent(content)
        +validateSyntax()
        +exportSVG()
    }
    
    class DiagramViewer {
        +Element svg
        +render(content)
        +zoom(level)
        +pan(x, y)
    }
    
    DiagramEditor --> DiagramViewer : renders
```

---

## 🛠️ Available Scripts

| Command      | Description                                |
|--------------|--------------------------------------------|
| `bun dev`    | 🔥 Start development server with Turbopack |
| `bun build`  | 🏗️ Build the application for production   |
| `bun start`  | 🚀 Start the production server             |
| `bun lint`   | 🔍 Run ESLint to check code quality        |
| `bun format` | ✨ Format code with Prettier                |

---

## ⚙️ How It Works

### 🏗️ **Architecture Overview**

```mermaid
graph LR
    A[📝 Monaco Editor] --> B[⚡ Debounced Updates]
    B --> C[🧜‍♀️ Mermaid Parser]
    C --> D[📊 SVG Renderer]
    D --> E[🔍 Zoom & Pan Viewer]
    
    F[💾 Local Storage] --> A
    A --> F
    
    G[🔗 URL Encoding] --> A
    E --> H[📤 Share Function]
    H --> G
```

### 🔧 **Key Components**

- **📝 Editor Panel:** Monaco Editor with TypeScript and Mermaid syntax highlighting
- **📊 Diagram Panel:** Real-time SVG rendering with interactive zoom and pan
- **🔄 Debounced Updates:** Optimized performance with 300ms debounce
- **📱 Responsive Layout:** `react-split` for adjustable panels on all devices
- **💾 Auto-Save:** Browser localStorage for persistent diagram storage
- **🔗 URL Sharing:** Compressed diagram data in shareable URLs

---

## 🧰 Technology Stack

<div align="center">

### **Frontend Framework**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

### **Core Libraries**

[![Mermaid](https://img.shields.io/badge/Mermaid-11.11.0-FF3670?style=for-the-badge&logo=mermaid&logoColor=white)](https://mermaid.js.org/)
[![MUI](https://img.shields.io/badge/Material_UI-7.3.2-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-4.7.0-1E1E1E?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)

### **Performance & Utilities**

[![Lodash](https://img.shields.io/badge/Lodash-4.0.8-3492FF?style=for-the-badge&logo=lodash&logoColor=white)](https://lodash.com/)
[![React Zoom Pan Pinch](https://img.shields.io/badge/Zoom_Pan_Pinch-3.7.0-FF6B6B?style=for-the-badge&logo=react&logoColor=white)](https://github.com/BetterTyped/react-zoom-pan-pinch)
[![Pako](https://img.shields.io/badge/Pako-2.1.0-4CAF50?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMiA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDIgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K&logoColor=white)](https://github.com/nodeca/pako)

### **Development Tools**

[![ESLint](https://img.shields.io/badge/ESLint-9.35.0-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.6.2-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-9.1.7-42B883?style=for-the-badge&logo=git&logoColor=white)](https://typicode.github.io/husky/)

</div>

---

## 🔧 Configuration & Customization

### 🎨 **Theming**

The application supports both light and dark themes using Material-UI's theming system. Themes automatically adapt to system preferences.

### ⚙️ **Editor Configuration**

Monaco Editor is configured with:

- Mermaid syntax highlighting
- Auto-completion
- Error detection
- Bracket matching
- Code folding

### 📱 **Responsive Breakpoints**

- **Mobile:** < 768px (stacked layout)
- **Tablet:** 768px - 1024px (adjustable split)
- **Desktop:** > 1024px (side-by-side split)

---

## 📊 Performance Features

- **⚡ Turbopack:** Lightning-fast development builds
- **🔄 Debounced Rendering:** Optimized diagram updates
- **💾 Efficient Storage:** Compressed URL encoding with Pako
- **📱 Mobile Optimized:** Touch-friendly interface
- **🚀 SSR Ready:** Server-side rendering support

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🚀 **Quick Contribution Guide**

1. **🍴 Fork the Project**

   ```bash
   # Click the Fork button on GitHub
   ```

2. **🌿 Create your Feature Branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **💻 Make your Changes**

   ```bash
   # Make your awesome changes
   bun dev # Test locally
   ```

4. **✅ Run Tests & Linting**

   ```bash
   bun lint
   bun format
   ```

5. **📝 Commit your Changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **🚀 Push to the Branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **🔄 Open a Pull Request**

### 🎯 **Contribution Areas**

- 🐛 **Bug Fixes:** Help us squash bugs
- ✨ **New Features:** Add exciting new functionality  
- 📖 **Documentation:** Improve our docs
- 🎨 **UI/UX:** Enhance user experience
- ⚡ **Performance:** Optimize for speed
- 🧪 **Testing:** Add test coverage

### 📋 **Development Guidelines**

- Follow existing code style (Prettier + ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Test on multiple browsers/devices

---

## 🙏 Acknowledgments

- **[Mermaid.js](https://mermaid.js.org/)** - For the amazing diagram rendering engine
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - For the powerful code editor
- **[Next.js](https://nextjs.org/)** - For the excellent React framework
- **[Material-UI](https://mui.com/)** - For the beautiful component library
- **[Vercel](https://vercel.com/)** - For seamless deployment and hosting

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/sametcn99/mermaid-viewer?style=social)
![GitHub forks](https://img.shields.io/github/forks/sametcn99/mermaid-viewer?style=social)
![GitHub issues](https://img.shields.io/github/issues/sametcn99/mermaid-viewer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sametcn99/mermaid-viewer)

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

[🔝 Back to top](#-mermaid-live-editor--viewer)

</div>
