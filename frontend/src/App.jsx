import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from "./components/Landing/page";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateSurvey from "./components/Admin/CreateSurvey";
import EditSurvey from "./components/Admin/EditSurvey";
import SurveyQuestions from "./components/Admin/SurveyQuestions";
import PublicSurveys from "./pages/PublicSurveys";
import ParticipateSurvey from "./pages/ParticipateSurvey";
import Loader from "./components/Common/Loader";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
}

function GlobalRouteLoader({ children }) {
  const location = useLocation();
  const [readyLocation, setReadyLocation] = useState(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReadyLocation(location.key);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [location.key]);
  if (location.pathname === "/dashboard") {
    return children;
  }

  if (readyLocation !== location.key) {
    return <Loader message="Loading your workspace..." />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <GlobalRouteLoader>
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
      </GlobalRouteLoader>
    </BrowserRouter>
  );
}

export default App;
