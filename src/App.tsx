import { Routes, Route, } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <div>
      

      <main className="p-6">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/analyze/:id" element={<AnalyzePage />} />
        </Routes>
      </main>
    </div>
  );
}
