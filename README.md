<div align="center">

# Mermaid Live Editor & Viewer

**Create, edit, and share beautiful Mermaid diagrams in real-time!**

*A powerful, modern web application that transforms your ideas into stunning diagrams with live preview and instant sharing capabilities.*

[Homepage](https://mermaid.sametcc.me/home) • [Report Bug](https://github.com/sametcn99/mermaid-viewer/issues) • [Request Feature](https://github.com/sametcn99/mermaid-viewer/issues) • [GitHub Repository](https://sametcc.me/repo/mermaid-viewer)

## Stats

![GitHub stars](https://img.shields.io/github/stars/sametcn99/mermaid-viewer?style=social)
![GitHub forks](https://img.shields.io/github/forks/sametcn99/mermaid-viewer?style=social)
![GitHub issues](https://img.shields.io/github/issues/sametcn99/mermaid-viewer)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sametcn99/mermaid-viewer)

</div>

---

## Quick Start

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.17.0 or higher)
- **Bun** (Recommended package manager) or npm/yarn/pnpm
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sametcn99/mermaid-viewer.git
   cd mermaid-viewer
   ```

2. **Install dependencies**

   We recommend using Bun for the fastest installation experience.

   ```bash
   bun install
   ```

3. **Start the development server**

   ```bash
   bun dev
   ```

4. **Open in Browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to start using the application.

## Docker Deployment

You can easily deploy the application using Docker Compose. This setup includes the frontend, backend, PostgreSQL database, and Nginx as a reverse proxy.

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.

### Running with Docker

1. **Configure Environment Variables**

   Create a `.env` file in the root directory containing necessary keys (Database credentials, API keys etc.).

2. **Build and Start Containers**

   Run the following command in the root directory:

   ```bash
   docker compose up -d --build
   ```

   This command will:
   - Build the backend and frontend images (using `oven/bun` for optimized builds).
   - Start a PostgreSQL database container.
   - Start an Nginx reverse proxy.

3. **Access the Application**

   Once the containers are running, you can access the application at:
   - **Web App:** [http://localhost](http://localhost) (via Nginx on port 80)

### Nginx Configuration

The project uses Nginx as a reverse proxy to route traffic to the frontend and backend services. The configuration is located in `nginx.conf` and handles:

- Routing root requests to the frontend service.
- Routing `/api` requests to the backend service.
- Handling proxy headers.

To stop the services:

```bash
docker compose down
```

---

## Contributing

We welcome contributions from the community! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the Project:** create your own copy of the repository on GitHub.
2. **Create a Branch:** switch to a new branch for your feature or fix.

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Changes:** implement your changes and test them locally.

   ```bash
   bun dev
   ```

4. **Lint & Format:** ensure your code meets the project's standards.

   ```bash
   bun lint
   bun format
   ```

5. **Commit:** write a clear, descriptive commit message.

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push:** upload your branch to your fork.

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request:** submit your changes for review.

---

<div align="center">

**Star this repo if you found it helpful!**

</div>
