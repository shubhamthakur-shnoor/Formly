
import { useState } from "react";
import { UserRound, LockKeyhole, Loader2 } from "lucide-react";

export default function SettingsSection({
  onUpdateProfile,
  onChangePassword,
}) {
  const [fullName, setFullName] = useState(
    localStorage.getItem("full_name") || ""
  );

  const [email, setEmail] = useState(
    localStorage.getItem("email") || ""
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [profileMessageType, setProfileMessageType] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageType, setPasswordMessageType] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const inputClass =
    "mt-2 h-12 w-full rounded-xl border border-[#dce7dd] px-4 text-sm outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10 disabled:cursor-not-allowed disabled:bg-gray-50";

  const buttonClass =
    "flex items-center justify-center gap-2 rounded-xl bg-[#006c49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00563a] disabled:cursor-not-allowed disabled:opacity-60";

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileMessage("");

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      setProfileMessageType("error");
      setProfileMessage("Full name must contain at least 2 characters.");
      return;
    }

    try {
      setProfileLoading(true);

      if (!onUpdateProfile) {
        throw new Error("Profile update is not configured.");
      }

      const result = await onUpdateProfile({
        full_name: trimmedName,
        email: trimmedEmail,
      });

      const updatedUser =
        result?.user ?? result?.data?.user ?? {};

      const savedName = updatedUser.full_name || trimmedName;
      const savedEmail = updatedUser.email || trimmedEmail;

      setFullName(savedName);
      setEmail(savedEmail);

      localStorage.setItem("full_name", savedName);
      localStorage.setItem("email", savedEmail);

      setProfileMessageType("success");
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileMessageType("error");
      setProfileMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (newPassword.length < 8) {
      setPasswordMessageType("error");
      setPasswordMessage(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessageType("error");
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordMessageType("error");
      setPasswordMessage(
        "New password must be different from current password."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      if (!onChangePassword) {
        throw new Error("Password update is not configured.");
      }

      await onChangePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessageType("success");
      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      setPasswordMessageType("error");
      setPasswordMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderMessage = (message, type) => {
    if (!message) return null;

    return (
      <p
        role="alert"
        className={`rounded-xl p-3 text-sm ${
          type === "error"
            ? "border border-red-200 bg-red-50 text-red-700"
            : "border border-[#bbd9c5] bg-[#eaf4ec] text-[#006c49]"
        }`}
      >
        {message}
      </p>
    );
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-hanken text-2xl font-bold text-[#17251c]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#718078]">
          Manage your account and security preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-[#dce7dd] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-[#e6eee7] pb-5">
          <div className="rounded-xl bg-[#eaf4ec] p-2.5 text-[#006c49]">
            <UserRound size={20} />
          </div>

          <div>
            <h3 className="font-hanken text-lg font-bold text-[#17251c]">
              Profile Information
            </h3>
            <p className="mt-1 text-sm text-[#718078]">
              Update your personal account details.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#17251c]">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
              placeholder="Enter your full name"
              required
              minLength={2}
              maxLength={100}
              disabled={profileLoading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#17251c]">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="Enter your email address"
              required
              maxLength={255}
              disabled={profileLoading}
            />
          </div>

          {renderMessage(profileMessage, profileMessageType)}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className={buttonClass}
            >
              {profileLoading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="rounded-2xl border border-[#dce7dd] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-[#e6eee7] pb-5">
          <div className="rounded-xl bg-[#eaf4ec] p-2.5 text-[#006c49]">
            <LockKeyhole size={20} />
          </div>

          <div>
            <h3 className="font-hanken text-lg font-bold text-[#17251c]">
              Change Password
            </h3>
            <p className="mt-1 text-sm text-[#718078]">
              Update your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#17251c]">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={inputClass}
              autoComplete="current-password"
              placeholder="Enter current password"
              required
              disabled={passwordLoading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#17251c]">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={inputClass}
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter new password"
              required
              disabled={passwordLoading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#17251c]">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClass}
              autoComplete="new-password"
              placeholder="Confirm new password"
              required
              disabled={passwordLoading}
            />
          </div>

          {renderMessage(passwordMessage, passwordMessageType)}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className={buttonClass}
            >
              {passwordLoading && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
