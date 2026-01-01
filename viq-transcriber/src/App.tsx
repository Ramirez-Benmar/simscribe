import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TranscribePage from "./pages/TranscribePage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          VIQ Transcriber
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link to="/" className="hover:text-indigo-300">
            Projects
          </Link>
          <Link to="/transcribe" className="hover:text-indigo-300">
            Transcribe
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-6 py-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/transcribe" element={<TranscribePage />} />
        </Routes>
      </main>
    </div>
  );
}
