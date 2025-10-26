
# Doscy — Chat with Your PDFs

**Doscy** is a full-stack web application that allows users to upload PDF documents and interact with them using AI-driven chat. It enables users to ask questions in natural language and receive precise, citation-backed responses derived directly from document content.

With a clean, responsive interface and integrated PDF viewer, Doscy provides a modern, seamless, and intelligent way to explore and understand documents.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation Steps](#installation-steps)
6. [Building for Production](#building-for-production)
7. [Configuration](#configuration)

   * [Environment Variables](#environment-variables)
   * [Expected API Endpoints](#expected-api-endpoints)
8. [Design System](#design-system)

   * [Colors](#colors)
   * [Typography](#typography)
9. [Screenshots](#screenshots)
10. [Contributing](#contributing)
11. [License](#license)
12. [Acknowledgments](#acknowledgments)

---

## Overview

Doscy simplifies document analysis by combining text parsing, semantic understanding, and conversational AI. Instead of manually reading through lengthy PDFs, users can query their documents naturally and receive accurate, contextual answers.

The application also includes citation mapping, allowing users to click page references and directly navigate to the relevant section within the PDF viewer.

---

## Features

* **Modern and Minimal UI** — Designed with glassmorphism and subtle animations.
* **Responsive Design** — Fully adaptive layout for desktop, tablet, and mobile devices.
* **AI-Powered Responses** — Answers are generated contextually from the document.
* **Built-In PDF Viewer** — Supports zooming, scrolling, and page navigation.
* **Citations and References** — Answers include linked page numbers for verification.
* **Interactive Chat Interface** — Enables a natural conversation flow.

---

## Tech Stack

| Layer              | Technology         |
| ------------------ | ------------------ |
| Frontend Framework | React 18           |
| Language           | TypeScript         |
| Build Tool         | Vite               |
| Styling            | Tailwind CSS       |
| PDF Rendering      | react-pdf (PDF.js) |
| HTTP Client        | Axios              |
| Icons              | Lucide React       |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatInterface.tsx
│   ├── PDFViewer.tsx
│   ├── FileUpload.tsx
│   ├── Message.tsx
│   ├── CitationButton.tsx
│   └── LoadingSpinner.tsx
├── context/             # Global state management
│   └── AppContext.tsx
├── services/            # API integration and requests
│   └── api.ts
├── types/               # TypeScript interfaces and type definitions
│   └── index.ts
├── App.tsx              # Root application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

---

## Getting Started

### Prerequisites

Before running this project, ensure the following are installed:

* Node.js (version 18 or higher)
* npm or yarn
* A running backend API (see the backend repository)

---

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd doscy-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Example `.env` file:

   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at:

   ```
   http://localhost:3000
   ```

---

## Building for Production

To create an optimized build for production, run:

```bash
npm run build
```

The compiled static files will be available in the `dist/` directory.

---

## Configuration

### Environment Variables

| Variable       | Description                  |
| -------------- | ---------------------------- |
| `VITE_API_URL` | Base URL of the backend API. |

---

### Expected API Endpoints

| Endpoint                     | Method | Description                                              |
| ---------------------------- | ------ | -------------------------------------------------------- |
| `/api/upload`                | POST   | Uploads a PDF document to the server.                    |
| `/api/chat`                  | POST   | Sends a user query and retrieves an AI-generated answer. |
| `/api/upload/file/:filename` | GET    | Fetches a PDF file by its name.                          |

---

## Design System

### Colors

| Purpose    | Color Code |
| ---------- | ---------- |
| Primary    | `#6366f1`  |
| Secondary  | `#8b5cf6`  |
| Success    | `#10b981`  |
| Background | `#ffffff`  |
| Surface    | `#f9fafb`  |

### Typography

* **Font Family:** Inter
* **Font Sizes:** Responsive range from 12px to 36px

---

## Screenshots

Below are a few interface previews of **Doscy**:

| Section            | Preview                                   |
| ------------------ | ----------------------------------------- |
| Home / Upload Page | ![Home Page](screenshots/home.png)        |
| Chat Interface     | ![Chat Interface](screenshots/chat.png)   |
| PDF Viewer         | ![PDF Viewer](screenshots/pdf-viewer.png) |

> Place your screenshots inside a `/screenshots` folder in the project root and ensure they match the file names above.

---

## Contributing

Contributions are welcome.
If you would like to report a bug, suggest an enhancement, or submit a feature, please open an issue or create a pull request.

---

## License

This project is licensed under the **MIT License**.
You may use, modify, and distribute it for both personal and commercial projects.

---

## Acknowledgments

* Built with React and TypeScript
* PDF rendering powered by PDF.js
* UI inspired by modern glassmorphism design principles

---

**Doscy — Designed for intelligent and seamless document interaction.**

---

Would you like me to format this as a **ready-to-copy `README.md` file** (with markdown syntax and link formatting preserved for GitHub)? I can give you that version next so you can just paste it into your repo directly.
