import { Routes, Route, Link, NavLink } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import TranscribePage from "./pages/TranscribePage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Simscribe
        </Link>

        <nav className="flex gap-4 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hover:text-indigo-300 ${isActive ? "text-indigo-300" : "text-slate-300"}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/transcribe"
            className={({ isActive }) =>
              `hover:text-indigo-300 ${isActive ? "text-indigo-300" : "text-slate-300"}`
            }
          >
            Transcribe
          </NavLink>
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
