import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, AlertTriangle, LogOut } from "lucide-react";
import api from "../../services/api";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardOverview from "./DashboardOverview";
import AvailableSurveys from "./AvailableSurveys";
import MySubmissions from "./MySubmissions";
import SettingsSection from "./SettingsSection";

const PAGE_TITLES = {
  Overview: "Overview",
  "Available Surveys": "Available Surveys",
  "My Submissions": "My Submissions",
  Settings: "Settings",
};

export default function EndUserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(() => {
    const requestedPage = location.state?.activePage;
    return PAGE_TITLES[requestedPage] ? requestedPage : "Overview";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const [availableSurveys, setAvailableSurveys] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [availableLoading, setAvailableLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  const [availableError, setAvailableError] = useState("");
  const [submissionsError, setSubmissionsError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [notice, setNotice] = useState("");

  // Selected submission and its answer details.
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Keep profile data in sync with the dashboard and sidebar.
  const [profile, setProfile] = useState({
    full_name: localStorage.getItem("full_name") || "",
    email: localStorage.getItem("email") || "",
  });

  // Fetch dashboard surveys and submissions.
  const fetchDashboardData = useCallback(async () => {
    setAvailableLoading(true);
    setSubmissionsLoading(true);

    setAvailableError("");
    setSubmissionsError("");

    const [availableResult, submissionsResult] = await Promise.allSettled([
      api.get("/respondent/surveys/available"),
      api.get("/respondent/surveys/my-submissions"),
    ]);

    if (availableResult.status === "fulfilled") {
      const data = availableResult.value.data;
      const surveys = data?.surveys || data?.data?.surveys || [];

      setAvailableSurveys(Array.isArray(surveys) ? surveys : []);
    } else {
      setAvailableSurveys([]);
      setAvailableError(
        availableResult.reason?.response?.data?.message ||
          "Unable to load available surveys. Please try again."
      );
    }

    setAvailableLoading(false);

    if (submissionsResult.status === "fulfilled") {
      const data = submissionsResult.value.data;
      const result = data?.submissions || data?.data?.submissions || [];

      setSubmissions(Array.isArray(result) ? result : []);
    } else {
      setSubmissions([]);
      setSubmissionsError(
        submissionsResult.reason?.response?.data?.message ||
          "Unable to load your submissions. Please try again."
      );
    }

    setSubmissionsLoading(false);
  }, []);

  // Fetch logged-in respondent profile.
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/profile");
      const user = data?.user;

      if (user) {
        const updatedProfile = {
          full_name: user.full_name || "",
          email: user.email || "",
        };

        setProfile(updatedProfile);

        localStorage.setItem("full_name", updatedProfile.full_name);
        localStorage.setItem("email", updatedProfile.email);
      }
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error.response?.data?.message || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchProfile();
  }, [fetchDashboardData, fetchProfile]);

  // Restore the dashboard tab when returning from a survey or sign-in.
  useEffect(() => {
    const requestedPage = location.state?.activePage;
    if (PAGE_TITLES[requestedPage]) {
      setActivePage(requestedPage);
    }
  }, [location.state?.activePage]);

  // Update profile API.
  const handleUpdateProfile = async (profileData) => {
  const { data } = await api.patch("/auth/profile", profileData);

  const user = data?.user ?? data?.data?.user;

  if (user) {
    const updatedProfile = {
      full_name: user.full_name || "",
      email: user.email || "",
    };

    setProfile(updatedProfile);

    localStorage.setItem("full_name", updatedProfile.full_name);
    localStorage.setItem("email", updatedProfile.email);
  }

  return data;
};

  // Change password API.
  const handleChangePassword = async (passwordData) => {
    const { data } = await api.patch(
      "/auth/change-password",
      passwordData
    );

    return data;
  };

  // Get already submitted survey IDs.
  const submittedSurveyIds = useMemo(
    () =>
      new Set(
        submissions.map((submission) => String(submission.survey_id))
      ),
    [submissions]
  );

  // Only show surveys that are not submitted yet.
  const pendingSurveys = useMemo(
    () =>
      availableSurveys.filter((survey) => {
        const surveyId = survey.survey_id ?? survey.id;
        return !submittedSurveyIds.has(String(surveyId));
      }),
    [availableSurveys, submittedSurveyIds]
  );

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setNotice("");
  };

  const handleLogout = () => {
  const authKeys = [
    "token",
    "user_type",
    "full_name",
    "email",
    "user_id",
    "respondent_id",
  ];

  authKeys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  window.location.replace("/");
};

  const handleViewSubmission = async (submission) => {
    setSelectedSubmission(submission);
    setSubmissionDetail(null);
    setDetailError("");

    try {
      setDetailLoading(true);
      const { data } = await api.get(
        `/respondent/surveys/my-submissions/${submission.response_id}`
      );
      setSubmissionDetail(data?.submission ?? data?.data?.submission ?? null);

      if (!data?.submission && !data?.data?.submission) {
        setDetailError("Submission details were not found.");
      }
    } catch (error) {
      setDetailError(
        error.response?.data?.message ||
          "Unable to load submission details. Please try again."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseSubmission = () => {
    setSelectedSubmission(null);
    setSubmissionDetail(null);
    setDetailError("");
  };

  const handleParticipate = (survey) => {
  if (!survey.slug) {
    setNotice("Survey link is unavailable.");
    return;
  }

  navigate(`/survey/${encodeURIComponent(survey.slug)}`, {
    state: {
      source: "end-user",
      returnTo: "/dashboard",
      returnPage: "Available Surveys",
    },
  });
};

  const renderActivePage = () => {
    switch (activePage) {
      case "Available Surveys":
        return (
          <AvailableSurveys
            surveys={pendingSurveys}
            loading={availableLoading || submissionsLoading}
            error={availableError || submissionsError}
            onParticipate={handleParticipate}
          />
        );

      case "My Submissions":
        return (
          <MySubmissions
            submissions={submissions}
            loading={submissionsLoading}
            error={submissionsError}
            onViewSubmission={handleViewSubmission}
            selectedSubmission={selectedSubmission}
            submissionDetail={submissionDetail}
            detailLoading={detailLoading}
            detailError={detailError}
            onCloseSubmission={handleCloseSubmission}
          />
        );

      case "Settings":
        return (
          <SettingsSection
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        );

      case "Overview":
      default:
        return (
          <div className="space-y-5">
            {(availableLoading || submissionsLoading) && (
              <p className="text-sm text-[#718078]">
                Loading your dashboard data...
              </p>
            )}

            {(availableError || submissionsError) && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {availableError || submissionsError}
              </p>
            )}

            <DashboardOverview
              availableCount={availableSurveys.length}
              submittedCount={submissions.length}
              pendingCount={pendingSurveys.length}
              onNavigate={handleNavigate}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#17251c] lg:flex">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={() => setShowLogoutConfirm(true)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <DashboardHeader
          activePage={PAGE_TITLES[activePage] || activePage}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#bbcabf] bg-white px-4 py-3 text-sm"
            >
              <span>{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss notification"
                className="rounded-md p-1 hover:bg-[#f4fbf4]"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {renderActivePage()}
        </main>
      </div>
          {showLogoutConfirm && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setShowLogoutConfirm(false);
      }
    }}
  >
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-description"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle size={24} />
        </div>

        <button
          type="button"
          onClick={() => setShowLogoutConfirm(false)}
          aria-label="Close confirmation"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={19} />
        </button>
      </div>

      <h2
        id="logout-title"
        className="mt-5 font-hanken text-xl font-bold text-[#17251c]"
      >
        Are you sure you want to logout?
      </h2>

      <p
        id="logout-description"
        className="mt-2 text-sm leading-6 text-[#3c4a42]"
      >
        You will be signed out of your Formly account.
        You can sign in again whenever you need.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(false)}
          className="rounded-xl border border-[#bbcabf] px-4 py-2.5 text-sm font-medium text-[#3c4a42] hover:bg-[#f4fbf4]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
        >
          <LogOut size={16} />
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
