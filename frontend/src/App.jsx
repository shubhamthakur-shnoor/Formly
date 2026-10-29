import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/Landing/page";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateSurvey from "./components/Admin/CreateSurvey";
import EditSurvey from "./components/Admin/EditSurvey";
import SurveyQuestions from "./components/Admin/SurveyQuestions";
import PublicSurveys from "./pages/PublicSurveys";
import ParticipateSurvey from "./pages/ParticipateSurvey";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/available-surveys"
          element={<PublicSurveys />}
        />
        <Route
          path="/survey/:slug"
          element={<ParticipateSurvey />}
        />
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
              <CreateSurvey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/surveys/:id/edit"
          element={
            <ProtectedRoute>
              <EditSurvey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/surveys/:id/questions"
          element={
            <ProtectedRoute>
              <SurveyQuestions />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
