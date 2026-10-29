import { useState } from "react";
import {
  UserRound, Mail,
  LockKeyhole,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../../services/api.js";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#bbcabf] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export default function SettingsSection() {
  const [profile, setProfile] = useState(() => ({
    username: localStorage.getItem("full_name") || "",
    email: localStorage.getItem("email") || "",
  }));

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileMessage("");
    setProfileError(false);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordMessage("");
    setPasswordError(false);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError(false);

    const full_name = profile.username.trim();
    const email = profile.email.trim().toLowerCase();

    if (!full_name || !email) {
      setProfileError(true);
      setProfileMessage("Username and email are required.");
      return;
    }

    if (full_name.length > 100) {
      setProfileError(true);
      setProfileMessage("Username cannot exceed 100 characters.");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await api.patch("/auth/profile", {
        full_name,
        email,
      });

      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("Profile update response is invalid.");
      }

      const updatedName = updatedUser.full_name;
      const updatedEmail = updatedUser.email;

      setProfile({
        username: updatedName,
        email: updatedEmail,
      });

      localStorage.setItem("full_name", updatedName);
      localStorage.setItem("email", updatedEmail);

      setProfileError(false);
      setProfileMessage(
        response.data?.message || "Profile updated successfully."
      );
    } catch (error) {
      setProfileError(true);
      setProfileMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError(false);

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(true);
      setPasswordMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(true);
      setPasswordMessage(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      setPasswordMessage("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(true);
      setPasswordMessage(
        "Your new password must be different from your current password."
      );
      return;
    }

    setSavingPassword(true);

    try {
      const response = await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordError(false);
      setPasswordMessage(
        response.data?.message || "Password updated successfully."
      );
    } catch (error) {
      setPasswordError(true);
      setPasswordMessage(
        getErrorMessage(
          error,
          "Unable to update password. Please try again."
        )
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const messageClass = (isError) =>
    `rounded-lg p-3 text-sm ${
      isError
        ? "bg-red-50 text-red-700"
        : "bg-[#f4fbf4] text-[#006c49]"
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-hanken text-2xl font-bold">Settings</h2>
        <p className="mt-2 text-sm text-[#3c4a42]">
          Manage your account details and security.
        </p>
      </div>

      {/* Profile settings */}
      <section className="max-w-3xl rounded-2xl border border-[#bbcabf] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
            <UserRound size={22} />
          </div>

          <div>
            <h3 className="font-hanken text-lg font-semibold">
              Profile information
            </h3>
            <p className="text-sm text-[#718078]">
              Update your username and email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="settings-username"
              className="text-sm font-medium"
            >
              Username
            </label>

            <input
              id="settings-username"
              name="username"
              type="text"
              autoComplete="username"
              maxLength={100}
              value={profile.username}
              onChange={handleProfileChange}
              placeholder="Enter your username"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail size={15} />
              Email address
            </label>

            <input
              id="settings-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Enter your email address"
              className={inputClass}
              required
            />
          </div>

          {profileMessage && (
            <p
              role="status"
              aria-live="polite"
              className={messageClass(profileError)}
            >
              {profileMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      {/* Password settings */}
      <section className="max-w-3xl rounded-2xl border border-[#bbcabf] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#e5f5eb] p-3 text-[#006c49]">
            <LockKeyhole size={22} />
          </div>

          <div>
            <h3 className="font-hanken text-lg font-semibold">
              Change password
            </h3>
            <p className="text-sm text-[#718078]">
              Choose a strong password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {[
            {
              name: "currentPassword",
              label: "Current password",
              placeholder: "Enter current password",
              autoComplete: "current-password",
            },
            {
              name: "newPassword",
              label: "New password",
              placeholder: "Enter new password",
              autoComplete: "new-password",
            },
            {
              name: "confirmPassword",
              label: "Confirm new password",
              placeholder: "Confirm new password",
              autoComplete: "new-password",
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="text-sm font-medium"
              >
                {field.label}
              </label>

              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  type={showPasswords ? "text" : "password"}
                  autoComplete={field.autoComplete}
                  value={passwords[field.name]}
                  onChange={handlePasswordChange}
                  placeholder={field.placeholder}
                  className={`${inputClass} pr-12`}
                  required
                />

                {field.name === "currentPassword" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((previous) => !previous)
                    }
                    aria-label={
                      showPasswords ? "Hide passwords" : "Show passwords"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#718078] hover:bg-[#f4fbf4]"
                  >
                    {showPasswords ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {passwordMessage && (
            <p
              role="status"
              aria-live="polite"
              className={messageClass(passwordError)}
            >
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole size={16} />
            {savingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}