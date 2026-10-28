import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/Landing/page";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
}

function FeaturePlaceholder({ title }) {
  return (
    <main className="min-h-screen bg-[#f4fbf4] p-8 text-[#161d19]">
      <h1 className="font-hanken text-3xl font-bold">{title}</h1>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/surveys/new"
          element={
            <ProtectedRoute>
              <FeaturePlaceholder title="Create Survey" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/surveys/:id"
          element={
            <ProtectedRoute>
              <FeaturePlaceholder title="Survey Details" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
