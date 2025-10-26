# 📄 Doscy - Chat with your PDFs

A modern, beautiful web application that lets you upload PDF documents and chat with them using AI-powered analysis.

## ✨ Features

- 🎨 **Beautiful UI** - Glassmorphism design with smooth animations
- 📱 **Responsive** - Works perfectly on mobile, tablet, and desktop
- 🤖 **AI-Powered** - Smart document analysis with accurate answers
- 📑 **PDF Viewer** - Built-in PDF viewer with zoom and navigation
- 🔍 **Citations** - Click on page numbers to jump to relevant sections
- 💬 **Chat Interface** - Natural conversation with your documents

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd doscy-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` and set your backend API URL:
```
VITE_API_URL=http://localhost:8000/api
```

4. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **react-pdf** - PDF rendering
- **Axios** - API calls
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ChatInterface.tsx
│   ├── PDFViewer.tsx
│   ├── FileUpload.tsx
│   ├── Message.tsx
│   ├── CitationButton.tsx
│   └── LoadingSpinner.tsx
├── context/            # State management
│   └── AppContext.tsx
├── services/           # API integration
│   └── api.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#8b5cf6` (Purple)
- **Success:** `#10b981` (Green)
- **Background:** `#ffffff` (White)
- **Surface:** `#f9fafb` (Light gray)

### Typography
- **Font Family:** Inter
- **Sizes:** Responsive scale from 12px to 36px

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API base URL

### API Endpoints Expected

- `POST /api/upload` - Upload PDF
- `POST /api/chat` - Send question
- `GET /api/upload/file/:filename` - Get PDF file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI inspired by modern glassmorphism design
- PDF rendering powered by PDF.js

---

**Made with ❤️ for better document interaction**