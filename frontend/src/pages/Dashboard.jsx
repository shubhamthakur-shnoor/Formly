import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogOut, X } from "lucide-react";

import api from "../services/api";

import Sidebar from "../components/Admin/Sidebar";
import DashboardHeader from "../components/Admin/DashboardHeader";
import DashboardOverview from "../components/Admin/DashboardOverview";
import SurveysSection from "../components/Admin/SurveysSection";
import AnalyticsSection from "../components/Admin/AnalyticsSection";
import ResponsesSection from "../components/Admin/ResponsesSection";
import ExportsSection from "../components/Admin/ExportsSection";
import SettingsSection from "../components/Admin/SettingsSection";

const PAGE_TITLES = {
  Overview: "Overview",
  "My Surveys": "My Surveys",
  Analytics: "Analytics",
  Responses: "Responses",
  Exports: "Exports",
  Settings: "Settings",
};

function LogoutConfirmModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
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
            onClick={onCancel}
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
          You will be signed out of your Formly admin account.
          You can sign in again whenever you need.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#bbcabf] px-4 py-2.5 text-sm font-medium text-[#3c4a42] hover:bg-[#f4fbf4]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <LogOut size={16} />
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notice, setNotice] = useState("");

  const adminName =
    localStorage.getItem("full_name") || "Admin";

const fetchSurveys = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/surveys");
    const result = response.data;

    const surveyList = Array.isArray(result)
      ? result
      : Array.isArray(result?.surveys)
        ? result.surveys
        : Array.isArray(result?.data?.surveys)
          ? result.data.surveys
          : Array.isArray(result?.data)
            ? result.data
            : [];

    // Fetch the real response count for each survey.
    const surveysWithCounts = await Promise.all(
      surveyList.map(async (survey) => {
        const surveyId = survey.id ?? survey.survey_id;

        if (!surveyId) return survey;

        try {
          const statsResponse = await api.get(
            `/surveys/${surveyId}/statistics`
          );

          const statsResult = statsResponse.data;

          const stats =
            statsResult?.data?.statistics ??
            statsResult?.data ??
            statsResult?.statistics ??
            statsResult;

          const actualCount = Number(
            stats?.total_responses ??
              stats?.totalResponses ??
              0
          );

          return {
            ...survey,
            response_count: actualCount,
            total_responses: actualCount,
          };
        } catch {
          // Keep the count already provided by the surveys endpoint.
          return survey;
        }
      })
    );

    setSurveys(surveysWithCounts);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to load surveys. Please try again."
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  useEffect(() => {
    if (!notice) return;

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    setNotice("");
  };

  const handleStatusChange = async (survey, nextStatus) => {
    const surveyId = survey.id ?? survey.survey_id;

    if (!surveyId || nextStatus === survey.status) {
      return;
    }

    try {
      await api.patch(`/surveys/${surveyId}/status`, {
        status: nextStatus,
      });

      setNotice("Survey status updated successfully.");
      await fetchSurveys();
    } catch (err) {
      setNotice(
        err.response?.data?.message ||
          "Unable to update survey status."
      );
    }
  };

  const handleCopyLink = async (survey) => {
    if (!survey.slug) {
      setNotice("This survey does not have a public link yet.");
      return;
    }

    const publicUrl =
      `${window.location.origin}/survey/${encodeURIComponent(survey.slug)}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setNotice("Survey link copied to clipboard.");
    } catch {
      setNotice("Unable to copy the survey link.");
    }
  };

  const handleOpenSurvey = (survey) => {
    if (!survey.slug) {
      setNotice("This survey does not have a public link yet.");
      return;
    }

    const publicUrl =
      `${window.location.origin}/survey/${encodeURIComponent(survey.slug)}`;

    window.open(publicUrl, "_blank", "noopener,noreferrer");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);

    localStorage.removeItem("token");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email");

    navigate("/signin", { replace: true });
  };

  const renderActivePage = () => {
    switch (activePage) {
      case "My Surveys":
        return (
          <SurveysSection
            surveys={surveys}
            loading={loading}
            error={error}
            onStatusChange={handleStatusChange}
            onCopyLink={handleCopyLink}
            onOpenSurvey={handleOpenSurvey}
          />
        );

      case "Analytics":
        return <AnalyticsSection surveys={surveys} />;

      case "Responses":
        return <ResponsesSection surveys={surveys} />;

      case "Exports":
        return <ExportsSection surveys={surveys} />;

      case "Settings":
        return <SettingsSection />;

      case "Overview":
      default:
        return (
          <DashboardOverview
            surveys={surveys}
            loading={loading}
            error={error}
            adminName={adminName}
            onViewAll={() => setActivePage("My Surveys")}
          />
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
          onRefresh={fetchSurveys}
          loading={loading}
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
        <LogoutConfirmModal
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
