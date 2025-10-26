import React from "react";
import { useApp } from "./context/AppContext";
import Header from "./components/Header";
import ErrorAlert from "./components/ErrorAlert";
import UploadScreen from "./components/UploadScreen";
import PDFAndChatScreen from "./components/PDFAndChatScreen";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const { document, error } = useApp();

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <Header />

      {/* Error Alert */}
      {error && <ErrorAlert />}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6">
        {!document ? (
          // Upload Screen
          <UploadScreen />
        ) : (
          // Split View: PDF + Chat
          <PDFAndChatScreen />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
